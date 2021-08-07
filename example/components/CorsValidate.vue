<template>
  <div>
    <v-form ref="vform" :model="formModel" :validator="validator"></v-form>
    <div style="margin: 20px 0 50px;text-align: center;">
      <van-button type="info" @click="submit">提交数据</van-button>
    </div>
  </div>
</template>

<script>
import { Button, Toast } from 'vant'
export default {
  name: 'CorsValidate',

  components: {
    [Button.name]: Button
  },

  data() {
    return {
      validator: {
        custom: {
          params: ['target1', 'target2'],
          message: '关联文字校验未通过',
          validate: (value, { target1, target2 }, ctx) => {
            console.log('关联校验context：', value, target1, target2, ctx)
            return value === target1 && value === target2
          }
        },

        custom1: {
          params: ['target1', 'target2'],
          message(mainValue, params, { trigger, valid, name }) {
            // valid 校验是否通过
            if (valid) return ''
            console.group('错误信息高级用法')
            console.log(`主字段的 value: ${mainValue}`)
            console.log('关联字段的 value: ', params)
            console.log(`触发规则的字段: ${trigger}`)
            console.log(`name: ${name}`, valid)
            console.groupEnd()
            if (name === 'main') return '文字 4 的错误信息'
            if (name === 'target1') return params.target1 === '2' ? '当前值为 2，校验通过，这里给空字符串即可' : '文字 5 的错误信息'
            if (name === 'target2') return '文字 6 的错误信息'
            return '关联文字校验未通过'
          },
          validate: (value, { target1, target2 }, ctx) => {
            console.log('关联校验context：', value, target1, target2, ctx)
            return value === target1 && value === target2
          }
        }
      },

      formModel: [
        { rules: { type: 'VCell', label: '基础关联校验示例' } },
        {
          key: 'text1',
          value: '',
          rules: {
            label: '关联文字 1',
            type: 'VInput',
            vRules: 'required|custom:@text2,@text3',
            placeholder: '请输入关联文字 1',
            errorMsg: '请输入关联文字 1',
            extra: 'extra'
          }
        },
        {
          key: 'text2',
          value: '',
          rules: {
            label: '关联文字 2',
            type: 'VInput',
            vRules: 'required|@custom',
            placeholder: '请输入关联文字 2',
            errorMsg: '请输入关联文字 2',
            extra: 'extra'
          }
        },
        {
          key: 'text3',
          value: '',
          rules: {
            label: '关联文字 3',
            type: 'VInput',
            vRules: 'required|@custom',
            placeholder: '请输入关联文字 3',
            errorMsg: '请输入关联文字 3'
          }
        },

        { rules: { type: 'VCell' } },
        { rules: { type: 'VCell', label: '错误信息高级用法示例' } },
        {
          key: 'text4',
          value: '',
          rules: {
            label: '关联文字 4',
            type: 'VInput',
            vRules: 'required|custom1:@text5,@text6',
            placeholder: '请输入文字',
            errorMsg: '请输入文字',
            extra: 'extra'
          }
        },
        {
          key: 'text5',
          value: '',
          rules: {
            label: '关联文字 5',
            type: 'VInput',
            vRules: 'required|@custom1',
            placeholder: '请输入文字',
            errorMsg: '请输入文字',
            extra: 'extra'
          }
        },
        {
          key: 'text6',
          value: '',
          rules: {
            label: '关联文字 6',
            type: 'VInput',
            vRules: 'required|@custom1',
            placeholder: '请输入文字',
            errorMsg: '请输入文字',
            extra: 'extra'
          }
        }
      ]
    }
  },

  methods: {
    submit() {
      this.$refs.vform.validate((isValid, formError) => {
        if (!isValid) return Toast(formError[0].errorMsg)
        Toast('提交成功')
      })
    }
  }
}
</script>
