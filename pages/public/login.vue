<style lang="less">
page {
	background: #ffffff;
}

.content {
	padding: 0px 60upx;
}

.wxlogo {
	display: flex;
	justify-content: center;
	text-align: center;
	margin-top: 36%;

	image {
		width: 200upx;
		height: 200upx;
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
		border-radius: 5px;
		box-shadow: 2px 6px 10px fade(#58c3e0, 20);
		width: 100%;
		height: 100upx;
		color: #ffffff;
		background-color: #58c3e0;

		&.button-hover {
			box-shadow: 0 0 0 fade(#58c3e0, 30);
		}
	}

	.cu-load {
		margin-left: 5px;

		&:after {
			content: '';
		}
	}
}
</style>

<template>
	<view class="content">
		<view class="wxlogo"><image :src="wxlogo" mode="aspectFit" /></view>
		<view class="login-body">
			<view class="dd1">微信授权页</view>
			<view class="dd2">授权并同意使用微信手机号登录小程序</view>
			<view class="flex justify-center align-center cu-btn bg-yellow big btnlogin" v-if="!submitLocaing">
				<view class="name">登录中</view>
				<view class="cu-load loading"></view>
			</view>
			<button class="cu-btn bg-yellow big btnlogin" v-if="canIUse && !token && submitLocaing" open-type="getUserInfo" @getuserinfo="bindGetUserInfo">微信授权</button>
			<button class="cu-btn bg-yellow big btnlogin" v-else-if="canIUse && token && submitLocaing" open-type="getPhoneNumber" @getphonenumber="bindGetUserInfo">
				绑定微信手机号
			</button>
		</view>
		<!-- <view class="flex justify-center padding text-footer text-sm" @tap="href('../article/content?id=1')">
			点击登录即表示已阅读并同意
			<text>《法律条款与隐私政策》</text>
		</view> -->
	</view>
</template>

<script>
export default {
	data() {
		return {
			test: '123456',
			canIUse: '',
			wxlogo: '',
			submitLocaing: 1,
			btntype: '',
			token: ''
		};
	},
	onLoad() {
		let that = this;
		// getphonenumber
		that.canIUse = uni.canIUse('button.open-type.getUserInfo');
	},
	methods: {
		// 检测同意授权信息
		bindGetUserInfo(e) {
			console.log(e);
			let that = this;
			that.dd('获得最新的用户信息');
			if (e.detail.encryptedData) {
				that.btntype = e.type;
				uni.setStorage({
					key: 'userdetail',
					data: e.detail,
					success: function(res) {
						uni.setStorageSync('userdetail', e.detail);
						uni.setStorageSync('userInfo', e.detail.userInfo);
						uni.removeStorageSync('token');
						that.checkSessionAndLogin(that);
					},
					fail: function(err) {
						console.log(err);
						uni.showToast({
							title: '微信信息获取失败',
							icon: 'none',
							duration: 2000
						});
					}
				});
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
		checkSessionAndLogin(that) {
			let thisOpenId = uni.getStorageSync('token');
			// 已经进行了登录，检查登录是否过期
			if (thisOpenId) {
				that.dd('有token直接登陆');
				uni.checkSession({
					success: function() {
						// session_key 未过期，并且在本生命周期一直有效
						uni.navigateBack({});
					},
					fail: function() {
						console.log('but session_key expired');
						// session_key 已经失效，需要重新执行登录流程
						uni.removeStorageSync('token');
						that.checkSessionAndLogin(that);
					}
				});
			} else {
				// 没有进行登录则先进行登录操作
				that.dd('没有token重新登陆，点击类型' + that.btntype);
				if (that.btntype == 'getuserinfo') {
					that.dd('微信信息获取');
					that.loginAndGetOpenid();
				}
				if (that.btntype == 'getphonenumber') {
					that.dd('手机号获取');
					that.loginAndGetOpenid();
				}
			}
		},
		// 执行登录操作并获取用户openId
		async loginAndGetOpenid() {
			let that = this;
			that.dd('开始登陆请求---');
			let userdetail = uni.getStorageSync('userdetail');
			that.submitLocaing = 0;
			uni.login({
				success: async res => {
					// 解决后台数据解密失败问题
					uni.getUserInfo({
						success: async ress => {
							that.dd('getUserInfo 请求结果', ress);
							that.dd('login 请求结果 ', res);
							if (!res.code) {
								return;
							}
							let result = await that.ajaxRequest(
								that,
								that.routes.api_wxlogin,
								{
									code: res.code,
									encryptedData: ress.encryptedData,
									iv: ress.iv
								},
								'post'
							);
							that.dd('登陆请求返回数据', result);
							let data = result.data;
							if (!data) {
								return;
							}
							that.token = data.token;
							uni.setStorageSync('token', data.token);
							uni.setStorageSync('userInfo', data.userInfo);
							uni.showToast({
								title: '登陆成功',
								icon: 'none',
								duration: 2000,
								success() {
									uni.reLaunch({
										url: '/pages/index/jiedan'
									});
								}
							});
						}
					});
				}
			});
		}
	}
};
</script>
