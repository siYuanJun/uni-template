<template>
    <view class="">
        <u-navbar id="cart-navbar" :title-color="'#000'" :border-bottom="false" :is-back="false"
            :background="{background: '#fff'}" title="购物车"></u-navbar>

        <view class="cart-header cart-header-height padding-lr align-center flex justify-between text-df" v-if="navHeight"
            :style="{top: navHeight + 'px'}">
            <view class="text-gray-999">
                共{{shopList.length}}件商品
            </view>
            <view class="text-gray-999" v-if="!delStatus" @tap="delStatus = !delStatus">
                批量删除
            </view>
            <view class="text-themes" v-else @tap="delStatus = !delStatus">
                完成
            </view>
        </view>
        <view class="cart-header-height"></view>


        <view class="padding-lr-sm">
            <u-checkbox-group active-color="#C7A163" @change="groupCheckChange">
                <view class="mb-sm" v-for="(item, index) in shopList" :key="index">
                    <u-swipe-action class="swiper-action-radius" :show="item.actionShow" :index="item.id" @open="swiperActionOpen"
                        @click="swiperActionClick" :options="swiperActionOptions">
                        <view class="padding bg-white radius">
                            <view class="flex align-center">
                                <u-checkbox shape="circle" :name="item.id" v-model="item.checked">
                                </u-checkbox>
                                <view class="flex-sub flex">
                                    <view class="img-wh"
                                        :style="'background: url('+item.image+') no-repeat center/cover'">
                                    </view>
                                    <view class="flex-sub ml-sm align-stretch">
                                        <view class="">
                                            <view class="text-lg text-black-000 max-text-2">
                                                {{item.actionShow}} {{item.id}}{{item.title}}
                                            </view>
                                            <view class="text-gray-999 text-sm mt-xs">
                                                规格: {{item.guige}}
                                            </view>
                                        </view>
                                        <view class="flex justify-between align-center">
                                            <view class="text-price text-themes text-lg text-bold">
                                                1988
                                            </view>
                                            <u-number-box bg-color="#fff" class="cart-number" :min="1"
                                                v-model="item.num">
                                            </u-number-box>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </u-swipe-action>
                </view>
            </u-checkbox-group>
        </view>


        <view class="footer-height"></view>
        <view class="cu-bar foot">
            <view class="flex-sub padding-tb-sm padding-lr bg-white flex align-center justify-between">
                <view class="flex align-center">
                    <u-checkbox shape="circle" v-model="selectAllStatus" @change="selectAllChange">
                        全选
                    </u-checkbox>
                    <view v-if="delStatus" class="text-themes ml text-df" @tap="handlerDel()">
                        删除
                    </view>
                </view>
                <view class="flex align-center">
                    <view class="flex align-end">
                        <view class="">
                            合计：
                        </view>
                        <view class="text-price text-themes text-lg text-bold">
                            800
                        </view>
                    </view>
                    <button class="cu-btn round bg-themes text-white ml-sm pl-xl pr-xl" @tap="handlerSubmit">结算</button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                delStatus: false,
                selectAllStatus: false,

                swiperActionOptions: [{
                    text: '删除',
                    style: {
                        backgroundColor: '#dd524d'
                    }
                }],

                shopList: [],
                shopCheck: [],

                navHeight: 0
            }
        },
        onLoad() {
            this.getShopData()

            this.$nextTick(() => {
                this.queryRect();
            });
        },
        methods: {
            queryRect() {
                this.$uGetRect('#cart-navbar').then(res => {
                    this.navHeight = res.height;
                }).catch(err => {
                    console.log(err)
                })
            },
            getShopData() {
                let shopData = []
                for (let i = 0; i < 10; i++) {
                    let shopItem = {
                        id: (i + 1),
                        title: '明前高档特级绿茶2021 新茶高山云雾茶毛尖春茶',
                        guige: '200/盒',
                        image: 'https://cdn.uviewui.com/uview/swiper/3.jpg',

                        actionShow: false,
                        checked: false,
                        num: 1,
                    }

                    shopData.push(shopItem)
                }

                this.shopList = shopData
            },
            handlerSubmit() {
                console.log("去结算", this.shopCheck)
            },
            groupCheckChange(e) {
                console.log("选中的数据", e)

                this.shopCheck = e
                this.selectAllStatus = this.shopCheck.length === this.shopList.length
            },
            selectAllChange(e) {
                let shopCheck = []

                this.shopList.map((val, index) => {
                    val.checked = e.value;

                    if (e.value) {
                        shopCheck.push(val.id)
                    }
                })

                this.shopCheck = shopCheck

                console.log(this.shopCheck)
            },
            handlerDel(ids) {
                console.log("删除选中商品", this.shopCheck)
                console.log("单个删除商品", ids)

                let shopArr = ids ? ids : this.shopCheck

                for (let i = 0; i < shopArr.length; i++) {
                    let shopId = shopArr[i]
                    console.log("商品ID", shopId)

                    this.shopList.map((item, index) => {
                        if (item.id === shopId) {
                            this.shopList.splice(index, 1)
                        }
                    })
                    
                    this.shopCheck.map((id, index) => {
                        if (id === shopId) {
                            this.shopCheck.splice(index, 1)
                        }
                    })
                }

            },
            swiperActionClick(index, actionIndex) {
                if (actionIndex === 0) {
                    this.handlerDel([index])
                }
            },
            swiperActionOpen(index) {
                this.shopList.map((val, idx) => {
                    if (index != val.id) {
                        this.shopList[idx].actionShow = false
                    } else {
                        this.shopList[idx].actionShow = true
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    body,
    page {
        background-color: #f2f2f2;
    }
    
    .swiper-action-radius {
        > *, > view {
            border-radius: 10upx;
            overflow: hidden;
        }
    }

    .img-wh {
        width: 210upx;
        height: 180upx;
        border-radius: 10upx;
    }

    .footer-height {
        height: 140upx;
    }

    .cart-number {
        border: 1upx solid #b9b9b9;
        border-radius: 10upx;
        overflow: hidden;

        .u-icon-minus {
            border-right: 1upx solid #b9b9b9;
        }

        .u-icon-plus {
            border-left: 1upx solid #b9b9b9;
        }

    }

    .cart-header {
        position: fixed;
        left: 0;
        right: 0;
        z-index: 99;
        background-color: #f2f2f2;
    }
    
    .cart-header-height {
        height: 90upx;
    }
    
</style>
