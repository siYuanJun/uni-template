<template>
    <view>
        <xkq-canvas @tempFilePath="tempFilePath" :canvasSize="canvasSize" :cancasImgs="cancasImgs" :fonts="fonts"
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
                    left: 190,
                    top: 355,
                    width: 220,
                    height: 220
                }],
                fonts: [{
                    font: '推荐一个我超满意的职位给你',
                    site: 26,
                    color: '#607185',
                    left: 300,
                    top: 80,
                    textAlign: 'center',
                    fontW: ''
                }, {
                    font: '快来看看吧～',
                    site: 26,
                    color: '#607185',
                    left: 300,
                    top: 120,
                    textAlign: 'center',
                    fontW: ''
                }, {
                    font: '大客户销售',
                    site: 10,
                    color: '#071329',
                    left: 305,
                    top: 230,
                    textAlign: 'center',
                    fontW: 'normal bold 28rpx SourceHanSansCN-Bold'
                }, {
                    font: '10k-15k',
                    site: 10,
                    color: '#F36B14',
                    left: 305,
                    top: 300,
                    textAlign: 'center',
                    fontW: 'normal bold 22rpx SourceHanSansCN-Bold'
                }, {
                    font: '长按识别小程序，了解详情',
                    site: 24,
                    color: '#607185',
                    left: 320,
                    top: 640,
                    textAlign: 'center',
                    fontW: ''
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
                this.fonts[2].font = this.taskShareData.title
                this.fonts[3].font = this.taskShareData.simple_salary
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
