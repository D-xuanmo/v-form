import { extend } from 'vee-validate'

extend('phone', {
  message: '手机号格式错误',
  validate: value => /^1[3456789]\d{9}$/g.test(value)
})
