import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import VForm from '@'
Vue.use(VForm, {
  validator: {
    customer: {
      message: '长度不能大于{length}',
      validate: (value, { length }) => {
        return value.length <= length
      },
      params: ['length']
    }
  }
})

new Vue({
  render: h => h(App),
}).$mount('#app')
