<template>
  <van-datetime-picker
    :value="_value"
    :type="type"
    :min-hour="formModel.rules.minHour"
    :max-hour="formModel.rules.minHour"
    :min-minute="formModel.rules.minMinute"
    :max-minute="formModel.rules.minMinute"
    :show-toolbar="showToolbar"
    @confirm="__confirm"
    @cancel="__cancel"
    @change="!showToolbar && __change($event)"
  ></van-datetime-picker>
</template>

<script>
import { DatetimePicker } from 'vant'
import mixin from './mixin'
export default {
  name: 'VTimePicker',

  components: {
    'van-datetime-picker': DatetimePicker,
  },

  mixins: [mixin],

  computed: {
    _value () {
      return this.datejs(new Date(this.value)).format('HH:mm')
    }
  },

  methods: {
    _format (value) {
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth()
      const day = date.getDate()
      const currentFormat = this.datejs(new Date(`${year}/${month}/${day} ${value}`))
      return {
        innerValue: value,
        value: this.formModel.rules.valueFormat
          ? (this.formModel.rules.valueFormat === 'timestamp'
            ? new Date(`${year}/${month}/${day} ${value}`).getTime()
            : currentFormat.format(this.formModel.rules.valueFormat))
          : value
      }
    }
  }
}
</script>
