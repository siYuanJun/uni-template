
export default {
    getu(field) {
        let userinfo = uni.getStorageSync("userInfo") || {};

        return field ? userinfo[field] : userinfo;
    },
    getMessage(uid) {
        if (!this.getu('id')) {
            return
        }

        if (!uni.getStorageSync('notificationID')) {
            let notificationID = setInterval(res => {
                this.getNotificationIndex()
            }, 5000)
            console.info("mixin创建消息定时器", notificationID)

            uni.setStorageSync('notificationID', notificationID)
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
    seleChange(e, field) {
        console.log(e)
        let value = e.detail.value

        let seleData = this.paramSele[field]

        if(this.paramSele[field]) {
            this.paramForm[field] = seleData[value].id
            this.$set(this.paramForm, '_' + field, seleData[value].title)
        } else {
            this.paramForm[field] = value
        }
    },
    getFuck(scan_url, name) {
        var reg = new RegExp("[^\?&]?" + encodeURI(name) + "=[^&]+");
        var arr = scan_url.match(reg);
        if (arr != null) {
            return decodeURI(arr[0].substring(arr[0].search("=") + 1));
        }
        return "";
    },
    getDateFull() {
        let date = new Date();
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        let d = date.getDate();

        return {
            full: y + "-" + this.dateFormatNum(m) + "-" + this.dateFormatNum(d),
            y,
            m,
            d
        }
    },
    dateFormatNum(num) {
        let res = Number(num);
        return res < 10 ? '0' + res : res;
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
    href(url) {
        uni.navigateTo({
            url: url,
            fail: (err) => {
                console.log(err)
            }
        });
    },
    swithref(url) {
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
        uni.navigateBack()
    },
    phoneGet(phone) {
        uni.makePhoneCall({
            phoneNumber: phone
        });
    }
}
