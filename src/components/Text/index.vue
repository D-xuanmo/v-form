<template>
  <div class="v-form-text">{{ formModel.value }}</div>
</template>

<script>
export default {
  name: 'VText',
  props: {
    formModel: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="less" scoped>

</style>
