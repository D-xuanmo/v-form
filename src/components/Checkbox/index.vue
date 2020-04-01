<template>
  <van-checkbox-group
    :value="value"
    :direction="formModel.rules.direction"
    :max="formModel.rules.max || 0"
    @input="e__input"
  >
    <van-checkbox
      v-for="item in formModel.rules.options"
      :key="item.value"
      :name="item.value"
      :shape="formModel.rules.shape"
      :checked-color="formModel.rules.checkColor"
    >{{ item.label }}</van-checkbox>
  </van-checkbox-group>
</template>

<script>
import { Checkbox, CheckboxGroup } from 'vant'
import formBase from '../mixins/form'
export default {
  name: 'VCheckbox',
  components: {
    'van-checkbox': Checkbox,
    'van-checkbox-group': CheckboxGroup
  },
  mixins: [formBase]
}
</script>

<style lang="less" scoped>
@import "../style/checkbox";
</style>
