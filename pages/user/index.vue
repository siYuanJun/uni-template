<style lang="less"></style>
<template>
    <view class="content">
        <view class="text-black text-xxl text-center padding-xl">初始化成功</view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            parmdata: {},
            parmform: {},
            parmloca: {},
        };
    },
    onLoad() {
        const that = this;
        that.$tools.requests(that, that.routes.api_index);
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
