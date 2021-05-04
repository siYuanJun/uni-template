<style lang="less"></style>
<template>
	<view class="content">
		<view class="text-black text-xxl text-center padding-xl">初始化成功</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			parmdata: {},
			parmform: {},
			parmloca: {}
		};
	},
	onLoad() {
		let that = this;
		// that.getData()
	},
	methods: {
		async getData() {
			let that = this;
			let result = await that.ajaxRequest(that, that.routes.api_content, that.parmdata);
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
