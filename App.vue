<script>
import Vue from 'vue'
export default {
    onLaunch() {
        uni.getSystemInfo({
            success: (e) => {
                // #ifndef MP
                Vue.prototype.StatusBar = e.statusBarHeight
                if (e.platform == 'android') {
                    Vue.prototype.CustomBar = e.statusBarHeight + 50
                } else {
                    Vue.prototype.CustomBar = e.statusBarHeight + 45
                }
                // #endif

                // #ifdef MP-WEIXIN
                Vue.prototype.StatusBar = e.statusBarHeight
                const custom = uni.getMenuButtonBoundingClientRect()
                Vue.prototype.Custom = custom
                Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight
                // #endif

                // #ifdef MP-ALIPAY
                Vue.prototype.StatusBar = e.statusBarHeight
                Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight
                // #endif
            },
        })
    },
    onShow() {
        console.log('App Show')
        // #ifdef MP-WEIXIN
        if (uni.canIUse('getUpdateManager')) {
            const updateManager = uni.getUpdateManager()
            updateManager.onCheckForUpdate(function (res) {
                // 请求完新版本信息的回调
                if (res.hasUpdate) {
                    updateManager.onUpdateReady(function () {
                        uni.showModal({
                            title: '更新提示',
                            content: '新版本已经准备好，请重启应用！',
                            showCancel: false,
                            success: (res) => {
                                // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
                                if (res.confirm) {
                                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                    updateManager.applyUpdate()
                                }
                            },
                        })
                    })
                    updateManager.onUpdateFailed(() => {
                        // 新的版本下载失败
                        uni.showModal({
                            title: '已经有新版本了哟~',
                            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
                        })
                    })
                }
            })
        }
        // #endif
    },
    onHide() {
        console.log('App Hide')
    },
}
</script>

<style lang="less">
/*每个页面公共css */
@import './components/colorui/main.css';
@import './components/colorui/icon.css';
@import './components/colorui/animation.css';
@import './static/css/common.less';
</style>
