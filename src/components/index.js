import Vue from 'vue'
import Base from './Base'

const VForm = {
  name: Base.name,
  install (vue, opt = {}) {
    Vue.component(Base.name, Base)
    Vue.prototype.$VFrom = opt
  }
}

export default VForm
