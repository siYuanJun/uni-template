import { http } from './request'
import routes from './routes'

const config = {
    // 项目名称
    title: 'uni-moban',
    // 接口域名
    baseUrl: 'https://www.xxx.com',
    // 项目Token
    webTokey: '',
    // 是否开启调试模式
    debug: false,
    // 系统版本号
    version: '1.0.0',
    // 高德地图
    amap: {
        WebKey: '', // WEB秘钥
        XcxKey: '', // 小程序秘钥
        AndroidKey: '', // 安卓秘钥
    },
}

// 初始化高德地图配置
const amapFile = require('@/js_sdk/amap-wx.js')
const amapsdk = new amapFile.AMapWX({
    key: config.amap.XcxKey,
})

export default {
    amapsdk,
    http,
    config,
    routes,
}
