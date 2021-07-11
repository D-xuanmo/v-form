<template>
  <v-base-input
    :value="value"
    :type="customerType"
    :placeholder="formModel.rules.placeholder"
    :readonly="formModel.rules.readonly"
    :disabled="disabled"
    :clearable="formModel.rules.clearable"
    :autosize="formModel.rules.autosize"
    :maxlength="formModel.rules.maxlength"
    :is-link="formModel.rules.isLink"
    :show-word-limit="formModel.rules.showWordLimit"
    @input="e__input"
    @change="e__change"
    @click="__eventHandler('click', formModel)"
  />
</template>

<script>
import VBaseInput from '../components/VBaseInput.vue'
import formItemBase from '../mixins/formItemBase'

export default {
  name: 'VInput',

  components: {
    [VBaseInput.name]: VBaseInput
  },

  mixins: [formItemBase],

  props: {
    value: {
      type: String,
      default: ''
    },

    type: {
      type: String,
      default: 'text'
    }
  }
}
</script>
