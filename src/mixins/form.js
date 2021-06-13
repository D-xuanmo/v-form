// 基础表单公用
import { debounce, isRegExp } from '../utils'
export default {
  inject: ['VFormRoot', '$validate'],

  props: {
    value: {
      type: [String, Array, Number, Date, Boolean],
      default: ''
    },

    customerType: {
      type: String,
      default: ''
    },

    placeholder: {
      type: String,
      default: ''
    },

    formModel: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      rulesList: [],
      errorMessage: {},
      debounce: null
    }
  },

  computed: {
    disabled() {
      return this.formModel.rules.disabled || this.VFormRoot.disabled
    }
  },

  watch: {
    formModel: {
      immediate: true,
      deep: true,
      handler(v) {
        this.__createRules(v.rules, v)
      }
    },

    value: {
      deep: true,
      handler(val) {
        !this.disabled && this.__validator(val)
      }
    }
  },

  created() {
    this.debounce = debounce((type, value) => {
      this.$emit('event', {
        type,
        value
      })
    }, this.$VForm.debounceTime)

    !this.disabled && this.e__input(this.value)
  },

  methods: {
    findModelByKey(key) {
      return this.VFormRoot.model.find((item) => item.key === key)
    },

    // 创建校验规则
    // 校验顺序：required => pattern => vRules 剩余规则
    __createRules({ vRules, pattern }) {
      if (vRules) {
        const rules = vRules.split('|')
        if (isRegExp(pattern)) {
          rules[0] === 'required'
            ? rules.splice(1, 0, pattern)
            : rules.unshift(pattern)
        }
        this.rulesList = rules
        return
      }
      if (isRegExp(pattern)) {
        this.rulesList = [pattern]
        return
      }
    },

    __eventHandler(type, value) {
      this.debounce(type, value)
    },

    // 向父级提交当前组件的值
    async e__input(val) {
      await this.__validator(val)
      this.$emit('input', this.formModel.index, val)
      this.__eventHandler('input', {
        ...this.formModel,
        value: val
      })
    },

    e__change(val) {
      this.$emit('change', {
        ...this.formModel,
        value: val
      })
    },

    // 向父级传递校验结果
    e__error() {
      this.$emit('error', this.formModel.name, this.errorMessage)
    },

    _handlerValidate(val, rule) {
      const formRoot = this.VFormRoot

      // 正则规则校验
      if (isRegExp(rule)) {
        const valid = rule.test(val)
        return Promise.resolve({
          valid,
          failedRules: {
            required: !valid
          }
        })
      }

      const rules = rule.split(':')

      // 是否为关联校验
      const isCrossField = /^@/.test(rules[1])

      // 是否为关联校验的接收字段
      const isCrossTarget = /^@/.test(rule)

      // 关联校验
      if (isCrossField || isCrossTarget) {
        // 关联校验主字段
        const crossRule = rules[0]
        const mainValidate = formRoot.validator[crossRule] || this.$VForm.validator[crossRule]

        // 关联校验接收字段
        const targetRule = rule.replace('@', '')
        const targetValidate = formRoot.validator[targetRule] || this.$VForm.validator[targetRule]

        // 生成关联校验的相关数据
        const createCrossParams = (params, target) => {
          const crossParams = {}
          const context = {}
          target.forEach((item, i) => {
            crossParams[params[i]] = this.findModelByKey(item).value

            // 当前关联组件实例
            context[item] = formRoot.$refs[item][0]
          })
          return {
            crossParams,
            context
          }
        }

        // 关联校验
        if (isCrossField) {
          if (!mainValidate) return Promise.reject(`[VForm]: '${crossRule}' 关联校验规则未注册！`)

          let crossFields = formRoot.crossFields[crossRule]

          const { crossParams, context } = createCrossParams(
            mainValidate.params,
            crossFields.target
          )

          return Promise.resolve({
            valid: mainValidate.validate(val, crossParams, context),
            failedRules: {
              required: null
            },
            errors: [mainValidate.message]
          })
        }

        // 关联校验被绑定字段
        if (isCrossTarget) {
          if (!targetValidate) return Promise.reject(`[VForm]: '@${targetRule}' 关联校验规则未注册！`)

          let crossFields = formRoot.crossFields[targetRule]

          const { crossParams, context } = createCrossParams(
            targetValidate.params,
            crossFields.target
          )

          const valid = targetValidate.validate(
            this.findModelByKey(crossFields.local).value,
            crossParams,
            context
          )
          if (valid && isCrossField) {
            formRoot.formErrors[crossFields.local] = {}
          } else {
            formRoot.$refs[crossFields.local][0].__validator(
              this.findModelByKey(crossFields.local).value
            )
          }
          return Promise.resolve({
            valid: true,
            failedRules: {
              required: null
            },
            errors: [targetValidate.message]
          })
        }
      }

      // veeValidate插件校验
      return this.$validate(val, rule)
    },

    // 执行校验
    async __validator(val) {
      const rules = this.rulesList
      for (let i = 0; i < rules.length; i++) {
        try {
          const rule = rules[i]
          let { valid, failedRules, errors } = await this._handlerValidate(val, rule)
          if (!valid) {
            this.$set(this, 'errorMessage', {
              name: this.formModel.name,
              value: val,
              index: this.formModel.index,
              errorMsg: failedRules.required
                ? this.formModel.rules.errorMsg
                : errors[0].replace('{field}', this.formModel.rules.label)
            })
            break
          } else {
            this.$set(this, 'errorMessage', {})
          }
        } catch (err) {
          throw new Error(err)
        }
      }
      this.e__error()
    }
  }
}
