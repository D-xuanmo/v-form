import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import VForm from '@'

Vue.use(VForm, {
  validator: {
    custom: {
      params: ['length'],
      message: '长度不能大于{length}',
      validate: (value, { length }) => {
        return value.length <= length
      }
    },
    target: {
      params: ['target'],
      message: 'password不正确',
      validate: (value, { target }) => {
        return value === target
      }
    }
  }
})

new Vue({
  render: h => h(App),
}).$mount('#app')
