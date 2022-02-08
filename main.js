import Vue from 'vue'
import App from './App'
import tools from '@/common/function'
import cuCustom from '@/components/colorui/components/cu-custom'
import cuFooter from '@/components/colorui/components/cu-footer'
import pagePull from '@/mixin/Public'
import share from '@/mixin/Share'
import {config} from '@/common/config.js'

Vue.prototype.$baseStatic = config.baseUrlStatic
Vue.prototype.$baseUrl = config.baseUrl
Vue.prototype.$baseTitle = config.title
Vue.prototype.$tools = tools

// 顶部自定义导航
Vue.component('cuCustom', cuCustom)
Vue.component('cuFooter', cuFooter)

Vue.mixin(pagePull)


// 防抖处理-立即执行
const on = Vue.prototype.$on
Vue.prototype.$on = function(event, func) {
    let timer;
    let flag = true;
    let newFunc = func
    if (event == 'click') {
        newFunc = function() {
            if (flag) {
                func.apply(this, arguments)
                flag = false
            }
            clearTimeout(timer)
            timer = setTimeout(function() {
                flag = true
            }, 500)
        }
    }
    on.call(this, event, newFunc)
}



// 防抖处理 -- 最后执行
// const on = Vue.prototype.$on
// Vue.prototype.$on = function (event, func) {
//   let timer
//   let newFunc = func
//   if (event === 'click') {
//     newFunc = function () {
//       clearTimeout(timer)
//       timer = setTimeout(function () {
//         func.apply(this, arguments)
//       }, 500)
//     }
//   }
//   on.call(this, event, newFunc)
// }



// 节流
// const on = Vue.prototype.$on

// Vue.prototype.$on = function (event, func) {
//   let previous = 0
//   let newFunc = func
//   if (event === 'click') {
//     newFunc = function () {
//       const now = new Date().getTime()
//       if (previous + 1000 <= now) {
//         func.apply(this, arguments)
//         previous = now
//       }
//     }
//   }
//   on.call(this, event, newFunc)
// }


Vue.config.productionTip = false

App.mpType = 'app'
const app = new Vue({
    ...App,
})
app.$mount()
