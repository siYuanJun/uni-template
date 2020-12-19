<style lang="less">
	.grid {
		.img {
			height: 300rpx;
		}
	}
	.about-desc {
		position: relative;
		z-index: 1;
		color: #c8c8c8;
		height: 300rpx;
		background: url(http://www.bjxcsy.com/promotion/images/3.png) no-repeat center;
		background-size: 100% auto;
	}
	.banner {
		image {
			width:95%;
		}
	}
	.logo {
		image {
			width: 90px;
		}
	}
</style>
<template>
	<view class="content">
		<view class="text-center padding-top-xl banner">
			<image :src="this.resostatic + '/1.png'" mode="widthFix"></image>
		</view>
		<view class="text-center logo margin-top">
			<image :src="this.resostatic + '/2.png'" mode="widthFix"></image>
		</view>
		<view class="text-center text-xxl text-white margin-top-xs">
			2008年创立于北京
		</view>
		<view class="text-center text-sm text-white text-height about-desc padding">
			北京星诚视野网络科技有限公司简称（星诚视野）于2008年成立，12年来，我们一直专注于高端网站建设、APP开发、微信开发、WEB应用系统开发和服务。
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
	import indexMixin from '@/common/mixinPull'
	export default {
		components: {},
		mixins: [indexMixin],
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