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
    @click="__eventHandler('click', formModel)"
  />
</template>

<script>
import { Switch } from 'vant'
import formBase from '../mixins/form'
export default {
  name: 'VSwitch',
  components: {
    'van-switch': Switch
  },
  mixins: [formBase]
}
</script>
