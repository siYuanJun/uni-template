<template>
   <view class="">
       <cu-custom :isBack="true">
            <block slot="content">
                <view class="">{{title}}</view>
            </block>
        </cu-custom>
       <view class="padding">
           <view class="padding bg-white radius-df">

               <view class="parm-content">
                   <u-parse :content="paramData.content" @preview="preview" @navigate="navigate"></u-parse>
               </view>
           </view>
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
            title: "详情",
            paramForm: {},
            paramData: {
                content: "详情。。。。。。"
            },
            paramLoca: {
            },
        }
    },
    onLoad(e) {
        this.paramForm.id = e.id
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
            
            // uni.setNavigationBarTitle({
            // 	title: res.name
            // })
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
