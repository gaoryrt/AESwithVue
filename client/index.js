import './utils/promise-polyfill'
import { app } from './utils/app'
import initRem from './utils/setRem'
import 'hack'

window.addEventListener('DOMContentLoaded', initRem, false)
app.$mount('#app')

import multiselectcss from 'assets/multiselect.css'
