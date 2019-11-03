<template>
	<view class="content">
		<view class="wxlogo">
			<image :src="wxlogo" mode="widthFix" />
		</view>
		<view class="login-body">
			<view class="dd1">微信授权页</view>
			<view class="dd2">授权并同意使用微信手机号登录小程序</view>
			<view class="flex justify-center align-center cu-btn bg-yellow big btnlogin" v-if="loginLoading">
				<view class="name">
					登录中
				</view>
				<view class="cu-load loading"></view>
			</view>
			<button class="cu-btn bg-yellow big btnlogin" v-else-if="canIUse" open-type="getUserInfo" @getuserinfo="bindGetUserInfo">
				手机号登录
			</button>
			<button class="cu-btn bg-yellow big btnlogin" v-if="!canIUse">请升级微信版本</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				api_login: '/login',
				api_userinfo: '/userinfo',
				canIUse: '',
				wxlogo: '',
				loginLoading: ''
			}
		},
		onLoad() {
			let that = this
			// getphonenumber
			that.canIUse = uni.canIUse('button.open-type.getUserInfo')
			that.wxlogo = that.weburl + '/static/xcx/images/wxlogo.png'
		},
		methods: {
			// 检测同意授权信息
			bindGetUserInfo(e) {
				console.log(e)
				let that = this
				// 获得最新的用户信息
				if (e.detail) {
					uni.setStorage({
						key: 'userdetail',
						data: e.detail,
						success: function(res) {
							uni.setStorageSync('userdetail', e.detail)
							uni.setStorageSync('userInfo', e.detail.userInfo)
							uni.removeStorageSync('openid')
							that.checkSessionAndLogin()
						},
						fail: function(err) {
							console.log(err)
							uni.showToast({
								title: '微信信息获取失败',
								icon: 'none',
								duration: 2000
							});
						}
					})
				} else {
					uni.showToast({
						title: '微信信息获取失败',
						icon: 'none',
						duration: 2000
					});
				}
			},
			/*
			 * 这里使用openid 作为与后端session 连接的标志
			 * 检查是否存在openid，即之前是否登录过
			 * 如果登录过，检查session_key 是否过期
			 * 如果过期了，remove openid 重新执行login 并将用户信息发送到服务器端更新
			 * 如果没过期则返回
			 * 如果没登录过则执行login 并将用户信息发送到服务器更新
			 */
			checkSessionAndLogin() {
				let that = this
				let thisOpenId = uni.getStorageSync('openid')
				// 已经进行了登录，检查登录是否过期
				if (thisOpenId) {
					console.log('have openid')
					uni.checkSession({
						success: function() {
							// session_key 未过期，并且在本生命周期一直有效
							uni.navigateBack({})
						},
						fail: function() {
							console.log('but session_key expired')
							// session_key 已经失效，需要重新执行登录流程
							uni.removeStorageSync('openid')
							that.checkSessionAndLogin()
						}
					})
				} else {
					// 没有进行登录则先进行登录操作
					console.log('do not have openid')
					that.loginAndGetOpenid()
				}
			},
			// 执行登录操作并获取用户openId
			loginAndGetOpenid() {
				console.log('do login and get openid')
				let that = this
				let userdetail = uni.getStorageSync('userdetail')
				that.loginLoading = 1
				uni.login({
					success: function(res) {
						console.log(res)
						if (res.code) {
							that.http.post(that.api_login, {
								token: that.webkey,
								formdata: {
									code: res.code,
									encryptedData: userdetail.encryptedData,
									iv: userdetail.iv
								}
							}).then(res => {
								res = res.data
								console.log(res)
								// 保存openId，并将用户信息发送给后端
								if (res.data) {
									uni.setStorageSync('openid', res.data)
									that.sendUserInfoToServer()
								} else {
									if (res.message) {
										uni.showToast({
											title: res.message,
											icon: 'none',
											duration: 2000
										});
									} else {
										uni.showToast({
											title: '系统超时，请重试',
											icon: 'none',
											duration: 2000
										});
									}
								}
							}).catch(err => {
								console.log(err)
								uni.showToast({
									title: '登录服务器错误',
									icon: 'none',
									duration: 2000
								});
							})
							that.loginLoading = 0
						}
					}
				})
			},
			// 同步用户信息
			sendUserInfoToServer() {
				console.log('now send user info to server')
				let that = this
				let userInfo = uni.getStorageSync('userInfo')
				userInfo.token = that.webkey
				userInfo.openid = uni.getStorageSync('openid')
				that.http.post(that.api_userinfo, userInfo).then(res => {
					res = res.data
					if (res.data) {
						console.log("信息同步成功，关闭页面")
						uni.setStorageSync('userInfo', res.data)
						uni.showToast({
							title: "登录成功",
							icon: 'none',
							duration: 2000
						});
						setTimeout(function() {
							uni.navigateBack({})
						}, 1200)
					} else {
						if (res.message) {
							uni.showToast({
								title: res.message,
								icon: 'none',
								duration: 2000
							});
						} else {
							uni.showToast({
								title: '信息同步失败',
								icon: 'none',
								duration: 2000
							});
						}
					}
				}).catch(err => {
					console.log(err)
					uni.showToast({
						title: '同步服务器错误',
						icon: 'none',
						duration: 2000
					});
				})
			}
		}
	}
</script>

<style lang="less">
	page {
		background: #ffffff;
	}

	.content {
		padding: 0px 20px;
	}

	.wxlogo {
		display: flex;
		justify-content: center;
		text-align: center;
		margin-top: 36%;

		image {
			width: 100px;
		}
	}

	.login-body {
		text-align: center;

		.dd1 {
			font-size: 16px;
			font-weight: bold;
			color: #000000;
			margin-top: 20px;
		}

		.dd2 {
			color: #8e8e8e;
			font-size: 14px;
			margin-top: 10px;
		}

		.btnlogin {
			margin-top: 40px;
			box-shadow: #007AFF;
			border-radius: 5px;
			box-shadow: 2px 6px 10px rgba(231, 154, 21, 0.2);
			background: #E79A15;

			&.button-hover {
				box-shadow: 0 0 0 rgba(231, 154, 21, 0.3);
			}
		}

		.cu-load {
			margin-left: 5px;

			&:after {
				content: "";
			}
		}
	}
</style>
