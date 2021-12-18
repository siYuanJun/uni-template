<template>
    <view class="">
        <cu-custom>
            <block slot="content">
                <view class="">defaultTitle</view>
            </block>
        </cu-custom>
        <view class="">

        </view>
    </view>
</template>

<script>
    export default {
        components: {},
        data() {
            return {
                paramData: {},
                paramForm: {},
                paramLoca: {},
            }
        },
        onLoad() {},
        methods: {
            async getData() {
                const that = this
                const result = await that.$tools.requests(that, that.$routes.api_index, that.parmdata)
                console.log(result)
                // uni.setNavigationBarTitle({
                // 	title: res.name
                // })
            },
            onPullDownRefresh() {
                console.log('refresh')
            },
            onReachBottom() {
                console.log('onReachBottom')
            },
        },
    }
</script>
<style lang="less">
    body,
    page {
        background-color: #f8f8f8;
    }
</style>
