<template>
    <view class="">
        <view class="cu-modal sy-model" :class="modelShow?'show':''">
            <view class="cu-dialog" :style="'background: url('+modelBodyImg+') no-repeat center/contain'">
                <view class="">
                    <view class="model-code">
                        <image v-show="msgCode === 0" :src="modelMsgOk" mode="aspectFit" style="width: 80%; height: 210upx;"></image>
                        <image v-show="msgCode === 1" :src="modelMsgError" mode="aspectFit" style="width: 80%; height: 210upx;"></image>
                    </view>
                    <view class="text-center">
                        <view class="text-xxl text-theme text-bold">
                            {{title}}
                        </view>
                        <view class="margin-top text-df text-black-071329">
                            {{info}}
                        </view>
                    </view>
                    <button class="cu-btn lg model-btn" v-if="btnInfo == '完善简历'" @tap="perHref">{{btnInfo}}</button>
                    <button class="cu-btn lg model-btn" v-else @tap="show">{{btnInfo}}</button>
                    <view class="model-close" @tap="show">
                        <image :src="modelCloseImg" mode="aspectFit" style="width: 60upx; height: 60upx;"></image>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                default: "提示",
            },
            info: {
                type: String,
                default: "",
            },
            btnInfo: {
                type: String,
                default: "关闭",
            },
            msgCode: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                modelShow: false,
                modelBodyImg: this.$baseStatic+'/static/images/model/model-body-back.png',
                modelCloseImg: this.$baseStatic+'/static/images/model/model-close.png',
                modelMsgError: this.$baseStatic+'/static/images/model/model-msg-error.png',
                modelMsgOk: this.$baseStatic+'/static/images/model/model-msg-ok.png'
            }
        },
        methods: {
            perHref() {
                this.href('/pagesPersonal/user/onlineResume')
                this.show()
            },

            show() {
                this.modelShow = !this.modelShow
            }
        }
    }
</script>

<style lang="less">
.sy-model {
    .cu-dialog {
        width: 700upx;
        height: 600upx;
        overflow: visible;
        position: relative;
    }

    .model-code {
        margin-top: -100upx;
    }

    .model-btn {
        width: 300upx;
        background: linear-gradient(0deg, #FEB71F 0%, #FCDB70 100%);
        color: #D31112;
        font-size: 30upx;
        border-radius: 80upx;
        position: absolute;
        bottom: 70upx;
        left: 50%;
        margin-left: -150upx;
    }

    .model-close {
        position: absolute;
        bottom: -90upx;
        margin-left: -30upx;
        left: 50%;
    }
}
</style>
