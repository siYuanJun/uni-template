import apis from '../api/index.js'
import { http } from '../libs/config.js'
import tools from '../libs/function'

let apiObject = {}
for (let i in apis) {
    apiObject[i] = apis[i](http, tools)
}

export default apiObject

// this.$request.common.statusMap()
