<template>
  <div>
    <input type="text" :value="value" @input="$event => e__input($event.target.value)">
  </div>
</template>

<script>
import { formItemBaseMixin } from '@'
export default {
  name: 'FormItemTest',

  mixins: [formItemBaseMixin]
}
</script>
