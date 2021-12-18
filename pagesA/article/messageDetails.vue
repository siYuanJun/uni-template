<template>
    <view class="">
        <cu-custom bgColor="bg-white" :isBack="true">
            <block slot="content">
                <view class=" ">{{title}}</view>
            </block>
        </cu-custom>
        <view class="parse-content">
            <u-parse :content="paramData.msgContent" @preview="preview" @navigate="navigate"></u-parse>
        </view>
    </view>
</template>

<script>
import uParse from '@/components/u-parse/u-parse'
export default {
    components: {
        uParse,
    },
    data() {
        return {
            paramForm: {},
            paramData: {},
            paramLoca: {},
        }
    },
    onLoad(e) {
        const that = this
        uni.getStorage({
            key: 'content',
            success: (res) => {
                that.paramData = res.data
                that.$tools.requests(that, `${that.api_updateMessageStatus}/${res.data.anntId}`).then((ress) => {
                    console.log(ress)
                })
                that.title = that.paramData.title ? that.paramData.title : '详情'
            },
        })
    },
    methods: {
        preview(src, e) {
            // do something
            console.log(src)
        },
        navigate(href, e) {
            // do something
        },
    },
}
</script>

<style lang="less">
.parse-content {
    margin: 30upx;
    font-size: 28upx;
    line-height: 30upx;
}
</style>
