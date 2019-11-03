import Vue from 'vue'
import App from './App'

// 项目域名
Vue.prototype.weburl = 'https://abc.lvtcn.com'
// 项目token
Vue.prototype.webkey = '09de36a34629cf351d598a28a202e4dd'

// 网络请求
import Request from '@/js_sdk/luch-request/request'
Vue.prototype.http = new Request();

// 顶部自定义导航
import cuCustom from '@/components/colorui/components/cu-custom'
Vue.component('cuCustom', cuCustom)

// 腾讯地图配置信息
var qqmapKey = ''
Vue.prototype.qqmapKey = qqmapKey;
var QQMapWX = require('@/js_sdk/qqmap-wx-jssdk.min.js');
Vue.prototype.qqmapsdk = new QQMapWX({
    key: qqmapKey // 必填
});

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
