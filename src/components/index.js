import Vue from 'vue'
import Base from './Base/index.vue'

const VForm = {
  install (vue, opt = {}) {
    Vue.component('VForm', Base)
    Vue.prototype.$VForm = opt
  }
}

export default VForm
