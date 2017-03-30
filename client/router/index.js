import Vue from 'vue'
import Router from 'vue-router'
import Main from '../views/Main'
import Process from '../views/Process'
import SubBytes from '../views/SubBytes'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/main',
      component: Main
    },
    {
      path: '/process',
      component: Process
    },
    {
      path: '/subbyte',
      component: SubBytes
    }
  ]
})
