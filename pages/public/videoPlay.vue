<template>
    <view class="">
        <cu-custom bgColor="bg-white" :isBack="true">
            <block slot="content">
                <view class="text-df text-black">{{ title }}</view>
            </block>
        </cu-custom>
        <view class="parse-content">
            <!-- <video class="videoDom" :src="paramData.url" id="video1" :controls="true" :show-fullscreen-btn="false" object-fit="fill"
			:style="'width: 100%; height: calc(100vh - '+videoHeight+'px);'"></video> -->
            <yy-video-player
                class="videoDom"
                :auto-play="true"
                :url="paramData.url"
                :poster="''"
                :danmu-list="[]"
                :showDownloadBtn="false"
                :show-back-btn="false"
                :style="'width: 100%; height: calc(100vh - ' + videoHeight + 'px);'"
            ></yy-video-player>
        </view>
    </view>
</template>

<script>
import yyVideoPlayer from '@/components/yy-video-player/yy-video-player.nvue';

export default {
    components: {
        yyVideoPlayer,
    },
    data() {
        return {
            title: '视频',
            paramForm: {},
            paramData: {
                url: '',
            },
            paramLoca: {},
            videoHeight: '',
            CustomBar: this.CustomBar,
            StatusBar: this.StatusBar,
        };
    },
    onLoad(e) {
        console.log(e);
        const that = this;
        uni.getStorage({
            key: 'content',
            success(res) {
                that.paramData.url = res.data;
            },
        });
        this.videoHeight = this.CustomBar;
    },
    methods: {},
};
</script>

<style lang="less">
.parse-content {
	width: 100%;
}
.videoDom {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
}
</style>
