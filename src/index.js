import Vue from 'vue'
import Base from './Base/index.vue'
import { extend } from './validator'

const VForm = {
  install (vue, opt = {}) {
    Vue.component('VForm', Base)
    Vue.prototype.$VForm = opt

    // 注册自定义校验规则
    extend(opt.validator)
  }
}

// 对外暴露自定义校验规则方法
export { extend }

export default VForm
