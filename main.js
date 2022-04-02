import Vue from 'vue'
import App from './App'
import tools from '@/common/function'
import cuCustom from '@/components/colorui/components/cu-custom'
import pagePull from '@/mixin/Public'
import share from '@/mixin/Share'
import {
    config
} from '@/common/config.js'
import apiObject from '@/common/request-plugins.js'
import uView from './uni_modules/uview-ui'


Vue.prototype.$baseStatic = config.baseUrlStatic
Vue.prototype.$baseUrl = config.baseUrl
Vue.prototype.$tools = tools
Vue.prototype.$request = apiObject

// 顶部自定义导航
Vue.component('cuCustom', cuCustom)
Vue.mixin(pagePull)
Vue.use(uView)


Vue.config.productionTip = false

App.mpType = 'app'
const app = new Vue({
    ...App,
})
app.$mount()
