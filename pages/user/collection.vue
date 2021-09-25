<style lang="less">
page {
	background-color: #eeeeee;
}
.cu-bar {
	.cu-item.cur {
		border-bottom: 4upx solid #58c3e0;
	}
}
</style>
<template>
    <view class="content">
        <view class="cu-bar bg-white bar-height fixed flex justify-around align-stretch">
            <view
                class="cu-item flex-sub text-999999 text-center text-df flex align-center justify-center"
                v-for="(item, index) in paramLoca.cloumlist"
                :key="index"
                :class="paramLoca.pagetpl === index ? 'text-333333 cur' : ''"
                @tap="pagetpl(index)"
            >
                <text>{{ item }}</text>
            </view>
        </view>
        <view class="bar-height"></view>
        <view class="padding-sm">
            <jiedan-item :list="paramData.taskGrid" :operation="paramLoca.operation" :statusDom="true"></jiedan-item>
            <data-none :count="paramLoca.dataNoneList" :loading="!submitLocaing"></data-none>
            <mix-load-more v-if="paramData.taskGrid.length" :status="paramLoca.loadMoreStatus"></mix-load-more>
        </view>
        <view class="bar-height"></view>
        <view class="bar-bottom bar-height flex" v-if="paramData.taskGrid.length">
            <view @tap="operation" class="text-df text-333333 flex justify-center align-center flex-sub" v-if="!paramLoca.operation">
                <image src="../../static/images/bianji.png" mode="aspectFit" class="icon-sm margin-right-xs"></image>
                <text>批量操作</text>
            </view>
            <view class="text-df text-333333 flex justify-around align-center flex-sub" v-else>
                <view class="">
                    <label class="flex align-center" @tap="selectAll">
                        <radio class="radio transform-sm blue" :checked="paramLoca.selectAll" />
                        <text>全选</text>
                    </label>
                </view>
                <view class="text-xl flex align-center" @tap="deleteBtn">
                    <text class="cuIcon-close"></text>
                    <text class="text-df">删除</text>
                </view>
                <view class="" @tap="operation">取消</view>
            </view>
        </view>
    </view>
</template>

<script>
import mixLoadMore from '@/components/mix-load-more/mix-load-more';
import jiedanItem from '../components/jiedanItem.vue';
import dataNone from '../components/dataNone.vue';
export default {
    components: {
        jiedanItem,
        dataNone,
        mixLoadMore,
    },
    data() {
        return {
            paramData: {
                taskGrid: [],
            },
            paramForm: {},
            paramLoca: {
                pagetpl: 0,
                operation: false,
                selectAll: false,
                selectendId: [], // 选中的数据
                cloumlist: ['所有', '待接单', '已接单', '已完成', '已结算'],
                loadMoreStatus: 0,
                dataNoneList: true,
            },
            submitLocaing: 0,
        };
    },
    onLoad() {
        this.submitLocaing = 0;
        this.getData(this);
    },
    methods: {
        async getData(that, page, type) {
            that.paramLoca.loadMoreStatus = 1;
            that.paramForm.page = page != undefined ? page : 1;
            const paramForm = {
                status: that.paramLoca.pagetpl,
                page: that.paramForm.page,
            };
            const result = await that.$tools.requests(that, that.routes.api_collectList, paramForm, 'post');
            const data = result.data.items;
            that.dd('收藏列表接口', data);
            if (type == 'add') {
                data.forEach(item => {
                    that.paramData.taskGrid.push(item);
                });
            } else {
                that.paramData.taskGrid = data;
            }
            if (data.length < 10) {
                that.paramLoca.loadMoreStatus = 2;
                that.paramForm.page = 1;
            }
            that.paramLoca.dataNoneList = that.paramData.taskGrid.length > 0;
        },
        // onPullDownRefresh() {
        // 	console.log('refresh');
        // 	this.getData(this);
        // },
        onReachBottom() {
            console.log('onReachBottom');
            const that = this;
            that.submitLocaing = 1;
            that.paramForm.page++;
            that.getData(that, that.paramForm.page, 'add');
        },
        // 全选操作
        selectAll() {
            this.paramLoca.selectendId = [];
            this.paramLoca.selectAll = !this.paramLoca.selectAll;
            this.paramData.taskGrid.forEach((item) => {
                this.$set(item, 'checked', this.paramLoca.selectAll);
                if (this.paramLoca.selectAll) {
                    this.paramLoca.selectendId.push(String(item.tid));
                }
            });
            this.dd('选中了', this.paramLoca.selectendId);
        },
        // 子组件操作
        radioChang(data) {
            this.dd('子组件选中', data);
            this.paramLoca.selectendId = data;
            this.paramLoca.selectAll = this.paramData.taskGrid.length === data.length;
        },
        async deleteBtn() {
            const that = this
            const {selectendId} = that.paramLoca;
            that.dd('删除的收藏数据', selectendId);
            const selectendIds = selectendId.toString();
            const paramForm = {
                tids: selectendIds,
            };
            const array = [];
            const result = await that.$tools.requests(that, that.routes.api_collect, paramForm, 'post');
            that.dd('删除的收藏请求', result);
            if (result.code === 0) {
                for (let i = 0; i < that.paramData.taskGrid.length; i++) {
                    const item = that.paramData.taskGrid[i];
                    const val = selectendId.filter(it => Number(it) === item.tid);
                    if (!val.length) {
                        array.push(that.paramData.taskGrid[i]);
                    }
                }
                that.paramData.taskGrid = array;
                that.paramLoca.dataNoneList = that.paramData.taskGrid.length > 0;
            }
        },
        // 是否操作状态
        operation() {
            this.paramLoca.operation = !this.paramLoca.operation;
        },
        async pagetpl(index) {
            this.paramLoca.pagetpl = index;
            this.submitLocaing = 0;
            this.paramData.taskGrid = [];
            this.getData(this);
        },
        // 子组件通信重构数组
        collectCalcu(item, index) {
            index = index || 0;
            this.dd('取消收藏', index);
            delete this.paramData.taskGrid[index];
            const array = [];
            this.paramData.taskGrid.forEach(item => {
                array.push(item);
            });
            this.paramData.taskGrid = array;
            this.paramLoca.dataNoneList = this.paramData.taskGrid.length > 0;
        },
    },
};
</script>
