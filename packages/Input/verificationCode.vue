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
import { isEmpty, isFunction, countDown } from '@xuanmo/javascript-utils'

export default {
  name: 'VVerificationCode',

  components: {
    VBaseInput,
    [Button.name]: Button
  },

  mixins: [formItemBase],

  props: {
    value: {
      type: String,
      default: ''
    }
  },

  data() {
    const defaultCountDown = 60
    return {
      defaultCountDown,
      loading: false,
      countdown: this.formModel.rules.countdown || defaultCountDown
    }
  },

  computed: {
    buttonText() {
      return this.loading ? `${this.countdown}s` : (this.formModel.rules.buttonText || '发送验证码')
    },

    buttonDisabled() {
      return this.disabled || this.formModel.rules.buttonDisabled || this.loading
    }
  },

  methods: {
    /**
     * 执行自定义校验规则
     * @returns {Promise<unknown>}
     */
    async handleCustomValidator() {
      return new Promise((resolve) => {
        this.__eventHandler('verification-code-valid', async (callback) => {
          if (isFunction(callback)) {
            const isValid = await callback(this.VFormRoot)
            resolve(isValid)
          }
        })
      })
    },

    // 这里的校验流程为：
    // 1. crossVerificationFields 关联字段校验通过
    // 2. verification-code-valid 校验事件通过
    // 3. 触发 verification-code-button-click 事件
    // 4. verification-code-countdown-over 倒计时结束触发
    async handlerButtonClick() {
      // 倒计时前执行需要关联校验的字段
      const crossVerificationFields = this.formModel.rules.crossVerificationFields
      if (Array.isArray(crossVerificationFields)) {
        for (let i = 0; i < crossVerificationFields.length; i++) {
          const field = crossVerificationFields[i]
          const { errorMsg } = await this.VFormRoot.formItemRefs[field].__validator(this.VFormRoot.formValues[field], true)
          if (!isEmpty(errorMsg)) return
        }
      }

      // 先判断是否需要自定义校验
      if (this.formModel.rules.needCustomValidate) {
        const isValid = await this.handleCustomValidator()
        if (!isValid) return
      }

      const mobile = this.VFormRoot.formValues[this.formModel.rules.mobile];
      // 开始执行倒计时
      this.loading = true
      let flag = false
      const cancel = countDown(this.formModel.rules.countdown, `VForm-timer-${Date.now()}`, () => {
        this.__eventHandler('verification-code-countdown-over')
        this.reset()
      }, () => {
        this.countdown--
        !flag && this.__eventHandler('verification-code-button-click', () => {
          cancel()
          this.reset()
        }, mobile)
        flag = true
      })
    },

    reset() {
      this.loading = false
      this.countdown = this.formModel.rules.countdown
    }
  }
}
</script>
