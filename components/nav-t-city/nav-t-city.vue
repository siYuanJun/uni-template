<template>
    <view class="container">
        <!-- 城市搜索 -->
        <view class="city-search-wrap" v-if="isReach">
            <view class="search">
                <view class="l-search">
                    <text class="icon-search cuIcon-search"></text>
                    <input class="input-search" type="text" :value="inputValue" placeholder="输入城市名或拼音" placeholder-style="color:#8E8F97" :focus="searchFocus" @input="searchChange" />
                    <text class="clear-input iconfont icon-icon-test" v-if="isClearBtn" @click="inputValue = ''"></text>
                </view>
                <view class="r-cancel" open-type="navigateBack" delta="1" @click="isReach = false">取消</view>
            </view>
            <!-- 搜索列表  -->
            <view class="reach-content" v-show="inputValue">
                <block v-show="searchData.length">
                    <view class="li borderBottom" v-for="item in searchData" :key="item.cityId" @click="citySearchList(item)">{{ item.city }}</view>
                </block>
                <view class="has-no-data" v-show="hasNoData">没有找到匹配数据~</view>
            </view>
        </view>

        <!-- 城市列表 -->
        <view v-show="!isReach">
            <view class="top-search">
                <view class="item" @click="isReach = true">
                    <text class="cuIcon-search"></text>
                    <text>输入城市名或拼音</text>
                </view>
            </view>
            <scroll-view class="scroll-view" scroll-y scroll-with-animation="true" enable-back-to-top="true" :scroll-into-view="toIndex" @scroll="scrollHandle">
                <view class="block">
                    <!-- 当前城市 -->
                    <view class="area borderBottom list-item" id="area">
                        <view class="title-wrapp">
                            <view class="title">
                                <text class="l">
                                    当前：
                                    <text>{{ areaName }}</text>
                                </text>
                                <!-- <text class="r " :class="{ isHide: isToggle }" @click="isToggle = !isToggle" v-if="regionList.length">
									切换区县
									<text class="iconfont" :class="isToggle ? 'icon-arrow-up' : 'icon-arrow-down'"></text>
								</text> -->
                            </view>
                        </view>
                        <view class="ul" v-if="isToggle">
                            <view class="li oneEllipsis" hover-class="hover" :class="{ active: areaName == item.areaName }" v-for="item in regionList" :key="item.areaId" @click="selectRegion(item)">
                                {{ item.areaName }}
                            </view>
                        </view>
                    </view>

                    <!-- 热门城市 -->
                    <view class="area borderBottom list-item" id="hot">
                        <view class="title-wrapp">
                            <view class="title"><text class="l">热门城市</text></view>
                        </view>
                        <view class="ul" v-if="hotcites.length">
                            <view class="li" hover-class="hover" v-for="item in hotcites" :key="item.cityId" @click="selectCity(item)">{{ item.cityName }}</view>
                        </view>
                    </view>
                </view>
                <!-- 城市列表  -->
                <view class="city-list">
                    <view class="list list-item" v-for="(item, key) of cities" :key="key" :id="key">
                        <view class="title">{{ key }}</view>
                        <view class="item borderBottom" hover-class="hover" v-for="innerItem in item" :key="innerItem.cityId" @click="selectCity(innerItem)">{{ innerItem.city }}</view>
                    </view>
                </view>
            </scroll-view>

            <!-- 字母列表 -->
            <view class="alphabet" @touchstart="touchStart" @touchend="touchEnd" @touchmove.stop="touchMove">
                <view v-for="(item, index) in alphabet" :key="index" @touchstart="getLetter" @touchend="setLetter" :id="item">
                    <view class="item" :class="{ active: currentLetter == item }">{{ item == 'area' ? '区县' : item == 'hot' ? '热门' : item }}</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import City from './city.json'
