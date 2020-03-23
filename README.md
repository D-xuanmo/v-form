# 基于vant-ui表单封装的表单组件

## 安装
```bash
yarn add @xuanmo/v-form
```

## 使用

- js
```js
import VForm from '@xuanmo/v-form'
Vue.use(VForm)
```

- html
```html
<v-form :model="model"></v-form>
```

- `vue.config.js`配置组件编译
```js
module.exports = {
  transpileDependencies: [
    '@xuanmo/v-form'
  ]
}
```

## props

|字段名|说明|类型|默认值
|---|---|---|---|
|model|数据模型(具体类型参考后续文档)|object|{}|
|label-width|label宽度|string|20%|
|label-position|label对齐方式，可选：left/right|string|left|

## events

|事件名|说明|回调参数
|---|---|---|
|change|数据更改时触发|object{value,errorMsg,isValid}|
|event|数据发生改变所发送的事件|object{event,formModel}|

## model数据格式

```js
model = {
  text: {
    value: '',
    rules: {
      label: '文字',
      type: 'VInput',
      vRules: 'required',
      placeholder: '请输入文字',
      errMsg: '请输入文字'
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
  }
}
```
