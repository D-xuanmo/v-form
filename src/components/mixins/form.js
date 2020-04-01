/**
 * 基础表单公用
 */

import * as validator from '../validator'
export default {
  inject: ['VFormRoot'],
  props: {
    value: {
      type: [String, Array, Number, Date],
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
      rules: {},
      errorMessage: {},
      validator
    }
  },
  watch: {
    formModel: {
      immediate: true,
      deep: true,
      handler (v) {
        this.generationRules(v.rules)
      }
    },

    value: {
      handler (v) {
        this.__validator(v)
      }
    }
  },
  created () {
    this.__validator(this.value)
  },
  methods: {
    // 创建校验规则
    generationRules ({ errMsg, vRules }) {
      const required = {
        validate: value => Boolean(value),
        message: errMsg || ''
      }
      this.$set(this, 'validator', {
        required,
        ...validator,
        ...this.$VForm.validator
      })
      if (vRules) {
        this.rulesList = vRules.split('|')
        this.rulesList.forEach(rule => {
          this.$set(this.rules, rule, this.validator[rule])
        })
      }
    },

    __eventHandler (type) {
      this.$nextTick(() => this.$emit('event', {
        type,
        value: this.formModel
      }))
    },

    // 向父级提交当前组件的值
    e__input (val) {
      this.$emit('input', this.formModel.name, val)
      this.__validator(val)
      this.__eventHandler('input')
    },

    // 向父级传递校验结果
    e__error () {
      this.$emit('error', this.formModel.name, this.errorMessage)
    },

    // 执行校验
    __validator (val) {
      for (let i = 0; i < this.rulesList.length; i++) {
        let current = this.rules[this.rulesList[i]]
        if (!current.validate(val)) {
          this.$set(this, 'errorMessage', {
            name: this.formModel.name,
            value: val,
            index: this.formModel.index,
            errMsg: current.message
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
