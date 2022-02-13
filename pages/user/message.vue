<style lang="scss">
	page {
		background-color: #F5F5F5;
	}

	.box-icon {
		width: 100upx;
		height: 100upx;
		&.icon1 {
			background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAA/1BMVEUAAAD/7+//6Oj/6Oj/6Oj/6Oj/5+f/6ur/6Oj/6Oj/6Oj/5+f/6Oj/6Oj/6Oj/6Oj/5+f/6Oj/6Oj/6Oj/8PD/6en/6en/6Oj/8PD/6Oj/6Oj/6Oj/6en/6Oj/6Oj/6en/6Oj/6Oj/6Oj/6ur/5eX/6Oj/6Oj/6Oj/6Oj/5+f/6Oj/5+f/5+f/6Oj/7+//6Oj/UUb/dm7/r6v/r6r/Y1r/1dT/iYL/aF//U0j/4uL/wsD/cGj/XlT/2dj/mpT/jYb/W1H/3dz/0M7/qaT/hH3/VUv/5eX/19b/urf/tbH/op3/ycb/v7z/q6f/paH/kYv/bWT/zMr/fHX/dGz/YFY79pl3AAAAL3RSTlMABtz97c5GDOrIIQP54tNJF9+YTwmhj3cT8b+vinBqXUuRh2w4Hde6tUPnt6xYD00Xm/kAAAOESURBVFjDrdnpWtpAFAbgQxK2skpFUHGre7cvKjsioqjgbvX+r6WZFGwymQlkkvcfj/CRnHOciSPNUS3s1n6mD75ns98P0j9rm4UqqVtO1OI6OHq8llhWScskSgYkjNJxJujFbeTgK7eRDBAXqxiYy6jEFs0raFiIllgo7ss6Fra+Pz/vq4EAjO151VvREYi+4lvJ32sIbM2n3cU4FMSL0nZoUKJ9kVwfy1NLLArrF4eyuKCOmTWEsJbxBNYQyjfPPOsIRf/KNdhASIa71UcI7ch1w4iA46aXl+AynJwKTYa+0/h/Z9iAU7/ZNmVGd5DbmOXFcnC4Ojd9nF9Bamk2jFtw6LRMX/UOpLamgXk4PFsfar+cCb2wWtxDKk+2PTi9W585hcTY+mEPcnvElOB0aZofkLLq0YZcyW5JCk7WNZxA6sT6MeRSbD/YRnSBYBvrStDAZvPi+s5n0YkHDWTaA/H0pImqevBA5r0PgWySClALNFvCxGPaDBzYaHQH0sRN2oFKl5/tREFrVuiHQiBLlKwURxRXC8R1myU2PBsqLSkGYsISX2/5JYyMwIH1qRtTsI6kKBswkMO/Nxs28JwPVLjlj7rzpvntWaEpDdcrT1Py0Qbm6TDawEPaiTZwh3blgeNmrzea3PKBT4Pe++BRErhJCVlgv2faXq+EY3PSFwYeU5IbRGsUWrAMW5+j1hCvhx1BoJ4kSsOF5TwAaHK/Dd7BHggC00T0DS4X1psun94e7IeETsdeVLqNGVaGm+tOg31d+419uWeT4os4vHRcgv0FvHtY/kxfvHLbqHejx+ONOTWGpesJtJv0NH3x5N3oqQS3h1fzn2tYJp7AruPCX/gpZPbAue3eD9gtfdwBfVanP80Z1oZeB7hihRldPAgfligPgTprzqjJPnjewcydvfC/jFhZ6rLHOdqCwKP56dQ9BDNj6QNnZgkCbGBsF65yjGZ5z+BpGZrahUjXnuLeI1fge3uuWmPRJj8T0yA07HaH8Oh0z87e4KXF6FMBESiQww+Etu7+43EVIRncOcEvhPSVOCWEUiJeLI0Q0jHyqOahLC8899zPQZFWjPogKOKjqipJJRUObw6TkR/3RX8g6W9f9chULrFgtw8Six87pzBXqhKL9GB8N+j5faZQli5pq+VChhQkt8qa958LWvlXktQVtyvldC61quurqVy6XNkukr+/61KhrPBMplgAAAAASUVORK5CYII=");
		}
	}
	.hongdian {
		width: 20upx;
		height: 20upx;
		background-color: #e54d42;
		border-radius: 50%;
	}
</style>

<template>
    <view class="content">
        <cu-custom>
            <block slot="content">
                <view class="">消息</view>
            </block>
        </cu-custom>
        <view class="padding-top-xs padding-bottom">
            <view class="padding-lr-sm padding-tb-xs shadow-lg"
                  v-for="(item,index) in paramData.records" :key="index" @tap="hrefSave(item, '/pages/article/messageDetails')">
                <view class="bg-white padding radius-df flex justify-between align-center">
                    <view class="box-icon icon1"></view>
                    <view class="margin-left flex-sub">
                        <view class="flex justify-between align-center">
                            <view class="text-df text-bold text-black">
                                {{item.title}}
                            </view>
                            <view class="text-df text-gray-C1C1C1">
                                {{item.sendTime}}
                            </view>
                        </view>
                        <view class="flex justify-between align-start margin-top-xs">
                            <view class="text-content">
                                <view class="">
                                    {{item.msgContent}}
                                </view>
                                <view class="text-red">点击查看</view>
                            </view>
                            <view class="hongdian margin-left" v-if="item.readFlag == 0"></view>
                        </view>
                    </view>
                </view>
            </view>
            <mixLoadMore :status="paramLoca.loadMoreStatus"></mixLoadMore>
        </view>
    </view>
</template>

<script>
import mixLoadMore from "@/components/mix-load-more/mix-load-more"
export default {
    components: {mixLoadMore},
    data() {
        return {
            paramForm: {
                page: 10,
            },
            paramData: {
                records: {},
            },
            paramLoca: {
                loadMoreStatus: 0,
            }
        }
    },
    onLoad(e) {
        const that = this
        this.init(this)
    },
    onShow() {
    },
    methods: {
        init() {

        },
        onPullDownRefresh() {
            console.log('refresh')
            this.init()
        },
        onReachBottom() {
            console.log('onReachBottom')
            this.init()
        },
    },
}
</script>
