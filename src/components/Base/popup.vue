<template>
  <van-popup :value="value" position="bottom" safe-area-inset-bottom @click-overlay="$emit('input', false)">
    <slot></slot>
  </van-popup>
</template>

<script>
import { Popup } from 'vant'
export default {
  name: 'VPopup',
  components: {
    'van-popup': Popup
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="less" scoped>

</style>
