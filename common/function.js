import init from '@/common/config'
const {
    amapsdk,
    http
} = init

export default {
    /*
     * 微信定位
     */
    getLocation() {
        return new Promise((resolve, reject) => {
            uni.getLocation({
                type: 'gcj02',
                success: (res) => {
                    resolve(res)
                },
                fail: (err) => {
                    console.log(err)
                    reject(err)
                }
            })
        })
    },

    /*
     * Sdk通过高德地图获取地址详细信息
     * @param option 经纬度 {location: froma.longitude + "," + froma.latitude}
     */
    getRegeo(option) {
        return new Promise((resolve, reject) => {
            amapsdk.getRegeo({
                ...option,
                success: function(data) {
                    resolve(data)
                },
                fail: function(err) {
                    console.log(err)
                    reject(err)
                }
            })
        })
    },

    /*
     * Web通过高德地图获取地址详细信息
     */
    getRegeoWeb(location) {
        var url = "https://restapi.amap.com/v3/geocode/regeo?key=" + init.config.amap.WebServerKey + "&location=" + location +
            "&poitype=&radius=1000&extensions=all&batch=false&roadlevel=0";
        return new Promise((resolve, reject) => {
            uni.request({
                url: url,
                method: "get",
                data: {},
                success: (res) => {
                    resolve(res.data)
                },
                fail: (e) => {
                    reject(e)
                }
            })
        })
    },

    /*
     * 地址转经纬度
     * @param that 所在页面 this
     * @param address 地址名称
     */
    getGeoWeb(that, address) {
        var url = "https://restapi.amap.com/v3/geocode/geo";
        return new Promise((resolve, reject) => {
            uni.request({
                url: url,
                method: "get",
                data: {
                    key: init.config.amapWebKey,
                    address: address,
                },
                success: (res) => {
                    resolve(res.data)
                },
                fail: (e) => {
                    reject(e)
                }
            })
        })
    },

    /*
     * 七牛云图片上传
     * @param num 上传数量
     * @param callback => res {} 回调
     */
    uploadImage(num, callback, sourceType) {
        let sourceTypeNew
        if (sourceType === 1) {
            sourceTypeNew = ['album']
        } else if (sourceType === 2) {
            sourceTypeNew = ['camera']
        } else if (sourceType === 3) {
            sourceTypeNew = ['camera', 'album']
        }
        uni.chooseImage({
            count: num,
            sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
            sourceType: sourceTypeNew,
            success: (res) => {
                uni.showLoading({
                    title: '上传中...'
                });
                let tempFilePaths = res.tempFilePaths
                callback(tempFilePaths);
                return
                //获取token
                uni.request({
                    url: init.config.baseUrl + "/oss/getOssToken",
                    success(resto) {
                        var data = resto.data
                        for (var i = 0; i < tempFilePaths.length; i++) {
                            uni.uploadFile({
                                url: 'https://up.qbox.me', //华东地区用这个
                                filePath: tempFilePaths[i],
                                name: 'file',
                                formData: {
                                    'key': 'xiehuo_' + Math.round(new Date() / 1000),
                                    'token': data.result
                                },
                                success: (uploadFileRes) => {
                                    console.log(uploadFileRes)
                                    var data = JSON.parse(uploadFileRes.data)
                                    // qiniuUrl 是自己七牛的前缀
                                    callback({
                                        pic: init.config.qiniuUrl + data.key,
                                        ...data
                                    });
                                },
                                fail: (error) => {
                                    if (error && error.response) {
                                        console.log(error)
                                    }
                                },
                                complete: () => {
                                    setTimeout(() => {
                                        uni.hideLoading();
                                    }, 250);
                                },
                            });
                        }
                    }
                })
            }
        })
    },

    /*
     * 表单图片上传
     * @param that 所在页面 this
     * @param num 上传数量
     * @param callback => res {} 回调
     */
    uploadImageForm(that, callback, sourceType) {
        let sourceTypeNew
        sourceType = sourceType ?? 3
        if (sourceType === 1) {
            sourceTypeNew = ['album']
        } else if (sourceType === 2) {
            sourceTypeNew = ['camera']
        } else if (sourceType === 3) {
            sourceTypeNew = ['camera', 'album']
        }
        uni.chooseImage({
            count: 1,
            sourceType: sourceTypeNew,
            sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
            success: (res) => {
                console.log("上传图片列表", res)
                uni.showLoading({
                    title: '上传中...'
                });
                let tempFilePaths = res.tempFilePaths
                let uploadImgCount = 0;
                tempFilePaths.map(item => {
                    uni.uploadFile({
                        url: init.config.baseUrl + that.$routes.api_uploadFile,
                        filePath: item,
                        name: 'file',
                        header: {
                            'authorization': init.config.webTokey,
                        },
                        formData: {
                            token: uni.getStorageSync("userToken")
                        },
                        success: res => {
                            uploadImgCount++;
                            let data = JSON.parse(res.data)
                            that.$tools.dd("上传图片请求", data)
                            callback(data)
                            //如果是最后一张,则隐藏等待中
                            if (uploadImgCount === tempFilePaths.length) {
                                uni.hideLoading();
                            }
                        },
                        fail: err => {
                            that.$tools.dd("上传图片请求", err, 2)
                            uni.hideLoading();
                            uni.showModal({
                                title: '超时提示',
                                content: '上传图片失败',
                                showCancel: false,
                                success: function(res) {}
                            })
                        }
                    });
                })
            }
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
            icon: 'none'
        })
        return
        //#endif
        let url = "";
        if (plus.os.name == "Android") {
            let hasBaiduMap = plus.runtime.isApplicationExist({
                pname: 'com.baidu.BaiduMap',
                action: 'baidumap://'
            });
            let hasAmap = plus.runtime.isApplicationExist({
                pname: 'com.autonavi.minimap',
                action: 'androidamap://'
            });
            let urlBaiduMap =
                `baidumap://map/marker?location=${latitude},${longitude}&title=${name}&coord_type=gcj02&src=andr.baidu.openAPIdemo`
            urlBaiduMap = encodeURI(urlBaiduMap)
            let urlAmap =
                `androidamap://viewMap?sourceApplication=appname&poiname=${name}&lat=${latitude}&lon=${longitude}&dev=0`
            urlAmap = encodeURI(urlAmap)
            console.log("urlAmap: " + urlAmap)
            console.log("urlBaiduMap: " + urlBaiduMap)
            if (hasAmap && hasBaiduMap) {
                plus.nativeUI.actionSheet({
                    title: "选择地图应用",
                    cancel: "取消",
                    buttons: [{
                        title: "百度地图"
                    }, {
                        title: "高德地图"
                    }]
                }, function(e) {
                    switch (e.index) {
                        case 1:
                            plus.runtime.openURL(urlBaiduMap);
                            break;
                        case 2:
                            plus.runtime.openURL(urlAmap);
                            break;
                    }
                })
            } else if (hasAmap) {
                plus.runtime.openURL(urlAmap);
            } else if (hasBaiduMap) {
                plus.runtime.openURL(urlBaiduMap);
            } else {
                plus.nativeUI.alert("本机未安装指定的地图应用");
                // url = "geo:"+latitude+","+longitude+"?q=%e6%95%b0%e5%ad%97%e5%a4%a9%e5%a0%82";
                // plus.runtime.openURL(url); //如果是国外应用，应该优先使用这个，会启动google地图。这个接口不能统一坐标系，进入百度地图时会有偏差
            }
        } else {
            // iOS上获取本机是否安装了百度高德地图，需要在manifest里配置，在manifest.json文件app-plus->distribute->apple->urlschemewhitelist节点下添加（如urlschemewhitelist:["iosamap","baidumap"]）
            plus.nativeUI.actionSheet({
                title: "选择地图应用",
                cancel: "取消",
                buttons: [{
                    title: "Apple地图"
                }, {
                    title: "百度地图"
                }, {
                    title: "高德地图"
                }]
            }, function(e) {
                console.log("e.index: " + e.index);
                switch (e.index) {
                    case 1:
                        url =
                            `http://maps.apple.com/?q=%e6%95%b0%e5%ad%97%e5%a4%a9%e5%a0%82&ll=${latitude},${longitude}&spn=0.008766,0.019441`;
                        break;
                    case 2:
                        url =
                            `baidumap://map/marker?location=${latitude},${longitude}&title=${name}&content=${name}&src=ios.baidu.openAPIdemo&coord_type=gcj02`;
                        break;
                    case 3:
                        url =
                            `iosamap://viewMap?sourceApplication=applicationName&poiname=${name}&lat=${latitude}&lon=${longitude}&dev=0`
                        break;
                    default:
                        break;
                }
                if (url != "") {
                    url = encodeURI(url)
                    plus.runtime.openURL(url, function(e) {
                        plus.nativeUI.alert("本机未安装指定的地图应用");
                    });
                }
            })
        }
    },

    /*
     * 单张加载状态
     * @param url 图片地址
     */
    loadImg(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = function() {
                console.log("一张图片加载完成");
                resolve(img);
            };
            img.onerror = function() {
                reject(new Error('Could not load image at' + url));
            };
            img.src = url;
        });
    },

    /*
     * 图片列表加载状态
     * @param urls Array 图片列表
     * @param handler [loadImg]
     * @param limit Number 数量
     * @例子：limitLoad(urls, loadImg, 3).then(res => {console.log("图片全部加载完毕"); console.log(res);}).catch(err => {console.error(err);});
     */
    limitLoad(urls, handler, limit) {
        let sequence = [].concat(urls); // 复制urls
        // 这一步是为了初始化 promises 这个"容器"
        let promises = sequence.splice(0, limit).map((url, index) => {
            return handler(url).then(() => {
                // 返回下标是为了知道数组中是哪一项最先完成
                return index;
            });
        });
        // 注意这里要将整个变量过程返回，这样得到的就是一个Promise，可以在外面链式调用
        return sequence
            .reduce((pCollect, url) => {
                return pCollect
                    .then(() => {
                        return Promise.race(promises); // 返回已经完成的下标
                    })
                    .then(fastestIndex => { // 获取到已经完成的下标
                        // 将"容器"内已经完成的那一项替换
                        promises[fastestIndex] = handler(url).then(
                            () => {
                                return fastestIndex; // 要继续将这个下标返回，以便下一次变量
                            }
                        );
                    })
                    .catch(err => {
                        console.error(err);
                    });
            }, Promise.resolve()) // 初始化传入
            .then(() => { // 最后三个用.all来调用
                return Promise.all(promises);
            });
    },
    // 调试使用
    dd(content, json, type) {
        type = type ? type : 0
        json = json ? json : ''
        let curRoute = '/'
        if (init.config.debug) {
            switch (type) {
                case 0:
                    console.log("[info](" + curRoute + ")", content, json)
                    break;
                case 1:
                    console.log("[warning](" + curRoute + ")", content, json)
                    break;
                case 2:
                    console.log("[error](" + curRoute + ")", content, json)
                    break;
            }
        }
    },
    // ID元素属性获取
    domExec(fieid) {
        var that = this;
        var query = uni.createSelectorQuery();
        query
            .select("#" + fieid)
            .boundingClientRect(function(res) {
                that.parmloca[fieid] = res;
            })
            .exec();
    },
    // 表单验证
    frmVerification(formdata, field, message) {
        return new Promise((resolve, reject) => {
            let status = 0;
            for (var i = 0; i < field.length; i++) {
                if (formdata[field[i]] == "") {
                    uni.showToast({
                        title: message[i] + "不能为空",
                        icon: "none",
                        duration: 2000
                    });
                    return;
                } else {
                    status += 1;
                }
            }
            if (status === field.length) {
                resolve(formdata);
            }
        });
    },
    // 发送数据请求
    requests(url, formdata, methods) {
        formdata = formdata ? formdata : {}, methods = methods ? methods : "get";
        return http[methods](url, formdata);
    },
    //获取用户地理位置权限
    getPermission(that) {
        uni.getLocation({
            success: function(res) {
                that.useraddr = res.address //调用成功直接设置地址
            },
            fail: function() {
                uni.getSetting({
                    success: function(res) {
                        var statu = res.authSetting;
                        if (!statu['scope.userLocation']) {
                            uni.showModal({
                                title: '是否授权当前位置',
                                content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                                success: function(tip) {
                                    if (tip.confirm) {
                                        uni.openSetting({
                                            success: function(data) {
                                                if (data.authSetting[
                                                        "scope.userLocation"
                                                    ] === true) {
                                                    uni.showToast({
                                                        title: '授权成功',
                                                        icon: 'none',
                                                        duration: 1000
                                                    })
                                                    //授权成功之后，再调用chooseLocation选择地方
                                                    uni.getLocation({
                                                        success: (
                                                            obj
                                                            ) => {
                                                            obj.useraddr =
                                                                res
                                                                .address //调用成功直接设置地址
                                                        },
                                                    })
                                                } else {
                                                    uni.showToast({
                                                        title: '授权失败',
                                                        icon: 'none',
                                                        duration: 1000
                                                    })
                                                }
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    },
                    fail: function(res) {
                        uni.showToast({
                            title: '调用授权窗口失败',
                            icon: 'none',
                            duration: 1000
                        })
                    }
                })
            }
        })
    },
    phoneVerification(phone) {
        let myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
        return !myreg.test(phone);
    },
    handleGoApp() {
        if (plus.os.name == 'Android') {
            //安卓
            if (
                plus.runtime.isApplicationExist({
                    //查看安卓系统手机有没有下载这款app
                    pname: 'com.tencent.mm' //微信app云打包的包名
                })
            ) {
                //安装了app
                plus.runtime.openURL(
                    'weixin://',
                    function(res) {
                        console.log(res);
                    }
                );
            } else {
                //未安装app
                uni.showModal({
                    title: '提示',
                    content: '您还没有此APP,去下载',
                    success: function(res) {
                        if (res.confirm) {
                            plus.runtime.openURL('https://a.app.qq.com/o/simple.jsp?pkgname=com.tencent.mm',
                                function(res) {
                                    console.log(res);
                                });
                        } else if (res.cancel) {
                            console.log('用户点击取消');
                        }
                    }
                });
            }
        } else if (plus.os.name == 'iOS') {
            //苹果
            //因为ios查不到B款app在ios系统手机里面，其实下载了，也是检测不到，所以就不检测了
            //直接打开微信app，微信pp没有的话，会进入回调报错，我们在回调去打开下载链接
            plus.runtime.launchApplication({
                    action: 'weixin://'
                },
                function(e) {
                    uni.showModal({
                        title: '提示',
                        content: '您还没有此APP,去下载',
                        success: function(res) {
                            if (res.confirm) {
                                plus.runtime.openURL(
                                    'https://a.app.qq.com/o/simple.jsp?pkgname=com.tencent.mm',
                                    function(res) {
                                        console.log(res);
                                    });
                            } else if (res.cancel) {
                                console.log('用户点击取消');
                            }
                        }
                    });
                }
            );
        }
    }
}
