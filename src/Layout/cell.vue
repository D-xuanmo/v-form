<template>
  <div class="v-form-cell" :style="formModel.rules.style">
    {{ formModel.rules.label }}
  </div>
</template>

<script>
export default {
  name: 'VCell',
  props: {
    formModel: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
