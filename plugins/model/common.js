import {statusMap} from '@/api/common.js'

export default {
    async getExtConfig() {
        let extKey = 'default-extConfig'
        let extConfig = uni.getStorageSync(extKey)
        extConfig = ''
        if (extConfig) {
            result = extConfig;
        } else {
            let result = await statusMap()
            uni.setStorageSync(extKey, result.data.data)
        }
        return result
    }
}
