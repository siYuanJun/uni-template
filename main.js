import Vue from 'vue'
import App from './App'
import uView from '@/uni_modules/uview-ui'
import core from './core'

Vue.use(uView)
Vue.use(core)

Vue.config.productionTip = false

App.mpType = 'app'
const app = new Vue({
    ...App,
})
app.$mount()
