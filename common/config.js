const config = {
	title: '虾优惠TMS',
	baseUrl: "http://121.36.132.134:8080/lobster/api",
	amapWebKey: '2ea15ef0ad713800e292b45a43adb1ae',
	amapXcxKey: '0263d3af61d347ae89c04ba4deb767a5',
	amapAndroidKey: '7d388d43e8143c89d16e0da85b10d815',
}

// 初始化高德地图配置
const amapFile = require('@/js_sdk/amap-wx.js');
const amapsdk = new amapFile.AMapWX({
	key: config.amapXcxKey
});

// 初始化网络请求
import Request from '@/js_sdk/luch-request/request'
const http = new Request();
http.config.baseUrl = config.baseUrl;

export default {
	amapsdk,
	http,
	config,
}