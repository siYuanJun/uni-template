
import tools from './libs/function'
import mixin from './mixin/Public'
import share from './mixin/Share'
import {
    config
} from './libs/config.js'
import apiObject from './libs/request-plugins.js'

const $sys = {
    $config: config,
    $tools: tools,
    $request: apiObject
}

// 挂载到uni对象上
uni.$sys = $sys

const install = (Vue) => {
    // #ifndef APP-NVUE
    // 只有vue，挂载到Vue.prototype才有意义，因为nvue中全局Vue.prototype和Vue.mixin是无效的
    Vue.prototype.$sys = $sys
    Vue.mixin(mixin)
    // #endif
}

export default {
    install
}
