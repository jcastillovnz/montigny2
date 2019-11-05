
import Vue from 'vue'

import VueRouter from 'vue-router'
Vue.use(VueRouter)

import roof from './roof.vue'
import pedrestian from './pedrestian.vue'
import etage3 from './etage3.vue'
import etage2 from './etage2.vue'
import etage1 from './etage1.vue' 
import rdc from './rdc.vue'



const routes = [
  { path: '/', component: roof  },
  { path: '/pedrestian', component: pedrestian},
  { path: '/3-etage', component: etage3 },
  { path: '/2-etage', component: etage2 },
  { path: '/1-etage', component: etage1 },
  { path: '/rdc', component: rdc },
]

const router = new VueRouter({
  routes // 
})

const app = new Vue({
  router
}).$mount('#app')




/*new Vue({
  el: '#app',
  render: h => h(App)
})
*/