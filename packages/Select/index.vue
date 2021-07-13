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
import { formatOption } from '../utils'

export default {
  name: 'VSelect',

  components: {
    [VBaseInput.name]: VBaseInput,
    [Picker.name]: Picker,
    [VPopup.name]: VPopup
  },

  mixins: [formItemBase],

  props: {
    value: {
      type: [String, Array],
      default: ''
    }
  },

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
      handler(value) {
        this.options = formatOption(value)
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
