<template>
  <div>
    <input type="text" :value="value" :disabled="disabled" @input="$event => e__input($event.target.value)">
  </div>
</template>

<script>
import { vFormItemBaseMixin } from '@'
export default {
  name: 'FormItemTest',

  mixins: [vFormItemBaseMixin],

  props: {
    value: {
      type: String,
      default: ''
    }
  }
}
</script>
