<template>
  <div class="v-form__input-wrapper">
    <van-field
      ref="input"
      :value="innerValue"
      readonly
      :disabled="disabled"
      :placeholder="formModel.rules.placeholder"
      :right-icon="formModel.rules.disabled ? '' : 'arrow-down'"
      @focus="isShowPicker = true"
      @click-right-icon="!VFormRoot.disabled && (isShowPicker = true)"
    ></van-field>
    <v-popup v-model="isShowPicker">
      <date-picker
        :value="+new Date(innerValue)"
        :type="customerType"
        :form-model="formModel"
        @confirm="_confirm"
        @cancel="isShowPicker = false"
      />
    </v-popup>
  </div>
</template>

<script>
import { Field } from 'vant'
import VPopup from '../components/popup'
import DatePicker from './components/index'
import formBase from '../mixins/form'
import datejs from '@xuanmo/datejs'
export default {
  name: 'VDatePicker',

  components: {
    'van-field': Field,
    'v-popup': VPopup,
    DatePicker
  },

  mixins: [formBase],

  data () {
    return {
      isShowPicker: false,
      innerValue: '',
      format: ''
    }
  },

  watch: {
    value (v) {
      this.innerValue = this._innerValueFormat(v)
    }
  },

  created () {
    this.innerValue = this._innerValueFormat(this.value)
  },

  methods: {
    _innerValueFormat (v) {
      if (!v) return ''
      const currentFormat = datejs(new Date(v))
      let result = ''
      /* eslint-disable */
      switch (this.customerType) {
        case 'year-month':
          result = currentFormat.format('yyyy-MM')
          break
        case 'datetime':
          result = currentFormat.format('yyyy-MM-dd HH:mm')
          break
        case 'date':
          result = currentFormat.format('yyyy-MM-dd')
          break
        case 'time':
          result = currentFormat.format('HH:mm')
          break
      }
      return result
    },

    _confirm ({ innerValue, value }) {
      this.isShowPicker = false
      this.innerValue = innerValue
      this.e__input(value)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
