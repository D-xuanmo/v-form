/**
 * 基础表单公用
 */

export default {
  inject: ['VFormRoot', '$validate'],
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
      errorMessage: {}
    }
  },
  watch: {
    formModel: {
      immediate: true,
      deep: true,
      handler (v) {
        this.generationRules(v.rules, v)
      }
    },

    value: {
      handler (v) {
        this.__validator(v)
      }
    }
  },
  created () {
    // console.log(this)
    this.__validator(this.value)
  },
  methods: {
    // 创建校验规则
    generationRules ({ vRules }) {
      vRules && (this.rulesList = vRules.split('|'))
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
      // this.__validator(val)
      this.__eventHandler('input')
    },

    // 向父级传递校验结果
    e__error () {
      this.$emit('error', this.formModel.name, this.errorMessage)
    },

    // 执行校验
    async __validator (val) {
      for (let i = 0; i < this.rulesList.length; i++) {
        let { valid, failedRules, errors } = await this.$validate(val, this.rulesList[i])
        if (!valid) {
          this.$set(this, 'errorMessage', {
            name: this.formModel.name,
            value: val,
            index: this.formModel.index,
            errMsg: failedRules.required
              ? this.formModel.rules.errMsg
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
