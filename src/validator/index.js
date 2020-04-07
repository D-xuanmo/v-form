/**
 * 校验规则
 * 已集成Vee-Validate  https://logaretm.github.io/vee-validate/guide/rules.html#rules
 */
import { validate, extend, localize } from 'vee-validate'
import * as veeRules from 'vee-validate/dist/rules'
import zh_CN from 'vee-validate/dist/locale/zh_CN'

// 引入自定义规则
import './customer'

localize('zh_CN', zh_CN)

// 注册规则
Object.keys(veeRules).forEach(rule => {
  extend(rule, {
    ...veeRules[rule],
    message: zh_CN.messages[rule]
  })
})

export { extend }

export default validate
