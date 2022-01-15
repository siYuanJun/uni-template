import uniCopy from "@/js_sdk/xb-copy/uni-copy";
import {
    judgePermission
} from '@/common/permission'

export default {
    data() {
        return {
            $baseUrl: this.$baseUrl,
            $baseStatic: this.$baseStatic,
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
        setTaskField(item) {
            item._type = this.extConfig.postType[item.type]
            item._experience = this.extConfig.experience[item.experience]
            item._edu_level = this.extConfig.eduLevel[item.edu_level]

            if(item.company_info) {
                item.company_info._logo = this.setImgUrl(item.company_info.logo)
            } else {
                item.company_info = {}
            }

            return item
        },
        getFuck(scan_url, name) {
            var reg = new RegExp("[^\?&]?" + encodeURI(name) + "=[^&]+");
            var arr = scan_url.match(reg);
            if (arr != null) {
                return decodeURI(arr[0].substring(arr[0].search("=") + 1));
            }
            return "";
        },
        getUserInfo() {
            let userInfo = uni.getStorageSync("userInfo")
            userInfo = ''
            if (userInfo) {
                this.userInfo = userInfo
                this.$tools.dd("缓存中用户信息", userInfo)
            } else {
                this.getUserDataApi()
            }
        },
        getNotificationIndex() {
            this.$tools.requests(this.$routes.api_auth_notification_index, this.paramForm, 'post').then(res => {
                let data = res.data.data
                this.messageData = data
                this.messageNum = data.see_true_num
                if (this.messageNum) {
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
        getExtConfig() {
            let extConfig = uni.getStorageSync("extConfig")
            // extConfig = ''
            if (extConfig) {
                this.$tools.dd("初始化缓存数据", JSON.stringify(extConfig))
                this.extConfig = extConfig;
            } else {
                this.getExtConfigApi()
            }
            return this.extConfig
        },
        getExtConfigApi() {
            statusMap().then(res => {
                this.extConfig = res.data.data;
                this.$tools.dd("初始化请求数据", JSON.stringify(this.extConfig))
                uni.setStorageSync("extConfig", this.extConfig)
            })
        },
        getUserDataApi() {
            return userInfoApi().then(res => {
                if (!res) {
                    return
                }
                try {
                    let data = res.data.data
                    if(!data) {
                        return
                    }
                    this.$tools.dd("请求获取用户信息", data)

                    this.userInfo = data
                    uni.setStorageSync("userInfo", data)
                    return res

                } catch (e) {
                    console.log(e)
                    //TODO handle the exception
                }
            })
        },
        getBirth(birth) {
            if(birth) {
                let dqbirth = new Date()
                let births = new Date(birth)
                return dqbirth.getFullYear() - births.getFullYear() + '岁'
            } else {
                return ''
            }
        },
        setImgUrl(src) {
            if(src) {
                let newStr = src.indexOf("http")

                if(newStr == 0) {
                    return src
                } else {
                    return this.$baseUrl + src
                }
            } else {
                return this.$baseUrl + '/avatar.png'
            }
        },
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
        userPhoneNumber(phone) {
            phone = "" + phone;
            var reg = /(\d{3})\d{4}(\d{4})/; //正则表达式
            return phone.replace(reg, "$1****$2")
        }
    }
};
