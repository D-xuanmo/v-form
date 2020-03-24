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
      return {
        innerValue: this.type === 'year-month' ? currentFormat.format('yyyy-MM') : currentFormat.format('yyyy-MM-dd HH:mm'),
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
