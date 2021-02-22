import Vue from "vue";
import App from "./App";
import init from "@/common/config";
import cuCustom from "@/components/colorui/components/cu-custom";
import pagePull from "@/common/mixinPull.js";
import share from "@/common/mixinShare.js";

Vue.prototype.webTitle = init.config.title;
// 项目token
Vue.prototype.webKey = "";
// 网络请求
Vue.prototype.http = init.http;
// 顶部自定义导航
Vue.component("cuCustom", cuCustom);

Vue.mixin(share);
Vue.mixin(pagePull);

Vue.config.productionTip = false;

App.mpType = "app";

const app = new Vue({
  ...App
});
app.$mount();
