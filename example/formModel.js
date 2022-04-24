import { dCookie } from '@xuanmo/javascript-utils'
export default [
  { rules: { type: 'VCell' } },
  {
    rules: {
      type: 'VCell',
      label: '自定义组件示例'
    }
  },
  {
    key: 'formItemTest',
    value: '',
    rules: {
      label: '自定义组件',
      type: 'FormItemTest',
      placeholder: '点击输入',
      vRules: 'required',
      pattern: /^\d+$/,
      errorMsg: '自定义组件只能输入数字',
      cellCenter: true
    }
  },
  {
    key: 'hideLable',
    value: '',
    rules: {
      label: '隐藏 Label',
      type: 'VInput',
      placeholder: '我是输入框',
      showLabel: false
    }
  },
  {
    key: 'text4',
    value: '这是一段纯文字内容展示',
    rules: {
      label: '文字 4',
      type: 'VText'
    }
  },

  { rules: { type: 'VCell' } },
  {
    rules: {
      type: 'VCell',
      label: '短信验证码示例'
    }
  },
  {
    key: 'phone',
    value: '',
    rules: {
      label: '手机号',
      type: 'VInput|number',
      placeholder: '请输入手机号',
      vRules: 'required|phone',
      errorMsg: '请输入手机号'
    }
  },
  {
    key: 'verificationCode',
    value: '',
    rules: {
      label: '短信验证码',
      type: 'VVerificationCode',
      buttonText: '发送验证码',
      placeholder: '请输入验证码',
      errorMsg: '请输入验证码',
      vRules: 'required',
      countdown: 60,
      crossVerificationFields: ['phone'],
      // 如果需要使用自定义校验需要设置此属性
      needCustomValidate: true,
      mobile: 'phone'
      // buttonDisabled: true,
    }
  },

  { rules: { type: 'VCell' } },
  { rules: { type: 'VCell', label: '基础表单示例' } },
  {
    key: 'inputBase',
    value: '',
    rules: {
      label: '输入框',
      type: 'VInput',
      vRules: 'required',
      placeholder: '请输入内容',
      errorMsg: '请输入内容'
    }
  },
  {
    key: 'textarea',
    value: '',
    rules: {
      label: '文本域',
      type: 'VInput|textarea',
      vRules: 'required',
      placeholder: '文本域',
      errorMsg: '文本域'
    }
  },
  {
    key: 'numberKeyboard',
    value: '',
    rules: {
      label: '数字键盘',
      type: 'VNumberKeyboard',
      placeholder: '点击输入',
      extraKey: '.'
      // theme: 'custom',
      // closeButtonText: '完成'
    }
  },
  {
    key: 'number',
    value: '',
    rules: {
      label: '原生数字键盘',
      type: 'VInput|digit',
      vRules: 'required',
      placeholder: '请输入数字',
      errorMsg: '请输入数字'
    }
  },
  {
    key: 'regexp',
    value: '',
    rules: {
      label: '正则校验',
      type: 'VInput',
      vRules: 'required',
      pattern: '^\\d+$',
      // pattern: /^\d+$/,
      placeholder: '只能输入数字',
      errorMsg: '只能输入数字'
    }
  },
  {
    key: 'radio',
    value: 'b',
    rules: {
      label: '单选框',
      type: 'VRadio',
      vRules: 'required',
      placeholder: '请输入单选框',
      errorMsg: '请输入单选框',
      direction: 'horizontal',
      options: [
        { label: '复选框 a', value: 'a' },
        { label: '复选框 b', value: 'b' },
        { label: '复选框 c', value: 'c' }
      ]
    }
  },
  {
    key: 'checkbox',
    value: ['a'],
    rules: {
      label: '复选框',
      type: 'VCheckbox',
      vRules: 'required',
      placeholder: '请输入复选框',
      errorMsg: '请输入复选框',
      direction: 'horizontal',
      options: [
        { label: '复选框 a', value: 'a' },
        { label: '复选框 b', value: 'b' },
        { label: '复选框 c', value: 'c' }
      ]
    }
  },
  {
    key: 'switch',
    value: true,
    rules: {
      label: '开关',
      type: 'VSwitch'
    }
  },

  { rules: { type: 'VCell' } },
  { rules: { type: 'VCell', label: '日期时间选择器' } },
  {
    key: 'date',
    value: Date.now(),
    rules: {
      label: '时间',
      type: 'VDatePicker|datetime',
      valueFormat: 'timestamp'
    }
  },
  {
    key: 'dateRange',
    value: [Date.now(), Date.now()],
    rules: {
      label: '时间',
      type: 'VDatePickerRange|time',
      valueFormat: 'timestamp',
      rangeSeparator: '至'
    }
  },

  { rules: { type: 'VCell' } },
  { rules: { type: 'VCell', label: '文件上传示例' } },

  {
    key: 'file',
    value: [
      {
        url: '/api/my-admin/readFile?path=/upload/v-form/20211211151251521209.png'
      }
    ],
    rules: {
      label: '文件上传',
      type: 'VUpload',
      action: '/api/my-admin/upload',
      accept: 'image/*',
      multiple: true,
      name: 'files',
      data: {
        type: 'media',
        path: '/v-form'
      },
      headers: {
        'X-XSRF-TOKEN': dCookie.getItem('csrfToken')
      },
      props: {
        url: 'url'
      },

      // 后端返回的数据自定义处理，每个图片会发一次请求
      // 如果后端返回的格式是数组取第一个就行了
      onSuccess({ data }) {
        return data[0]
      }
    }
  },

  { rules: { type: 'VCell' } },
  { rules: { type: 'VCell', label: '下拉选择器示例' } },
  {
    key: 'address',
    value: '110000,110100,110114',
    rules: {
      label: '地址选择',
      type: 'VAddress',
      vRules: 'required',
      placeholder: '请输入地址',
      errorMsg: '请输入地址'
    }
  },
  {
    key: 'select',
    value: '4',
    rules: {
      label: '单列选择器',
      type: 'VSelect',
      placeholder: 'picker 选择器',
      errorMsg: 'picker 选择器',
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
  {
    key: 'selectMultiple',
    // value: '4,2',
    value: ['4', '2'],
    rules: {
      label: '多列选择器',
      type: 'VSelect',
      placeholder: 'picker 选择器',
      errorMsg: 'picker 选择器',
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
]
