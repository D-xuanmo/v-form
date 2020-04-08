<template>
  <div class="v-form__input-wrapper">
    <van-field
      ref="input"
      :value="innerValue"
      readonly
      :disabled="formModel.rules.disabled"
      :placeholder="formModel.rules.placeholder"
      :right-icon="formModel.rules.disabled ? '' : 'arrow-down'"
      @focus="isShow = true"
      @click-right-icon="isShow = true"
      @click="__eventHandler('click', formModel)"
    ></van-field>
    <v-popup v-model="isShow" position="bottom">
      <van-picker
        ref="picker"
        show-toolbar
        :columns="options"
        @confirm="_confirm"
        @cancel="isShow = false"
      />
    </v-popup>
  </div>
</template>

<script>
import { Field, Picker } from 'vant'
import VPopup from '../components/popup'
import formBase from '../mixins/form'
import { isObject } from '../utils'
export default {
  name: 'VSelect',
  components: {
    'van-field': Field,
    'van-picker': Picker,
    'v-popup': VPopup
  },
  mixins: [formBase],
  data () {
    return {
      isShow: false,
      innerValue: '',
      format: [],
      options: []
    }
  },
  watch: {
    'formModel.rules.options': {
      immediate: true,
      deep: true,
      handler (val) {
        console.log(val)
        let result = []
        if (val.length) {
          if (isObject(val[0])) {
            result.push({
              values: val
            })
          } else if (Array.isArray(val[0])) {
            val.forEach(item => {
              result.push({
                values: item
              })
            })
          }
        }
        this.options = result
      }
    },
    value (v) {
      this.__validator(v)
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
      const indexs = this.value.toString().split(',')
      let format = []
      this.options.forEach((_, index) => {
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
