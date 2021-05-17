import uniCopy from "@/js_sdk/xb-copy/uni-copy";
import init from "@/common/config";

export default {
	data() {
		return {
			extConfig: []
		};
	},
	onLoad() {},
	onShow() {
		uni.setTabBarBadge({
			index: 0,
			text: '1'
		});
	},
	methods: {
		async getExtConfig() {
			if (uni.getStorageSync("extConfig")) {
				this.extConfig = uni.getStorageSync("extConfig");
			} else {
				await this.ajaxRequest(this, this.routes.api_selectList, {}).then(res => {
					this.extConfig = res.data;
					this.dd("获取配置初始化数据", this.extConfig)
					uni.setStorageSync("extConfig", this.extConfig)
				})
			}
			return this.extConfig
		},
		islogin() {
			if (!this.getu('id')) {
				uni.reLaunch({
					url: "/pages/public/login"
				})
				return
			}
		},
		async getUserInfo(that) {
			await this.ajaxRequest(this, this.routes.api_getUserInfo, {}, 'post').then(res => {
				this.dd("用户信息", res.data)
				that.userInfo = res.data ? res.data : {}
				uni.setStorageSync("userInfo", res.data)
			})
		},
		// 调试使用
		dd(content, json, type) {
			type = type ? type : 0
			json = json ? json : ''
			let curRoute = '/'
			if (this.$mp.page) {
				curRoute = this.$mp.page.route
			}
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
		redirectTo(url) {
			uni.redirectTo({
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
		hrefBack() {
			uni.navigateBack({})
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
						if (res.code !== 0) {
							if (res.code === 1001) {
								uni.navigateTo({
									url: "/pages/public/login"
								});
								return
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
						resolve(res);
						that.submitLoading = 1;
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