export default {
    name: 'nav-t-city',
    props: {
      areaName: {
          type: String,
          default: '北京市'
      },
      cityData: {
          type: Object,
          default: {}
      }
    },
    data() {
        return {
            isIPX: null,
            regionId: null, //区域ID
            isToggle: false,
            isReach: false,
            inputValue: '',
            searchData: [], //搜索的数据
            isClearBtn: false,

            regionList: City.data.area, //区域列表,模拟数据请自行修改
            cityId: null, //城市ID
            cityName: null, //城市名

            hotcites: [], //热门城市，模拟数据请自行修改
            cities: City.data.cities, //城市列表,拟数据请自行修改

            alphabet: City.data.alphabet, //字母列表
            toIndex: '', //跳转的索引的字母
            tipsLetter: '', //滑动显示字母
            timer: null,
            hasNoData: false,
            searchFocus: false,
            letterDetails: [],
            currentLetter: 'area', //默认选择hot
        }
    },
    watch: {
        cityData(newVal, oldVal) {
            this.hotcites = newVal.hotcity
        },
        // 城市搜索输入框
        inputValue(newVal) {
            this.isClearBtn = newVal ? true : false

            if (this.timer) {
                clearTimeout(this.timer)
            }

            if (!this.inputValue) {
                this.searchData = []
                return
            }
            this.timer = setTimeout(() => {
                const result = []
                for (let i in this.cities) {
                    this.cities[i].forEach((item) => {
                        if (item.spell.includes(this.inputValue) || item.city.includes(this.inputValue)) {
                            result.push(item)
                        }
                    })
                }
                this.searchData = result
                if (this.searchData.length === 0) {
                    this.hasNoData = true
                } else {
                    this.hasNoData = false
                }
            }, 500)
        },
        isReach(val) {
            this.searchFocus = val
        },
    },
    created() {
        //真实数据请求...
    },
    methods: {
        //列表滚动，和右边字母表对应
        scrollHandle(e) {
            let view = uni
                .createSelectorQuery()
                .in(this)
                .selectAll('.list-item')
            view.boundingClientRect((d) => {
                let top = d[0].top
                d.forEach((item) => {
                    item.top = item.top - top
                    item.bottom = item.bottom - top
                    this.letterDetails.push({
                        id: item.id,
                        top: item.top,
                        bottom: item.bottom,
                    })
                })
            }).exec()

            const scrollTop = e.detail.scrollTop
            this.letterDetails.some((item) => {
                if (scrollTop >= item.top && scrollTop <= item.bottom - 20) {
                    this.currentLetter = item.id
                    //当前固定用的是粘性定位，如果不用粘性定位，在这里设置
                    return true
                }
            })
        },

        //搜索
        searchChange(e) {
            let { value } = e.detail
            this.inputValue = value
        },

        //搜索结果列表数据
        citySearchList(item) {
            console.log('选择的城市：', item)
            this.$emit("cityClickChang", item)
        },

        selectCity(item) {
            console.log('选择的城市：', item)
            this.$emit("cityClickChang", item)

            //当前项目是需要选择到区域，所以选择城市后回到区县的地方
            // this.toIndex = 'area'
            // setTimeout(() => {
            //     this.toIndex = ''
            // }, 1000)
        },

        //区域选择
        selectRegion(item) {
            console.log('选择的区域是：', item)
        },

        //触发开始
        touchStart(e) {
            // console.log(e);
        },
        //移动时
        touchMove(e) {
            uni.vibrateShort()
            let y = e.touches[0].clientY
            let offsettop = e.currentTarget.offsetTop

            //判断选择区域,只在选择区才会生效
            if (y > offsettop) {
                let num = parseInt((y - offsettop) / 15) //右边每个字母元素的高度
                let letter = this.alphabet[num]
                this.tipsLetter = letter

                let curentLetter = this.letterTransform(letter)
                uni.showToast({
                    title: curentLetter,
                    icon: 'none',
                    duration: 1000,
                })
            }
        },
        //触发结束
        touchEnd() {
            this.toIndex = this.tipsLetter
        },
        //移动开始获取字母，并放大提示
        getLetter(e) {
            uni.vibrateShort()
            let { id } = e.currentTarget
            this.tipsLetter = id

            let curentLetter = this.letterTransform(id)
            uni.showToast({
                title: curentLetter,
                icon: 'none',
                duration: 1000,
            })
        },
        //移动结束设置字母，赋值到toIndex
        setLetter() {
            this.toIndex = this.tipsLetter
        },

        //提示字母转换
        letterTransform(letter) {
            let str = ''
            if (letter == 'area') {
                str = '区县'
            } else if (letter == 'hot') {
                str = '热门'
            } else {
                str = letter
            }

            return str
        },
    },
}
</script>

<style lang="scss">
body, page {
    background: #ffffff;
}

.borderBottom {
    position: relative;

    &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1upx;
        background: #dedede;
        transform: scaleY(0.5);
    }
}

