<template>
  <div id="app">
    <div style="margin-bottom: 30px">
      <span style="vertical-align: super;">切换表单禁用状态</span>
      <van-switch v-model="disabled" size="20px" />
    </div>
    <v-form
      ref="vform"
      v-model="formValue"
      :model="model"
      :disabled="disabled"
      label-width="100px"
      :validator="validator"
      @change="_change"
      @event="_event"
    >
      <template #text4-label>
        自定义label
      </template>
      <template #text4-extra>
        <!-- <van-field v-model="data.value"></van-field> -->
        extra
      </template>
    </v-form>
    <div style="margin: 20px 0;text-align: center;">
      <van-button type="primary" @click="_submit">提交数据</van-button>
    </div>
  </div>
</template>

<script>
import { Switch, Button, Toast } from 'vant'
import formModel from './formModel'
export default {
  name: 'App',
  components: {
    // 'van-field': Field,
    [Switch.name]: Switch,
    [Button.name]: Button
  },
  data () {
    return {
      validator: {
        custom: {
          message: '关联文字校验未通过',
          params: ['target1', 'target2'],
          validate: (value, { target1, target2 }, ctx) => {
            console.log('关联校验context：', ctx)
            return value === target1 && value === target2
          }
        }
      },
      formValue: {
        text1: '123'
      },
      formData: {},
      formError: [],
      isValid: false,
      disabled: false,
      model: formModel
    }
  },

  mounted() {
    this.$refs.vform.setModelItemOptions('1qw', [])
  },
  methods: {
    _change ({ value, errorMsg, isValid }) {
      this.formData = value
      this.formError = errorMsg
      this.isValid = isValid
    },
    _event ({ type, value, model }) {
      // console.log(type, value, model)
      // if (type === 'verification-code-valid') {
      //   value(async (formRoot) => {
      //     // 返回 true 代表通过，开始倒计时；false 则不执行
      //     return true
      //   })
      // }
      // 可以在这里写异步回调函数，比如验证码请求失败需要恢复点击状态，执行 value() 即可
      if (type === 'verification-code-button-click') {
        setTimeout(() => {
          Toast('验证码发送失败了')
          value()
        }, 3000)
      }
    },
    _submit () {
      this.$refs.vform.validate((isValid, formError) => {
        if (!isValid) return Toast(formError[0].errorMsg)
        Toast('提交成功')
      })
    }
  }
}
</script>

<style lang="less">
@import "./assets/style/index.less";
</style>
<style lang="less" scoped>
/deep/ .v-form-conatiner {
  .v-form-cell {
    &.has-child {
      background: #fff;
      border-bottom: 1px solid #F0F0F0;
    }
  }
  .v-form-cell__label {
    &:before {
      content: "";
      display: inline-block;
      width: 3px;
      height: 15px;
      margin-right: 5px;
      background: #f00;
      vertical-align: middle;
    }
  }
}
</style>
