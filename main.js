import Vue from 'vue'
import App from './App'
import tools from '@/common/function'
import cuCustom from '@/components/colorui/components/cu-custom'
import cuFooter from '@/components/colorui/components/cu-footer'
import pagePull from '@/mixin/Public'
import share from '@/mixin/Share'

Vue.prototype.$tools = tools

// 顶部自定义导航
Vue.component('cuCustom', cuCustom)
Vue.component('cuFooter', cuFooter)

Vue.mixin(share)
Vue.mixin(pagePull)

Vue.config.productionTip = false

App.mpType = 'app'
const app = new Vue({
    ...App,
})
app.$mount()
