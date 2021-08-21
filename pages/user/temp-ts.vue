<style lang="less">
	page {
		background-color: #EEEEEE;
	}
</style>

<template>
	<view class="content">
	</view>
</template>

<script lang="ts">
	import {
		Component,
		Prop,
		Vue,
		Watch,
		Mixins
	} from "vue-property-decorator";
	import mixLoadMore from "@/components/mix-load-more/mix-load-more";
	@Component({
		components: {
			mixLoadMore
		},
		mixins: []
	})
	export default class jiedan extends Vue {
		public parmform: any = {}
		public parmloca: any = {
			loadMoreStatus: 0,
		}
		public parmdata: Array = []
		onLoad(e) {
			let that = this
			// that.getData(that, 1);
		}
		async getData(that: any, page: number, type: string): void {
			that.parmform.pageNo = page != undefined ? page : 1
			that.parmform.userSystemId = that.getu("userSystemId")
			that.parmloca.loadMoreStatus = 1
			let result = await that.Requests(that, that.routes.api_index, that.parmform, "get");
			var data = result.result.records;
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
		}
		onShow() {}
		onPullDownRefresh() {
			console.log("refresh");
			let that = this;
			that.getData(that);
		}
		onReachBottom() {
			console.log("onReachBottom");
			let that = this;
			that.parmform.pageNo++;
			that.getData(that, that.parmform.pageNo, "add");
		}
	}
</script>
