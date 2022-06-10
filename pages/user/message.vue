<template>
    <view class="">
        <u-navbar bgColor="#1B5DA3" title="列表" :titleStyle="{'color': 'white'}" leftIconColor="#fff" placeholder>
        </u-navbar>
        <view class="padding-lr pb-xl">
            <view class="bg-white  mt padding " v-for="(item, index) in 5" :key="index"
                @tap="hrefNavigateTo('/pages-business/article/messageDetails?id=' + index)">
                <view class="text-df u-flex justify-between">
                    <view class="u-flex">
                        <view class="icon-round mr-sm"></view>
                        <view class="text-df text-black-333">
                            项目审核通过通知
                        </view>
                    </view>
                    <u-icon name="arrow-right"></u-icon>
                </view>
            </view>
            <view class="mt-lg">
                <u-loadmore :status="loadingMoreStatus"></u-loadmore>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                loadingMoreStatus: 'loadmore',

                paramForm: {},
                paramData: {
                    content: "详情。。。。。。"
                },
                paramLoca: {},
            }
        },
        onLoad(e) {
            this.paramForm.id = e.id
        },
        onReachBottom() {
            console.log("onReachBottom")
            this.loadingMoreStatus = 'loading'

            setTimeout(() => {
                this.loadingMoreStatus = 'nomore'
            }, 2000)
        },
        methods: {},
    }
</script>

<style lang="scss">
    body,
    page {
        background-color: #f8f8f8;
    }
</style>
