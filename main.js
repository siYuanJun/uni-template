import Vue from 'vue'
import App from './App'
import init from '@/common/config'

Vue.prototype.webTitle = init.config.title
// 项目token
Vue.prototype.webKey = ''
// 网络请求
Vue.prototype.http = init.http;
// 顶部自定义导航
import cuCustom from '@/components/colorui/components/cu-custom'
Vue.component('cuCustom', cuCustom)
// 全局 mixin
import pagePull from '@/common/mixinPull.js'
import share from '@/common/mixinShare.js'
Vue.mixin(share)
Vue.mixin(pagePull)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
