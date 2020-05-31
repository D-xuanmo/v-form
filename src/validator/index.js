/**
 * 校验规则
 * 已集成Vee-Validate  https://logaretm.github.io/vee-validate/guide/rules.html#rules
 */
import { validate } from 'vee-validate'

// 引入自定义规则
import './extend'

export { extend } from './extend'

export default validate
