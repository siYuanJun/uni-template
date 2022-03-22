import {
    config
} from '@/common/config'
import {
    judgePermission
} from '@/plugins/permission'

export default {
    handlerDestroyNotifcation(key) {
        // 销毁消息定时器
        let notificationID = uni.getStorageSync('notificationID')
        if (notificationID) {
            console.log("App-销毁消息定时器", notificationID)
            uni.removeStorageSync('notificationID')
            clearInterval(notificationID)
        }
    },
    setImgUrl(imgUrl) {
        let newStr = imgUrl.indexOf("http")

        return newStr == 0 ? imgUrl : (config.$baseUrl + imgUrl)
    },
    //保存图片
    downSaveImage(imgurl) {
        uni.showModal({
            title: '保存图片',
            content: '是否保存当前图片？',
            success: res => {
                if (res.confirm) {
                    uni.downloadFile({
                        url: imgurl,
                        success: res => {
                            if (res.statusCode === 200) {
                                uni.saveImageToPhotosAlbum({
                                    filePath: res.tempFilePath,
                                    success: function() {
                                        uni.showToast({
                                            title: '保存成功',
                                            duration: 2000
                                        });
                                    },
                                    fail: function() {
                                        uni.showToast({
                                            title: '保存失败，请稍后重试',
                                            icon: 'none'
                                        });
                                    }
                                });
                            }
                        }
                    });
                } else if (res.cancel) {
                    // uni.showToast({
                    // 	title: "你取消了该操作",
                    // 	icon:'none',
                    // 	duration: 2000
                    // });
                }
            }
        });
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
                    url: config.baseUrl + "/oss/getOssToken",
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
                                        pic: config.qiniuUrl + data.key,
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
     */
    uploadImageForm(uploadUrl, callback, sourceType) {
        let sourceTypeNew = []
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
                // callback(tempFilePaths);
                // return
                tempFilePaths.map(item => {
                    uni.uploadFile({
                        url: config.baseUrl + '/api' + uploadUrl,
                        filePath: item,
                        name: 'file',
                        header: {
                            'authorization': config.webTokey,
                        },
                        formData: {
                            token: uni.getStorageSync("userToken")
                        },
                        success: res => {
                            uploadImgCount++;
                            let data = JSON.parse(res.data)
                            this.dd("上传图片请求", data)
                            callback(data)
                            //如果是最后一张,则隐藏等待中
                            if (uploadImgCount === tempFilePaths.length) {
                                uni.hideLoading();
                            }
                        },
                        fail: err => {
                            this.dd("上传图片请求", err, 2)
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
        if (config.debug) {
            switch (type) {
                case 0:
                    console.info("[info](" + curRoute + ")", content, json)
                    break;
                case 1:
                    console.warn("[warning](" + curRoute + ")", content, json)
                    break;
                case 2:
                    console.error("[error](" + curRoute + ")", content, json)
                    break;
            }
        }
    },
    // ID元素属性获取
    domExec(fieid, calls) {
        var query = uni.createSelectorQuery();
        query
            .select("#" + fieid)
            .boundingClientRect(function(res) {
                calls(res)
            })
            .exec();
    },

    // 表单验证
    frmVerification(formdata, field, message) {
        return new Promise((resolve, reject) => {
            let status = 0;
            for (var i = 0; i < field.length; i++) {
                if (formdata[field[i]] === "") {
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
