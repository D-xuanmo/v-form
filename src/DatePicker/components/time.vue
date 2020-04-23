<template>
  <van-datetime-picker
    :value="value"
    :type="type"
    :min-hour="formModel.rules.minHour"
    :max-hour="formModel.rules.minHour"
    :min-minute="formModel.rules.minMinute"
    :max-minute="formModel.rules.minMinute"
    :show-toolbar="showToolbar"
    @confirm="__confirm"
    @cancel="__cancel"
    @change="__change"
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

<style lang="less" scoped>

</style>
