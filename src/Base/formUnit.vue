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
        const formValues = {}
        model.forEach(item => {
          const { key, value, rules } = item

          // 排除展示类组件
          if ((rules.type !== 'VCell') && (rules.type !== 'VText')) {
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
      handler (val) {
        for (let [key, value] of Object.entries(val)) {
          this.model.map(item => {
            if (item.key === key) {
              item.value = value
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
    // 监听value和errorMsg发生改变，对父组件提供本次改变之后的新数据
    watchValueAndError () {
      this.$watch(() => {
        return {
          value: this.formValues,
          errorMsg: this.formErrors
        }
      }, ({ value, errorMsg }) => {
        this.change(
          value,
          Object.values(errorMsg).filter(v => Object.values(v).length !== 0).sort((a, b) => a['index'] - b['index'])
        )
      }, {
        deep: true,
        immediate: true
      })
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
