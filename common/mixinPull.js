import uniCopy from "@/js_sdk/xb-copy/uni-copy";
export default {
  data() {
    return {};
  },
  onLoad() {},
  methods: {
    // ID元素属性获取
    domExec(fieid) {
      var that = this;
      var query = uni.createSelectorQuery();
      query
        .select("#" + fieid)
        .boundingClientRect(function (res) {
          that.parmloca[fieid] = res;
        })
        .exec();
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
    getu(field) {
      let userinfo = uni.getStorageSync("userInfo");
      if (field) {
        return userinfo[field];
      }
      return userinfo;
    },
    href(url) {
      uni.navigateTo({
        url: url
      });
    },
    swithref(url) {
      uni.switchTab({
        url: url
      });
    },
    // 缓存数据跳转
    hrefSave(json, url) {
      uni.setStorage({
        key: "content",
        data: json,
        success: function () {
          uni.navigateTo({
            url: url
          });
        }
      });
    },
    // 发送数据请求
    ajaxRequest(that, url, formdata, methods, type) {
      //type add 加载更多 refresh下拉刷新
      if (type == "add") {
        that.parmloca.loadMoreStatus = 1;
      } else {
        // that.parmform.page = 1;
      }
      var formdata = formdata ? formdata : {},
        methods = methods ? methods : "get";
      if (methods == "get") {
        that.http.config.header = {
          "content-type": "application/x-www-form-urlencoded",
          "X-Access-Token": uni.getStorageSync("userInfoToken")
        };
        formdata = {
          params: formdata
        };
      }
      if (methods == "post") {
        that.http.config.header = {
          "content-type": "application/json",
          "X-Access-Token": uni.getStorageSync("userInfoToken")
        };
      }
      return new Promise((resolve, reject) => {
        that.http[methods](url, formdata)
          .then((res) => {
            res = res.data;
            if (res.code === 200) {
              resolve(res);
            } else {
              if (res.code === 403) {
                uni.navigateTo({
                  url: "/pages/public/login"
                });
              } else {
                if (res.message) {
                  uni.showToast({
                    title: res.message,
                    icon: "none",
                    duration: 2000
                  });
                }
              }
            }
            that.submitLocaing = 1;
            uni.stopPullDownRefresh();
          })
          .catch((err) => {
            reject(err);
            console.log(err);
          });
      });
    },
    //调用地图路线规划接口
    directionFun(that, froma, toa) {
      // that.loading = 1
      that.qqmapsdk.direction({
        mode: "driving", //可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
        //from参数不填默认当前地址
        from: froma,
        to: toa,
        success: function (res) {
          console.log("进行划线规划");
          console.log(res);
          var ret = res;
          var coors = ret.result.routes[0].polyline,
            pl = [],
            latlong;
          //坐标解压（返回的点串坐标，通过前向差分进行压缩）
          var kr = 1000000;
          for (var i = 2; i < coors.length; i++) {
            coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
          }
          //将解压后的坐标放入点串数组pl中
          for (var i = 0; i < coors.length; i += 2) {
            pl.push({
              latitude: coors[i],
              longitude: coors[i + 1]
            });
          }
          console.log(pl);
          latlong = Math.round((pl.length / 5) * 4);
          console.log(latlong);
          //设置polyline属性，将路线显示出来,计算出中心点坐标
          that.parmloca.map.latitude = pl[latlong].latitude;
          that.parmloca.map.longitude = pl[latlong].longitude;
          // 配置线条样式
          var contentqd, contentzd;
          if (that.parmdata.data.strokelist) {
            //默认行程详情页
            contentqd = that.parmdata.data.strokelist.startingpoint_name;
            contentzd = that.parmdata.data.strokelist.startingend_name;
            that.parmloca.map.polyline = [
              {
                points: pl,
                color: "#018DC1",
                borderColor: "#018DC1",
                width: 3,
                arrowLine: true
              }
            ];
          } else if (that.parmdata.data.be_to_stroke_cz) {
            //行程关联详情页
            contentqd = that.parmdata.data.be_to_stroke_cz.startingpoint_name;
            contentzd = that.parmdata.data.be_to_stroke_cz.startingend_name;
            that.parmloca.map.polyline = [
              {
                points: pl,
                color: "#018DC1",
                borderColor: "#018DC1",
                width: 3,
                arrowLine: true
              }
            ];
          } else {
            //行程结束详情页
            contentqd = that.parmdata.data.startingpoint_name;
            contentzd = that.parmdata.data.startingend_name;
          }
          // 配置起点终点
          that.parmloca.map.markers = [
            {
              id: 1,
              latitude: pl[0].latitude,
              longitude: pl[0].longitude,
              title: "起点",
              iconPath: "/static/images/stroke/qd.png",
              width: "30",
              height: "30",
              callout: {
                content: "起点: " + contentqd,
                color: "#2c2c2c",
                fontSize: "12px",
                borderRadius: "3px",
                bgColor: "#ffffff",
                padding: "10px",
                textAlign: "center"
              }
            },
            {
              id: 1,
              latitude: pl.slice(-1)[0].latitude,
              longitude: pl.slice(-1)[0].longitude,
              title: "终点",
              iconPath: "/static/images/stroke/zd.png",
              width: "30",
              height: "30",
              callout: {
                content: "终点: " + contentzd,
                color: "#2c2c2c",
                fontSize: "12px",
                borderRadius: "3px",
                bgColor: "#ffffff",
                padding: "10px",
                textAlign: "center"
              }
            }
          ];
          that.loading = 0;
        },
        fail: function (error) {
          console.log("获取失败，调用弹框打开授权配置");
          that.getPermission(that);
        },
        complete: function (res) {}
      });
    },
    //地图调用
    onMapClicka(that, mapType) {
      console.log("打开地图");
      if (!uni.getStorageSync("openid")) {
        uni.navigateTo({
          url: "/pages/public/login"
        });
        return;
      }
      uni.getLocation({
        type: "gcj02",
        success: function (res) {
          // 默认小程序地图
          // uni.chooseLocation({
          // 	success: function(res) {
          // 	}
          // })

          // 腾讯地图插件
          const referer = "地图业务"; //调用插件的app的名称
          const category = "生活服务,娱乐休闲";
          const location = JSON.stringify({
            latitude: res.latitude,
            longitude: res.longitude
          });
          wx.navigateTo({
            url:
              "plugin://chooseLocation/index?key=" +
              that.qqmapKey +
              "&referer=" +
              referer +
              "&location=" +
              location +
              "&category=" +
              category,
            animationType: "fade-in",
            animationDuration: 200,
            success: function (res) {
              if (mapType) {
                //取消跳转发布页阻止
                uni.setStorageSync("pageRedirect", 0);
                // 选择的地图所属文本框
                uni.setStorage({
                  key: "maptype",
                  data: mapType,
                  success: function () {
                    console.log("set maptype success");
                  }
                });
              }
            }
          });
        },
        fail: function (res) {
          console.log("获取失败，调用弹框打开授权配置");
          that.getPermission(that);
        },
        complete: function (res) {}
      });
    },
    //设置当前页面地图信息
    setMapInfo(that) {
      // 根据返回的地图选择类型，设置地址数据
      let chooseLocation = requirePlugin("chooseLocation");
      let location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
      if (location) {
        console.log(location);
        // 判断起点终点选择类型
        uni.getStorage({
          key: "maptype",
          success: function (res) {
            let data = res.data;
            if (data === 1) {
              that.parmform.startingpoint = location.address;
              that.parmform.startingpoint_name = location.name;
              that.parmform.startingpointloca =
                location.latitude + "," + location.longitude;
            }
            if (data === 2) {
              that.parmform.startingend = location.address;
              that.parmform.startingend_name = location.name;
              that.parmform.startingendloca =
                location.latitude + "," + location.longitude;
            }
            if (
              that.parmform.startingpointloca &&
              that.parmform.startingendloca
            ) {
              console.log("选择地图地点后，页面赋值成功");
              that["callMapInfo"] ? that["callMapInfo"](that.parmform) : "";
            }
          }
        });
      }
    }
  }
};
