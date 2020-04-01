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
    }
  },

  data () {
    return {
      formValues: {},
      formErrors: {},
      errorBag: []
    }
  },

  watch: {
    model: {
      deep: true,
      immediate: true,
      handler (v) {
        for (let [key, { value, rules }] of Object.entries(v)) {
          rules.type !== 'VCell' && rules.type !== 'VText' && this.$set(this.formValues, key, value)
        }
      }
    },

    formErrors: {
      deep: true,
      handler (v) {
        // 生成错误信息
        this.$set(this, 'errorBag', Object.values(v).sort((a, b) => a['index'] - b['index']).filter(v => Object.values(v).length !== 0))
      }
    },

    formValues: {
      deep: true,
      immediate: true,
      handler (v) {
        this._change(v)
      }
    }
  },

  methods: {
    // 分割组件类型
    _splitComponentType (type) {
      let [compType, compParameter = ''] = type.split('|')
      return [compType, compParameter]
    },

    _change (value) {
      this.$nextTick(() => {
        this.$emit('change', {
          value,
          isValid: this.errorBag.length === 0,
          errorMsg: this.errorBag
        })
      })
    },

    _updateFormValues (key, val) {
      this.$set(this.model[key], 'value', val)
    },

    // 获取子级错误信息
    _getError (name, err) {
      this.$set(this.formErrors, name, err)
    }
  },

  render () {
    return <div />
  }
})

export default formUnitBase
</script>
