<template>
  <div id="app">
    <ul class="doc-wrap">
      <li><a href="https://github.com/D-xuanmo/v-form/blob/master/example/App.vue" target="_blank">点我查看示例代码，Go</a></li>
      <li><a href="https://codesandbox.io/s/v-formshili-3hs2c?file=/src/App.vue" target="_blank">点我可在线编辑预览（PC端），Go</a></li>
      <li>
        <span style="vertical-align: super;">切换表单禁用状态 </span>
        <van-switch v-model="disabled" size="20px" />
      </li>
    </ul>
    <v-form
      ref="vform"
      v-model="formValue"
      :model="model"
      :disabled="disabled"
      label-width="100px"
      :label-color="labelColor"
      :validator="validator"
      @change="change"
      @event="handleEvent"
    >
      <template #text4-label>
        自定义 label
      </template>
      <template #text4-extra>
        <!-- <van-field v-model="data.value"></van-field> -->
        extra
      </template>
    </v-form>
    <div style="margin: 20px 0 50px;text-align: center;">
      <van-button type="info" @click="submit">提交数据</van-button>
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
      model: formModel,
      labelColor: 'inherit'
    }
  },
  methods: {
    change ({ value, errorMsg, isValid }) {
      this.formData = value
      this.formError = errorMsg
      this.isValid = isValid
    },
    handleEvent ({ type, value, model }) {
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
    submit () {
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
@import "./assets/style/var.less";
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
      border-radius: 2px;
      background: @blue;
      vertical-align: middle;
    }
  }
}
</style>
