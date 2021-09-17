<style lang="less"></style>
<template>
	<view class="content">
		<view class="text-lg mt-xl text-center">初始化成功</view>
	</view>
</template>

<script>
	export default {
		components: {
		},
		data() {
			return {
				parmdata: {},
				parmform: {},
				parmloca: {}
			};
		},
		onLoad() {
			this.$nextTick(function() {
			})
		},
		methods: {
			async getData() {
				let that = this;
				let result = await that.Requests(that, that.routes.api_content, that.parmdata);
				console.log(result);
				// uni.setNavigationBarTitle({
				// 	title: res.name
				// })
			},
			onPullDownRefresh() {
				console.log('refresh');
			},
			onReachBottom() {
				console.log('onReachBottom');
			}
		}
	};
</script>
