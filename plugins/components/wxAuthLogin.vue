<template>
    <view>
        <image src="@/static/images/wx-icon.png" mode="widthFix" class="w-lgs" @tap="handleThirdLoginApp"></image>
        <view class="cu-modal" :class="paramLoca.showModel ? 'show' : ''">
            <view class="cu-dialog">
                <view class="padding-lr padding-tb-xl text-left">
                    <view class="border-bottom-D8D8D8 padding-tb flex align-center text-df">
                        <view class="w-xl text-center padding-tb-xs border-right-D8D8D8">+86</view>
                        <view class="flex-sub padding-left"><input type="number" class="flex-sub" v-model="paramForm.phone" placeholder="请输入手机号" placeholder-class="text-grey-C1C1C1"/></view>
                    </view>
                    <view class="border-bottom-D8D8D8 padding-tb flex align-center text-df">
                        <view class="flex-sub padding-right"><input type="number" class="flex-sub" v-model="paramForm.code" placeholder="请输入验证码" placeholder-class="text-grey-C1C1C1"/></view>
                        <phone-sms :phone="paramForm.phone"></phone-sms>
                    </view>
                    <view class="flex margin-top-xl">
                        <view class="cu-btn lg flex-sub bg-theme round text-white" v-if="paramForm.phone && paramForm.code" @tap="submitCode">绑定提交</view>
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
                }
            }
        },
        created(e) {
        },
        methods: {
            // app 第三方登录
            handleThirdLoginApp() {
                console.log("App 微信拉起授权")
                var that = this
                if(that.buttonLoading) {
                    return
                }
                that.buttonLoading = true
                uni.getProvider({
                    service: 'oauth',
                    success: (res) => {
                        console.log(res)
                        // 支持微信、qq和微博等
                        if (res.provider.indexOf('weixin') === 0) {
                            uni.login({
                                provider: 'weixin',
                                success: loginRes => {
                                    console.log("App微信获取用户信息成功", loginRes);
                                    that.getApploginData(loginRes) //请求登录接口方法
                                },
                                fail: err => {
                                    that.buttonLoading = false
                                    console.log("App微信获取用户信息失败", err);
                                }
                            })
                        }
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
                    if(err.data.code === 402) {
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
</style>
