export default [
  {
    rules: { type: 'VCell' }
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
      errorMsg: '自定义组件错误信息',
      cellCenter: true
    }
  },
  {
    rules: { type: 'VCell' }
  },
  {
    rules: {
      type: 'VCell',
      label: '我是标题'
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
      crossVerificationFields: ['phone']
      // buttonDisabled: true,
    }
  },
  {
    rules: { type: 'VCell' }
  },
  {
    key: 'numberKeyboard',
    value: '',
    rules: {
      label: '数字键盘',
      type: 'VNumberKeyboard',
      placeholder: '点击输入',
      // theme: 'custom',
      extraKey: '.'
      // closeButtonText: '完成'
    }
  },
  {
    key: 'number',
    value: '',
    rules: {
      label: '数字',
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
      placeholder: '请输入',
      errorMsg: '只能输入数字'
    }
  },
  {
    key: 'file',
    value: [
      {
        path:
          'https://www.xuanmo.xin/wp-content/uploads/2019/10/xuanmo_avatar.JPG'
      }
    ],
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
  {
    key: 'switch',
    value: true,
    rules: {
      label: '开关',
      type: 'VSwitch'
    }
  },
  {
    rules: { type: 'VCell' }
  },
  {
    key: 'text1',
    value: '',
    rules: {
      label: '关联文字1',
      type: 'VInput',
      vRules: 'required|custom:@text2,@text3',
      placeholder: '请输入关联文字1',
      errorMsg: '请输入关联文字1',
      extra: 'extra'
    }
  },
  {
    key: 'text2',
    value: '',
    rules: {
      label: '关联文字2',
      type: 'VInput',
      vRules: 'required|@custom',
      placeholder: '请输入关联文字2',
      errorMsg: '请输入关联文字2',
      extra: 'extra'
    }
  },
  {
    key: 'text3',
    value: '',
    rules: {
      label: '关联文字3',
      type: 'VInput',
      vRules: 'required|@custom',
      placeholder: '请输入关联文字3',
      errorMsg: '请输入关联文字3'
    }
  },
  {
    rules: { type: 'VCell' }
  },
  {
    key: 'text4',
    value: '文字内容',
    rules: {
      label: '文字4',
      type: 'VText'
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
    key: 'select',
    value: '4',
    rules: {
      label: '选择器',
      type: 'VSelect',
      placeholder: 'picker选择器',
      errorMsg: 'picker选择器',
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
    value: '4,2',
    rules: {
      label: '多列选择器',
      type: 'VSelect',
      placeholder: 'picker选择器',
      errorMsg: 'picker选择器',
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
