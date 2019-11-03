<template>
	<view class="content">
	</view>
</template>

<script>
	import indexMixin from '@/common/mixinPull'
	export default {
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
				parmloca: {
				},
			}
		},
		onLoad() {
			let that = this
			that.ajaxRequest(that, that.api_url)
		},
		onPullDownRefresh() {
			console.log('refresh');
			let that = this
			that.ajaxRequest(that, that.api_url)
		},
		methods: {
		}
	}
</script>

<style lang="less">
</style>
