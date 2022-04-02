<template>
    <view class="slot-content" style="height: 600upx;">
        <view class="dropdown direction show">
            <scroll-view class="dropdown-item item1" scroll-y="true">
                <view class="u-dropdown-item__options">
                    <u-cell-group>
                        <u-cell-item title="不限" @click="all(0)">
                            <u-icon v-if="value[0] == 0" name="checkbox-mark" :color="activeColor" size="32"></u-icon>
                        </u-cell-item>
                    </u-cell-group>
                </view>
                <view class="u-dropdown-item__options">
                    <u-cell-group>
                        <u-cell-item :title="item.name" @click="openPanel(1,index,item.id)"
                            v-for="(item, index) in jobCateList" :key="index" :title-style="{
							color:value[0] == item.id ? activeColor : inactiveColor
						}">
                            <u-icon v-if="value[0] == item.id" name="checkbox-mark" :color="activeColor" size="32">
                            </u-icon>
                        </u-cell-item>
                    </u-cell-group>
                </view>
            </scroll-view>

            <view class="popup_bg second " :class="panelIndex>0?'show':'hidden'" @click="closePanel(0)"></view>
            <scroll-view class="dropdown-item item2  " :class="panelIndex>0?'show':'hidden'" scroll-y="true">
                <view class="u-dropdown-item__options">
                    <u-cell-group>
                        <u-cell-item :title="titleList['0']" @click="all(1)">
                            <u-icon v-if="value[1] == 0" name="checkbox-mark" :color="activeColor" size="32"></u-icon>
                        </u-cell-item>
                    </u-cell-group>
                </view>
                <view class="u-dropdown-item__options">
                    <u-cell-group>
                        <u-cell-item :title="item.name" @click="openPanel(2,index,item.id)"
                            v-for="(item, index) in secondList" :key="index" :title-style="{
							color: value[1] == item.id ? activeColor : inactiveColor
						}">
                            <u-icon v-if="value[1] == item.id" name="checkbox-mark" :color="activeColor" size="32">
                            </u-icon>
                        </u-cell-item>
                    </u-cell-group>
                </view>
            </scroll-view>
            <!-- <view class="popup_bg lowest " :class="panelIndex>1?'show':'hidden'" @click="closePanel(1)"></view>
		<scroll-view class="dropdown-item item3  " :class="panelIndex>1?'show':'hidden'" scroll-y="true">
			<view class="u-dropdown-item__options">
				<u-cell-group>
					<u-cell-item :title="titleList['1']" @click="all(2)"><u-icon v-if="value['2'] == 0" name="checkbox-mark" :color="activeColor" size="32"></u-icon></u-cell-item>
				</u-cell-group>
			</view>
			<view class="u-dropdown-item__options">
				<u-cell-group>
					<u-cell-item :title="item.name" @click="openPanel(0,0,item.id)"  v-for="(item, index) in threeList"
						 :key="index" :title-style="{
							color: value['2'] == item.id ? activeColor : inactiveColor
						}"><u-icon v-if="value['2'] == item.id" name="checkbox-mark" :color="activeColor" size="32"></u-icon></u-cell-item>
				</u-cell-group>
			</view>
		</scroll-view> -->
        </view>
    </view>
</template>

<script>
    export default {
        name: 'CateSelect',
        props: {
            valueDefault: {
                type: Array,
                default () {
                    return ['', '', '']
                }
            },
            jobCateList: {
                type: Array,
                default () {
                    return []
                }
            }

        },
        data() {
            return {
                panelIndex: 0,
                active: false,
                activeColor: '#2979ff',
                inactiveColor: '#606266',
                secondList: [],
                threeList: [],
                titleList: [],

                value: [0, 0, 0]
            };
        },
        methods: {
            openPanel(index, dataindex, id) {
                this.panelIndex = index;
                console.log("openPanel", index, dataindex, id);
                switch (index) {
                    case 1:
                        this.$set(this.value, '0', id)
                        this.secondList = this.jobCateList[dataindex]['children'];
                        this.titleList['0'] = '全部-' + this.jobCateList[dataindex]['name'];
                        break;
                    case 2:
                        this.$set(this.value, '1', id)
                        this.threeList = this.secondList[dataindex]['children'];
                        this.titleList['1'] = '全部-' + this.secondList[dataindex]['name'];
                        break;
                    case 0:
                        this.$set(this.value, '2', id)
                        this.threeList = this.secondList[dataindex]['children'];
                        break;
                }
                this.$emit('jobChange', this.value);
            },
            closePanel(index) {
                this.panelIndex = index;
                console.log("closePanel", this.panelIndex);
            },
            all(index) {
                switch (index) {
                    case 0:
                        this.value.splice(0, 3);
                        break;
                    case 1:
                        this.value.splice(2, 1);
                        break;
                }
                this.value[index] = 0;
                this.$emit('jobChange', this.value);
            }
        },

    };
</script>

<style lang="scss" scoped>
    .slot-content {
        position: relative;
    }
    
    .popup_bg {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2;
        background: rgba(0, 0, 0, 0.5);
        opacity: 1;
        transform: scale3d(1, 1, 1);
        transition: all 0.3s ease-in;
    }

    .popup_bg.hidden {
        opacity: 0;
        transform: scale3d(1, 1, 0);
    }

    .dropdown {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;
        height: 100%;
        background: #fff;
        transform: translateY(100%);
        backface-visibility: hidden;
        transition: transform 0.3s;
        transition: transform 0.3s, -webkit-transform 0.3s;
        overflow: hidden;
    }

    .dropdown.direction {
        position: absolute;
        top: 0;
        bottom: normal;
        transform: translateY(0);
        display: none;
    }

    .dropdown.show {
        transform: translateY(0);
        display: inline-block;
    }

    .dropdown.hidden {
        display: none;
    }

    .dropdown .dropdown-item {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        height: 100%;
        text-align: left;
        background: #fff;
    }

    .dropdown .second {
        position: absolute;
        background: rgba(0, 0, 0, 0.2);
        z-index: 1;
    }

    .dropdown .item2 {
        top: 0;
        left: 25%;
        right: 0;
        bottom: 0;
        z-index: 2;
        width: auto;
        transform: translateX(100%);
        backface-visibility: hidden;
        transition: transform 0.3s;
        transition: transform 0.3s, -webkit-transform 0.3s;
        overflow: hidden;
    }

    .dropdown .lowest {
        position: absolute;
        background: rgba(0, 0, 0, 0.1);
        z-index: 3;
        left: 25%;
    }

    .dropdown .item3 {
        top: 0;
        left: 50%;
        right: 0;
        bottom: 0;
        z-index: 4;
        transform: translateX(100%);
        backface-visibility: hidden;
        transition: transform 0.3s;
        transition: transform 0.3s, -webkit-transform 0.3s;
        overflow: hidden;
    }

    .dropdown .dropdown-item.show {
        transform: translateX(0);
    }
</style>
