<script>
import Vue from 'vue'
import components from './components'
import validate from '../validator'

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
      type: Object,
      required: true,
      default: () => ({})
    },

    value: {
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
      formErrors: {}
    }
  },

  watch: {
    model: {
      deep: true,
      immediate: true,
      handler (v) {
        for (let [key, { value, rules }] of Object.entries(v)) {
          // 排除展示类组件
          (rules.type !== 'VCell') && (rules.type !== 'VText') && this.$set(this.formValues, key, value)
        }
      }
    },

    value: {
      deep: true,
      immediate: true,
      handler (val) {
        for (let [key, value] of Object.entries(val)) {
          this.$set(this.model[key], 'value', value)
        }
      }
    }
  },

  created () {
    this._watchValueAndError()
  },

  methods: {
    // 监听value和errorMsg发生改变，对父组件提供本次改变之后的新数据
    _watchValueAndError () {
      this.$watch(() => {
        return {
          value: this.formValues,
          errorMsg: this.formErrors
        }
      }, ({ value, errorMsg }) => {
        this._change(
          value,
          Object.values(errorMsg).sort((a, b) => a['index'] - b['index']).filter(v => Object.values(v).length !== 0)
        )
      }, {
        deep: true,
        immediate: true
      })
    },

    // 分割组件类型
    _splitComponentType (type) {
      let [compType, compParameter = ''] = type.split('|')
      return [compType, compParameter]
    },

    _change (value, errorMsg) {
      this.$emit('input', value)
      this.$emit('change', {
        value,
        isValid: errorMsg.length === 0,
        errorMsg
      })
    },

    _updateFormValues (key, val) {
      this.$set(this.model[key], 'value', val)
    },

    // 获取子级错误信息
    _getError (name, err) {
      this.$set(this.formErrors, name, err)
    }
  }
})

export default formUnitBase
</script>
