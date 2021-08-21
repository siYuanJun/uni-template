<style lang="less">
.parm-content {
	margin: 30upx;
	font-size: 28upx;
	line-height: 1.5;
}
</style>

<template>
	<view class="parm-content"><u-parse :content="parmdata.content" @preview="preview" @navigate="navigate"></u-parse></view>
</template>

<script>
import uParse from '@/components/u-parse/u-parse';
export default {
	components: {
		uParse
	},
	data() {
		return {
			parmform: {},
			parmdata: {},
			parmloca: {
				imageProp: {
					mode: 'widthFix'
				}
			}
		};
	},
	onLoad(e) {
		let that = this;
		that.parmform.id = e.id;
		that.getData();
	},
	methods: {
		preview(src, e) {
			// do something
			console.log(src);
		},
		navigate(href, e) {
			// do something
		},
		async getData() {
			let that = this;
			let result = await that.Requests(that, that.routes.api_content, that.parmdata);
			console.log(result);
			// uni.setNavigationBarTitle({
			// 	title: res.name
			// })
		}
	}
};
</script>
