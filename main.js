import Vue from "vue";
import App from "./App";
import init from "@/common/config";
import routes from "@/common/routes";
import fun from "@/common/function";
import cuCustom from "@/components/colorui/components/cu-custom";
import pagePull from "@/mixin/Public";
import share from "@/mixin/Share";
import "@/static/css/tailwind.css"

Vue.prototype.webTitle = init.config.title;
Vue.prototype.webVersion = init.config.version;
Vue.prototype.webTokey = init.config.webTokey;
Vue.prototype.http = init.http;
Vue.prototype.routes = routes;
Vue.prototype.tools = fun;

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
