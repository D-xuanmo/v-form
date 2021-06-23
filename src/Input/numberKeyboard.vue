<template>
  <div class="v-form__input-wrapper">
    <Field
      :value="value"
      :placeholder="formModel.rules.placeholder"
      readonly
      :disabled="disabled"
      @touchstart.native.stop="() => !disabled && (isShow = true)"
    ></Field>
    <NumberKeyboard
      v-model="_value"
      :show="isShow"
      :title="formModel.rules.title"
      :theme="formModel.rules.theme"
      :maxlength="formModel.rules.maxlength"
      :z-index="formModel.rules.zIndex"
      :extra-key="formModel.rules.extraKey"
      :close-button-text="formModel.rules.closeButtonText"
      :delete-button-text="formModel.rules.deleteButtonText"
      :close-button-loading="formModel.rules.closeButtonLoading"
      :show-delete-key="formModel.rules.showDeleteKey"
      @blur="isShow = false"
      @hide="e__change"
    />
  </div>
</template>

<script>
import { Field, NumberKeyboard } from 'vant'
import formBase from '../mixins/formItemBase'
export default {
  name: 'VNumberKeyboard',
  components: {
    Field,
    NumberKeyboard
  },
  mixins: [formBase],
  data() {
    return {
      isShow: false
    }
  },
  computed: {
    _value: {
      get() {
        return this.value
      },
      set(val) {
        this.innerValue = val
        this.e__input(val)
      }
    }
  }
}
</script>
