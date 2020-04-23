<template>
  <v-datetime-picker
    v-if="type === 'datetime' || type === 'year-month' || type === 'date'"
    ref="picker"
    :value="value"
    :form-model="formModel"
    :type="type"
    :show-toolbar="showToolbar"
    @confirm="$emit('confirm', $event)"
    @cancel="$emit('cancel', $event)"
    @change="$emit('change', $event)"
  />
  <v-time-picker
    v-else-if="type === 'time'"
    ref="picker"
    :value="value"
    :form-model="formModel"
    :type="type"
    :show-toolbar="showToolbar"
    @confirm="$emit('confirm', $event)"
    @cancel="$emit('cancel', $event)"
    @change="$emit('change', $event)"
  />
</template>

<script>
import DatetimePicker from './datetime'
import TimePicker from './time'
export default {
  name: 'DatePicker',

  components: {
    'v-datetime-picker': DatetimePicker,
    'v-time-picker': TimePicker
  },

  props: {
    value: {
      type: Number,
      default: null
    },

    type: {
      type: String,
      default: 'datetime'
    },

    showToolbar: {
      type: Boolean,
      default: true
    },

    formModel: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
