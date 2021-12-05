<template>
    <view class="">
        <view class="cu-bar tabbar bg-white shadow foot">
            <view class="action" @click="NavChange" data-cur="workbench">
                <view class='cuIcon-cu-image'>
                    <image :src="'/static/images/nav/' + [PageCur == 'workbench'?'workbench-icon-cur':'workbench-icon'] + '.png'"></image>
                </view>
                <view :class="'footer-text'">工作台</view>
            </view>
            <view class="action" @click="NavChange" data-cur="message">
                <view class='cuIcon-cu-image'>
                    <image :src="'/static/images/nav/' + [PageCur == 'message'?'message-icon-cur':'message-icon'] + '.png'"></image>
                </view>
                <view :class="'footer-text'">消息</view>
            </view>
            <view class="action" @click="NavChange" data-cur="user">
                <view class='cuIcon-cu-image'>
                    <image :src="'/static/images/nav/' + [PageCur == 'user'?'user-icon-cur':'user-icon'] + '.png'"></image>
                </view>
                <view :class="'footer-text'">我的</view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: 'cu-footer',
        props: {
            PageCur: {
                type: String,
                default: "workbench"
            }
        },
        data() {
            return {}
        },
        methods: {
            NavChange() {
            }
        }
    }
</script>

<style>
    .footer-text {
        margin-top: 5upx;
        color: #071329;
        font-size: 20upx;
    }
</style>
