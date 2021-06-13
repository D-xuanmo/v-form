<template>
  <van-popup
    :value="value"
    position="bottom"
    safe-area-inset-bottom
    @click-overlay="_close"
  >
    <slot></slot>
  </van-popup>
</template>

<script>
import { Popup } from 'vant'
export default {
  name: 'VPopup',
  components: {
    [Popup.name]: Popup
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    _close() {
      this.$emit('input', false)
      this.$emit('close')
    }
  }
}
</script>
