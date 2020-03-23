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
        value-key="label"
        :columns="addressData"
        @confirm="_confirm"
        @cancel="isShow = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { Popup, Field, Picker } from 'vant'
import formBase from '../mixins/form'
import addressData from './data'
export default {
  name: 'VAddress',
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
      format: [],
      addressData
    }
  },
  watch: {
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
      const query = this.value.split(',')
      this.$set(this, 'format', this._findValue(this.addressData, query, 'value'))
      this.innerValue = this.format.map(({ label }) => label).join('/')
    }
  }
}
</script>
