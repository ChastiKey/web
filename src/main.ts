import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import VueApexCharts from 'vue-apexcharts'

Vue.config.productionTip = false

Vue.component('apexchart', VueApexCharts)

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
