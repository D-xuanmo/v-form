<template>
  <div class="v-form__input-wrapper">
    <v-base-input
      ref="input"
      :value="innerValue"
      readonly
      :disabled="disabled"
      :placeholder="formModel.rules.placeholder"
      :right-icon="formModel.rules.disabled ? '' : 'arrow-down'"
      @focus="isShowPicker = true"
      @change="e__change"
      @click-right-icon="!VFormRoot.disabled && (isShowPicker = true)"
    />
    <v-popup v-model="isShowPicker">
      <date-picker
        :value="+new Date(innerValue)"
        :type="customerType"
        :form-model="formModel"
        @confirm="confirm"
        @cancel="isShowPicker = false"
      />
    </v-popup>
  </div>
</template>

<script>
import VBaseInput from '../components/VBaseInput.vue'
import VPopup from '../components/VPopup.vue'
import DatePicker from './components/index'
import formItemBase from '../mixins/formItemBase'
import datejs from '@xuanmo/datejs'
export default {
  name: 'VDatePicker',

  components: {
    VBaseInput,
    VPopup,
    DatePicker
  },

  mixins: [formItemBase],

  props: {
    value: {
      type: [String, Number, Date],
      default: ''
    }
  },

  data() {
    return {
      isShowPicker: false,
      innerValue: '',
      format: ''
    }
  },

  watch: {
    value(v) {
      this.innerValue = this.innerValueFormat(v)
    }
  },

  created() {
    this.innerValue = this.innerValueFormat(this.value)
  },

  methods: {
    innerValueFormat(v) {
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

    confirm({ innerValue, value }) {
      this.isShowPicker = false
      this.innerValue = innerValue
      this.e__input(value)
    }
  }
}
</script>
