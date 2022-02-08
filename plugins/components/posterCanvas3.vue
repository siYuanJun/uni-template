<template>
    <view>
        <xkq-canvas @tempFilePath="tempFilePath" canvasId="myCanvas3" :canvasSize="canvasSize" :cancasImgs="cancasImgs" :fonts="fonts"
            :title="title" ref="canvasRef">
            <!-- <view class="flex margin-top-xxl">
                <button class="cu-btn bg-theme text-white lg flex-sub" @click="builderPic()">保存图片</button>
            </view> -->
        </xkq-canvas>
    </view>
</template>

<script>

    export default {
        components: {},
        props: {
            taskShareData: {
                type: Object,
                default: () => {
                    return {}
                }
            },
            taskShareImg: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                canvasSize: {
                    width: 600,
                    height: 700
                },
                title: [],
                cancasImgs: [{
                    img: this.$baseStatic + '/static/images/xcx-ever-big.png',
                    // img: '',
                    left: 150,
                    top: 40,
                    width: 300,
                    height: 300
                }, {
                    img: this.$baseStatic + '/static/images/hui-canvas-1.png',
                    // img: '',
                    left: 0,
                    top: 480,
                    width: 600,
                    height: 220
                }],
                fonts: [{
                    font: '长按识别小程序码',
                    site: 24,
                    color: '#607185',
                    left: 300,
                    top: 390,
                    textAlign: 'center',
                    fontW: ''
                }, {
                    font: '大客户销售',
                    site: 10,
                    color: '#071329',
                    left: 305,
                    top: 630,
                    textAlign: 'center',
                    fontW: 'normal bold 26rpx SourceHanSansCN-Bold'
                }, {
                    font: '10k-15k',
                    site: 10,
                    color: '#F36B14',
                    left: 305,
                    top: 550,
                    textAlign: 'center',
                    fontW: 'normal bold 28rpx SourceHanSansCN-Bold'
                }]
            }
        },
        watch: {
            taskShareImg(val) {
                this.shareCanvas()
            }
        },
        mounted() {
            if(this.taskShareImg) {
                this.shareCanvas()
            }
        },
        methods: {
            builderPic() {
                // 生成图片
                this.$refs.canvasRef.canvasToTempFilePath()
            },

            tempFilePath(res) {
                console.log("生成图片触发后返回的图片路径", res)
                this.$tools.downSaveImage(res)
            },

            shareCanvas() {
                this.fonts[1].font = this.taskShareData.title
                this.fonts[2].font = this.taskShareData.simple_salary
                this.cancasImgs[0].img = this.taskShareImg

                // 生成画布
                setTimeout(() => {
                    this.$refs.canvasRef.draw()
                }, 300)
            }
        }
    }
</script>

<style lang="scss">

</style>
