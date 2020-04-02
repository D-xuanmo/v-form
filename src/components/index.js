import Vue from 'vue'
import Base from './Base/index.vue'
import { extend } from 'vee-validate'

const VForm = {
  install (vue, opt = {}) {
    Vue.component('VForm', Base)
    Vue.prototype.$VForm = opt

    // 注册自定义校验规则
    for (const [key, val] of Object.entries(opt.validator)) {
      extend(key, val)
    }
  }
}

// 对外暴露自定义校验规则方法
export { extend }

export default VForm
