<style lang="less">
    .btn-wx {
        border: 1px solid #A8B0BD;
        height: 85upx;
    }

    .cu-load.loading::after {
        content: "";
    }
</style>

<template>
    <view class="">
        <view class="">
            <block v-if="!submitLoading">
                <view class="round flex align-center padding-lr padding-tb-sm btn-wx lg">
                    <image :src="wxIcon" mode="aspectFit" class="icon--df"></image>
                    <view class="flex align-center text-df text-gray-A8B0BD margin-left-xs">
                        <view class="">登录中</view>
                        <view class="cu-load loading"></view>
                    </view>
                </view>
            </block>
            <block v-if="canIUse && !userInfoAuth && submitLoading">
                <button class="round flex align-center padding-lr padding-tb-sm btn-wx lg" @tap="getLogin">
                    <image :src="wxIcon" mode="aspectFit" class="icon--df"></image>
                    <view class="text-df text-gray-A8B0BD margin-left-xs">
                        微信登录
                    </view>
                </button>
            </block>
            <block v-else-if="canIUse && userInfoAuth && submitLoading">
                <button class="round flex align-center padding-lr padding-tb-sm btn-wx lg" open-type="getPhoneNumber"
                    @getphonenumber="getLogin">
                    <image :src="wxIcon" mode="aspectFit" class="icon--df"></image>
                    <view class="text-df text-gray-A8B0BD margin-left-xs">
                        微信手机号登录
                    </view>
                </button>
            </block>
        </view>
        <!-- <view class="flex justify-center padding text-footer text-sm" @tap="href('../article/content?id=1')">
			点击登录即表示已阅读并同意
			<text>《法律条款与隐私政策》</text>
		</view> -->
    </view>
</template>

