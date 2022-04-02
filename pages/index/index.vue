<template>
    <view class="">
        <cu-custom>
            <block slot="content">
                <view class="">首页</view>
            </block>
        </cu-custom>
        <view class="text-center padding">
            <view class="">
                个人主页
            </view>
            <view class="">
                <u-button type="success">默认按钮</u-button>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                loadMoreStatus: 2,
                paramData: [],
                workId: 0,
            }
        },
        methods: {
            getInit(workId, page, date) {
                this.workId = workId
                this.loadMoreStatus = 1

                // signClockList(workId, {page, time: date || ''}).then(res => {
                //     let data = res.data.data.data

                //     if(page > 1) {
                //         data.map(item => {
                //             this.paramData.push(item)
                //         })
                //     } else {
                //         this.paramData = data
                //     }

                //     this.loadMoreStatus = data.length === 0 ? 2 : (data.length < 10 ? 2 : 0)
                // })
            },
        }
    }
</script>
<style lang="scss"></style>
