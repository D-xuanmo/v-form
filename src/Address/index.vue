<template>
  <div class="v-form__input-wrapper">
    <van-field
      ref="input"
      :value="innerValue"
      readonly
      :disabled="formModel.rules.disabled || VFormRoot.disabled"
      :placeholder="formModel.rules.placeholder"
      :right-icon="formModel.rules.disabled ? '' : 'arrow-down'"
      @focus="isShow = true"
      @click-right-icon="!VFormRoot.disabled && (isShow = true)"
      @click="__eventHandler('click', formModel)"
    ></van-field>
    <v-popup v-model="isShow">
      <van-picker
        ref="picker"
        show-toolbar
        value-key="label"
        :columns="addressData"
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
import addressData from './data'
export default {
  name: 'VAddress',
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
      addressData
    }
  },
  watch: {
    value (v) {
      v ? this._valueToIndex() : this._reset()
    },
    isShow (v) {
      v && this.$nextTick(() => {
        this.$refs.picker.setValues(this.format.map(({ label }) => label))
      })
    }
  },
  created () {
    this._valueToIndex()
  },
  methods: {
    _confirm (val) {
      this.format = this._findValue(this.addressData, val)
      this.isShow = false
      this.innerValue = this.format.map(({ label }) => label).join('/')
      this.e__input(this.format.map(({ value }) => value).join(','))
      this.__eventHandler('address-change', {
        label: this.innerValue,
        value: this.value
      })
    },

    _findValue (arr, queryList, key = 'label') {
      let result = []
      let i = 0
      const find = (arr, q) => {
        try {
          let r = arr.find(v => v[key] === q)
          result.push({
            label: r.label,
            value: r.value
          })
          i++
          if (Array.isArray(r.children)) {
            find(r.children, queryList[i])
          }
        } catch (err) {
          return
        }
      }
      find(arr, queryList[i])
      return result
    },

    _valueToIndex () {
      if (!this.value) return
      const query = this.value.toString().split(',')
      this.$set(this, 'format', this._findValue(this.addressData, query, 'value'))
      this.innerValue = this.format.map(({ label }) => label).join('/')
    },

    _reset () {
      this.format = []
      this.innerValue = ''
    }
  }
}
</script>
