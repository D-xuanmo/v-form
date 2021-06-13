import Vue from 'vue'
import Base from './Base/index.vue'
import { extend } from './validator'

const VForm = {
  /**
   * 注册组件函数
   * @param {object} vue Vue
   * @param {object} opt 扩展参数
   * @param {boolean} opt.primaryData 组件配置项是否在 rules 字段下
   * @param {object} opt.validator 需要全局注册的自定义校验规则
   * @param {number} opt.debounceTime 防抖时间，单位：ms
   * @param {array} opt.addressData 地址选择器数据源，格式参考：https://github.com/D-xuanmo/v-form/blob/master/src/Address/data.json
   */
  install (vue, opt = {}) {
    Vue.component('VForm', Base)
    Vue.prototype.$VForm = {
      ...opt,
      debounceTime: opt.debounceTime || 200
    }

    // 注册自定义校验规则
    extend(opt.validator)
  }
}

// 对外暴露自定义校验规则方法
export { extend }

// 将内部工具函数对外暴露
export * as utils from './utils'

export default VForm
