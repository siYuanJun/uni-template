import Vue from 'vue'
import App from './App'
import init from '@/common/config'
import fun from '@/common/function'
import cuCustom from '@/components/colorui/components/cu-custom'
import cuFooter from '@/components/colorui/components/cu-footer'
import pagePull from '@/mixin/Public'
import share from '@/mixin/Share'

Vue.prototype.$webTitle = init.config.title
Vue.prototype.$webVersion = init.config.version
Vue.prototype.$webTokey = init.config.webTokey
Vue.prototype.$http = init.http
Vue.prototype.$routes = init.routes
Vue.prototype.$tools = fun

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
