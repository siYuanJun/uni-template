<template>
    <view class="">
        <u-navbar id="shopNavbar" :title-color="'#000'" :border-bottom="false" :is-back="false"
            :background="{background: '#fff'}" title="商品分类"></u-navbar>

        <view class="header" id="headerDom" :style="{top: navHeight + 'px'}">
            <view class="padding-lr-sm pb-sm align-center flex bg-white">
                <u-input confirm-type="搜索" class="padding-lr flex-sub bg-gray-F2F2F2 text-center"
                    v-model="paramForm.keywords" placeholder="请输入产品名称"></u-input>
                <u-button class="sear-btn ml" @click="handlerSear" hover-class="none">搜索</u-button>
            </view>
        </view>
        
        
        <view class="flex u-relative" :style="{'height': windowsHeight + 'px', 'margin-top': headerHeight + 'px'}">
            
            <view class="page-cate" :style="{'top': (headerHeight + navHeight) + 'px'}">
                <scroll-view scroll-y="true" :style="{'height': windowsHeight + 'px'}">
                    <view class="" v-for="(item, index) in cateData" :key="index">
                        <view class="item text-df text-black " @tap="cateChange(index)"
                            :class="{'bg-gray-F2F2F2 text-themes text-bold': cateIndex === index}">
                            {{item.title}}
                        </view>
                    </view>
                </scroll-view>
            </view>
            
            <view class="page-body flex-sub">
                <view class="shop-tools bg-gray-F2F2F2 flex align-center" :style="{'top': (headerHeight + navHeight) + 'px'}">
                    <view class="flex-sub flex justify-around align-center">
                        <view @tap="sortChange(1)" :class="paramForm.sort === 1 ? 'text-black' : 'text-gray-999'" class="text-center text-df flex align-center justify-center">
                            <view class="mr-sm">
                                按价格
                            </view>
                            <u-icon name="arrow-downward"></u-icon>
                        </view>
                        <view @tap="sortChange(2)" :class="paramForm.sort === 2 ? 'text-black' : 'text-gray-999'" class="text-center text-df flex align-center justify-center">
                            <view class="mr-sm">
                                按销量
                            </view>
                            <u-icon name="arrow-downward"></u-icon>
                        </view>
                    </view>
                </view>
                
                
                <view class="shop-body">
                    <view class="pl-sm">
                        <s-shop-item :shopData="shopData" :likeDom="true" imgHeight="h-xl-2"></s-shop-item>
                        
                        <view class="padding">
                            <u-loadmore :status="loadingMoreStatus" :loadText="loadText"></u-loadmore>
                        </view>
                    </view>
                </view>
            </view>
            
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                navHeight: 0,

                paramForm: {
                    keywords: '',
                    sort: 1,
                },

                cateData: [],
                cateIndex: 0,

                sysInfo: {},
                headerHeight: 0,
                windowsHeight: 0,
                
                shopData: [
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                ],
                
                loadingMoreStatus: 'loadmore',
                loadText: {
                    loadmore: '上拉继续浏览',
                    loading: '努力加载中',
                    nomore: '实在没有了'
                }
            }
        },
        onLoad() {
            this.sysInfo = this.$u.sys()
            this.$nextTick(() => {
                this.queryRect();

            });

            this.getCateData()
        },
        onReachBottom() {
            console.log('page bottom')
            
            this.getData()
        },
        methods: {
            getData() {
                this.loadingMoreStatus = 'loading'
            
            //     this.$sys.$request.managementAudit.getArrivalRegisterList(this.paramForm).then(res => {
            //         console.log("到货物资申请", res.rows)
            
            //         if(this.paramForm.pageNum > 1) {
            //             res.rows.map(item => {
            //                 this.paramData.push(item)
            //             })
            //         } else {
            //             this.paramData = res.rows
            //         }
            
            //     })
                
                // this.loadingMoreStatus = res.rows.length === 0 || res.rows.length < 10 ? 'nomore' : 'loadmore'
            },
            
            sortChange(index) {
                this.paramForm.sort = index
            },
            
            cateChange(index) {
                this.cateIndex = index
            },
            
            getCateData() {
                let cateData = [{
                    title: '全部商品',
                    id: 1,
                }]

                for (let i = 0; i < 20; i++) {
                    let item = {
                        id: i + 1,
                        title: '朗庭中国红' + i,
                    }

                    cateData.push(item)
                }

                this.cateData = cateData
            },
            async queryRect() {
                console.log(this.sysInfo)

                this.navHeight = await this.$uGetRect('#shopNavbar').then(res => {
                    return res.height
                })

                this.headerHeight = await this.$uGetRect('#headerDom').then(res => {
                    return res.height
                })

                this.windowsHeight = this.sysInfo.windowHeight - (this.headerHeight + this.navHeight)
            },

            handlerSear() {
                console.log(this.paramForm.keywords)
            },
        }
    }
</script>

<style lang="scss">
    body,
    page {
        background-color: #f2f2f2;
    }

    .sear-btn {
        .u-btn--default {
            width: 160upx;
            height: 70upx !important;
            line-height: 70upx !important;
            background-color: #080808 !important;
            color: #fff !important;
        }
    }

    .page-cate {
        width: 200upx;
        background-color: #fff;
        position: fixed;
        top: 0;
        left: 0;
        
        .item {
            height: 110upx;
            line-height: 110upx;
            padding-left: 20upx;
        }
    }

    .page-body {
        margin-left: 200upx;
    }

    .header {
        position: fixed;
        left: 0;
        right: 0;
        z-index: 999;
    }
    
    .h-xl-2 {
        height: 260upx;
    }
    
    .shop-tools {
        position: fixed;
        top: 0;
        right: 0;
        left: 200upx;
        z-index: 99;
        height: 110upx;
    }
    
    .shop-body {
        padding-top: 110upx;
    }
</style>
