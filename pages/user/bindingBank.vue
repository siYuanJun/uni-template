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
                    <input type="text" v-model="parmform.bankCard" @input="input1" placeholder="请输入您的银行卡号" placeholder-class="text-999999" />
                </view>
                <view class="cu-form-group" @tap="getBankAccount">
                    <view class="title">开户行:</view>
                    <input type="text" disabled="" v-model="parmform.bankName" @input="input1" placeholder="点击自动获取" placeholder-class="text-999999" />
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
                        <button class="cu-btn text-white round lg flex-sub" v-if="submitLocaing" :class="parmloca.submitBtn2 ? 'bg-58C3E0' : 'bg-grey'" @tap="submit">提交</button>
                        <view class="cu-btn text-white round lg flex-sub" v-else>
                            <view class="cu-load loading"></view>
                        </view>
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
                name: '',
                bankCard: '',
                bankName: '',
                phone: '',
                code: '',
            },
            parmloca: {
                submitBtn1: false,
                submitBtn2: false,
                agree: false,
                pageseq: 0,
                smsmiao: 60,
                smstxt: '获取验证码',
                smsbtn: true,
            },
            submitLocaing: 1,
        };
    },
    onLoad() {
        const that = this;
    },
    methods: {
        input1(e) {
            this.dd(`submitBtn1:${  this.parmform.name  }-${  this.parmform.bankCard  }-${  this.parmform.bankName}`);
            if (this.parmform.name && this.parmform.bankCard && this.parmform.bankName) {
                this.parmloca.submitBtn1 = true;
            } else {
                this.parmloca.submitBtn1 = false;
            }
        },
        input2(e) {
            this.dd(`submitBtn2:${  this.parmform.phone  }-${  this.parmform.code}`);
            if (this.parmform.phone && this.parmform.code) {
                this.parmloca.submitBtn2 = true;
            } else {
                this.parmloca.submitBtn2 = false;
            }
        },
        async submit() {
            const that = this;
            that.input1();
            that.input2();
            if (!that.parmloca.agree && that.parmloca.submitBtn1) {
                uni.showToast({
                    title: '未同意协议！',
                    icon: 'none',
                    duration: 2000,
                });
                return;
            }
            if(!that.parmloca.submitBtn1) {
                return
            }
            if(that.parmloca.pageseq === 0) {
                // 二要素验证
                const result = await that.$tools.requests(that, that.routes.api_verifyBankCard, that.parmform, 'post');
                that.parmloca.pageseq = 1;
            }
            if (that.parmloca.pageseq != 1 || !that.parmloca.submitBtn2) {
                return;
            }
            that.dd(`[用户信息完善传递的数据]${  JSON.stringify(that.parmform)}`);
            const frmResult = await that.frmVerification(that.parmform, ['phone', 'code'], ['手机号', '验证码']);

            // 提交
            if (frmResult) {
                that.submitLocaing = 0;
                const result = await that.$tools.requests(that, that.routes.api_bindBankCard, that.parmform, 'post');
                console.log(result);
                uni.navigateBack({
                })
            }
        },
        agreeChang() {
            this.parmloca.agree = !this.parmloca.agree;
        },
        async getsms() {
            const that = this;
            if (that.parmloca.smsmiao !== 60 || !that.parmloca.smsbtn) {
                return;
            }
            that.parmloca.smsbtn = false;
            const result = await that.$tools.requests(that, that.routes.api_sendSms, {phone: that.parmform.phone}, "post").then(res => {
            }).catch(err => {
                that.parmloca.smsbtn = true;
            });
            that.smsmiao();
        },
        smsmiao() {
            this.parmloca.smstxt = `倒计时(${  this.parmloca.smsmiao  })`;
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
        },
        // 获取开户行
        async getBankAccount() {
            const that = this
            if (!that.parmform.bankCard) {
                uni.showToast({
                    title: '请先输入银行卡号！',
                    icon: 'none',
                    duration: 2000,
                });
                return;
            }
            uni.showLoading({
                title: "获取中...",
            })
            const result = await that.$tools.requests(that, that.routes.api_getBankAccount, {bankCard: that.parmform.bankCard}, "post");
            that.dd("银行卡和开户行信息", result)
            if(result.data.AccountType !== 1) {
                uni.showToast({
                    title: "请输入储蓄卡卡号",
                    icon: "none",
                    duration: 3000,
                });
                return
            }
            that.parmform.bankName = result.data.AccountBank
            that.input1()
            uni.hideLoading({})
        },
  	},
};
</script>
