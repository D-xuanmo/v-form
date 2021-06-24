<template>
  <van-switch
    :value="value"
    :size="formModel.rules.size || '20px'"
    :disabled="disabled"
    :active-color="formModel.rules.activeColor"
    :active-value="formModel.rules.activeValue"
    :inactive-color="formModel.rules.inactiveColor"
    :inactive-value="formModel.rules.inactiveValue"
    @input="e__input"
    @change="e__change"
    @click="__eventHandler('click', formModel)"
  />
</template>

<script>
import { Switch } from 'vant'
import formBase from '../mixins/formItemBase'
export default {
  name: 'VSwitch',
  components: {
    [Switch.name]: Switch
  },
  mixins: [formBase]
}
</script>
