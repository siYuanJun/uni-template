<template>
    <view class="parm-content">
        <u-parse :content="paramData.content" @preview="preview" @navigate="navigate"></u-parse>
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
            paramLoca: {
                imageProp: {
                    mode: 'widthFix',
                },
            },
        }
    },
    onLoad(e) {
        const that = this
        that.paramForm.id = e.id
        that.getData()
    },
    methods: {
        preview(src, e) {
            // do something
            console.log(src)
        },
        navigate(href, e) {
            // do something
        },
        async getData() {
            const that = this
            const result = await that.tools.Requests(that, that.routes.api_content, that.paramData)
            console.log(result)
            // uni.setNavigationBarTitle({
            // 	title: res.name
            // })
        },
    },
}
</script>

<style lang="less">
</style>
