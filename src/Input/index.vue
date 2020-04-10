<template>
  <Field
    :value="value"
    :type="customerType"
    :placeholder="formModel.rules.placeholder"
    :readonly="formModel.rules.readonly"
    :disabled="formModel.rules.disabled || VFormRoot.disabled"
    :clearable="formModel.rules.clearable"
    :autosize="formModel.rules.autosize"
    :maxlength="formModel.rules.maxlength"
    :is-link="formModel.rules.isLink"
    :show-word-limit="formModel.rules.showWordLimit"
    @input="e__input"
    @click="__eventHandler('click', formModel)"
  ></Field>
</template>

<script>
import { Field } from 'vant'
import formBase from '../mixins/form'
export default {
  name: 'VInput',
  components: {
    Field
  },
  mixins: [formBase],
  props: {
    type: {
      type: String,
      default: 'text'
    }
  }
}
</script>
