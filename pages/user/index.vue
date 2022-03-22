<style lang="scss"></style>
<template>
    <view class="">
        <cu-custom>
            <block slot="content">
                <view class="">我的</view>
            </block>
        </cu-custom>
        <view class="padding text-center">
            我的
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            paramData: {},
            paramForm: {},
            paramLoca: {},
        };
    },
    onLoad() {
    },
    methods: {
        onPullDownRefresh() {
            console.log('refresh');
        },
        onReachBottom() {
            console.log('onReachBottom');
        },
    },
};
</script>
