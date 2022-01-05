import Request from '@/js_sdk/luch-request/request'

const test = new Request()

test.setConfig((config) => {
    /* 设置全局配置 */
    config.baseUrl = 'https://www.aaa.com'
    config.header = {
        ...config.header,
        a: 1,
        b: 2
    }
    return config
})

test.interceptor.request((config, cancel) => {
    /* 请求之前拦截器 */
    config.header = {
        ...config.header,
        a: 3
    }
    /*
    if (!token) { // 如果token不存在，调用cancel 会取消本次请求，但是该函数的catch() 仍会执行
      cancel('token 不存在') // 接收一个参数，会传给catch((err) => {}) err.errMsg === 'token 不存在'
    }
    */
    return config
})

/**
 * 自定义验证器，如果返回true 则进入响应拦截器的响应成功函数(resolve)，否则进入响应拦截器的响应错误函数(reject)
 * @param { Object } response - 请求响应体（只读）
 * @return { Boolean } 如果为true,则 resolve, 否则 reject
 */
test.validateStatus = (response) => {
    return response.statusCode === 200
}

test.interceptor.response((response) => {
    /* 请求之后拦截器 */
    return response
}, (response) => { // 请求错误做点什么
    return response
})

const http = new Request()

http.setConfig((config) => {
    /* 设置全局配置 */
    config.baseUrl = '' /* 根域名不同 */
    config.header = {
        'content-type': 'application/x-www-form-urlencoded',
        ...config.header,
    }
    return config
})

/**
 * 自定义验证器，如果返回true 则进入响应拦截器的响应成功函数(resolve)，否则进入响应拦截器的响应错误函数(reject)
 * @param { Object } response - 请求响应体（只读）
 * @return { Boolean } 如果为true,则 resolve, 否则 reject
 */
http.validateStatus = (response) => {
    return response.statusCode === 200
}

http.interceptor.request((config, cancel) => {
    /* 请求之前拦截器 */
    const params = {
        token: uni.getStorageSync('userToken')
    }
    if (config.method == "GET") {
        config.params = {
            ...config.params,
            ...params
        }
    }
    if (config.method == "POST") {
        config.data = {
            ...config.data,
            ...params
        }
    }
    // console.log(JSON.stringify(config))
    /*
    if (!token) { // 如果token不存在，调用cancel 会取消本次请求，但是该函数的catch() 仍会执行
      cancel('token 不存在') // 接收一个参数，会传给catch((err) => {}) err.errMsg === 'token 不存在'
    }
    */
    return config
})

http.interceptor.response((res) => {
    /* 请求之后拦截器 */
    // console.log("httpRes-" + res.config.url, res)

    let pageUrl = ''

    // #ifdef H5
    pageUrl = getCurrentPages()[0].$route.fullPath
    // #endif

    // #ifdef MP-WEIXIN
    pageUrl = getCurrentPages()[0].$page.fullPath
    // #endif

    // #ifdef APP-PLUS
    pageUrl = getCurrentPages()[0].$getAppWebview().__uniapp_route
    // #endif

    console.log("当前请求所在页面->", pageUrl, res.config.url)

    switch (res.data.code) {
        case 1001:
            uni.removeStorageSync("userInfo")
            uni.removeStorageSync('userToken')

            try {
                if (pageUrl == '/pages/public/login' || pageUrl == 'pages/public/login') {
                    return res
                }
            } catch (e) {
                console.log(e)
            }
            uni.navigateTo({
                url: '/pagesA/user/login'
            })
            break;
    }

    if (res.data.code != 0) {
        if (res.data.msg) {
            uni.showToast({
                title: res.data.msg,
                icon: 'none'
            })
            return
        }
    }

    return res

}, (res) => { // 请求错误做点什么
    console.log("httpErr-" + res.config.url, res)
    return res
})

export {
    http,
    test
}
