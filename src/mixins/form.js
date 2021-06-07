/**
 * 基础表单公用
 */
import { debounce } from '../utils'
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
      vRules && (this.rulesList = vRules.split('|'))
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

    // 向父级传递校验结果
    e__error () {
      this.$emit('error', this.formModel.name, this.errorMessage)
    },

    _validateObserver (val, rule) {
      const rules = rule.split(':')

      // 是否为关联校验
      const isCrossField = /^@/.test(rules[1])

      // 是否为关联校验的接收字段
      const isTarget = /^@/.test(rule)

      const _VFrom = this.VFormRoot

      const _validate = (params, target) => {
        const result = {}
        target.forEach((item, i) => {
          result[params[i]] = this.findModelByKey(item).value
        })
        return result
      }

      // TODO 代码待优化
      // 关联校验
      if (isCrossField) {
        const _crossRule = rules[0]

        let currValidate = _VFrom.validator[_crossRule] || this.$VForm.validator[_crossRule]

        let crossFields = _VFrom.crossFields[_crossRule]

        return Promise.resolve({
          valid: currValidate.validate(val, _validate(currValidate.params, crossFields.target)),
          failedRules: {
            required: null
          },
          errors: [currValidate.message]
        })
      }

      // 关联校验被绑定字段
      if (isTarget) {
        const _targetRule = rule.replace('@', '')

        let currValidate = _VFrom.validator[_targetRule] || this.$VForm.validator[_targetRule]

        let crossFields = _VFrom.crossFields[_targetRule]

        const valid = currValidate.validate(
          this.findModelByKey(crossFields.local).value,
          _validate(currValidate.params, crossFields.target)
        )
        if (valid && isCrossField) {
          _VFrom.formErrors[crossFields.local] = {}
        } else {
          _VFrom.$refs[crossFields.local][0].__validator(this.findModelByKey(crossFields.local).value)
        }
        return Promise.resolve({
          valid: true,
          failedRules: {
            required: null
          },
          errors: [currValidate.message]
        })
      }

      // veeValidate插件校验
      return this.$validate(val, rule)
    },

    // 执行校验
    async __validator (val) {
      for (let i = 0; i < this.rulesList.length; i++) {
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
      }
      this.e__error()
    }
  }
}
