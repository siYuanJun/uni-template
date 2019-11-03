<template>
	<view class="content">
		<!-- 下拉刷新组件 -->
		<view class="newlist">
			<view class="block" v-for="(item,index) in pram_data" :key="index">
				<navigator :url="'../article/details?id='+ item.path" class='block-item'>
					<view class="name">{{item.title}}</view>
					<view class="img" :style="'background: url('+item.image+') no-repeat center; background-size: cover;'"></view>
				</navigator>
			</view>
			<!-- 上滑加载更多组件 -->
			<mix-load-more :status="parmloca.loadMoreStatus"></mix-load-more>
		</view>
	</view>
</template>

<script>
	import mixLoadMore from '@/components/mix-load-more/mix-load-more';
	import indexMixin from '@/common/mixinPull'
	export default {
		components: {
			mixLoadMore
		},
		mixins: [indexMixin],
		data() {
			return {
				api_url: 'https://api.apiopen.top/getWangYiNews',
				parmdata: {
					data: {}
				},
				parmform: {
					page: 1
				},
				parmloca: {},
			}
		},
		onLoad() {
			let that = this
			that.ajaxRequest(that, 'refresh')
		},
		onPullDownRefresh() {
			console.log('refresh');
			let that = this
			that.ajaxRequest(that, 'refresh')
		},
		methods: {
			onReachBottom() {
				console.log('onReachBottom')
				let that = this
				that.ajaxRequest(that, 'add')
			},
		}
	}
</script>

<style lang="less">
</style>
