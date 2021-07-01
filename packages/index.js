import Vue from 'vue'
import Base from './Base/index.vue'
import { extend } from './validator'

const VForm = {
  /**
   * 注册组件函数
   * @param {object} vue Vue
   * @param {object} options 扩展参数
   * @param {boolean} options.primaryData 组件配置项是否在 rules 字段下
   * @param {object} options.validator 需要全局注册的自定义校验规则
   * @param {number} options.debounceTime 防抖时间，单位：ms
   * @param {array} options.addressJSON 地址选择器数据源，格式参考：https://github.com/D-xuanmo/v-form/blob/master/src/Address/data.json
   */
  install (vue, options = {}) {
    Vue.component('VForm', Base)
    const { debounceTime } = options
    Vue.prototype.$VForm = {
      ...options,
      debounceTime: debounceTime === undefined ? 200 : debounceTime
    }

    // 注册自定义校验规则
    extend(options.validator)
  }
}

// 对外暴露自定义校验规则方法
export { extend }

// 导出 form item 公用 mixin
export { default as vFormItemBaseMixin } from './mixins/formItemBase'

export * from './components/export'

export default VForm
