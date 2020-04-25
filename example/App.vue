<template>
  <div id="app">
    <div style="margin-bottom: 30px">
      <span style="vertical-align: super;">切换表单禁用状态</span>
      <van-switch v-model="disabled" size="20px" />
    </div>
    <v-form
      ref="vform"
      :model="model"
      :disabled="disabled"
      label-width="100px"
      @change="_change"
      @event="_event"
    >
      <template v-slot:text="{ data }">
        <van-field v-model="data.value"></van-field>
      </template>
    </v-form>
    <div style="margin: 20px 0;text-align: center;">
      <van-button type="primary" @click="_submit">提交数据</van-button>
    </div>
  </div>
</template>

<script>
import { Field, Switch, Button } from 'vant'
export default {
  name: 'App',
  components: {
    'van-field': Field,
    'van-switch': Switch,
    'van-button': Button
  },
  data () {
    return {
      formData: {},
      formError: [],
      isValid: false,
      disabled: false,
      model: {
        file: {
          value: [{ path: 'https://www.xuanmo.xin/wp-content/uploads/2019/10/xuanmo_avatar.JPG' }],
          rules: {
            label: '文件上传',
            type: 'VUpload',
            action: 'xxx',
            accept: 'image/png',
            multiple: true,
            name: 'file',
            data: {
              dir: 'test'
            },
            props: {
              url: 'path'
            }
          }
        },
        switch: {
          value: true,
          rules: {
            label: '是否启用编辑',
            type: 'VSwitch'
          }
        },
        text: {
          value: '',
          rules: {
            label: '文字',
            type: 'VInput',
            vRules: 'required|customer:2',
            placeholder: '请输入文字',
            errMsg: '请输入文字',
            extra: 'extra'
          }
        },
        text1: {
          value: '123123123123123123123123123123123123123123123123123123123123',
          rules: {
            label: '文字',
            type: 'VText'
          }
        },
        checkbox: {
          value: ['a'],
          rules: {
            label: '复选框',
            type: 'VCheckbox',
            vRules: 'required',
            placeholder: '请输入复选框',
            errMsg: '请输入复选框',
            direction: 'horizontal',
            options: [
              { label: '复选框 a', value: 'a' },
              { label: '复选框 b', value: 'b' },
              { label: '复选框 c', value: 'c' }
            ]
          }
        },
        radio: {
          value: 'b',
          rules: {
            label: '单选框',
            type: 'VRadio',
            vRules: 'required',
            placeholder: '请输入单选框',
            errMsg: '请输入单选框',
            direction: 'horizontal',
            options: [
              { label: '复选框 a', value: 'a' },
              { label: '复选框 b', value: 'b' },
              { label: '复选框 c', value: 'c' }
            ]
          }
        },
        date: {
          value: Date.now(),
          rules: {
            label: '时间',
            type: 'VDatePicker|datetime',
            valueFormat: 'timestamp'
          }
        },
        dateRange: {
          value: [Date.now(), Date.now()],
          rules: {
            label: '时间',
            type: 'VDatePickerRange|time',
            valueFormat: 'timestamp',
            rangeSeparator: '至'
          }
        },
        number: {
          value: '',
          rules: {
            label: '数字',
            type: 'VInput|digit',
            vRules: 'required',
            placeholder: '请输入数字',
            errMsg: '请输入数字'
          }
        },
        address: {
          value: '110000,110100,110114',
          rules: {
            label: '地址选择',
            type: 'VAddress',
            vRules: 'required',
            placeholder: '请输入地址',
            errMsg: '请输入地址'
          }
        },
        textarea: {
          value: '',
          rules: {
            label: '文本域',
            type: 'VInput|textarea',
            vRules: 'required',
            placeholder: '文本域',
            errMsg: '文本域'
          }
        },
        select: {
          value: '4',
          rules: {
            label: '选择器',
            type: 'VSelect',
            placeholder: 'picker选择器',
            errMsg: 'picker选择器',
            vRules: 'required',
            options: [
              { text: '杭州', value: 1 },
              { text: '宁波', value: 2 },
              { text: '温州', value: 3 },
              { text: '嘉兴', value: 4 },
              { text: '湖州', value: 5 }
            ]
          }
        },
        selectMultiple: {
          value: '4,2',
          rules: {
            label: '多列选择器',
            type: 'VSelect',
            placeholder: 'picker选择器',
            errMsg: 'picker选择器',
            options: [
              [
                { text: '杭州', value: '1' },
                { text: '宁波', value: '2' },
                { text: '温州', value: '3' },
                { text: '嘉兴', value: '4' },
                { text: '湖州', value: '5' }
              ],
              [
                { text: '杭州', value: '1' },
                { text: '宁波', value: '2' },
                { text: '温州', value: '3' },
                { text: '嘉兴', value: '4' },
                { text: '湖州', value: '5' }
              ]
            ]
          }
        }
      }
    }
  },
  methods: {
    _change ({ value, errorMsg, isValid }) {
      this.formData = value
      this.formError = errorMsg
      this.isValid = isValid
    },
    _event ({ type, value }) {
      console.log(type, value)
    },
    _submit () {
      if (!this.isValid) {
        this.$toast(this.formError[0].errMsg)
        return
      }
      this.$toast('提交成功')
    }
  }
}
</script>

<style>
#app {
  font-size: 14px;
}
</style>
