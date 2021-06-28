<template>
  <div class="v-form-text" @click="__eventHandler('click', formModel)">
    <span
      v-if="!formModel.value && formModel.rules.placeholder"
      class="placeholder"
    >
      {{ formModel.rules.placeholder }}
    </span>
    <template v-else>{{ formModel.value }}</template>
  </div>
</template>

<script>
import formItemBase from '../mixins/formItemBase'
export default {
  name: 'VText',
  mixins: [formItemBase]
}
</script>
