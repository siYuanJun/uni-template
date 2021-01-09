<style lang="less">
</style>
<template>
	<view class="content">
		<view class="text-black text-xxl text-center padding-xl">
			初始化成功
		</view>
		<view class="grid col-1 margin-top-xxl">
			<view class="block margin-top" v-for="(item,index) in parmdata.list" :key="index">
				<navigator :url="'../article/details?id='+ item.path" class='block-item'>
					<view class="img" :style="'background: url('+item.image+') no-repeat center; background-size: cover;'"></view>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				api_url: "&c=Promotion&a=index",
				parmdata: {
				},
				parmform: {
					page: 1
				},
				parmloca: {},
			}
		},
		onLoad() {
			let that = this
			that.ajaxRequest(that, that.api_url)
		},
		methods: {
			onPullDownRefresh() {
				console.log('refresh')
			},
			onReachBottom() {
				console.log('onReachBottom')
			},
		}
	}
</script>