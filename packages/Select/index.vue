<template>
  <div class="v-form__input-wrapper">
    <v-base-input
      ref="input"
      :value="innerValue"
      readonly
      :disabled="disabled"
      :placeholder="formModel.rules.placeholder"
      :right-icon="formModel.rules.disabled ? '' : 'arrow-down'"
      @focus="isShowPopup = true"
      @click-right-icon="!VFormRoot.disabled && (isShowPopup = true)"
      @change="e__change"
      @click="__eventHandler('click', formModel)"
    />
    <v-popup v-model="isShowPopup" position="bottom">
      <van-picker
        ref="picker"
        show-toolbar
        :columns="options"
        @confirm="confirm"
        @cancel="isShowPopup = false"
      />
    </v-popup>
  </div>
</template>

<script>
import VBaseInput from '../components/VBaseInput.vue'
import { Picker } from 'vant'
import VPopup from '../components/VPopup.vue'
import formItemBase from '../mixins/formItemBase'
import { isObject } from '@xuanmo/javascript-utils'

export default {
  name: 'VSelect',

  components: {
    [VBaseInput.name]: VBaseInput,
    [Picker.name]: Picker,
    [VPopup.name]: VPopup
  },

  mixins: [formItemBase],

  data() {
    return {
      isShowPopup: false,
      innerValue: '',
      format: [],
      options: []
    }
  },

  watch: {
    // 生成 vant picker 所需要的数据格式
    'formModel.rules.options': {
      immediate: true,
      deep: true,
      handler(value, oldValue) {
        if (value === oldValue) return
        let result = []
        if (isObject(value[0])) {
          result.push({ values: value })
        } else if (Array.isArray(value[0])) {
          value.forEach((item) => {
            result.push({ values: item })
          })
        }
        this.options = result
      }
    },

    value(value) {
      this.__validator(value)
      value ? this.valueToIndex() : this.reset()
    },

    isShowPopup(value) {
      value && this.$nextTick(() => this.$refs.picker.setValues(this.format.map(({ text }) => text)))
    }
  },

  created() {
    this.valueToIndex()
  },

  methods: {
    confirm(val) {
      this.format = val
      this.isShowPopup = false
      this.innerValue = val.map(({ text }) => text).join('/')
      this.e__input(val.map(({ value }) => value).join(','))
    },

    valueToIndex() {
      if (!this.value) return
      const indexs = this.value.toString().split(',')
      let format = []
      this.options.forEach((_, index) => {
        format.push(_.values.find((v) => v.value.toString() === indexs[index].toString()))
      })
      this.$set(this, 'format', format)
      this.innerValue = format.map(({ text }) => text).join('/')
    },

    reset() {
      this.format = []
      this.innerValue = ''
    }
  }
}
</script>