.city-search-wrap {
    width: 100%;
    padding: 0upx 30upx 0 30upx;
    box-sizing: border-box;

    .search {
        width: 100%;
        height: 100upx;
        display: flex;
        align-items: center;
        font-size: 24upx;
        color: #222;
        padding: 20upx 30upx;
        box-sizing: border-box;
        position: fixed;
        left: 0;
        z-index: 1;
        background: #fff;

        .l-search {
            display: flex;
            flex: 1;
            position: relative;
            height: 60upx;
            line-height: 60upx;

            .icon-search {
                font-size: 22upx;
                position: absolute;
                left: 30upx;
                top: 50%;
                transform: translateY(-50%);
                color: #8e8f97;
                font-weight: 700;
            }

            .input-search {
                height: 66upx;
                box-sizing: border-box;
                padding: 0 100upx 0 100upx;
                text-align: center;
                background: #f4f5f9;
                border-radius: 50upx;
                border: 0;
                width: 100%;
                font-size: 24upx;
            }

            .clear-input {
                font-size: 30upx;
                position: absolute;
                right: 10upx;
                top: 50%;
                transform: translateY(-50%);
                padding: 10upx;
                color: #8e8f97;
            }
        }

        .r-cancel {
            margin-left: 28upx;
            padding-right: 30upx;
            padding: 0;
            font-size: 30upx;
            height: 60upx;
            line-height: 60upx;
            background: transparent;
            border: 0;
        }
    }
}

.reach-content {
    padding-top: 100upx;

    .li {
        font-size: 32upx;
        color: #333;
        padding: 20upx 0;
        position: relative;
    }
}

.block {
    padding: 0 30upx;
    box-sizing: border-box;
}

.borderBottom {
    position: relative;

    &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1upx;
        background: #dedede;
        transform: scaleY(0.5);
    }
}

.top-search {
    padding: 30upx;
    box-sizing: border-box;
    margin-bottom: 20upx;

    .item {
        height: 66upx;
        background: #f4f5f9;
        border-radius: 50upx;
        font-size: 24upx;
        text-align: center;
        color: #8e8f97;
        text {
            padding-left: 10upx;
            color: #c1c2cd;
            font-size: 24upx;
        }
        display: flex;
        align-items: center;
        justify-content: center;

        .icon-search {
            font-size: 26upx;
            color: #8e8f97;
            font-weight: 700;
        }
    }
}

.scroll-view {
    width: 100%;
    height: calc(100vh - 80upx);
    box-sizing: border-box;
}

.area {
    padding-bottom: 40upx;
    margin-bottom: 44upx;

    .title-wrapp {
        position: sticky;
        top: 0;
        left: 0;
        background: #fff;
    }

    .title {
        width: 100%;
        box-sizing: border-box;
        font-size: 40upx;
        font-weight: 500;
        color: #222;
        font-size: 30upx;
        font-weight: 500;
        display: inline-flex;
        justify-content: space-between;
        align-items: center;

        .r {
            font-size: 24upx;
            color: #8e8f97;
            display: inline-block;
            align-items: center;

            .iconfont {
                font-size: 24upx;
            }
        }
    }

    .ul {
        display: flex;
        flex-wrap: wrap;

        .li {
            width: calc(33.33% - 38upx);
            margin-top: 20upx;
            margin-right: 30upx;
            padding: 0 10upx;
            box-sizing: border-box;
            height: 70upx;
            line-height: 70upx;
            text-align: center;
            font-size: 26upx;
            color: #222;
            border-radius: 10upx;
            background: #f4f5f9;

            &.active {
                font-weight: 500;
                background: #35bfb0;
                color: #fff;
            }
        }
    }
}

.city-list {
    margin-right: 80upx;
    padding-bottom: 50upx;

    .title {
        height: 60upx;
        line-height: 60upx;
        font-size: 30upx;
        font-weight: 500;
        color: #272636;
        background: #f4f5f9;
        margin-bottom: 20upx;
        padding-left: 30upx;
        position: sticky;
        top: 0;
        left: 0;
        z-index: 2;
    }

    .item {
        padding: 24upx 0 24upx 30upx;
        color: #333;
        font-size: 32upx;
        font-weight: 500;

        &::after {
            left: 30upx;
            width: calc(100% - 30upx);
            background: #d2d2d2;
        }
    }

    .hover {
        background: #f4f5f9;

        &::after {
            background: #f4f5f9;
        }
    }
}

.alphabet {
    position: fixed;
    right: 18upx;
    bottom: 20%;
    text-align: center;
    font-size: 20upx;
    font-weight: 700;
    color: #8e8f97;

    .item {
        height: 30upx;
        line-height: 30upx;
    }

    .active {
        color: #222;
    }
}

.has-no-data {
    font-size: 24upx;
    text-align: center;
    color: #8e8f97;
    margin-top: 50upx;
}
</style>
