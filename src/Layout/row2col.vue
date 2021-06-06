<template>
  <div :class="['v-form-row', disabled && 'is-disabled']">
    <div
      v-if="VFormRoot.showLabel"
      class="v-form-row__label"
      :style="{
        width: VFormRoot.labelWidth,
        textAlign: VFormRoot.labelPosition,
        color: VFormRoot.labelColor
      }"
    >
      <slot name="label">
        {{ label }}
        <span v-show="required" class="v-form-row__required-mark">*</span>
      </slot>
    </div>
    <div class="v-form-row__content">
      <slot></slot>
      <div v-show="error.errorMsg" class="v-form-row__error">{{ error.errorMsg }}</div>
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
    },

    disabled: {
      type: Boolean,
      default: false
    },

    error: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="less" scoped>
@import "../style/row";
</style>
