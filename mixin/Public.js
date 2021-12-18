import uniCopy from "@/js_sdk/xb-copy/uni-copy";
import {
    judgePermission
} from '@/common/permission'

export default {
    data() {
        return {
            extConfig: {},
            messageNum: 0,
            messageData: []
        };
    },
    onLoad() {
        this.getExtConfig()
    },
    onShow() {
        if (this.getu('id')) {
            // if (!uni.getStorageSync('notificationID')) {
            //     let notificationID = setInterval(res => {
            //         this.getNotificationIndex()
            //     }, 5000)
            //     console.log("mixin->创建消息定时器", notificationID)
            //     uni.setStorageSync('notificationID', notificationID)
            // } else {
            //     let notificationID = uni.getStorageSync('notificationID')
            //     console.log("mixin->销毁消息定时器", notificationID)
            //     clearInterval(notificationID)
            //     uni.removeStorageSync('notificationID')
            // }
        }
    },
    methods: {
        getNotificationIndex() {
            this.$tools.requests(this.$routes.api_auth_notification_index, this.paramForm, 'post').then(res => {
                let data = res.data.data
                this.messageData = data
                this.messageNum = data.see_true_num
                if(this.messageNum) {
                    uni.setTabBarBadge({
                        index: 2,
                        text: this.messageNum.toString()
                    });
                }
            })
        },
        getDateFull() {
            let date = new Date();
            let y = date.getFullYear();
            let m = date.getMonth() + 1;
            let d = date.getDate();
            return y + "-" + this.dateFormatNum(m) + "-" + this.dateFormatNum(d)
        },
        dateFormatNum(num) {
            let res = Number(num);
            return res < 10 ? '0' + res : res;
        },
        async getAddress(call) {
            // #ifdef APP-PLUS
            judgePermission('location')
            // #endif
            this.$tools.dd("开始定位")
            let location = await this.$tools.getLocation()
            this.$tools.dd("定位", location)
            let result = await this.$tools.getRegeoWeb(location.longitude + "," + location.latitude)
            this.$tools.dd("转换中文", result)

            try {
                call(result.regeocode.formatted_address)
            } catch (e) {
                this.$tools.dd("定位失败", e)
            }
        },
        getExtConfig() {
            let extConfig = uni.getStorageSync("extConfig")
            // extConfig = ''
            if (extConfig) {
                this.extConfig = extConfig;
            } else {
                this.$tools.requests(this.$routes.api_extConfig).then(res => {
                    this.extConfig = res.data.data;
                    this.$tools.dd("获取配置初始化数据", this.extConfig)
                    uni.setStorageSync("extConfig", this.extConfig)
                })
            }
            return this.extConfig
        },
        getUserInfo() {
            let extConfig = uni.getStorageSync("userInfo")
            // extConfig = ''
            if (extConfig) {
                this.userInfo = extConfig
                this.$tools.dd("缓存中用户信息", extConfig)
            } else {
                this.$tools.requests(this.$routes.api_auth_user, {}, 'post').then(res => {
                    let data = res.data.data
                    data._invitation_code = data.invitation_code.split('')
                    this.$tools.dd("用户信息", data)
                    this.userInfo = data ?? {}
                    uni.setStorageSync("userInfo", data)
                })
            }
        },
        islogin() {
            if (!this.getu('id')) {
                uni.reLaunch({
                    url: "/pages/public/login"
                })
                return
            }
        },
        getu(field) {
            let userinfo = uni.getStorageSync("userInfo") ?? {};
            if (field) {
                return userinfo[field];
            }
            return userinfo;
        },
        href(url) {
            uni.navigateTo({
                url: url,
                fail: (err) => {
                    console.log(err)
                }
            });
        },
        swithref(url) {
            console.log(url)
            uni.switchTab({
                url: url
            });
        },
        redirectTo(url) {
            uni.redirectTo({
                url: url
            });
        },
        // 缓存数据跳转
        hrefSave(json, url) {
            uni.setStorage({
                key: "content",
                data: json,
                success: function() {
                    uni.navigateTo({
                        url: url
                    });
                }
            });
        },
        hrefBack() {
            uni.navigateBack({})
        },
        copyGet(content) {
            uniCopy({
                content: content,
                success: (res) => {
                    uni.showToast({
                        title: res,
                        icon: "none"
                    });
                },
                error: (e) => {
                    uni.showToast({
                        title: e,
                        icon: "none",
                        duration: 3000
                    });
                }
            });
        },
        phoneGet(phone) {
            uni.makePhoneCall({
                phoneNumber: phone
            });
        },
    }
};
