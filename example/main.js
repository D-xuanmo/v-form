import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import VForm from '@'
Vue.use(VForm)

new Vue({
  render: h => h(App),
}).$mount('#app')
