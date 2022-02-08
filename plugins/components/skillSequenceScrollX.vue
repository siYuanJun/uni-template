<template>
    <view class="skill-sequence-panel-content-wrapper">
        <!--左边虚化-->
        <view class="hide-content-box hide-content-box-left"></view>
        <!--右边虚化-->
        <view class="hide-content-box hide-content-box-right"></view>

        <scroll-view scroll-x="true" class="skill-sequence-panel-content">
            <slot></slot>
        </scroll-view>
    </view>
</template>

<script>
</script>

<style>
    /*scroll-view外层*/
    .skill-sequence-panel-content-wrapper {
        width: 100%;
        position: relative;
        white-space: nowrap;
    }

    /*左右渐变遮罩*/
    .hide-content-box {
        position: absolute;
        top: 0;
        height: 100%;
        width: 32px;
        z-index: 2;
    }

    .hide-content-box-left {
        left: 0;
        background-image: linear-gradient(to left, rgba(255, 255, 255, .001), #ffffff 99%);
    }

    .hide-content-box-right {
        right: 0;
        background-image: linear-gradient(to right, rgba(255, 255, 255, .001), #ffffff 99%);
    }

    /*scroll-view本身*/
    .skill-sequence-panel-content {
        min-width: 100%;
    }

    /*scroll-view内层*/
    .skill-sequence-skill-wrapper {
        margin-left: 2px;
        display: inline-block;
    }

    /*设置空白以保持美观*/
    .skill-sequence-panel-content .skill-sequence-skill-wrapper:first-child {
        margin-left: 18px;
    }

    .skill-sequence-panel-content .skill-sequence-skill-wrapper:last-child {
        margin-right: 16px;
    }
</style>
