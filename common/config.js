import Request from "@/js_sdk/luch-request/request";

const config = {
  // 项目名称
  title: "uni-moban",
  // 接口域名
  baseUrl: "",
  //  高德地图
  amap: {
    WebKey: "", // WEB秘钥
    XcxKey: "", // 小程序秘钥
    AndroidKey: "" // 安卓秘钥
  }
};

// 初始化高德地图配置
const amapFile = require("@/js_sdk/amap-wx.js");
const amapsdk = new amapFile.AMapWX({
  key: config.amap.XcxKey
});

// 初始化网络请求
const http = new Request();
http.config.baseUrl = config.baseUrl;

export default {
  amapsdk,
  http,
  config
};
