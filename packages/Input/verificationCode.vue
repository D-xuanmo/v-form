<template>
  <v-base-input
    :value="value"
    :placeholder="formModel.rules.placeholder"
    :clearable="formModel.rules.clearable"
    :maxlength="formModel.rules.maxlength"
    :disabled="disabled"
    @input="e__input"
  >
    <van-button
      type="info"
      size="small"
      style="min-width: 78px;"
      :disabled="buttonDisabled"
      @click="handlerButtonClick"
    >
      {{ buttonText }}
    </van-button>
  </v-base-input>
</template>

<script>
import VBaseInput from '../components/VBaseInput.vue'
import { Button } from 'vant'
import formItemBase from '../mixins/formItemBase'
import { countDown, isFunction } from '@xuanmo/javascript-utils'

export default {
  name: 'VVerificationCode',

  components: {
    VBaseInput,
    [Button.name]: Button
  },

  mixins: [formItemBase],

  data() {
    const defaultCountDown = 60
    return {
      defaultCountDown,
      loading: false,
      countDown: this.formModel.rules.countDown || defaultCountDown
    }
  },

  computed: {
    buttonText() {
      return this.loading ? `${this.countDown}s` : (this.formModel.rules.buttonText || '发送验证码')
    },

    buttonDisabled() {
      return this.disabled || this.formModel.rules.buttonDisabled || this.loading
    }
  },

  methods: {
    async handlerButtonClick() {
      // 拦截请求
      const beforeCountdown = this.formModel.rules.onBeforeCountdown
      if (isFunction(beforeCountdown)) {
        const allow = await beforeCountdown(this.VFormRoot)
        if (!allow) return
      }

      this.loading = true
      const timer = countDown(this.countDown, `VForm-timer-${Date.now()}`, () => {
        this.loading = false
        this.__eventHandler('verification-code-countdown-over')
      }, () => {
        this.countDown--
      })

      // 按钮点击时传回一个可关闭定时器的函数，用于取消倒计时
      this.__eventHandler('verification-code-button-click', () => {
        clearTimeout(timer)
        this.loading = false
      })
    }
  }
}
</script>
