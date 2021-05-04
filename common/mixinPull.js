import init from "@/common/config";
import uniCopy from "@/js_sdk/xb-copy/uni-copy";
import Voice from '@/js_sdk/QuShe-baiduYY/QS-baiduyy/QS-baiduyy.js';

export default {
	data() {
		return {
			extConfig: []
		};
	},
	onLoad() {
		console.log("onLoad mixinPull")
	},
	onShow() {
		if (uni.getStorageSync("extConfig")) {
			this.extConfig = uni.getStorageSync("extConfig");
			return
		}
		this.ajaxRequest(this, this.routes.api_selectList, {}).then(res => {
			this.extConfig = res.data;
			uni.setStorageSync("extConfig", this.extConfig)
		})
		this.dd("获取配置初始化数据", this.extConfig)
	},
	methods: {
		getUserInfo(that) {
			this.ajaxRequest(this, this.routes.api_getUserInfo, {}, 'post').then(res => {
				this.dd(res.data)
				that.userInfo = res.data
				uni.setStorageSync("userInfo", res.data)
			})
		},
		// 调试使用
		dd(content, json, type) {
			type = type ? type : 0
			json = json ? json : ''
			let curRoute = this.$mp.page.route
			if (init.config.debug) {
				switch (type) {
					case 0:
						console.log("[info](" + curRoute + ")", content, json)
						break;
					case 1:
						console.log("[warning](" + curRoute + ")", content, json)
						break;
					case 2:
						console.log("[error](" + curRoute + ")", content, json)
						break;
				}
			}
		},
		// 百度音频播放
		audioPlay(text) {
			Voice({
				voiceSet: {
					tex: text,
					vol: 10
				},
				audioSet: {
					volume: 1
				},
				audioCallback: {
					onplay: () => {
						console.log('音频开始播放了');
					}
				},
				lineUp: true, // 加入语音队列
				returnAudio: false // 返回音频对象
			});
		},
		// ID元素属性获取
		domExec(fieid) {
			var that = this;
			var query = uni.createSelectorQuery();
			query
				.select("#" + fieid)
				.boundingClientRect(function(res) {
					that.parmloca[fieid] = res;
				})
				.exec();
		},
		copyGet(content) {
			uniCopy({
				content: content,
				success: (res) => {
					uni.showToast({
						title: res,
						icon: "none"
					});
				},
				error: (e) => {
					uni.showToast({
						title: e,
						icon: "none",
						duration: 3000
					});
				}
			});
		},
		phoneGet(phone) {
			uni.makePhoneCall({
				phoneNumber: phone
			});
		},
		// 表单验证
		frmVerification(formdata, field, message) {
			return new Promise((resolve, reject) => {
				let status = 0;
				for (var i = 0; i < field.length; i++) {
					if (formdata[field[i]] == "") {
						uni.showToast({
							title: message[i] + "不能为空",
							icon: "none",
							duration: 2000
						});
						return;
					} else {
						status += 1;
					}
				}
				if (status === field.length) {
					resolve(formdata);
				}
			});
		},
		getu(field) {
			let userinfo = uni.getStorageSync("userInfo");
			if (field) {
				return userinfo[field];
			}
			return userinfo;
		},
		href(url) {
			uni.navigateTo({
				url: url
			});
		},
		swithref(url) {
			uni.switchTab({
				url: url
			});
		},
		// 缓存数据跳转
		hrefSave(json, url) {
			uni.setStorage({
				key: "content",
				data: json,
				success: function() {
					uni.navigateTo({
						url: url
					});
				}
			});
		},
		// 发送数据请求
		ajaxRequest(that, url, formdata, methods) {
			var formdata = formdata ? formdata : {},
				methods = methods ? methods : "get";
			if (methods == "get") {
				that.http.config.header = {
					"content-type": "application/x-www-form-urlencoded",
					// "X-Access-Token": uni.getStorageSync("userInfoToken")
				};
				formdata = {
					params: formdata
				};
				formdata.params.token = uni.getStorageSync("token")
			}
			if (methods == "post") {
				that.http.config.header = {
					"content-type": "application/x-www-form-urlencoded",
					// "X-Access-Token": uni.getStorageSync("userInfoToken")
				};
				formdata.token = uni.getStorageSync("token")
			}
			return new Promise((resolve, reject) => {
				that.http[methods](url, formdata)
					.then((res) => {
						res = res.data;
						resolve(res);
						if (res.code !== 0) {
							if (res.code === 1001) {
								uni.navigateTo({
									url: "/pages/public/login"
								});
							} else {
								if (res.msg) {
									uni.showToast({
										title: res.msg,
										icon: "none",
										duration: 2000
									});
								}
							}
						}
						that.submitLocaing = 1;
						uni.stopPullDownRefresh();
					})
					.catch((err) => {
						reject(err);
						that.dd("err", err)
					});
			});
		}
	}
};
