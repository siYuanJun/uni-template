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
    getUserDataApi() {
        let result = await userInfoApi()
        if (!result) {
            return {}
        }

        try {
            let data = result.data.data
            if(!data) {
                return
            }

            uni.setStorageSync("userInfo", data)
            return result

        } catch (e) {
            console.log(e)
        }
    },
    getUserInfo() {
        let userInfo = uni.getStorageSync("userInfo")
        userInfo = ''
        if (userInfo) {
            this.userInfo = userInfo
        } else {
            this.getUserDataApi()
        }
    },
}
