import Vue from 'vue'
import App from './App'

// 项目token
Vue.prototype.webkey = ''

// 资源地址
Vue.prototype.resostatic= 'http://www.bjxcsy.com/promotion/images'

// 网络请求
import Request from '@/js_sdk/luch-request/request'
var http = new Request();
http.config.baseUrl = "https://www.xxx.com/api";
Vue.prototype.http = http;

// 顶部自定义导航
import cuCustom from '@/components/colorui/components/cu-custom'
Vue.component('cuCustom', cuCustom)

// 腾讯地图配置信息
// var qqmapKey = ''
// Vue.prototype.qqmapKey = qqmapKey;
// var QQMapWX = require('@/js_sdk/qqmap-wx-jssdk.min.js');
// Vue.prototype.qqmapsdk = new QQMapWX({
//     key: qqmapKey // 必填
// });

// 全局mixin
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
