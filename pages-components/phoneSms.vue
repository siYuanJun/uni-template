<template>
    <view class="">
        <view class="w-xxl text-theme text-center" v-if="paramLoca.buttonLoaing" @tap="getSmsSubmit">{{ paramLoca.smsTxt }}</view>
        <view class="w-xxl text-grey-6F6F6F text-center" v-else>{{ paramLoca.smsTxt }}</view>
    </view>
</template>

<script>
    import {sendSms} from '@/api/common.js'

    export default {
        props: {
            phone: {
                type: String,
                default: ''
            },
            type: {
                type: String,
                default: 'register',
            }
        },
        data() {
            return {
                paramLoca: {
                    smsMiao: 60,
                    smsTxt: '获取验证码',
                    buttonLoaing: true,
                }
            }
        },
        methods: {
            smsMiaoChang() {
                let that = this
                that.paramLoca.smsTxt = '(' + this.paramLoca.smsMiao + 's 重新获取)'
                if (that.paramLoca.smsMiao > 0) {
                    that.paramLoca.smsMiao -= 1
                    setTimeout(() => {
                        that.smsMiaoChang()
                    }, 1000)
                } else {
                    that.paramLoca.smsMiao = 60
                    that.paramLoca.smsTxt = '获取验证码'
                    that.paramLoca.buttonLoaing = true
                }
            },
            getSmsSubmit() {
                const that = this;
                if (that.paramLoca.smsMiao !== 60) {
                    return;
                }
                if (that.$tools.phoneVerification(that.phone)) {
                    uni.showModal({
                        title: "温馨提示",
                        showCancel: false,
                        content: "手机号格式错误"
                    })
                    return
                }
                that.paramLoca.buttonLoaing = false
                sendSms({phone: this.phone, type: this.type}).then(res => {
                    that.smsMiaoChang();
                }).catch(err => {
                    uni.showToast({
                        title: err.data.msg,
                        icon: 'none',
                        complete: () => {
                            that.paramLoca.buttonLoaing = true
                        }
                    })
                });
            }
        }
    }
</script>

<style>
</style>
