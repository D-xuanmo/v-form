<script>
import Vue from 'vue'
import components from './components'
import validate, { extend } from '../validator'

const formUnitBase = Vue.extend({
  name: 'VFormUnit',
  components,

  provide () {
    return {
      VFormRoot: this,
      $validate: validate
    }
  },

  props: {
    // 数据模型
    model: {
      type: Array,
      required: true,
      default: () => []
    },

    value: {
      type: Object,
      default: () => ({})
    },

    // 局部校验规则
    validator: {
      type: Object,
      default: () => ({})
    },

    disabled: {
      type: Boolean,
      default: false
    },

    labelWidth: {
      type: String,
      default: ''
    },

    labelPosition: {
      type: String,
      default: 'left'
    },

    labelColor: {
      type: String,
      default: ''
    },

    showLabel: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      // 内部数据模型
      formModel: [],

      formValues: {},

      formErrors: {},

      crossFields: {}
    }
  },

  watch: {
    model: {
      deep: true,
      immediate: true,
      handler (model) {
        const formModel = this.$VForm.primaryData ? this.modelFormatter(model) : model
        this.formModel = formModel

        const formValues = {}

        formModel.forEach(item => {
          const { key, value, rules } = item

          // 排除展示类组件
          if (!(['VCell', 'VText'].includes(rules.type))) {
            formValues[key] = value
          }

          // 生成跨域校验字段
          const crossFields = (rules.vRules || '').match(/\w+:@\w+(,@\w+)*/g) || []
          crossFields.forEach(_ => {
            const [name, cross] = _.split(':')
            this.crossFields[name] = {
              local: key,
              target: cross.split(',').map(_ => _.replace('@', ''))
            }
          })
        })
        this.formValues = formValues
      }
    },

    value: {
      deep: true,
      immediate: true,
      handler (value) {
        for (let [_key, _value] of Object.entries(value)) {
          this.model.map(item => {
            if (item.key === _key) {
              item.value = _value
            }
          })
        }
      }
    }
  },

  created () {
    // 注册局部校验规则
    extend(this.validator)

    this.watchValueAndError()
  },

  methods: {
    // 监听 value 和 errorMsg 发生改变，对父组件提供本次改变之后的新数据
    watchValueAndError () {
      const entry = () => ({
        value: this.formValues,
        errorMsg: this.formErrors
      })
      const callback = ({ value, errorMsg }) => {
        this.change(
          value,
          Object.values(errorMsg).filter(v => Object.values(v).length !== 0).sort((a, b) => a.index - b.index)
        )
      }
      this.$watch(entry, callback, {
        deep: true,
        immediate: true
      })
    },

    // 处理数据模型
    // 当所有的属性不存在 rules 字段的情况下调用
    modelFormatter(model) {
      const fixedKeys = ['key', 'value']
      const result = []
      model.forEach(item => {
        const resultItem = {
          rules: {}
        }
        for (const [key, value] of Object.entries(item)) {
          if (fixedKeys.includes(key)) {
            resultItem[key] = value
            continue
          }
          resultItem.rules[key] = value
        }
        result.push(resultItem)
      })
      return result
    },

    // 分割组件类型
    splitComponentType (type) {
      let [compType, compParameter = ''] = type.split('|')
      return [compType, compParameter]
    },

    change (value, errorMsg) {
      this.$emit('input', value)
      this.$emit('change', {
        value,
        isValid: errorMsg.length === 0,
        errorMsg
      })
    },

    updateFormValues (index, val) {
      this.$set(this.model[index], 'value', val)
    },

    // 获取子级错误信息
    getChildError (name, err) {
      this.$set(this.formErrors, name, err)
    }
  }
})

export default formUnitBase
</script>
