
import Vue from 'vue'

import VueRouter from 'vue-router'
Vue.use(VueRouter)


Vue.component('navigation', require('./components/navigation.vue').default);


import App from './App.vue'
import roof from './roof.vue'
import pedrestian from './pedrestian.vue'
import etage3 from './etage3.vue'
import etage2 from './etage2.vue'
import etage1 from './etage1.vue' 
import rdc from './rdc.vue'

import "./assets/css/estilos.css"
import "./assets/css/index.css"

const routes = [
  { path: '/', component: roof  },
  { path: '/pedrestian', component: pedrestian},
  { path: '/1-etage', component: etage1 },
  { path: '/rdc', component: rdc },
]

const router = new VueRouter({
  routes // 
})

 new Vue({
  router,
  components: { App },

}).$mount('#app')
