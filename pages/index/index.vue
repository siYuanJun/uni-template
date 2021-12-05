<template>
    <view class="">
        <cu-custom>
            <block slot="content">
                <view class="">华中人才</view>
            </block>
        </cu-custom>
        <view>
            个人主页
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
<style lang="less"></style>
