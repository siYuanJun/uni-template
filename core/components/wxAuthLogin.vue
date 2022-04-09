<template>
    <view>
        <view class="flex flex-direction justify-center align-center">
            <!-- #ifdef APP-PLUS -->
            <image src="@/static/images/wx-icon.png" mode="widthFix" class="w-lgs" @tap="handleLoginApp('weixin')"></image>
            <button class="cu-btn btn-ios flex align-center margin-top-xl lg" @tap="handleLoginApp('apple')" v-if="isIos">
                <image src="@/static/images/ios-sm.png" mode="aspectFit" style="width: 30upx; height: 30upx;"></image>
                <view class="margin-left-xs text-white">
                    通过 Apple 登录
                </view>
            </button>
            <!-- #endif -->
        </view>
        <view class="cu-modal" :class="paramLoca.showModel ? 'show' : ''">
            <view class="cu-dialog">
                <view class="padding-lr padding-tb-xl text-left">
                    <view class="border-bottom-D8D8D8 padding-tb flex align-center text-df">
                        <view class="w-xl text-center padding-tb-xs border-right-D8D8D8">+86</view>
                        <view class="flex-sub padding-left"><input type="number" class="flex-sub"
                                v-model="paramForm.phone" placeholder="请输入手机号" placeholder-class="text-grey-C1C1C1" />
                        </view>
                    </view>
                    <view class="border-bottom-D8D8D8 padding-tb flex align-center text-df">
                        <view class="flex-sub padding-right"><input type="number" class="flex-sub"
                                v-model="paramForm.code" placeholder="请输入验证码" placeholder-class="text-grey-C1C1C1" />
                        </view>
                        <phone-sms :phone="paramForm.phone"></phone-sms>
                    </view>
                    <view class="flex margin-top-xl">
                        <view class="cu-btn lg flex-sub bg-theme round text-white"
                            v-if="paramForm.phone && paramForm.code" @tap="submitCode">绑定提交</view>
                        <view class="cu-btn lg flex-sub bg-theme round text-white opacity-50" v-else>绑定提交</view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import phoneSms from './phoneSms'

    export default {
        components: {
            phoneSms
        },
        data() {
            return {
                paramForm: {
                    phone: '',
                    code: '',
                },
                paramLoca: {
                    showModel: false,
                    buttonLoading: false,
                },
                isIos: false,
                system: '',
                platform: ''
            }
        },
        created(e) {
            let that = this
            uni.getSystemInfo({
                success: function(res) {
                    that.system = Number(res.system.substring(3, 6))
                    that.platform = res.platform
                    console.log(res, that.system, that.platform, res.system.substring(3, 6))
                    if (that.platform == 'ios' && that.system < 13) {
                        console.log("不支持苹果登录")
                        that.isIos = false
                    } else if (that.platform == 'ios' && that.system >= 13) {
                        //调用苹果登录
                        console.log("支持苹果登录")
                        that.isIos = true
                    }
                }
            });
        },
        methods: {
            handleLoginApp(provider) {
                console.log("App 微信拉起授权")
                var that = this
                if (that.buttonLoading) {
                    return
                }
                that.buttonLoading = true
                uni.getProvider({
                    service: 'oauth',
                    success: (res) => {
                        console.log(res, res.provider.indexOf('weixin'))
                        uni.login({
                            provider,
                            success: loginRes => {
                                console.log(`App${provider}登录成功`, loginRes);
                                that.getApploginData(loginRes) //请求登录接口方法
                            },
                            fail: err => {
                                that.buttonLoading = false
                                console.log(`App${provider}登录失败`, err);
                            }
                        })
                    },
                    fail: (err) => {
                        console.log(err)
                        that.buttonLoading = false
                    }
                });
            },
            // 请求登录接口方法
            async getApploginData(data) {
                var that = this

                let paramForm = {
                    access_token: data.authResult.access_token,
                    openid: data.authResult.openid,
                }

                this.$tools.requests(this.$routes.api_auth_wechat_serve, paramForm, 'post').then(res => {
                    that.buttonLoading = false

                    let token = res.data.data
                    uni.setStorageSync('userToken', token)
                    setTimeout(() => that.getUserDataApi(), 100)
                    uni.reLaunch({
                        url: '/pages/index/index'
                    })
                }).catch(err => {
                    that.buttonLoading = false
                    if (err.data.code === 402) {
                        uni.reLaunch({
                            url: `/pages/public/register?type=binding&openid=${paramForm.openid}`
                        })
                    }
                })
            }
        }
    }
</script>

<style>
    .btn-ios {
        background-color: #000;
        border-radius: 20upx;
    }
</style>
