<script>
	import Vue from 'vue'
	export default {
		onLaunch: function() {
			uni.getSystemInfo({
				success: function(e) {
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif

					// #ifdef MP-WEIXIN
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = uni.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif		

					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
				}
			})
			//获取用户地理位置权限
			Vue.prototype.getPermission = function(obj) {
				uni.getLocation({
					success: function(res) {
						obj.useraddr = res.address //调用成功直接设置地址
					},
					fail: function() {
						uni.getSetting({
							success: function(res) {
								var statu = res.authSetting;
								if (!statu['scope.userLocation']) {
									uni.showModal({
										title: '是否授权当前位置',
										content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
										success: function(tip) {
											if (tip.confirm) {
												uni.openSetting({
													success: function(data) {
														if (data.authSetting["scope.userLocation"] === true) {
															uni.showToast({
																title: '授权成功',
																icon: 'none',
																duration: 1000
															})
															//授权成功之后，再调用chooseLocation选择地方
															uni.getLocation({
																success: function(res) {
																	obj.useraddr = res.address //调用成功直接设置地址
																},
															})
														} else {
															uni.showToast({
																title: '授权失败',
																icon: 'none',
																duration: 1000
															})
														}
													}
												})
											}
										}
									})
								}
							},
							fail: function(res) {
								uni.showToast({
									title: '调用授权窗口失败',
									icon: 'none',
									duration: 1000
								})
							}
						})
					}
				})
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
	}
</script>

<style lang="less">
	/*每个页面公共css */
	@import "./components/colorui/main.css";
	@import "./components/colorui/icon.css";
	@import "./components/colorui/animation.css";

	html {
		max-width: 750px;
		margin: 0px auto;
		body {
			background-color: #222222;
		}
	}

	.big {
		width: 100%;
		height: 50px;
		color: #ffffff;
		background-color: #E79A15;
	}

	.navigator-hover {
		background: none;
	}

	uni-swiper .uni-swiper-dot {
		width: 26px;
		height: 3px;
		border-radius: 0px;
	}

	uni-swiper .uni-swiper-dot.uni-swiper-dot-active {
		background: rgba(251, 95, 36, 1);
	}
	
	.margin-top-xxl {
		margin-top: 100rpx;
	}
</style>
