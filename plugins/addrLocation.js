import {
    config
} from '@/common/config'
import {
    judgePermission
} from '@/plugins/permission'


export default {
    //获取用户地理位置权限
    getPermission(callData) {
        uni.getLocation({
            success: (res) => {
                callData ?? callData(obj)
            },
            fail: function() {
                uni.getSetting({
                    success: function(res) {
                        var statu = res.authSetting;
                        if (!statu['scope.userLocation']) {
                            uni.showModal({
                                title: '是否授权当前位置',
                                content: '需要获取您的地理位置，请确认授权，否则定位功能将无法使用',
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
                                                            if (
                                                                callData
                                                                ) {
                                                                callData
                                                                    (
                                                                        obj
                                                                        )
                                                            }
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

    async getAddress(call) {
        // #ifdef APP-PLUS
        judgePermission('location')
        // #endif

        this.dd("开始定位")
        let location = await this.getLocation().catch(err => {
            this.getPermission()
        })

        try {
            this.dd("定位", location)
            let result = await this.getRegeoWeb(location.longitude + "," + location.latitude)
            this.dd("转换中文", result)
            call(result)
        } catch (e) {
            this.dd("定位失败", e)
        }
    },

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
     * Web高德获取地址详细信息
     */
    getRegeoWeb(location) {
        let url =
            "https://restapi.amap.com/v3/geocode/regeo?poitype=&radius=1000&extensions=all&batch=false&roadlevel=0";

        return new Promise((resolve, reject) => {
            uni.request({
                url: url,
                method: "get",
                data: {
                    key: config.amap.WebServerKey,
                    location
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
     * 地址转经纬度
     */
    getGeoWeb(address) {
        let url = "https://restapi.amap.com/v3/geocode/geo";

        return new Promise((resolve, reject) => {
            uni.request({
                url: url,
                method: "get",
                data: {
                    key: config.amap.WebServerKey,
                    address,
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

    // 路城规划
    getDirectionWalking(origin, destination) {
        let url = "https://restapi.amap.com/v3/direction/walking";

        return new Promise((resolve, reject) => {
            uni.request({
                url: url,
                method: "get",
                data: {
                    key: config.amap.WebServerKey,
                    origin,
                    destination,
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
     * 打开第三方地图 [实用]
     * @param latitude 终点纬度
     * @param longitude 终点经度
     * @param name 终点名称
     */
    openMapApp(latitude, longitude, name) {
        // #ifdef APP-PLUS
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
        //#endif
    }
}
