<template>
  <van-datetime-picker
    :value="new Date(formModel.value)"
    :type="type"
    :min-date="formModel.rules.minDate"
    :max-date="formModel.rules.maxDate"
    @confirm="__confirm"
    @cancel="__cancel"
  ></van-datetime-picker>
</template>

<script>
import { DatetimePicker } from 'vant'
import mixin from './mixin'
export default {
  name: 'VDatetimePicker',
  components: {
    'van-datetime-picker': DatetimePicker,
  },
  mixins: [mixin],
  methods: {
    _format (value) {
      const currentFormat = this.datejs(new Date(value))
      let innerValue = ''
      if (this.type === 'year-month') {
        innerValue = currentFormat.format('yyyy-MM')
      } else if (this.type === 'date') {
        innerValue = currentFormat.format('yyyy-MM-dd')
      } else {
        innerValue = currentFormat.format('yyyy-MM-dd HH:mm')
      }
      return {
        innerValue,
        value: this.formModel.rules.valueFormat
          ? (this.formModel.rules.valueFormat === 'timestamp'
            ? new Date(value).getTime()
            : currentFormat.format(this.formModel.rules.valueFormat))
          : value
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
