<template>
    <u-mask :show="show">
        <view class="warp">
            <u-icon name="close" color="#fff" @click="close"></u-icon>
            <h3>发现新版本<span v-text="version"></span></h3>
            <view class="scrollWarp">
                <u-line-progress v-if="showPercent" :active-color="activeColor" :percent="current"></u-line-progress>
                <scroll-view scroll-y="true">
                    本次升级内容：<br>
                    <span v-text="comment"></span>
                </scroll-view>
            </view>
            <view class="start-answer" @tap="AndroidCheckUpdate">立即更新</view>
        </view>
    </u-mask>
</template>

<script>
import { getVersion } from '@/api/common.js'
export default {
    data() {
        return {
            show: false,
            url: '',
            content: '',
            type: '2',
            title: '',
            showPercent: false,
            disabled: false,
            current: 0,
            confirmText: '升级',
            activeColor: '#2979ff',
            isAuto: false,
            comment: '',
            version: '',
            plusInfo: {},
        }
    },
    mounted() {
        this.plusInfo = uni.getSystemInfoSync()
        this.init()
    },
    methods: {
        init() {
            getVersion().then((res) => {
                this.comment = res.comment
                this.version = res.version
                this.url = this.$baseApi + res.appPath
                const oldVersion = plus.runtime.version
                // let oldVersion = '0.0.0'
                const newVersion = res.version
                const oldList = oldVersion.split('.')
                const newList = newVersion.split('.')
                let temp = false
                for (let i = 0; i < oldList.length; i++) {
                    if (Number.parseInt(oldList[i]) < Number.parseInt(newList[i])) {
                        temp = true
                        break
                    }
                }
                if (this.plusInfo.platform === 'android') {
                    this.show = temp
                } else {
                    return
                    // const appleId = 146691123123
                    // plus.runtime.launchApplication(
                    //     {
                    //         action: `itms-apps://itunes.apple.com/cn/app/id${appleId}?mt=8`,
                    //     },
                    //     function (e) {
                    //         console.log(`Open system default browser failed: ${e.message}`)
                    //     },
                    // )
                }

                this.$emit('getVersion', temp)
            })
        },
        close() {
            this.show = false
            this.$emit('getVersion', false)
        },
        cancel() {
            this.closeModal()
        },
        confirm() {
            if (this.disabled) {
                return
            }
            this.disabled = true

            if (!this.isAuto) {
                this.showTitle()
            } else {
                this.AndroidCheckUpdate()
                this.continueDown()
            }
        },
        closeModal() {
            uni.navigateBack()
        },
        showTitle() {
            this.showContent = false
            if (plus.networkinfo.getCurrentType() != 3) {
                this.isAuto = true
                this.confirmText = '继续升级'
                this.title = '有新的版本发布，检测到您目前非Wifi连接，为节约您的流量，程序已停止自动更新，将在您连接WIFI之后重新检测更新。'
            } else {
                this.isAuto = false
                this.AndroidCheckUpdate()
                this.title = '有新的版本发布，检测到您目前为Wifi连接，程序已启动自动更新。新版本下载完成后将自动弹出安装程序。'
                this.continueDown()
            }
        },
        AndroidCheckUpdate() {
            if (this.showPercent) return
            this.showPercent = true
            const that = this
            this.dtask = plus.downloader.createDownload(this.url, {}, (d, status) => {
                // 下载完成
                if (status == 200) {
                    plus.runtime.install(plus.io.convertLocalFileSystemURL(d.filename), {}, {}, (error) => {
                        uni.showToast({
                            title: '安装失败',
                            mask: false,
                            duration: 1500,
                        })
                    })
                    that.exit()
                } else {
                    uni.showToast({
                        title: '更新失败',
                        mask: false,
                        duration: 1500,
                    })
                }
            })
            this.dtask.start()
            // dtask.abort(); 中断下载
            this.dtask.addEventListener('statechanged', (task, status) => {
                switch (task.state) {
                case 1: // 开始
                    break
                case 2: // 已连接到服务器
                    break
                case 3: // 已接收到数据
                    that.current = parseInt((100 * task.downloadedSize) / task.totalSize)
                    if (that.current >= 20) {
                        that.activeColor = '#fcbd71'
                    }
                    if (that.current >= 50) {
                        that.activeColor = 'orange'
                    }
                    if (that.current >= 90) {
                        that.activeColor = '#19be6b'
                    }
                    break
                case 4: // 下载完成
                    break
                default:
                    break
                }
            })
        },
        // 退出程序
        exit() {
            plus.runtime.quit()
        },

        // 继续下载
        continueDown() {
            this.dtask.start()
        },
    },
}
</script>

<style scoped lang="scss">
@import 'uview-ui/libs/css/style.components.scss';

/deep/ .warp {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60%;
    width: 80%;
    margin: 30% auto;
    position: relative;
    background-image: url(/static/img/update-img.png);
    background-repeat: no-repeat;
    background-size: 100%;
    border-radius: 30rpx;
}

/deep/ h3 {
    position: absolute;
    top: 350rpx;
}

/deep/ .u-icon {
    position: absolute;
    right: 30rpx;
    top: 80rpx;
}

/deep/ .scrollWarp {
    height: 30%;
    width: 75%;
    overflow: scroll;
    position: absolute;
    top: 430rpx;
}

.start-answer {
    background: #ffb622;
    width: 50%;
    margin: 0 auto;
    color: #ffffff;
    border-radius: #{50rpx};
    text-align: center;
    line-height: #{72rpx};

    position: absolute;
    bottom: 50rpx;
}

.u-full-content {
    background-color: #00c777;
}

.u-update-content {
    font-size: 26rpx;
    color: $u-content-color;
    line-height: 1.7;
    padding: 30rpx;
    max-height: 1000rpx;
}
</style>
