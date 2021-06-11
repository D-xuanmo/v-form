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

  data () {
    return {
      rulesList: [],
      errorMessage: {},
      debounce: null
    }
  },

  computed: {
    disabled () {
      return this.formModel.rules.disabled || this.VFormRoot.disabled
    },

    isRegExp () {
      return isRegExp(this.formModel.rules.vRules)
    }
  },

  watch: {
    formModel: {
      immediate: true,
      deep: true,
      handler (v) {
        this.__createRules(v.rules, v)
      }
    },

    value: {
      deep: true,
      handler (val) {
        !this.disabled && this.__validator(val)
      }
    }
  },

  created () {
    this.debounce = debounce((type, value) => {
      this.$emit('event', {
        type,
        value
      })
    }, this.$VForm.debounceTime)
    !this.disabled && this.e__input(this.value)
  },

  methods: {
    findModelByKey (key) {
      return this.VFormRoot.model.find(item => item.key === key)
    },

    // 创建校验规则
    __createRules ({ vRules }) {
      if (vRules && !this.isRegExp) {
        this.rulesList = vRules.split('|')
      }
    },

    __eventHandler (type, value) {
      this.debounce(type, value)
    },

    // 向父级提交当前组件的值
    async e__input (val) {
      await this.__validator(val)
      this.$emit('input', this.formModel.index, val)
      this.__eventHandler('input', {
        ...this.formModel,
        value: val
      })
    },

    e__change (val) {
      this.$emit('change', {
        ...this.formModel,
        value: val
      })
    },

    // 向父级传递校验结果
    e__error () {
      this.$emit('error', this.formModel.name, this.errorMessage)
    },

    _validateObserver (val, rule) {
      const formRoot = this.VFormRoot

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

        if (!mainValidate || !targetValidate) {
          return Promise.reject(`[VForm]: '${crossRule}' 关联校验规则未注册！`)
        }

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
          let crossFields = formRoot.crossFields[crossRule]

          const { crossParams, context } = createCrossParams(mainValidate.params, crossFields.target)

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
          let crossFields = formRoot.crossFields[targetRule]

          const { crossParams, context } = createCrossParams(targetValidate.params, crossFields.target)

          const valid = targetValidate.validate(
            this.findModelByKey(crossFields.local).value,
            crossParams,
            context
          )
          if (valid && isCrossField) {
            formRoot.formErrors[crossFields.local] = {}
          } else {
            formRoot.$refs[crossFields.local][0].__validator(this.findModelByKey(crossFields.local).value)
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
    async __validator (val) {
      // 校验字段是正则的情况单独处理
      if (this.isRegExp) {
        if (!val || this.formModel.rules.vRules.test(val)) {
          this.$set(this, 'errorMessage', {})
        } else {
          this.$set(this, 'errorMessage', {
            name: this.formModel.name,
            value: val,
            index: this.formModel.index,
            errorMsg: this.formModel.rules.errorMsg
          })
        }
        this.e__error()
        return
      }

      for (let i = 0; i < this.rulesList.length; i++) {
        try {
          let { valid, failedRules, errors } = await this._validateObserver(val, this.rulesList[i])
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
