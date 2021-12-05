<template>
    <view class="">
        <cu-custom>
            <block slot="content">
                <view class="">华中人才</view>
            </block>
        </cu-custom>
        <view class="">
            <view class="padding-sm bg-white text-df flex align-center justify-between">
                <view class="text-theme">
                    企业当前的状态为：经营中
                </view>
                <view class="text-gray-607185 text-sm">
                    [重新认证]
                </view>
            </view>
            <view class="padding-sm">
                <view class="padding-top-sm padding-bottom-sm text-df">
                    <text class="text-black-071329">面试通知量</text>
                    <text class="text-black-071329 text-bold padding-left">30</text>
                </view>
                <view class="bg-white radius-df">
                    <view class="charts-box padding-top padding-bottom-sm padding-right-sm">
                        <!-- <qiun-loading></qiun-loading> -->
                        <qiun-data-charts type="line" :opts="{extra:{line:{type:'curve'}}}" :eopts="{seriesTemplate:{smooth:true}}" :chartData="chartData" />
                    </view>
                </view>
            </view>
            <view class="padding-sm grid col-2">
                <view class="">
                    <view class="margin-right-xs bg-white radius-df">
                       <view class="padding-lr padding-tb-sm flex align-center">
                           <view class="margin-right">
                               <image class="icon-df" src="../static/images/zw-icon.png" mode="aspectFit"></image>
                           </view>
                           <view class="text-black-071329 text-lg text-bold">
                               项目管理
                           </view>
                       </view>
                   </view>
                </view>
                <view class="">
                    <view class="margin-left-xs bg-white radius-df">
                       <view class="padding-lr padding-tb-sm flex align-center">
                           <view class="margin-right">
                               <image class="icon-df" src="../static/images/msgl-icon.png" mode="aspectFit"></image>
                           </view>
                           <view class="text-black-071329 text-lg text-bold">
                               面试管理
                           </view>
                       </view>
                   </view>
                </view>
                <view class="margin-top-sm">
                    <view class="margin-right-xs bg-white radius-df">
                       <view class="padding-lr padding-tb-sm flex align-center">
                           <view class="margin-right">
                               <image class="icon-df" src="../static/images/fx-icon.png" mode="aspectFit"></image>
                           </view>
                           <view class="text-black-071329 text-lg text-bold">
                               分享模版
                           </view>
                       </view>
                   </view>
                </view>
                <view class="margin-top-sm">
                    <view class="margin-left-xs bg-white radius-df">
                       <view class="padding-lr padding-tb-sm flex align-center">
                           <view class="margin-right">
                               <image class="icon-df" src="../static/images/wdxm-icon.png" mode="aspectFit"></image>
                           </view>
                           <view class="text-black-071329 text-lg text-bold">
                               我的项目
                           </view>
                       </view>
                   </view>
                </view>
                <view class="margin-top-sm">
                    <view class="margin-right-xs bg-white radius-df">
                       <view class="padding-lr padding-tb-sm flex align-center">
                           <view class="margin-right">
                               <image class="icon-df" src="../static/images/xmsc-icon.png" mode="aspectFit"></image>
                           </view>
                           <view class="text-black-071329 text-lg text-bold">
                               项目市场
                           </view>
                       </view>
                   </view>
                </view>
                <view class="margin-top-sm">
                    <view class="margin-left-xs bg-white radius-df">
                       <view class="padding-lr padding-tb-sm flex align-center">
                           <view class="margin-right">
                               <image class="icon-df" src="../static/images/rsgl-icon.png" mode="aspectFit"></image>
                           </view>
                           <view class="text-black-071329 text-lg text-bold">
                               人事管理
                           </view>
                       </view>
                   </view>
                </view>
            </view>
        </view>
        <cuFooter PageCur="workbench"></cuFooter>
    </view>
</template>

<script>
    export default {
        components: {},
        data() {
            return {
                paramData: {},
                paramForm: {},
                paramLoca: {},
                chartData: {
                    "categories": ["2012", "2013", "2014", "2015", "2016", "2017"],
                    "series": [{
                        "name": "数量",
                        "data": [35, 8, 25, 37, 4, 20]
                    }]
                }
            }
        },
        onLoad() {},
        methods: {
            async getData() {
                const that = this
                const result = await that.$tools.requests(that, that.$routes.api_index, that.parmdata)
                console.log(result)
                // uni.setNavigationBarTitle({
                // 	title: res.name
                // })
            },
            onPullDownRefresh() {
                console.log('refresh')
            },
            onReachBottom() {
                console.log('onReachBottom')
            },
        },
    }
</script>
<style lang="less">
    body,
    page {
        background-color: #f8f8f8;
    }
    .icon-df {
        width: 70upx;
        height: 70upx;
    }
    .charts-box {
        height: 480upx;
    }
</style>