<script>
    import {
        wxLogin as wxLoginApi
    } from '@/api/auth.js'

    export default {
        data() {
            return {
                loginCode: '',
                canIUse: '',
                submitLoading: true,
                btntype: '',
                userInfoAuth: 1,
                wxIcon: this.$baseStatic + '/static/images/wx-icon.png',
                loginStatus: ''
            };
        },
        created() {
            // getphonenumber
            this.canIUse = uni.canIUse('button.open-type.getUserInfo');
            this.loginRequest()
            // this.getWxUserInfo()
        },
        methods: {
            getWxUserInfo() {
                uni.getUserInfo({
                    success: res => {
                        this.$tools.dd('getUserInfo', res);
                        uni.setStorageSync('userProfileData', res);
                        this.userInfoAuth = res
                    },
                    fail: err => {
                        console.log("自动获取用户信息失败，未微信授权", err)
                        // this.userInfoAuth = ''
                    }
                })
            },
            loginRequest() {
                uni.login({
                    success: res => {
                        this.$tools.dd('loginRequest => 初始化点击', res);
                        uni.setStorageSync('loginCode', res.code);
                    },
                    fail: err => {
                        console.log(err);
                    },
                });
            },
            getLogin(e) {
                this.$tools.dd('微信授权入口', e);
                this.submitLoading = false;

                // 手机号操作
                if (e.detail.iv) {
                    setTimeout(res => {
                        this.bindCheckCacheUserInfo(e);
                    }, 600);
                    return;
                }

                // 个人信息获取操作
                uni.getUserProfile({
                    desc: '用于完善个人资料',
                    success: res => {
                        this.$tools.dd('getUserProfile', res);
                        uni.setStorageSync('userProfileData', res);
                        this.userInfoAuth = res
                        this.submitLoading = true

                        // this.bindCheckCacheUserInfo({
                        //     type: 'getuserinfo',
                        //     detail: res,
                        // });
                    },
                    fail: err => {
                        this.$tools.dd('getUserProfile', err);
                        this.submitLoading = true;
                        uni.showToast({
                            title: '微信信息获取失败',
                            icon: 'none',
                            duration: 2000,
                        });
                    },
                });
            },
            // 检测缓存授权信息
            bindCheckCacheUserInfo(e) {
                const that = this;
                that.$tools.dd('获得用户缓存信息', e);

                if (e.detail.encryptedData) {
                    that.btntype = e.type;

                    uni.setStorage({
                        key: 'userDetail',
                        data: e.detail,
                        success: res => {
                            e.detail.code = uni.getStorageSync('loginCode');

                            uni.setStorageSync('userDetail', e.detail);
                            if (e.detail.userInfo) {
                                uni.setStorageSync('userInfo', e.detail.userInfo);
                            }
                            uni.removeStorageSync('userToken');
                            that.checkSessionAndLogin();
                        },
                        fail: err => {
                            console.log(err);
                            this.submitLoading = true;
                            uni.showToast({
                                title: '微信信息获取失败',
                                icon: 'none',
                                duration: 2000,
                            });
                        },
                    });
                } else {
                    uni.showToast({
                        title: '微信信息获取失败',
                        icon: 'none',
                        duration: 2000,
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
                const thisOpenId = uni.getStorageSync('userToken');
                // 已经进行了登录，检查登录是否过期
                if (thisOpenId) {
                    that.$tools.dd('有token直接登录');
                    uni.checkSession({
                        success() {
                            // session_key 未过期，并且在本生命周期一直有效
                            uni.reLaunch({
                                url: '/pages/index/tabBar',
                            });
                        },
                        fail() {
                            console.log('but session_key expired');
                            // session_key 已经失效，需要重新执行登录流程
                            uni.removeStorageSync('userToken');
                            that.checkSessionAndLogin();
                        },
                    });
                } else {
                    // 没有进行登录则先进行登录操作
                    that.$tools.dd(`没有[token]重新登录，点击类型 => ${  that.btntype}`);
                    if (that.btntype == 'getuserinfo') {
                        that.$tools.dd('个人信息获取');
                    }
                    if (that.btntype == 'getphonenumber') {
                        that.$tools.dd('手机号获取');
                    }
                    that.loginAndGetOpenid();
                }
            },
            // 执行登录操作并获取用户openId
            async loginAndGetOpenid() {
                const that = this;
                that.submitLoading = false;
                that.$tools.dd('开始登录请求---');
                const userdetail = uni.getStorageSync('userDetail');
                const userProfileData = uni.getStorageSync('userProfileData');
                that.$tools.dd('loginAndGetOpenid => 读取缓存的用户数据', userdetail, userProfileData);

                if (!userdetail.code) {
                    uni.showToast({
                        title: '微信信息获取失败',
                        icon: 'none',
                        duration: 2000,
                    });
                    that.submitLoading = true;
                    this.loginRequest()
                    return;
                }

                const paramForm = {
                    code: userdetail.code,
                    encryptedData: userdetail.encryptedData,
                    iv: userdetail.iv,
                    shareId: uni.getStorageSync('userShareId')
                };

                // if (userProfileData) {
                //     paramForm.nickname = userProfileData.userInfo.nickName
                //     paramForm.avatar = userProfileData.userInfo.avatarUrl
                // }

                console.log(JSON.stringify(paramForm))
                const result = await wxLoginApi(paramForm);
                that.$tools.dd('登录请求返回数据', result);

                try {
                    const data = result.data
                    if (data.code != 0) {
                        uni.showToast({
                            title: result.data.data
                        })
                        that.submitLoading = true;
                        return
                    }

                    uni.setStorageSync('userToken', data.data.token);
                    await this.getUserDataApi()

                    uni.showToast({
                        title: '登录成功',
                        icon: 'none',
                        duration: 2000,
                        success() {
                            uni.reLaunch({
                                url: '/pages/index/tabBar',
                            });
                        },
                    });
                } catch (e) {
                    console.log(e)
                    //TODO handle the exception
                }
            },
        },
    };
</script>
