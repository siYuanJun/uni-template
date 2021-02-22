<style lang="less">
page {
  background-color: #F5F5F5;
}
.box-icon {
  width: 100upx;
  height: 100upx;
}
.hongdian {
  width: 20upx;
  height: 20upx;
  background-color: #e54d42;
  border-radius: 50%;
}
</style>

<template>
  <view class="content">
    <cu-custom bgColor="bg-white" :isBack="false">
      <block slot="content">
        <view class="text-bold">{{ title }}</view>
      </block>
    </cu-custom>
    <view class="padding-top-xs padding-bottom">
      <view class="padding-sm">
        <view
          class="padding-lr-sm padding-tb-sm bg-white text-df flex justify-between align-center round"
        >
          <view class="flex">
            <view class="text-3E3E3E margin-right flex align-center">
              <view class="w-xs h-xs round bg-red margin-right-sm"></view>
              <view class=""> 订单最早到达时间 </view>
            </view>
            <view class="text-black"> 01月30日 07:14 </view>
          </view>
          <button class="cu-btn bg-red sm round">打卡</button>
        </view>
      </view>
      <view
        class="padding-lr-sm padding-tb-xs shadow-lg"
        v-for="(item, index) in parmdata"
        :key="index"
        @tap="hrefSave(item, '/pages/article/messageDetails')"
      >
        <view
          class="bg-white padding radius-df flex justify-between align-center"
        >
          <view class="box-icon icon1"></view>
          <view class="margin-left flex-sub">
            <view class="flex justify-between">
              <view class="text-lg text-bold text-black">
                {{ item.title }}
              </view>
              <view class="text-df text-gray-C1C1C1">
                {{ item.sendTime }}
              </view>
            </view>
            <view class="flex justify-between align-start margin-top-xs">
              <view class="text-content">
                <view class="">
                  {{ item.msgContent }}
                </view>
                <view class="text-red">点击查看</view>
              </view>
              <view
                class="hongdian margin-left"
                v-if="item.readFlag == 0"
              ></view>
            </view>
          </view>
        </view>
      </view>
      <mixLoadMore :status="parmloca.loadMoreStatus"></mixLoadMore>
    </view>
  </view>
</template>

<script>
import mixLoadMore from "@/components/mix-load-more/mix-load-more";
export default {
  components: { mixLoadMore },
  data() {
    return {
      title: "消息",
      api_getMessageList: "/delivery/getMessageList",
      parmform: {
        pageNo: 1,
        pageSize: 10,
      },
      parmdata: [],
      parmloca: {
        loadMoreStatus: 0,
      },
    };
  },
  onLoad(e) {
    let that = this;
    that.init(that, 1);
  },
  onShow() {},
  methods: {
    init(that, page, type) {
      that.parmform.pageNo = page != undefined ? page : 1;
      that.parmform.userSystemId = that.getu("userSystemId");
      that
        .ajaxRequest(that, that.api_getMessageList, that.parmform, "get", type)
        .then((res) => {
          var data = res.result.records;
          console.log(data);
          if (type == "add") {
            data.forEach((item) => {
              that.parmdata.push(item);
            });
          } else {
            that.parmdata = data;
          }
          if (data.length < 10) {
            that.parmloca.loadMoreStatus = 2;
          }
        });
    },
    onPullDownRefresh() {
      console.log("refresh");
      let that = this;
      that.init(that);
    },
    onReachBottom() {
      console.log("onReachBottom");
      let that = this;
      that.parmform.pageNo++;
      that.init(that, that.parmform.pageNo, "add");
    },
  },
};
</script>