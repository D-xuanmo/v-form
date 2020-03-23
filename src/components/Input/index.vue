<template>
  <Field
    :value="value"
    :type="customerType"
    :placeholder="formModel.rules.placeholder"
    :readonly="formModel.rules.readonly"
    :disabled="formModel.rules.disabled"
    :clearable="formModel.rules.clearable"
    @input="e__input"
  ></Field>
</template>

<script>
import Field from 'vant/lib/field'
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
