<style lang="less">
page {
    background-color: #eeeeee;
}
</style>

<template>
    <view class="content">
    </view>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Mixins } from 'vue-property-decorator'
import mixLoadMore from '@/components/mix-load-more/mix-load-more'

@Component({
    components: {
        mixLoadMore,
    },
    mixins: [],
})
export default class jiedan extends Vue {
    public paramForm: any = {}
    public paramLoca: any = {
        loadMoreStatus: 0,
    }
    public paramData: Array<[]> = []
    onLoad(e) {
        let that = this
        // that.getData(that, 1);
    }
    async getData(that: any, page?: number, type?: string): Promise<void> {
        that.paramForm.pageNo = page != undefined ? page : 1
        that.paramForm.userSystemId = that.getu('userSystemId')
        that.paramLoca.loadMoreStatus = 1
        let result = await that.$tools.requests(that, that.routes.api_index, that.paramForm, 'get')
        var data = result.result.records
        console.log(data)
        if (type == 'add') {
            data.forEach((item) => {
                that.paramData.push(item)
            })
        } else {
            that.paramData = data
        }
        if (data.length < 10) {
            that.paramLoca.loadMoreStatus = 2
        }
    }
    onShow() {}
    onPullDownRefresh() {
        console.log('refresh')
        let that = this
        that.getData(that)
    }
    onReachBottom() {
        console.log('onReachBottom')
        let that = this
        that.paramForm.pageNo++
        that.getData(that, that.paramForm.pageNo, 'add')
    }
}
</script>
