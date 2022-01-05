<style lang="less"></style>
<template>
	<view class="">
        <view class="cu-load loading" v-if="loading"></view>
		<block class="" v-if="!count && !loading">
			<view class="padding flex flex-direction align-center">
				<!-- <view class=""><image src="../../static/images/kong.png'" mode="aspectFit" class="icon-xxxl"></image></view> -->
				<view class="text-df text-333333">空空如也～</view>
			</view>
		</block>
	</view>
</template>

<script>
export default {
	name: 'dataNone',
	props: {
		count: {
			type: Number,
			default: 0
		},
		loading: {
			type: Boolean,
			default: false
		},
	},
    watch: {
        count(val) {
            console.log(val)
        }
    },
    computed: {
        loadingFun() {

        }
    }
};
</script>
