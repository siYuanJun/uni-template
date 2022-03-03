import {statusMap} from '@/api/common.js'

export default {
    async getExtConfig(field) {
        let extConfig = uni.getStorageSync('ddc-extConfig')
        // extConfig = ''
        if (!extConfig) {
            let result = await statusMap()
            extConfig = result
        }
        return field ? extConfig[field] : extConfig
    }
}
