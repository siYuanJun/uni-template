import Vue from "vue";
import App from "./App";
import init from "@/common/config";
import cuCustom from "@/components/colorui/components/cu-custom";
import pagePull from "@/common/mixinPull";
import share from "@/common/mixinShare";
import routes from "@/common/routes";

// git commit -m "feat: code"
// git commit -m "fix: code"
// git commit -m "perf: code audioPlay"
Vue.prototype.webTitle = init.config.title;
Vue.prototype.webVersion = init.config.version;
// 项目token
Vue.prototype.webTokey = init.config.webTokey;
// 公用路由
Vue.prototype.routes = routes;
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
