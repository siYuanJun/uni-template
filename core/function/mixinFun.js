export default {
    
    uPickerChange(e, field) {
        console.log(field, e)

        let item = e.value[0]
        this.paramForm[field] = item.value
        this.$set(this.paramForm, '_' + field, item.text)

        this.uPickerClose(field)
    },

    uPickerDateChange(e, field) {
        console.log(field, e)

        let time = e.value
        let date = new Date(time);

        let dateTime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

        this.paramForm[field] = dateTime
        console.log(this.paramForm, dateTime)

        this.uPickerClose(field)
    },

    uPickerClose(field) {
        this.pickerModel[field] = !this.pickerModel[field]
    },

    setStaticImage(staticUrl) {
        let isBug = this.$sys.$config.debug

        return isBug ? staticUrl : (this.$baseUrlStatic + '/static/' + staticUrl)
    },
    isLogin() {
        if(this.getu('userId')) {
            return true
        } else {
            return false
        }
    },
    getu(field) {
        const userinfo = uni.getStorageSync("userInfo") || {};

        let user = userinfo.user || {}
        user.avatar = user.avatar || '/static/images/avatar-1.png'

        return field ? user[field] : user;
    },
    seleChange(e, field) {
        console.log(field, e)
        let value = e.detail.value

        let seleData = this.paramSele[field]

        if (this.paramSele[field]) {
            this.paramForm[field] = seleData[value].value
            this.$set(this.paramForm, '_' + field, seleData[value].label)
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
        if (birth) {
            let dqbirth = new Date()
            let births = new Date(birth)
            return dqbirth.getFullYear() - births.getFullYear() + '岁'
        } else {
            return ''
        }
    },
    hrefNavigateTo(url) {
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
