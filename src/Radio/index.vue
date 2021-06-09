<template>
  <van-radio-group
    :value="value"
    :direction="formModel.rules.direction"
    :disabled="disabled"
    @input="e__input"
    @change="e__change"
  >
    <van-radio
      v-for="item in formModel.rules.options"
      :key="item.value"
      :name="item.value"
      :shape="formModel.rules.shape"
      :checked-color="formModel.rules.checkColor"
    >{{ item.label }}</van-radio>
  </van-radio-group>
</template>

<script>
import { RadioGroup, Radio } from 'vant'
import formBase from '../mixins/form'
export default {
  name: 'VRadio',
  components: {
    'van-radio': Radio,
    'van-radio-group': RadioGroup
  },
  mixins: [formBase]
}
</script>
