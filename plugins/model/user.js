import {userInfo as userInfoApi} from "@/api/auth.js"

export default {
    islogin() {
        if (!this.getu('id')) {
            uni.showModal({
                title: "温馨提示",
                content: "您还没有登录，请先登录!",
                cancelText: '取消',
                confirmText: '去登录',
                success: (res) => {
                    if (res.confirm) {
                        uni.reLaunch({
                            url: "/pagesA/user/login"
                        })
                    }
                }
            })
            return
        }
    },
    getu(field) {
        let userinfo = uni.getStorageSync("userInfo") || {};
        if (field) {
            return userinfo[field];
        }
        return userinfo;
    },
    async getUserInfo() {
        let userInfo = uni.getStorageSync("userInfo")
        userInfo = ''
        if (userInfo) {
            this.userInfo = userInfo
        } else {
            if(!this.getu('id')) {
                this.userInfo = {_avatar: this.$baseUrl + '/vendor/dcat-admin/images/avatar.png'}
                return
            }
            this.userInfo = await userInfoApi()
        }
    },
}
