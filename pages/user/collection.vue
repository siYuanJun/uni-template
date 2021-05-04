<style lang="less">
page {
	background-color: #eeeeee;
}
.bar-height {
	height: 100upx;
}
.cu-bar {
	.cu-item.cur {
		border-bottom: 4upx solid #58c3e0;
	}
}
.bar-bottom {
	background: #f9f9f9;
	position: fixed;
	left: 0;
	width: 100%;
	bottom: 0;
}
</style>
<template>
	<view class="content">
		<view class="cu-bar bg-white bar-height fixed flex justify-around align-stretch">
			<view
				class="cu-item flex-sub text-999999 text-center text-df flex align-center justify-center"
				v-for="(item, index) in parmloca.cloumlist"
				:key="index"
				:class="parmloca.pagetpl === index ? 'text-333333 cur' : ''"
				@tap="pagetpl(index)"
			>
				<text>{{ item }}</text>
			</view>
		</view>
		<view class="bar-height"></view>
		<view class="padding-sm">
			<jiedan-item :list="parmdata.taskGrid" :operation="parmloca.operation" :statusDom="true"></jiedan-item>
			<data-none :count="parmloca.dataNoneList" :loading="!submitLocaing"></data-none>
			<mix-load-more v-if="parmdata.taskGrid.length" :status="parmloca.loadMoreStatus"></mix-load-more>
		</view>
		<view class="bar-height"></view>
		<view class="bar-bottom bar-height flex" v-if="parmdata.taskGrid.length">
			<view @tap="operation" class="text-df text-333333 flex justify-center align-center flex-sub" v-if="!parmloca.operation">
				<image src="../../static/images/bianji.png" mode="aspectFit" class="icon-sm margin-right-xs"></image>
				<text>批量操作</text>
			</view>
			<view class="text-df text-333333 flex justify-around align-center flex-sub" v-else>
				<view class="">
					<label class="flex align-center" @tap="selectAll">
						<radio class="radio transform-sm blue" :checked="parmloca.selectAll" />
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
		mixLoadMore
	},
	data() {
		return {
			parmdata: {
				taskGrid: []
			},
			parmform: {},
			parmloca: {
				pagetpl: 0,
				operation: false,
				selectAll: false,
				selectendId: [], // 选中的数据
				cloumlist: ['所有', '待接单', '已接单', '已完成', '已结算'],
				loadMoreStatus: 0,
				dataNoneList: true,
			},
			submitLocaing: 0
		};
	},
	onLoad() {
		this.getData(this)
	},
	methods: {
		async getData(that, page, type) {
			that.submitLocaing = 0
			that.parmloca.loadMoreStatus = 1;
			that.parmform.page = page != undefined ? page : 1;
			let parmform = {
				status: that.parmloca.pagetpl
			};
			let result = await that.ajaxRequest(that, that.routes.api_collectList, parmform, "post");
			var data = result.data.items;
			that.dd('收藏列表接口', data);
			if (type == 'add') {
				data.forEach(item => {
					that.parmdata.taskGrid.push(item);
				});
			} else {
				that.parmdata.taskGrid = data;
			}
			if (data.length < 10) {
				that.parmloca.loadMoreStatus = 2;
				that.parmform.page = 1;
			}
			that.parmloca.dataNoneList = that.parmdata.taskGrid.length > 0;
		},
		onPullDownRefresh() {
			console.log('refresh');
			this.getData(this);
		},
		onReachBottom() {
			console.log('onReachBottom');
			let that = this;
			that.parmform.page++;
			that.getData(that, that.parmform.page, 'add');
		},
		// 全选操作
		selectAll() {
			this.parmloca.selectendId = []
			this.parmloca.selectAll = !this.parmloca.selectAll;
			this.parmdata.taskGrid.map(item => {
				this.$set(item, 'checked', this.parmloca.selectAll);
				if(this.parmloca.selectAll) {
					this.parmloca.selectendId.push(String(item.tid))
				}
			})
			this.dd("选中了", this.parmloca.selectendId)
		},
		// 子组件操作
		radioChang(data) {
			this.dd("子组件选中", data)
			this.parmloca.selectendId = data
			this.parmloca.selectAll = this.parmdata.taskGrid.length === data.length;
		},
		deleteBtn() {},
		// 是否操作状态
		operation() {
			this.parmloca.operation = !this.parmloca.operation;
		},
		async pagetpl(index) {
			this.parmloca.pagetpl = index;
			this.parmdata.taskGrid = []
			this.getData(this);
		}
	}
};
</script>
