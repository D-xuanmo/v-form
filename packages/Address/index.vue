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
      @click="__eventHandler('click', formModel)"
    />
    <v-popup v-model="isShowPopup">
      <van-picker
        ref="picker"
        show-toolbar
        value-key="label"
        :columns="addressJSON"
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

export default {
  name: 'VAddress',

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
      format: []
    }
  },

  computed: {
    addressJSON() {
      return this.formModel.rules.options || this.$VForm.addressJSON
    }
  },

  watch: {
    value(value) {
      value ? this.valueToIndex() : this.reset()
    },

    isShowPopup(value) {
      value && this.$nextTick(() => this.$refs.picker.setValues(this.format.map(({ label }) => label)))
    }
  },

  created() {
    this.valueToIndex()
  },

  methods: {
    confirm(val) {
      this.format = this.findValue(this.addressJSON, val)
      const _value = this.format.map(({ value }) => value).join(',')
      this.isShowPopup = false
      this.innerValue = this.format.map(({ label }) => label).join('/')
      this.e__input(_value)
      this.__eventHandler('address-change', {
        label: this.innerValue,
        value: _value
      })
    },

    findValue(arr, queryList, key = 'label') {
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

    valueToIndex() {
      if (!this.value) return
      const query = this.value.toString().split(',')
      this.$set(this, 'format', this.findValue(this.addressJSON, query, 'value'))
      this.innerValue = this.format.map(({ label }) => label).join('/')
    },

    reset() {
      this.format = []
      this.innerValue = ''
    }
  }
}
</script>
