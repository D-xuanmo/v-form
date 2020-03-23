<template>
  <div class="v-form-conatiner">
    <row-2-col
      v-for="(v, key, index) in model"
      :key="key"
      :label="v.rules.label"
      :required="(v.rules.vRules || '').indexOf('required') !== -1"
    >
      <component
        :is="_splitComponentType(v.rules.type)[0]"
        :customer-type="_splitComponentType(v.rules.type)[1]"
        :value="v.value"
        :form-model="{
          ...v,
          name: key,
          index
        }"
        @input="_updateFormValues"
        @error="_getError"
        @event="$emit('event', $event)"
      ></component>
    </row-2-col>
  </div>
</template>

<script>
import 'vant/lib/index.less'
import components from './components'
export default {
  name: 'VForm',
  components,

  provide () {
    return {
      VFormRoot: this
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

    // 自定义校验规则
    validator: {
      type: Object,
      default: () => ({})
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
        for (let [key, { value }] of Object.entries(v)) {
          this.$set(this.formValues, key, value)
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
        this.$nextTick(() => this._change(v))
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
      this.$emit('change', {
        value,
        isValid: this.errorBag.length === 0,
        errorMsg: this.errorBag
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
}
</script>

<style lang="less" scoped>
@import "../style/index";
</style>
