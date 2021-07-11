// 基础表单公用
import { debounce, isEmpty, isRegexp } from '@xuanmo/javascript-utils'
import baseProps from './formItemBaseProps'
export default {
  inject: ['VFormRoot', '$validate'],

  mixins: [baseProps],

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
    }
  },

  data() {
    return {
      rulesList: [],
      errorMessage: {},
      debounce: null,
      isNotVerified: true
    }
  },

  computed: {
    disabled() {
      return this.formModel.rules.disabled || this.VFormRoot.disabled
    },

    pattern() {
      let pattern = this.formModel.rules.pattern
      if (typeof pattern === 'string') return new RegExp(pattern)
      if (isRegexp(pattern)) return pattern
      return pattern
    },

    isValid() {
      return !this.isNotVerified && isEmpty(this.errorMessage.errorMsg)
    }
  },

  watch: {
    value: {
      deep: true,
      handler(value) {
        !this.disabled && this.__validator(value, true)
      }
    }
  },

  created () {
    this.debounce = debounce((type, value, model) => {
      this.$emit('event', {
        type,
        value,
        model
      })
    }, this.$VForm.debounceTime)

    if (!this.disabled) {
      this.__createRules()
      this.e__input(this.value)
    }
  },

  methods: {
    findModelByKey(key) {
      return this.VFormRoot.model.find((item) => item.key === key)
    },

    // 创建校验规则
    // 校验顺序：required => pattern => vRules 剩余规则
    __createRules() {
      this.$watch(() => ({
        pattern: this.formModel.rules.pattern,
        vRules: this.formModel.rules.vRules
      }), ({ pattern, vRules }) => {
        if (vRules) {
          const rules = vRules.split('|')
          if (pattern) {
            rules[0] === 'required'
              ? rules.splice(1, 0, pattern)
              : rules.unshift(pattern)
          }
          this.rulesList = rules
          return
        }

        if (pattern) {
          this.rulesList = [pattern]
          return
        }
      }, {
        deep: true,
        immediate: true
      })
    },

    /**
     * 自定义事件传递
     * @param {string} type 事件名
     * @param {*} value 任意数据
     */
    __eventHandler(type, value = this.formModel) {
      this.debounce(type, value, this.VFormRoot.model)
    },

    // 向父级提交当前组件的值
    e__input(value) {
      this.$emit('input', this.formModel.index, value)
      this.__eventHandler('input', {
        ...this.formModel,
        value
      })
    },

    e__change(value) {
      this.$emit('change', {
        ...this.formModel,
        value
      })
    },

    // 向父级传递校验结果
    e__error() {
      this.$emit('error', this.formModel.name, this.errorMessage)
    },

    _handlerValidate(value, rule) {
      const formRoot = this.VFormRoot

      // 正则规则校验
      if (isRegexp(rule)) {
        const valid = rule.test(value)
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
        const corssRuleName = (rules[0] || rule).replace('@', '')

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

        const handlerCorssValidate = () => {
          // 跨域校验规则
          const validator = formRoot.validator[corssRuleName] || this.$VForm.validator[corssRuleName]

          if (!validator) return Promise.reject(`[VForm]: '${corssRuleName}' 关联校验规则未注册！`)

          let crossFields = formRoot.crossFields[corssRuleName]

          const { crossParams, context } = createCrossParams(validator.params, crossFields.target)

          let valid = validator.validate(value, crossParams, context)

          ;[crossFields.local, ...crossFields.target].forEach(key => {
            if (key !== this.formModel.key) {
              const self = formRoot.$refs[key][0]
              if (valid) {
                self.$set(self, 'errorMessage', {})
              } else {
                self.$set(self, 'errorMessage', {
                  name: self.formModel.name,
                  value,
                  visible: true,
                  index: self.formModel.index,
                  errorMsg: validator.message
                })
              }
              self.e__error(key)
            }
          })
          return {
            valid,
            message: validator.message
          }
        }

        const { valid, message } = handlerCorssValidate()
        return Promise.resolve({
          valid,
          failedRules: {
            required: null
          },
          errors: [message]
        })
      }

      // veeValidate插件校验
      return this.$validate(value, rule)
    },

    // 执行校验
    async __validator(value = this.value, visible = false) {
      this.isNotVerified = false
      const rules = this.rulesList
      let errorInfo = {}
      for (let i = 0; i < rules.length; i++) {
        try {
          const rule = rules[i]
          let { valid, failedRules, errors } = await this._handlerValidate(value, rule)
          if (!valid) {
            errorInfo = {
              name: this.formModel.name,
              value,
              visible,
              index: this.formModel.index,
              errorMsg: failedRules.required
                ? this.formModel.rules.errorMsg
                : errors[0].replace('{field}', this.formModel.rules.label)
            }
            this.$set(this, 'errorMessage', errorInfo)
            break
          } else {
            errorInfo = {}
            this.$set(this, 'errorMessage', errorInfo)
          }
        } catch (err) {
          console.error(err)
          return Promise.reject(err)
        }
      }
      this.e__error()
      return Promise.resolve(errorInfo)
    }
  }
}
