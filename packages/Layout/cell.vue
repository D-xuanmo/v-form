<template>
  <div
    class="v-form-cell"
    :class="{
      'has-child': formModel.rules.label
    }"
    :style="formModel.rules.style"
  >
    <span v-if="formModel.rules.label" class="v-form-cell__label">
      <span class="vertical-middle">{{ formModel.rules.label }}</span>
    </span>
  </div>
</template>

<script>
import formItemBaseProps from '../mixins/formItemBaseProps'
export default {
  name: 'VCell',
  mixins: [formItemBaseProps]
}
</script>
