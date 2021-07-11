<template>
  <van-checkbox-group
    :value="value"
    :direction="formModel.rules.direction"
    :max="formModel.rules.max || 0"
    :disabled="disabled"
    @input="e__input"
    @change="e__change"
  >
    <van-checkbox
      v-for="item in formModel.rules.options"
      :key="item.value"
      :name="item.value"
      :shape="formModel.rules.shape"
      :checked-color="formModel.rules.checkColor"
    >
      {{ item.label }}
    </van-checkbox>
  </van-checkbox-group>
</template>

<script>
import { Checkbox, CheckboxGroup } from 'vant'
import formItemBase from '../mixins/formItemBase'

export default {
  name: 'VCheckbox',

  components: {
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
  },

  mixins: [formItemBase],

  props: {
    value: {
      type: Array,
      default: () => []
    }
  }
}
</script>
