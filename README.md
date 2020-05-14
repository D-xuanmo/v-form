# 基于vant-ui表单封装的表单组件
* 目前已经集成的组件（Address/Checkbox/DatePicker/Input/Radio/Select/Text/Switch/Upload），其他组件还在完善中...
* 组件的调用方式采取json配置的形式，具体参数见model数据说明
* 校验规则已经集成VeeValidate插件，也可以自定义扩展规则，更多资料 [https://logaretm.github.io/vee-validate](https://logaretm.github.io/vee-validate)
* [在线演示](https://codesandbox.io/s/v-formshili-3hs2c)

## 安装
```bash
yarn add @xuanmo/v-form
```

## 使用

- js
```js
// 不需要编译方式引入
import VForm from "@xuanmo/v-form/dist/v-form.umd.js"
import "@xuanmo/v-form/dist/v-form.css"

// 项目推荐使用以下方式引入，后编译
import VForm from '@xuanmo/v-form'

// 注册组件
Vue.use(VForm)

/**
 * 自定义校验规则示例，规则遵循VeeValidate规则扩展
 * 更多资料查看：https://logaretm.github.io/vee-validate/guide/basics.html#validation-provider
 */
Vue.use(VForm, {
  validator: {
    customer: {
      message: '长度不能大于{length}',
      validate: (value, { length }) => {
        return value.length <= length
      },
      params: ['length']
    }
  }
})
```

- html
```html
<v-form :model="model"></v-form>
```

- `vue.config.js`配置组件编译(注：如果组件引入采取的后编译需要配置这一项)
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
|disabled|是否禁用表单|boolean|false|
|label-width|label宽度|string|20%|
|label-position|label对齐方式，可选：left/right|string|left|
|label-color|label文字颜色|string|-|

## events

|事件名|说明|回调参数
|---|---|---|
|change|数据更改时触发|object{value,errorMsg,isValid}|
|event|数据发生改变所发送的事件|object{event,formModel}|

## slots
> 组件可接受多个slot，用于替换当前行的表单组件，会为该slot传入该组件的原始数据，每个slot的name为当前行的key，注：该slot不继承所有校验规则
```html
<!-- 示例如下 -->
<v-form :model="model">
  <template v-slot:text="{ data }">
    <van-field v-model="data.value"></van-field>
  </template>
</v-form>
```

## model数据格式
> 以下是一个简单的数据格式，生成一个输入框，详细使用见目录example

```js
const model = {
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
  // 时间选择器
  date: {
    value: Date.now(),
    rules: {
      label: '时间',
      // 共4种类型：datetime、year-month、date、time
      type: 'VDatePicker|datetime',
      // 数据格式处理：timestamp时间戳，其他用法参考：https://github.com/xuanmos/datejs
      valueFormat: 'yyyy-MM-dd'
    }
  },
  // 图片上传
  file: {
    // 用于显示列表
    value: [{ path: 'https://upyun.xuanmo.xin/test/20200418225229.png' }],
    rules: {
      label: '文件上传',
      type: 'VUpload',
      action: 'xxx',
      accept: 'image/png',
      multiple: true,
      name: 'file',
      headers: {},
      // 上传附加的数据
      data: {
        dir: 'test'
      },
      // 自定义配置项，用于指定url字段为某个属性值
      props: {
        url: 'path'
      }
    }
  }
}
```

## 组件发生change事件返回的数据
```json
{
  "value": {}, // 所有的数据经过处理后会以一个对象存放在这个字段
  "errorMsg": [], // 所有的校验失败的错误信息集合
  "isValid": false // 是否有通过所有的校验标识
}
```

## 示例图片

![示例](./example/assets/example.png)
