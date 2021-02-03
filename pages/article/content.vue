<style lang="less">
	.content {
		margin: 30px 20px 20px 20px;
		font-size: 16px;
		line-height: 30px;
	}
</style>

<template>
	<view class="content">
		<u-parse :content="parmdata.data.content" @preview="preview" @navigate="navigate"></u-parse>
	</view>
</template>

<script>
	import uParse from '@/components/u-parse/u-parse'
	export default {
		components: {
		    uParse
	    },
		data() {
			return {
				api_index: '/navads',
				imageProp: {
					mode: 'widthFix'
				},
				parmform: {},
				parmdata: {
					data: {}
				},
				parmloca: {}
			}
		},
		onLoad(e) {
			let that = this
			console.log(e)
			if(e.id) {
				that.parmform.id = e.id
				that.ajaxRequest(that, that.api_index, 0, 'contentCall')
				that.contentCall = res => {
					res = res.data
					if(res.name) {
						uni.setNavigationBarTitle({
							title: res.name
						})
					}
				}
			}
		},
		methods: {
			preview(src, e) {
			  // do something
			  console.log(src)
			},
			navigate(href, e) {
			  // do something
			}
		}
	}
</script>
