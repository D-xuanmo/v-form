<template>
  <div class="v-form__input-wrapper">
    <van-field
      ref="input"
      :value="innerValue"
      readonly
      :disabled="formModel.rules.disabled"
      :placeholder="formModel.rules.placeholder"
      right-icon="arrow-down"
      @focus="isShow = true"
      @click-right-icon="isShow = true"
    ></van-field>
    <van-popup v-model="isShow" position="bottom">
      <van-picker
        ref="picker"
        show-toolbar
        :columns="formModel.rules.options"
        @confirm="_confirm"
        @cancel="isShow = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { Popup, Field, Picker } from 'vant'
import formBase from '../mixins/form'
export default {
  name: 'VSelect',
  components: {
    'van-popup': Popup,
    'van-field': Field,
    'van-picker': Picker
  },
  mixins: [formBase],
  data () {
    return {
      isShow: false,
      innerValue: '',
      format: []
    }
  },
  watch: {
    value (v) {
      v ? this._valueToIndex() : this._reset()
    },
    isShow (v) {
      v && this.$nextTick(() => {
        this.$refs.picker.setValues(this.format.map(({ text }) => text))
      })
    }
  },
  created () {
    this._valueToIndex()
  },
  methods: {
    _confirm (val) {
      this.format = val
      this.isShow = false
      this.innerValue = val.map(({ text }) => text).join('/')
      this.e__input(val.map(({ value }) => value).join(','))
    },

    _valueToIndex () {
      if (!this.value) return
      const indexs = this.value.split(',')
      let format = []
      this.formModel.rules.options.forEach((_, index) => {
        format.push(_.values.find(v => v.value.toString() === indexs[index].toString()))
      })
      this.$set(this, 'format', format)
      this.innerValue = format.map(({ text }) => text).join('/')
    },

    _reset () {
      this.format = []
      this.innerValue = ''
    }
  }
}
</script>
