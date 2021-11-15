// 基础表单公用
import { debounce, isEmpty, isFunction, isRegexp } from '@xuanmo/javascript-utils'
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
      isNotVerified: true,

      // 用于取消 rules 的监听
      unwatchRules: null
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
      async handler(value) {
        if (!this.disabled) {
          const { isValid, isLastValid } = await this.customValidator?.() || { isValid: true }
          isValid && !isLastValid && this.__validator(value, true)
        }
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
     * 自定义校验规则公用方法，需要自定义校验调用次方法
     * @param {string} errorMsg 错误信息
     * @param {boolean} isValid 是否校验通过
     * @param {boolean} isLastValid 是否执行完跳出本次校验，不执行后续校验规则
     * @returns 错误信息对象
     */
    customValidatorHelper(errorMsg, isValid, isLastValid = false) {
      const { name, index } = this.formModel
      const errorInfo = {
        name,
        index,
        value: this.value,
        visible: true,
        errorMsg
      }
      this.$set(this, 'errorMessage', errorInfo)
      this.e__error()
      return {
        ...errorInfo,
        isValid,
        isLastValid
      }
    },

    /**
     * 创建校验规则
     * 校验顺序：required => pattern => vRules 剩余规则
     */
    __createRules() {
      this.unwatchRules = this.$watch(() => ({
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

    _formatErrorMsg(message) {
      return message.replace('{_field_}', this.formModel.rules.label).replace('{_key_}', this.formModel.key)
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
          const crossNamesMap = {}
          const context = {}
          target.forEach((key, i) => {
            crossParams[params[i]] = formRoot.formValues[key]
            crossNamesMap[target[i]] = params[i]

            // 当前关联组件实例
            context[key] = formRoot.$refs[key][0]
          })
          return {
            crossParams,
            crossNamesMap,
            context
          }
        }

        const handlerCorssValidate = () => {
          // 关联校验规则
          const validator = formRoot.validator[corssRuleName] || this.$VForm.validator[corssRuleName]

          if (!validator) return Promise.reject(`[VForm]: '${corssRuleName}' 关联校验规则未注册！`)

          const crossFields = formRoot.crossFields[corssRuleName]

          const { crossParams, context, crossNamesMap } = createCrossParams(validator.params, crossFields.target)

          // 主字段组件
          const mainFieldComp = formRoot.$refs[crossFields.local][0]

          // 执行校验时传递当前相关联的组件实例与整个表单组件实例到回调函数
          const valid = validator.validate(mainFieldComp.value, crossParams, {
            formRoot,
            [crossFields.local]: mainFieldComp,
            ...context
          })

          // 当前组件需要提示的错误信息
          let message = ''

          // 第一个字段校验失败的错误信息，需要上报给父组件
          let firstFieldMessage = ''

          ;[crossFields.local, ...crossFields.target].forEach((key, index) => {
            const self = formRoot.$refs[key][0]

            // 如果错误信息是函数，则返回相关参数做自定义提示
            message = isFunction(validator.message)
              ? validator.message(value, crossParams, {
                name: crossNamesMap[key] || 'main',
                trigger: crossNamesMap[this.formModel.key] || 'main',
                index: self.formModel.index,
                valid
              })
              : validator.message

            if (!firstFieldMessage) firstFieldMessage = message

            if (valid) {
              self.$set(self, 'errorMessage', {})
            } else {
              // 更新当前组件的错误信息
              self.$set(self, 'errorMessage', {
                name: self.formModel.name,
                value,
                visible: true,
                index: self.formModel.index,
                errorMsg: message
              })
            }
            self.e__error(key)
          })
          return {
            valid,
            isCorss: true,
            message: firstFieldMessage
          }
        }

        const { valid, message, isCorss } = handlerCorssValidate()
        return Promise.resolve({
          valid,
          isCorss,
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
      // 是否已经执行过校验
      this.isNotVerified = false

      // 当前组件的校验规则列表
      const rules = this.rulesList

      let errorInfo = {}

      const { name, index: compIndex } = this.formModel
      for (let i = 0; i < rules.length; i++) {
        try {
          const rule = rules[i]
          const { valid, failedRules, isCorss, errors } = await this._handlerValidate(value, rule)
          const [error] = errors || []
          if (!valid) {
            errorInfo = {
              name,
              value,
              visible,
              index: compIndex,

              /**
               * 1. 错误信息先校验必填
               * 2. 如果为函数则执行自定义错误信息
               * 3. 否则执行 message
               */
              errorMsg: failedRules.required
                ? this.formModel.rules.errorMsg
                : isFunction(error)
                  ? error({ value, name, index: compIndex })
                  : this._formatErrorMsg(error)
            }

            // 关联校验的错误信息自定义处理
            !isCorss && this.$set(this, 'errorMessage', errorInfo)
            break
          } else {
            errorInfo = {}
            this.$set(this, 'errorMessage', errorInfo)
          }
        } catch (err) {
          return Promise.reject(err)
        }
      }
      this.e__error()
      return Promise.resolve(errorInfo)
    }
  }
}
