// 基础表单公用
import { debounce, isEmpty, isRegexp } from '@xuanmo/javascript-utils'
import baseProps from './formItemBaseProps'
export default {
  inject: ['VFormRoot', '$validate'],

  mixins: [baseProps],

  props: {
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
      const pattern = this.formModel.rules.pattern
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
    /**
     * 通过 key 查找数据单元
     * @param {string} key
     * @returns {object}
     */
    findModelByKey(key) {
      return this.VFormRoot.formModel.find((item) => item.key === key)
    },

    /**
     * 创建校验规则
     * 校验顺序：required => pattern => vRules 剩余规则
     */
    __createRules() {
      this.$watch(() => ({
        pattern: this.formModel.rules.pattern,
        vRules: this.formModel.rules.vRules
      }), ({ vRules }) => {
        if (vRules) {
          const rules = vRules.split('|')
          if (this.pattern) {
            rules[0] === 'required'
              ? rules.splice(1, 0, this.pattern)
              : rules.unshift(this.pattern)
          }
          this.rulesList = rules
          return
        }

        if (this.pattern) this.rulesList = [this.pattern]
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

    /**
     * 向父级提交当前组件的值
     * @param {any} value
     */
    e__input(value) {
      this.$emit('input', this.formModel.index, value)
      this.__eventHandler('input', {
        ...this.formModel,
        value
      })
    },

    /**
     * 执行 change 事件
     * @param {any} value
     */
    e__change(value) {
      this.$emit('change', {
        ...this.formModel,
        value
      })
    },

    /**
     * 向父级传递校验结果
     */
    e__error() {
      this.$emit('error', this.formModel.name, this.errorMessage)
    },

    /**
     * 校验执行方法
     * @param {any} value 组件的数据
     * @param {string} rule 校验规则
     * @returns {*|Promise<{valid, failedRules: {required: boolean}}>|Promise<{valid, failedRules: {required: null}, errors: *[]}>}
     */
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

      const crossFields = formRoot.crossFields[this.formModel.key]
      // 关联校验
      if (crossFields) {
        const corssRuleName = crossFields.name;

        // 生成关联校验的相关数据
        const createCrossParams = (params, target) => {
          const crossParams = {}
          const context = {}
          target.forEach((key, i) => {
            crossParams[params[i]] = formRoot.formValues[key]

            // 当前关联组件实例
            context[key] = formRoot.$refs[key][0]
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

          const { crossParams, context } = createCrossParams(validator.params, crossFields.target)

          // 执行校验时传递当前相关联的组件实例与整个表单组件实例到回调函数
          const valid = validator.validate(value, crossParams, {
            formRoot,
            [crossFields.local]: formRoot.$refs[crossFields.local][0],
            ...context
          })

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

    /**
     * 执行校验
     * @param {any} value 组件数据
     * @param {boolean} visible 是否显示错误信息
     * @returns {Promise<{}>}
     */
    async __validator(value = this.value, visible = false) {
      this.isNotVerified = false
      const rules = this.rulesList
      let errorInfo = {}
      for (let i = 0; i < rules.length; i++) {
        try {
          const rule = rules[i]
          const { valid, failedRules, errors } = await this._handlerValidate(value, rule)
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
