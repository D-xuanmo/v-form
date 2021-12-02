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
        @confirm="onConfirm"
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
import { isEmpty } from '@xuanmo/javascript-utils'

export default {
  name: 'VAddress',

  components: {
    [VBaseInput.name]: VBaseInput,
    [Picker.name]: Picker,
    [VPopup.name]: VPopup
  },

  mixins: [formItemBase],

  props: {
    value: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      isConfirm: false,
      isShowPopup: false,

      // 当前回显在输入框中的文字
      innerValue: '',

      // 记录当前的原始 value 数据
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
      if (this.isConfirm) return
      value ? this.formatValue() : this.reset()
    },

    isShowPopup(value) {
      value && this.$nextTick(() => this.$refs.picker.setValues(this.format.map(({ label }) => label)))
    },

    // 避免 options 后加载 value 未回显问题
    'formModel.rules.options'(value) {
      this.value && !isEmpty(value) && this.formatValue()
    }
  },

  created() {
    this.formatValue()
  },

  methods: {
    /**
     * 通过 key 查找对应列表
     * @param data 树形结构数据
     * @param queryList 查找的列表
     * @param key 关键字
     * @returns {Array<{label: string; value: string;}>}
     */
    findValueByKey(data, queryList, key = 'label') {
      const result = []
      let i = 0
      const deep = (current, value) => {
        try {
          const _res = current.find((item) => item[key] === value)
          result.push({
            label: _res.label,
            value: _res.value
          })
          i++
          if (Array.isArray(_res.children)) deep(_res.children, queryList[i])
        } catch (err) {
          return undefined
        }
      }
      deep(data, queryList[i])
      return result
    },

    /**
     * 格式化数据
     */
    formatValue() {
      if (!this.value) return
      const query = this.value.toString().split(',')
      this.format = this.findValueByKey(this.addressJSON, query, 'value')
      this.innerValue = this.format.map(({ label }) => label).join('/')
    },

    async onConfirm(val) {
      this.isConfirm = true
      this.isShowPopup = false
      this.format = this.findValueByKey(this.addressJSON, val)
      const _value = this.format.map(({ value }) => value).join(',')
      this.innerValue = this.format.map(({ label }) => label).join('/')
      this.e__input(_value)
      this.__eventHandler('address-change', {
        label: this.innerValue,
        value: _value
      })
      await this.$nextTick()
      this.isConfirm = false
    },

    reset() {
      this.format = []
      this.innerValue = ''
    }
  }
}
</script>
