import uniCopy from "@/js_sdk/xb-copy/uni-copy";

export default {
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
