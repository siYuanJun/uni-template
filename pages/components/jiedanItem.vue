<style lang="less">
.item-block {
}
</style>
<template>
	<view class="">
		<checkbox-group style="width: 100%;" @change="radioChang">
			<view class="margin-bottom hide flex" v-for="(item, index) in list" :key="index">
				<view class="padding-right flex align-center" v-if="operation"><checkbox :value="item.tid" class="radio round blue transform-sm" :checked="item.checked" @tap="radioChecked(index, item.checked)"/></view>
				<view class="padding-sm radius-df flex-sub relative bg-white" :class="operation ? 'item-block' : ''">
					<view class="padding-bottom-sm solid-bottom flex align-center justify-between text-df text-black">
						<view class="">{{ item.taskName }}</view>
						<view class="flex-sub text-right">
							<text class="text-red">{{ item.settlePrice }}</text>
							元/单
						</view>
					</view>
					<view class="padding-tb-xs">
						<view class="" @tap="href('/pages/article/jiedanDetails?tid=' + item.tid)">
							<view class="flex align-center padding-tb-xs">
								<view class="padding-right-sm"><image src="../../static/images/time-icon.png" class="icon-sm" mode="aspectFit"></image></view>
								<view class="flex align-center text-df text-333333">
									<view class="text-999999 margin-right-xs">{{ item.startTime }} - {{ item.endTime }}</view>
									<view class="cu-tag radius sm bg-blue-FFF0CF text-white">{{ item.dayNum }}天</view>
									<block v-if="statusDom">
										<view class="cu-tag radius sm bg-yellow-FF9951 text-white" v-if="item.applyStatus === 1">{{ cloumlist[item.applyStatus] }}</view>
										<view class="cu-tag radius sm bg-red-DD2025 text-white" v-if="item.applyStatus === 2">{{ cloumlist[item.applyStatus] }}</view>
										<view class="cu-tag radius sm bg-green-6EC957 text-white" v-if="item.applyStatus === 3">{{ cloumlist[item.applyStatus] }}</view>
										<view class="cu-tag radius sm bg-green-6EC957 text-white" v-if="item.applyStatus === 4">{{ cloumlist[item.applyStatus] }}</view>
									</block>
								</view>
							</view>
							<view class="flex align-center padding-tb-xs">
								<view class="padding-right-sm"><image src="../../static/images/loca-icon.png" class="icon-sm" mode="aspectFit"></image></view>
								<view class="text-df text-333333">{{ item.address }}</view>
							</view>
							<view class="flex align-center padding-tb-xs">
								<view class="padding-right-sm"><image src="../../static/images/lou-icon.png" class="icon-sm" mode="aspectFit"></image></view>
								<view class="text-df text-333333">{{ item.companyName }}</view>
							</view>
						</view>
						<view class="flex align-center justify-between padding-top-xs">
							<view class="flex align-center">
								<view class="padding-right-sm"><image src="../../static/images/user-icon.png" class="icon-sm" mode="aspectFit"></image></view>
								<view class="text-df text-333333">{{ item.applyNum ? item.applyNum : 0 }}/{{ item.totalNum }}</view>
							</view>
							<view class="" @tap="collectBtn(item, index)">
								<image src="../../static/images/xing-icon-cur.png" mode="aspectFit" class="icon-sm" v-if="item.isCollect"></image>
								<image src="../../static/images/xing-icon.png" mode="aspectFit" class="icon-sm" v-else></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</checkbox-group>
	</view>
</template>

<script>
export default {
	name: 'jiedanItem',
	props: {
		list: {
			type: Array,
			default: []
		},
		operation: {
			type: Boolean,
			default: false
		},
		statusDom: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			cloumlist: ['所有', '待接单', '已接单', '已完成', '已结算']
		};
	},
	onLoad() {
		let that = this;
	},
	methods: {
		// 选中组操作
		radioChang(e) {
			this.$parent.radioChang(e.detail.value);
		},
		// 选中单条数据操作
		radioChecked(index, checked) {
			this.$set(this.$parent.parmdata.taskGrid[index], "checked", !checked)
		},
		async collectBtn(item, index) {
			let that = this;
			let parmform = {
				tids: item.tid
			};
			let result = await that.ajaxRequest(that, that.routes.api_collect, parmform, 'post');
			that.list[index].isCollect = !that.list[index].isCollect;
			// 必须通知父级更换状态
			that.$parent.parmdata.taskGrid = that.list;
			that.dd('收藏返回', result);
		}
	}
};
</script>
