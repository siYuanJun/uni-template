import { http } from './request'

const config = {
    // 项目名称
    title: 'default',
    // 接口域名
    baseUrl: 'https://www.xxx.com',
    // 资源地址
    baseUrlStatic: 'https://www.xxx.com/static',
    // 项目Token
    webTokey: '',
    // 是否开启调试模式
    debug: true,
    // 系统版本号
    version: '1.0.0',
    // 高德地图
    amap: {
        WebKey: "23ea30beceb9f3265fbdba619863f97c", // WEB秘钥
        WebServerKey: "caa9b5f9fa46e0a3100f05ac06738689", // WEB服务秘钥
    },
}

// 初始化高德地图配置
// const amapFile = require('@/js_sdk/amap-wx.js')
// const amapsdk = new amapFile.AMapWX({
//     key: config.amap.XcxKey,
// })

http.setConfig((configs) => { /* 设置全局配置 */
  configs.baseUrl =  config.baseUrl + '/api' /* 根域名不同 */
  configs.header = {
      ...configs.header,
      // 'authorization': config.webTokey
  }
  return configs
})

export {
    http,
    config
};
