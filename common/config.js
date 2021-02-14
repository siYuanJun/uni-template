const config = {
	title: 'uni-moban',
	baseUrl: '',
	amapWebKey: '',
	amapXcxKey: '',
	amapAndroidKey: '',
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
