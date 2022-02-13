<style lang="scss"></style>
<template>
    <view class="content">
        <view class="padding text-333333 text-lg text-center solid-bottom">
            {{paramLoca.pageseq === 0 ? '因打款需要请绑定您本人的储蓄卡' : '请输入银行卡绑定手机号'}}
        </view>
        <view class="">
            <block class="" v-if="paramLoca.pageseq === 0">
                <view class="cu-form-group">
                    <view class="title">姓名:</view>
                    <input type="text" v-model="paramForm.name" @input="input1" placeholder="请输入您的姓名" placeholder-class="text-999999" />
                </view>
                <view class="cu-form-group">
                    <view class="title">卡号:</view>
                    <input type="text" v-model="paramForm.bankCard" @input="input1" placeholder="请输入您的银行卡号" placeholder-class="text-999999" />
                </view>
                <view class="cu-form-group" @tap="getBankAccount">
                    <view class="title">开户行:</view>
                    <input type="text" disabled="" v-model="paramForm.bankName" @input="input1" placeholder="点击自动获取" placeholder-class="text-999999" />
                </view>
                <view class="padding-sm">
                    <view class="flex margin-top">
                        <button class="cu-btn text-white round lg flex-sub" :class="paramLoca.submitBtn1 ? 'bg-58C3E0' : 'bg-grey'" @tap="submit">下一步</button>
                    </view>
                    <view class="margin-top flex align-center">
                        <label class="flex align-center padding-right-xs" @tap="agreeChang">
                            <radio value="1" class="radio blue transform-sm" :checked="paramLoca.agree" />
                            <text>我同意</text>
                        </label>
                        <text class="text-58C3E0" @tap="href('/pages/article/agreement?id=1')">《银行卡绑定协议》</text>
                    </view>
                </view>
            </block>
            <block class="" v-if="paramLoca.pageseq === 1">
                <view class="cu-form-group">
                    <view class="title">手机号:</view>
                    <input type="text" v-model="paramForm.phone" maxlength="11" @input="input2" placeholder="请输入您的手机号" placeholder-class="text-999999" />
                </view>
                <view class="cu-form-group">
                    <view class="title">验证码:</view>
                    <input type="text" v-model="paramForm.code" maxlength="6" @input="input2" placeholder="请输入验证码" placeholder-class="text-999999" />
                    <button class="cu-btn shadow round" :class="paramLoca.smsbtn ? 'bg-yellow-FFF0CF' : 'bg-grey'" @tap="getsms">{{ paramLoca.smstxt }}</button>
                </view>
                <view class="padding-sm">
                    <view class="flex margin-top">
                        <button class="cu-btn text-white round lg flex-sub" v-if="submitLocaing" :class="paramLoca.submitBtn2 ? 'bg-58C3E0' : 'bg-grey'" @tap="submit">提交</button>
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
            paramData: {},
            paramForm: {
                name: '',
                bankCard: '',
                bankName: '',
                phone: '',
                code: '',
            },
            paramLoca: {
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
            this.dd(`submitBtn1:${  this.paramForm.name  }-${  this.paramForm.bankCard  }-${  this.paramForm.bankName}`);
            if (this.paramForm.name && this.paramForm.bankCard && this.paramForm.bankName) {
                this.paramLoca.submitBtn1 = true;
            } else {
                this.paramLoca.submitBtn1 = false;
            }
        },
        input2(e) {
            this.dd(`submitBtn2:${  this.paramForm.phone  }-${  this.paramForm.code}`);
            if (this.paramForm.phone && this.paramForm.code) {
                this.paramLoca.submitBtn2 = true;
            } else {
                this.paramLoca.submitBtn2 = false;
            }
        },
        async submit() {
            const that = this;
            that.input1();
            that.input2();
            if (!that.paramLoca.agree && that.paramLoca.submitBtn1) {
                uni.showToast({
                    title: '未同意协议！',
                    icon: 'none',
                    duration: 2000,
                });
                return;
            }
            if(!that.paramLoca.submitBtn1) {
                return
            }
            if(that.paramLoca.pageseq === 0) {
                // 二要素验证
                const result = await that.$tools.requests(that, that.routes.api_verifyBankCard, that.paramForm, 'post');
                that.paramLoca.pageseq = 1;
            }
            if (that.paramLoca.pageseq != 1 || !that.paramLoca.submitBtn2) {
                return;
            }
            that.dd(`[用户信息完善传递的数据]${  JSON.stringify(that.paramForm)}`);
            const frmResult = await that.frmVerification(that.paramForm, ['phone', 'code'], ['手机号', '验证码']);

            // 提交
            if (frmResult) {
                that.submitLocaing = 0;
                const result = await that.$tools.requests(that, that.routes.api_bindBankCard, that.paramForm, 'post');
                console.log(result);
                uni.navigateBack({
                })
            }
        },
        agreeChang() {
            this.paramLoca.agree = !this.paramLoca.agree;
        },
        async getsms() {
            const that = this;
            if (that.paramLoca.smsmiao !== 60 || !that.paramLoca.smsbtn) {
                return;
            }
            that.paramLoca.smsbtn = false;
            const result = await that.$tools.requests(that, that.routes.api_sendSms, {phone: that.paramForm.phone}, "post").then(res => {
            }).catch(err => {
                that.paramLoca.smsbtn = true;
            });
            that.smsmiao();
        },
        smsmiao() {
            this.paramLoca.smstxt = `倒计时(${  this.paramLoca.smsmiao  })`;
            if (this.paramLoca.smsmiao > 0) {
                this.paramLoca.smsmiao -= 1;
                setTimeout(res => {
                    this.smsmiao();
                }, 1000);
            } else {
                this.paramLoca.smsmiao = 60;
                this.paramLoca.smstxt = '获取验证码';
                this.paramLoca.smsbtn = true;
            }
        },
        // 获取开户行
        async getBankAccount() {
            const that = this
            if (!that.paramForm.bankCard) {
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
            const result = await that.$tools.requests(that, that.routes.api_getBankAccount, {bankCard: that.paramForm.bankCard}, "post");
            that.dd("银行卡和开户行信息", result)
            if(result.data.AccountType !== 1) {
                uni.showToast({
                    title: "请输入储蓄卡卡号",
                    icon: "none",
                    duration: 3000,
                });
                return
            }
            that.paramForm.bankName = result.data.AccountBank
            that.input1()
            uni.hideLoading({})
        },
  	},
};
</script>
