import init from '@/common/config'
import uniCopy from '@/js_sdk/xb-copy/uni-copy'
const amapsdk = init.amapsdk
const http = init.http

export default {
    /*
     * 微信定位
     * @param that 当前页面this
     */
    getLocation(that) {
        return new Promise((resolve, reject) => {
            uni.getLocation({
                type: 'gcj02',
                success: (res) => {
                    resolve(res)
                },
                fail: function (e) {
                    reject(e)
                },
            })
        })
    },

    /*
     * Sdk通过高德地图获取地址详细信息
     * @param that 所在页面 this
     * @param option 经纬度 {location: froma.longitude + "," + froma.latitude}
     */
    getRegeo(that, option) {
        return new Promise((resolve, reject) => {
            amapsdk.getRegeo({
                ...option,
                success: function (data) {
                    resolve(data)
                },
                fail: function (e) {
                    reject(e)
                },
            })
        })
    },

    /*
     * Web通过高德地图获取地址详细信息
     * @param that 所在页面 this
     * @param option 经纬度 {location: froma.longitude + "," + froma.latitude}
     */
    getRegeoWeb(that, location) {
        var url = 'https://restapi.amap.com/v3/geocode/regeo?key=' + init.config.amapWebKey + '&location=' + location + '&poitype=&radius=1000&extensions=all&batch=false&roadlevel=0'
        return new Promise((resolve, reject) => {
            uni.request({
                url: url,
                method: 'get',
                data: {},
                success: (res) => {
                    resolve(res.data)
                },
                fail: (e) => {
                    reject(e)
                },
            })
        })
    },

    /*
     * 地址转经纬度
     * @param that 所在页面 this
     * @param address 地址名称
     */
    getGeoWeb(that, address) {
        var url = 'https://restapi.amap.com/v3/geocode/geo'
        return new Promise((resolve, reject) => {
            uni.request({
                url: url,
                method: 'get',
                data: {
                    key: init.config.amapWebKey,
                    address: address,
                },
                success: (res) => {
                    resolve(res.data)
                },
                fail: (e) => {
                    reject(e)
                },
            })
        })
    },

    /*
     * 高德地图调用地图路线规划接口
     * @param that 所在页面 this
     * @param froma 起点
     * @param toa 重点
     */
    directionFun(that, froma, toa) {
        console.log('获取路线规划')
        amapsdk.getDrivingRoute({
            //from参数不填默认当前地址
            origin: froma,
            destination: toa,
            extensions: 'base',
            success: function (data) {
                console.log(data)
                var paramLoca = {
                        map: {
                            latitude: '',
                            longitude: '',
                            polyline: [],
                            markers: [],
                        },
                    },
                    contentqd,
                    contentzd
                console.log('进行划线规划')
                var points = []
                if (data.paths && data.paths[0] && data.paths[0].steps) {
                    var steps = data.paths[0].steps
                    for (var i = 0; i < steps.length; i++) {
                        var poLen = steps[i].polyline.split(';')
                        for (var j = 0; j < poLen.length; j++) {
                            points.push({
                                longitude: parseFloat(poLen[j].split(',')[0]),
                                latitude: parseFloat(poLen[j].split(',')[1]),
                            })
                        }
                    }
                }
                console.log(points.length)
                var latlong = Math.round((points.length / 5) * 4)
                // console.log(latlong)
                paramLoca.map.scale = points.length > 1000 ? 6 : 10
                //设置polyline属性，将路线显示出来,计算出中心点坐标
                paramLoca.map.latitude = points[latlong].latitude
                paramLoca.map.longitude = points[latlong].longitude
                // 配置行程信息线条样式
                contentqd = that.paramData.qidian
                contentzd = that.paramData.zhongdian
                paramLoca.map.polyline = [
                    {
                        points: points,
                        color: '#FF5146',
                        borderColor: '#FF5146',
                        width: 8,
                        arrowLine: true,
                    },
                ]
                // 配置起点终点
                paramLoca.map.markers = [
                    {
                        id: 1,
                        title: '起点：',
                        latitude: points[0].latitude,
                        longitude: points[0].longitude,
                        iconPath: '/static/images/dangqian-weizhi.png',
                        callout: {
                            content: '起点: ' + contentqd,
                            color: '#2c2c2c',
                            fontSize: '12',
                            borderRadius: '3',
                            bgColor: '#ffffff',
                            padding: '10',
                            textAlign: 'center',
                        },
                    },
                    {
                        id: 2,
                        latitude: points.slice(-1)[0].latitude,
                        longitude: points.slice(-1)[0].longitude,
                        title: '终点',
                        iconPath: '/static/images/biaodian.png',
                        callout: {
                            content: '终点: ' + contentzd,
                            color: '#2c2c2c',
                            fontSize: '12',
                            borderRadius: '3',
                            bgColor: '#ffffff',
                            padding: '10',
                            textAlign: 'center',
                        },
                    },
                ]
                that.paramLoca = paramLoca
                uni.hideLoading({})
            },
            fail: function (error) {
                console.log('获取失败，调用弹框打开授权配置')
            },
            complete: function (res) {},
        })
    },

    /*
     * 多点位地图路线规划接口
     * @param that 所在页面 this
     * @param froma 起点
     * @param toa 重点
     */
    directionFunBatch(that, froma, toa) {
        console.log('获取路线规划')
        return new Promise((resolve, reject) => {
            amapsdk.getDrivingRoute({
                //from参数不填默认当前地址
                origin: froma,
                destination: toa,
                extensions: 'base',
                success: function (data) {
                    console.log('进行划线规划')
                    var paramLoca = {
                        map: {
                            scale: 10,
                            latitude: '',
                            longitude: '',
                            polyline: [],
                        },
                    }
                    var points = []
                    if (data.paths && data.paths[0] && data.paths[0].steps) {
                        var steps = data.paths[0].steps
                        for (var i = 0; i < steps.length; i++) {
                            var poLen = steps[i].polyline.split(';')
                            for (var j = 0; j < poLen.length; j++) {
                                points.push({
                                    longitude: parseFloat(poLen[j].split(',')[0]),
                                    latitude: parseFloat(poLen[j].split(',')[1]),
                                })
                            }
                        }
                    }
                    var latlong = Math.round((points.length / 5) * 4)
                    console.log(points.length)
                    if (points.length > 1500) {
                        paramLoca.map.scale = 6
                    }
                    if (points.length > 4000) {
                        paramLoca.map.scale = 4
                    }
                    //设置polyline属性，将路线显示出来,计算出中心点坐标
                    paramLoca.map.latitude = points[latlong].latitude
                    paramLoca.map.longitude = points[latlong].longitude
                    // 配置行程信息线条样式
                    paramLoca.map.polyline = {
                        points: points,
                        color: '#FF5146',
                        borderColor: '#FF5146',
                        width: 8,
                        arrowLine: true,
                    }
                    resolve(paramLoca)
                },
                fail: function (error) {
                    console.log('获取失败，调用弹框打开授权配置')
                },
                complete: function (res) {},
            })
        })
    },

    /*
     * 七牛云图片上传
     * @param num 上传数量
     * @param callback => res {} 回调
     */
    uploadImage(num, callback) {
        uni.chooseImage({
            count: num,
            sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
            success: (res) => {
                uni.showLoading({
                    title: '上传中...',
                })
                let tempFilePaths = res.tempFilePaths
                console.log(tempFilePaths)
                //获取token
                uni.request({
                    url: init.config.baseUrl + '/oss/getOssToken',
                    success(resto) {
                        var data = resto.data
                        for (var i = 0; i < tempFilePaths.length; i++) {
                            uni.uploadFile({
                                url: 'https://up.qbox.me', //华东地区用这个
                                filePath: tempFilePaths[i],
                                name: 'file',
                                formData: {
                                    key: 'xiehuo_' + Math.round(new Date() / 1000),
                                    token: data.result,
                                },
                                success: (uploadFileRes) => {
                                    console.log(uploadFileRes)
                                    var data = JSON.parse(uploadFileRes.data)
                                    // qiniuUrl 是自己七牛的前缀
                                    callback({
                                        pic: init.config.qiniuUrl + data.key,
                                        ...data,
                                    })
                                },
                                fail: (error) => {
                                    if (error && error.response) {
                                        console.log(error)
                                    }
                                },
                                complete: () => {
                                    setTimeout(function () {
                                        uni.hideLoading()
                                    }, 250)
                                },
                            })
                        }
                    },
                })
            },
        })
    },

    /*
     * 表单图片上传
     * @param that 所在页面 this
     * @param num 上传数量
     * @param callback => res {} 回调
     */
    uploadImageForm(that, num, callback) {
        uni.chooseImage({
            count: num,
            sourceType: ['camera'],
            sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
            success: (res) => {
                console.log('上传图片列表', res)
                uni.showLoading({
                    title: '上传中...',
                })
                let tempFilePaths = res.tempFilePaths
                let uploadImgCount = 0
                tempFilePaths.map(async (item) => {
                    uni.uploadFile({
                        url: init.config.baseUrl + that.routes.api_uploadFile,
                        filePath: item,
                        name: 'file',
                        header: {
                            'content-type': 'application/x-www-form-urlencoded',
                        },
                        formData: {
                            token: uni.getStorageSync('token'),
                        },
                        success: function (res) {
                            uploadImgCount++
                            res = JSON.parse(res.data)
                            that.dd('上传图片请求', res)
                            callback(res)
                            //如果是最后一张,则隐藏等待中
                            if (uploadImgCount === tempFilePaths.length) {
                                uni.hideLoading()
                            }
                        },
                        fail: function (err) {
                            that.dd('上传图片请求', err, 2)
                            uni.hideLoading()
                            uni.showModal({
                                title: '超时提示',
                                content: '上传图片失败',
                                showCancel: false,
                                success: function (res) {},
                            })
                        },
                    })
                })
            },
        })
    },

    /*
     * 打开第三方地图 [实用]
     * @param latitude 终点纬度
     * @param longitude 终点经度
     * @param name 终点名称
     */
    openMapApp(latitude, longitude, name) {
        //#ifndef APP-PLUS
        uni.showToast({
            title: '请APP操作',
            icon: 'none',
        })
        return
        //#endif
        let url = ''
        if (plus.os.name == 'Android') {
            let hasBaiduMap = plus.runtime.isApplicationExist({
                pname: 'com.baidu.BaiduMap',
                action: 'baidumap://',
            })
            let hasAmap = plus.runtime.isApplicationExist({
                pname: 'com.autonavi.minimap',
                action: 'androidamap://',
            })
            let urlBaiduMap = `baidumap://map/marker?location=${latitude},${longitude}&title=${name}&coord_type=gcj02&src=andr.baidu.openAPIdemo`
            urlBaiduMap = encodeURI(urlBaiduMap)
            let urlAmap = `androidamap://viewMap?sourceApplication=appname&poiname=${name}&lat=${latitude}&lon=${longitude}&dev=0`
            urlAmap = encodeURI(urlAmap)
            console.log('urlAmap: ' + urlAmap)
            console.log('urlBaiduMap: ' + urlBaiduMap)
            if (hasAmap && hasBaiduMap) {
                plus.nativeUI.actionSheet(
                    {
                        title: '选择地图应用',
                        cancel: '取消',
                        buttons: [
                            {
                                title: '百度地图',
                            },
                            {
                                title: '高德地图',
                            },
                        ],
                    },
                    function (e) {
                        switch (e.index) {
                            case 1:
                                plus.runtime.openURL(urlBaiduMap)
                                break
                            case 2:
                                plus.runtime.openURL(urlAmap)
                                break
                        }
                    }
                )
            } else if (hasAmap) {
                plus.runtime.openURL(urlAmap)
            } else if (hasBaiduMap) {
                plus.runtime.openURL(urlBaiduMap)
            } else {
                plus.nativeUI.alert('本机未安装指定的地图应用')
                // url = "geo:"+latitude+","+longitude+"?q=%e6%95%b0%e5%ad%97%e5%a4%a9%e5%a0%82";
                // plus.runtime.openURL(url); //如果是国外应用，应该优先使用这个，会启动google地图。这个接口不能统一坐标系，进入百度地图时会有偏差
            }
        } else {
            // iOS上获取本机是否安装了百度高德地图，需要在manifest里配置，在manifest.json文件app-plus->distribute->apple->urlschemewhitelist节点下添加（如urlschemewhitelist:["iosamap","baidumap"]）
            plus.nativeUI.actionSheet(
                {
                    title: '选择地图应用',
                    cancel: '取消',
                    buttons: [
                        {
                            title: 'Apple地图',
                        },
                        {
                            title: '百度地图',
                        },
                        {
                            title: '高德地图',
                        },
                    ],
                },
                function (e) {
                    console.log('e.index: ' + e.index)
                    switch (e.index) {
                        case 1:
                            url = `http://maps.apple.com/?q=%e6%95%b0%e5%ad%97%e5%a4%a9%e5%a0%82&ll=${latitude},${longitude}&spn=0.008766,0.019441`
                            break
                        case 2:
                            url = `baidumap://map/marker?location=${latitude},${longitude}&title=${name}&content=${name}&src=ios.baidu.openAPIdemo&coord_type=gcj02`
                            break
                        case 3:
                            url = `iosamap://viewMap?sourceApplication=applicationName&poiname=${name}&lat=${latitude}&lon=${longitude}&dev=0`
                            break
                        default:
                            break
                    }
                    if (url != '') {
                        url = encodeURI(url)
                        plus.runtime.openURL(url, function (e) {
                            plus.nativeUI.alert('本机未安装指定的地图应用')
                        })
                    }
                }
            )
        }
    },

    /*
     * 打开高德地图 [未使用]
     * @param name 终点名称
     * @param slocation 起点经纬度
     * @param dlocation 终点经纬度
     */
    gdMapOpen(name, slocation, dlocation) {
        //#ifdef APP-PLUS
        if (dlocation) {
            var packageName = 'com.autonavi.minimap'
            var main = plus.android.runtimeMainActivity()
            var packageManager = main.getPackageManager()
            var PackageManager = plus.android.importClass(packageManager)
            var packageInfo = packageManager.getPackageInfo(packageName, PackageManager.GET_ACTIVITIES)
            if (packageInfo) {
                var Uri = plus.android.importClass('android.net.Uri')
                var url =
                    'amapuri://route/plan?sourceApplication=maxuslife' +
                    '&sid=A&slat=' +
                    slocation[1] +
                    '&slon=' +
                    slocation[0] +
                    '&sname=' +
                    name[0] +
                    '&did=B&dlat=' +
                    dlocation[1] +
                    '&dlon=' +
                    dlocation[0] +
                    '&dname=' +
                    name[1] +
                    '&dev=0&t=0'
                var Intent = plus.android.importClass('android.content.Intent')
                var intent = new Intent()
                intent.setAction(Intent.ACTION_VIEW)
                intent.addCategory(Intent.CATEGORY_DEFAULT)
                var uri = Uri.parse(url)
                //将功能Scheme以URI的方式传入data
                intent.setData(uri)
                intent.setPackage('com.autonavi.minimap')
                var main = plus.android.runtimeMainActivity()
                main.startActivity(intent)
            } else {
                uni.showToast({
                    title: '未安装' + packageName + '',
                    icon: 'none',
                })
                // alert('未安装' + packageName + '')
            }
        }
        //#endif
    },

    /*
     * 单张加载状态
     * @param url 图片地址
     */
    loadImg(url) {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.onload = function () {
                console.log('一张图片加载完成')
                resolve(img)
            }
            img.onerror = function () {
                reject(new Error('Could not load image at' + url))
            }
            img.src = url
        })
    },

    /*
     * 图片列表加载状态
     * @param urls Array 图片列表
     * @param handler [loadImg]
     * @param limit Number 数量
     * @例子：limitLoad(urls, loadImg, 3).then(res => {console.log("图片全部加载完毕"); console.log(res);}).catch(err => {console.error(err);});
     */
    limitLoad(urls, handler, limit) {
        let sequence = [].concat(urls) // 复制urls
        // 这一步是为了初始化 promises 这个"容器"
        let promises = sequence.splice(0, limit).map((url, index) => {
            return handler(url).then(() => {
                // 返回下标是为了知道数组中是哪一项最先完成
                return index
            })
        })
        // 注意这里要将整个变量过程返回，这样得到的就是一个Promise，可以在外面链式调用
        return sequence
            .reduce((pCollect, url) => {
                return pCollect
                    .then(() => {
                        return Promise.race(promises) // 返回已经完成的下标
                    })
                    .then((fastestIndex) => {
                        // 获取到已经完成的下标
                        // 将"容器"内已经完成的那一项替换
                        promises[fastestIndex] = handler(url).then(() => {
                            return fastestIndex // 要继续将这个下标返回，以便下一次变量
                        })
                    })
                    .catch((err) => {
                        console.error(err)
                    })
            }, Promise.resolve()) // 初始化传入
            .then(() => {
                // 最后三个用.all来调用
                return Promise.all(promises)
            })
    },

    async getExtConfig() {
        if (uni.getStorageSync('extConfig')) {
            this.extConfig = uni.getStorageSync('extConfig')
        } else {
            await this.$tools.requests(this, this.routes.api_selectList, {}).then((res) => {
                this.extConfig = res.data
                this.dd('获取配置初始化数据', this.extConfig)
                uni.setStorageSync('extConfig', this.extConfig)
            })
        }
        return this.extConfig
    },
    islogin() {
        if (!this.getu('id')) {
            uni.reLaunch({
                url: '/pages/public/login',
            })
            return
        }
    },
    async getUserInfo(that) {
        await this.$tools.requests(this, this.routes.api_getUserInfo, {}, 'post').then((res) => {
            this.dd('用户信息', res.data)
            that.userInfo = res.data ? res.data : {}
            uni.setStorageSync('userInfo', res.data)
        })
    },
    // 调试使用
    dd(content, json, type) {
        type = type ? type : 0
        json = json ? json : ''
        let curRoute = '/'
        if (this.$mp.page) {
            curRoute = this.$mp.page.route
        }
        if (init.config.debug) {
            switch (type) {
                case 0:
                    console.log('[info](' + curRoute + ')', content, json)
                    break
                case 1:
                    console.log('[warning](' + curRoute + ')', content, json)
                    break
                case 2:
                    console.log('[error](' + curRoute + ')', content, json)
                    break
            }
        }
    },
    // ID元素属性获取
    domExec(fieid) {
        var that = this
        var query = uni.createSelectorQuery()
        query
            .select('#' + fieid)
            .boundingClientRect(function (res) {
                that.paramLoca[fieid] = res
            })
            .exec()
    },
    copyGet(content) {
        uniCopy({
            content: content,
            success: (res) => {
                uni.showToast({
                    title: res,
                    icon: 'none',
                })
            },
            error: (e) => {
                uni.showToast({
                    title: e,
                    icon: 'none',
                    duration: 3000,
                })
            },
        })
    },
    phoneGet(phone) {
        uni.makePhoneCall({
            phoneNumber: phone,
        })
    },
    // 表单验证
    frmVerification(formdata, field, message) {
        return new Promise((resolve, reject) => {
            let status = 0
            for (var i = 0; i < field.length; i++) {
                if (formdata[field[i]] == '') {
                    uni.showToast({
                        title: message[i] + '不能为空',
                        icon: 'none',
                        duration: 2000,
                    })
                    return
                } else {
                    status += 1
                }
            }
            if (status === field.length) {
                resolve(formdata)
            }
        })
    },
    getu(field) {
        let userinfo = uni.getStorageSync('userInfo')
        if (field) {
            return userinfo[field]
        }
        return userinfo
    },
    href(url) {
        uni.navigateTo({
            url: url,
        })
    },
    swithref(url) {
        uni.switchTab({
            url: url,
        })
    },
    redirectTo(url) {
        uni.redirectTo({
            url: url,
        })
    },
    // 缓存数据跳转
    hrefSave(json, url) {
        uni.setStorage({
            key: 'content',
            data: json,
            success: function () {
                uni.navigateTo({
                    url: url,
                })
            },
        })
    },
    hrefBack() {
        uni.navigateBack({})
    },
    // 发送数据请求
    requests(that, url, formdata, methods) {
        ;(formdata = formdata ? formdata : {}), (methods = methods ? methods : 'get')
        return that.$http[methods](url, formdata);
    },
    //获取用户地理位置权限
    getPermission(that) {
        uni.getLocation({
            success: function (res) {
                that.useraddr = res.address //调用成功直接设置地址
            },
            fail: function () {
                uni.getSetting({
                    success: function (res) {
                        var statu = res.authSetting
                        if (!statu['scope.userLocation']) {
                            uni.showModal({
                                title: '是否授权当前位置',
                                content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                                success: function (tip) {
                                    if (tip.confirm) {
                                        uni.openSetting({
                                            success: function (data) {
                                                if (data.authSetting['scope.userLocation'] === true) {
                                                    uni.showToast({
                                                        title: '授权成功',
                                                        icon: 'none',
                                                        duration: 1000,
                                                    })
                                                    //授权成功之后，再调用chooseLocation选择地方
                                                    uni.getLocation({
                                                        success: function (res) {
                                                            obj.useraddr = res.address //调用成功直接设置地址
                                                        },
                                                    })
                                                } else {
                                                    uni.showToast({
                                                        title: '授权失败',
                                                        icon: 'none',
                                                        duration: 1000,
                                                    })
                                                }
                                            },
                                        })
                                    }
                                },
                            })
                        }
                    },
                    fail: function (res) {
                        uni.showToast({
                            title: '调用授权窗口失败',
                            icon: 'none',
                            duration: 1000,
                        })
                    },
                })
            },
        })
    },
}
