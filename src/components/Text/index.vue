<template>
  <div class="v-form-text" @click="__eventHandler('click')">
    <span v-if="!formModel.value && formModel.rules.placeholder" class="placeholder">{{ formModel.rules.placeholder }}</span>
    <template v-else>{{ formModel.value }}</template>
  </div>
</template>

<script>
import formBase from '../mixins/form'
export default {
  name: 'VText',
  mixins: [formBase]
}
</script>

<style lang="less" scoped>

</style>
