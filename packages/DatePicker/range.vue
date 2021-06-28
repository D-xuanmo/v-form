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
      @click-right-icon="!VFormRoot.disabled && (isShowPicker = true)"
    />
    <v-popup v-model="isShowPicker" @close="_cancel">
      <div class="van-hairline--top-bottom van-picker__toolbar">
        <button type="button" class="van-picker__cancel" @click="_cancel">
          取消
        </button>
        <button type="button" class="van-picker__confirm" @click="_confirm">
          确认
        </button>
      </div>
      <row2col
        :label="formModel.rules.startPlaceholder || '开始时间'"
        :class="current === 'start' && 'is-active'"
        @click.native="_toggleDate('start')"
      >
        {{ startInnerValue }}
      </row2col>
      <row2col
        :label="formModel.rules.endPlaceholder || '结束时间'"
        :class="current === 'end' && 'is-active'"
        @click.native="_toggleDate('end')"
      >
        {{ endInnerValue }}
      </row2col>
      <template>
        <date-picker
          v-if="current === 'start'"
          ref="start"
          :value="+new Date(startValue)"
          :type="customerType"
          :form-model="formModel"
          :show-toolbar="false"
          @confirm="_startConfirm"
        />
        <date-picker
          v-else-if="current === 'end'"
          ref="end"
          :value="+new Date(endValue)"
          :type="customerType"
          :form-model="formModel"
          :show-toolbar="false"
          @confirm="_endConfirm"
        />
      </template>
    </v-popup>
  </div>
</template>

<script>
import VPopup from '../components/VPopup.vue'
import formItemBase from '../mixins/formItemBase'
import datejs from '@xuanmo/datejs'
import row2col from '../Layout/row2col'
import DatePicker from './components/index'
import VBaseInput from '../components/VBaseInput.vue'
export default {
  name: 'VDatePickerRange',

  components: {
    [VPopup.name]: VPopup,
    row2col,
    DatePicker,
    VBaseInput
  },

  mixins: [formItemBase],

  props: {
    value: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      isShowPicker: false,
      startInnerValue: '',
      startValue: '',
      endInnerValue: '',
      endValue: '',
      current: 'start'
    }
  },

  computed: {
    innerValue() {
      return this.startInnerValue && this.endInnerValue
        ? `${this.startInnerValue} ${this.formModel.rules.rangeSeparator ||
            '-'} ${this.endInnerValue}`
        : ''
    }
  },

  watch: {
    value: {
      immediate: true,
      deep: true,
      handler([start, end]) {
        this.startValue = start || Date.now()
        this.endValue = end || Date.now()
        this.startInnerValue = start
          ? this._innerValueFormat(new Date(start))
          : ''
        this.endInnerValue = end ? this._innerValueFormat(new Date(end)) : ''
      }
    }
  },

  methods: {
    _innerValueFormat(date) {
      const currentFormat = datejs(date)
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

    _toggleDate(type) {
      this.current = type
    },

    _startConfirm({ value, innerValue }) {
      this.startInnerValue = innerValue
      this.startValue = value
    },

    _endConfirm({ value, innerValue }) {
      this.endInnerValue = innerValue
      this.endValue = value
    },

    _confirm() {
      this.e__input([this.startValue, this.endValue])
      this._cancel()
    },

    _cancel() {
      this.current = 'start'
      this.isShowPicker = false
    }
  }
}
</script>
