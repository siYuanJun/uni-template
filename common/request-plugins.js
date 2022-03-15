import Vue from 'vue'
import apis from '@/api/index.js'
import { http } from '@/common/config.js'
import tools from '@/common/function'

let apiObject = {}
for (let i in apis) {
    apiObject[i] = apis[i](http, tools)
}

export default apiObject

// this.$request.common.statusMap()
