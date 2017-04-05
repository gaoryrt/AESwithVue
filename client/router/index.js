import Vue from 'vue'
import Router from 'vue-router'
import Main from '../views/Main'
import Process from '../views/Process'
import SubBytes from '../views/SubBytes'
import ShiftRows from '../views/ShiftRows'
import MixColumns from '../views/MixColumns'
import AddRoundKey from '../views/AddRoundKey'

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
    },
    {
      path: '/shiftrow',
      component: ShiftRows
    },
    {
      path: '/mixcolumn',
      component: MixColumns
    },
    {
      path: '/addroundKey',
      component: AddRoundKey
    }
  ]
})
