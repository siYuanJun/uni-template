<style lang="less"></style>
<template>
	<view class="">
		<block class="" v-if="!count">
			<view class="padding-xl flex flex-direction align-center">
				<view class=""><image src="../../static/images/kong.png" mode="aspectFit" class="icon-xxxl"></image></view>
				<view class="padding-top text-df text-333333">空空如也～</view>
			</view>
		</block>
	</view>
</template>

<script>
export default {
	name: "dataNone",
	props: {
		count: {
			type: Boolean,
			default: true
		}
	},
	watch: {
		count(newVal, oldVal) {
		}
	},
	data() {
		return {
		};
	},
	created() {
	},
	methods: {
	}
};
</script>
