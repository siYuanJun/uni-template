<style lang="less"></style>
<template>
	<view class="content">
		<view class="padding text-333333 text-lg text-center solid-bottom">
			 {{parmloca.pageseq === 0 ? '因打款需要请绑定您本人的储蓄卡' : '请输入银行卡绑定手机号'}}
		</view>
		<view class="">
			<block class="" v-if="parmloca.pageseq === 0">
				<view class="cu-form-group">
					<view class="title">姓名:</view>
					<input type="text" v-model="parmform.name" @input="input1" placeholder="请输入您的姓名" placeholder-class="text-999999" />
				</view>
				<view class="cu-form-group">
					<view class="title">卡号:</view>
					<input type="text" v-model="parmform.kahao" @input="input1" placeholder="请输入您的银行卡号" placeholder-class="text-999999" />
				</view>
				<view class="cu-form-group">
					<view class="title">开户行:</view>
					<input type="text" v-model="parmform.kaihuhang" @input="input1" placeholder="请输入您的银行卡开户行" placeholder-class="text-999999" />
				</view>
				<view class="padding-sm">
					<view class="flex margin-top">
						<button class="cu-btn text-white round lg flex-sub" :class="parmloca.submitBtn1 ? 'bg-58C3E0' : 'bg-grey'" @tap="submit">下一步</button>
					</view>
					<view class="margin-top flex align-center">
						<label class="flex align-center padding-right-xs" @tap="agreeChang">
							<radio value="1" class="radio blue transform-sm" :checked="parmloca.agree" />
							<text>我同意</text>
						</label>
						<text class="text-58C3E0" @tap="href('/pages/article/agreement?id=1')">《银行卡绑定协议》</text>
					</view>
				</view>
			</block>
			<block class="" v-if="parmloca.pageseq === 1">
				<view class="cu-form-group">
					<view class="title">手机号:</view>
					<input type="text" v-model="parmform.phone" maxlength="11" @input="input2" placeholder="请输入您的手机号" placeholder-class="text-999999" />
				</view>
				<view class="cu-form-group">
					<view class="title">验证码:</view>
					<input type="text" v-model="parmform.code" maxlength="6" @input="input2" placeholder="请输入验证码" placeholder-class="text-999999" />
					<button class="cu-btn shadow round" :class="parmloca.smsbtn ? 'bg-yellow-FFF0CF' : 'bg-grey'" @tap="getsms">{{ parmloca.smstxt }}</button>
				</view>
				<view class="padding-sm">
					<view class="flex margin-top">
						<button class="cu-btn text-white round lg flex-sub" :class="parmloca.submitBtn2 ? 'bg-58C3E0' : 'bg-grey'" @tap="submit">提交</button>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			parmdata: {},
			parmform: {
				name: '吴夕',
				kahao: '123456789',
				kaihuhang: '',
				phone: '13522841811',
				code: ''
			},
			parmloca: {
				submitBtn1: false,
				submitBtn2: false,
				agree: false,
				pageseq: 0,
				smsmiao: 60,
				smstxt: '获取验证码',
				smsbtn: true
			}
		};
	},
	onLoad() {
		let that = this;
	},
	methods: {
		input1(e) {
			this.dd('submitBtn1:' + this.parmform.name + '-' + this.parmform.kahao + '-' + this.parmform.kaihuhang);
			if (this.parmform.name && this.parmform.kahao && this.parmform.kaihuhang) {
				this.parmloca.submitBtn1 = true;
			} else {
				this.parmloca.submitBtn1 = false;
			}
		},
		input2(e) {
			this.dd('submitBtn2:' + this.parmform.phone + '-' + this.parmform.code);
			if (this.parmform.phone && this.parmform.code) {
				this.parmloca.submitBtn2 = true;
			} else {
				this.parmloca.submitBtn2 = false;
			}
		},
		async submit() {
			let that = this;
			this.input1();
			this.input2();
			if (!that.parmloca.agree && this.parmloca.submitBtn1) {
				uni.showToast({
					title: '未同意协议！',
					icon: 'none',
					duration: 2000
				});
				return;
			}
			if(this.parmloca.submitBtn1) {
				that.parmloca.pageseq = 1;
			} else {
				return
			}
			if (that.parmloca.pageseq != 1 || !this.parmloca.submitBtn2) {
				return;
			}
			that.dd('[用户信息完善传递的数据]' + JSON.stringify(that.parmform));
			let frmResult = await that.frmVerification(that.parmform, ['phone', 'code'], ['手机号', '验证码']);

			if (frmResult) {
				let result = await that.ajaxRequest(that, that.routes.api_saveUserInfo, that.parmform, 'post');
				console.log(result);
			}
		},
		agreeChang() {
			this.parmloca.agree = !this.parmloca.agree;
		},
		getsms() {
			if (this.parmloca.smsmiao !== 60) {
				return;
			}
			this.parmloca.smsbtn = false;
			this.smsmiao();
		},
		smsmiao() {
			this.parmloca.smstxt = '倒计时(' + this.parmloca.smsmiao + ')';
			if (this.parmloca.smsmiao > 0) {
				this.parmloca.smsmiao -= 1;
				setTimeout(res => {
					this.smsmiao();
				}, 1000);
			} else {
				this.parmloca.smsmiao = 60;
				this.parmloca.smstxt = '获取验证码';
				this.parmloca.smsbtn = true;
			}
		}
	}
};
</script>
