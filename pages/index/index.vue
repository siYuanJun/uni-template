<style lang="less"></style>
<template>
	<view class="content">
		<view class="text-black text-xxl text-center padding-xl">初始化成功</view>
		<seeimg ref="mychild" />
	</view>
</template>

<script>
	import seeimg from '@/components/xw-seeimg/index'
	export default {
		components: {
			seeimg
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
				this.showimg()
			})
		},
		methods: {
			showimg() {
				this.$refs.mychild.onImg(
					"https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2384030035,3537130422&fm=26&gp=0.jpg");
			},
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
