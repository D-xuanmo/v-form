<template>
  <div>
    <input type="text" :value="value" :disabled="disabled" @input="$event => e__input($event.target.value)">
  </div>
</template>

<script>
import { vFormItemBaseMixin } from '../../packages'
export default {
  name: 'FormItemTest',

  mixins: [vFormItemBaseMixin],

  props: {
    value: {
      type: String,
      default: ''
    }
  },

  methods: {
    /**
     * 自定义校验固定命名
     * 返回结果需要调用 this.customValidatorHelper 工具函数包装
     * @returns {Promise<unknown>}
     */
    customValidator() {
      return new Promise((resolve) => {
        if (this.value !== '222') {
          resolve(this.customValidatorHelper('自定义校验：数值不等于222，校验失败', false, true))
        } else {
          resolve(this.customValidatorHelper('', true, true))
        }
      })
    }
  }
}
</script>
