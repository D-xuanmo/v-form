import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import VForm from './components'
Vue.use(VForm, {
  a: 1
})

new Vue({
  render: h => h(App),
}).$mount('#app')
