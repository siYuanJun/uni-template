// 公共接口

import { http } from '@/common/config.js'

// 状态数据
export function statusMap(data) {
    return http.post("/common/statusMap", data)
}
