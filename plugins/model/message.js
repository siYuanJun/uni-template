
export default {
    getMessage(uid) {
        if (!uid) {
            return
        }
        if (uni.getStorageSync('notificationID') == '') {
            let notificationID = setInterval(res => {
                this.getNotificationIndex()
            }, 5000)
            console.log("mixin->创建消息定时器", notificationID)
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
}
