<template>
  <div class="v-form__input-wrapper">
    <van-field
      ref="input"
      :value="innerValue"
      readonly
      :disabled="disabled"
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
        :columns="addressJSON"
        @confirm="_confirm"
        @cancel="isShow = false"
      />
    </v-popup>
  </div>
</template>

<script>
import { Field, Picker } from 'vant'
import VPopup from '../components/popup'
import formBase from '../mixins/formItemBase'

export default {
  name: 'VAddress',

  components: {
    [Field.name]: Field,
    [Picker.name]: Picker,
    [VPopup.name]: VPopup
  },

  mixins: [formBase],

  data() {
    return {
      isShow: false,
      innerValue: '',
      format: []
    }
  },

  computed: {
    addressJSON() {
      return this.formModel.rules.options || this.$VForm.ADDRESS_JSON
    }
  },

  watch: {
    value(v) {
      v ? this._valueToIndex() : this._reset()
    },

    isShow(v) {
      v &&
        this.$nextTick(() => {
          this.$refs.picker.setValues(this.format.map(({ label }) => label))
        })
    }
  },

  created() {
    this._valueToIndex()
  },

  methods: {
    _confirm(val) {
      this.format = this._findValue(this.addressJSON, val)
      const _value = this.format.map(({ value }) => value).join(',')
      this.isShow = false
      this.innerValue = this.format.map(({ label }) => label).join('/')
      this.e__input(_value)
      this.__eventHandler('address-change', {
        label: this.innerValue,
        value: _value
      })
    },

    _findValue(arr, queryList, key = 'label') {
      let result = []
      let i = 0
      const find = (arr, q) => {
        try {
          let r = arr.find((v) => v[key] === q)
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

    _valueToIndex() {
      if (!this.value) return
      const query = this.value.toString().split(',')
      this.$set(this, 'format', this._findValue(this.addressJSON, query, 'value'))
      this.innerValue = this.format.map(({ label }) => label).join('/')
    },

    _reset() {
      this.format = []
      this.innerValue = ''
    }
  }
}
</script>
