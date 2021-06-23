<template>
  <van-field
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
  ></van-field>
</template>

<script>
import { Field } from 'vant'
import formBase from '../mixins/formItemBase'
export default {
  name: 'VInput',
  components: {
    [Field.name]: Field
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
