/**
 * 校验规则
 */

export const name = {
  message: '名称格式错误',
  validate: value => /^[a-z]+$/ig.test(value)
}
