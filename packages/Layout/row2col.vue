<template>
  <div
    class="v-form-row"
    :class="{
      'is-disabled': disabled,
      'cell--center': isCellCenter
    }"
  >
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
      <div v-show="showErrorMsg" class="v-form-row__error">
        {{ error.errorMsg }}
      </div>
    </div>
    <div v-if="$slots.extra" class="v-form-row__extra">
      <slot name="extra"></slot>
    </div>
  </div>
</template>

<script>
import formItemBaseProps from '../mixins/formItemBaseProps'
export default {
  name: 'Row2Col',

  mixins: [formItemBaseProps],

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
  },

  computed: {
    showErrorMsg() {
      return this.VFormRoot.showErrorMessage || this.error.visible
    },

    isCellCenter() {
      return this.formModel.rules.cellCenter || ['VVerificationCode'].includes(this.formModel.rules.type)
    }
  }
}
</script>
