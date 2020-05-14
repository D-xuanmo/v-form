<template>
  <div class="v-form-row">
    <div
      v-if="VFormRoot.showLabel"
      class="v-form-row__label"
      :style="{
        width: VFormRoot.labelWidth,
        textAlign: VFormRoot.labelPosition,
        color: VFormRoot.labelColor
      }"
    >
      {{ label }}
      <span v-show="required" class="v-form-row__required-mark">*</span>
    </div>
    <div class="v-form-row__content">
      <slot></slot>
    </div>
    <div v-if="$slots.extra" class="v-form-row__extra">
      <slot name="extra"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Row2Col',
  inject: ['VFormRoot'],
  props: {
    label: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="less" scoped>
@import "../style/row";
</style>
