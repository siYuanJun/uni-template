<style lang="less"></style>
<template>
	<view class="">
		<view class="cu-load bg-grey loading" v-if="loading"></view>
		<block class="" v-if="!loading && !count">
			<view class="padding-xl flex flex-direction align-center">
				<view class=""><image src="../../static/images/kong.png" mode="aspectFit" class="icon-xxxl"></image></view>
				<view class="padding-top text-df text-333333">空空如也～</view>
			</view>
		</block>
	</view>
</template>

<script>
export default {
	name: 'dataNone',
	props: {
		count: {
			type: Boolean,
			default: true
		},
		loading: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		count(newVal, oldVal) {}
	},
	data() {
		return {};
	},
	created() {},
	methods: {}
};
</script>
