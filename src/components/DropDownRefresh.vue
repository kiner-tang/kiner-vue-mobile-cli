<template lang="html">
    <div class="refresh-moudle" @touchstart="touchStart($event)" @touchmove="touchMove($event)"
         @touchend="touchEnd($event)" :style="{transform: 'translate3d(0,' + top + 'px, 0)', transition: transition}">
        <header class="pull-refresh">
            <slot name="pull-refresh">
                <div class="down-tip" v-if="dropDownState==1">
                    <img class="loading-img" src="/assets/images/down.png" alt="">
                    <span class="down-text">{{dropDownInfo.downText}}</span>
                </div>
                <div class="up-tip" v-if="dropDownState==2">
                    <img class="loading-img" src="/assets/images/up.png" alt="">
                    <span class="up-text">{{dropDownInfo.upText}}</span>
                </div>
                <div class="refresh-tip" v-if="dropDownState==3">
                    <img class="loading-img loading" src="/assets/images/loading.gif" alt="">
                    <span class="refresh-text">{{dropDownInfo.refreshText}}</span>
                </div>
            </slot>
        </header>
        <slot></slot>
    </div>
</template>
<script>
    export default {
        props: {},
        data() {
            return {
                defaultOffset: 50, // 默认高度, 相应的修改.releshMoudle的margin-top和.down-tip, .up-tip, .refresh-tip的height
                top: 0,
                scrollIsToTop: 0,
                startY: 0,
                isDropDown: false, // 是否下拉
                isRefreshing: false, // 是否正在刷新
                dropDownState: 1, // 显示1:下拉可以刷新, 2:松开立即刷新, 3:正在刷新数据中...
                dropDownInfo: {
                    downText: '下拉可以刷新',
                    // downImg: 'down.png',
                    upText: '松开立即刷新',
                    // upImg: 'up.png',
                    refreshText: '正在刷新数据...',
                    // refreshImg: 'loading.png'
                },
                transition: ''
            }
        },
        created() {
            if (document.querySelector('.down-tip')) {
                // 获取不同手机的物理像素（dpr）,以便适配rem
                this.defaultOffset = document.querySelector('.down-tip').clientHeight || this.defaultOffset
            }
        },
        methods: {
            /**
             * 触摸开始，手指点击屏幕时
             * @param {object} e Touch 对象包含的属性
             */
            touchStart(e) {
                this.startY = e.targetTouches[0].pageY
            },

            /**
             * 接触点改变，滑动时
             * @param {object} e Touch 对象包含的属性
             */
            touchMove(e) {
                this.scrollIsToTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop // safari 获取scrollTop用window.pageYOffset
                if (e.targetTouches[0].pageY > this.startY) {
                    // 下拉
                    this.isDropDown = true
                    if (this.scrollIsToTop === 0 && !this.isRefreshing) {
                        // 拉动的距离
                        let diff = e.targetTouches[0].pageY - this.startY - this.scrollIsToTop
                        this.top = Math.pow(diff, 0.8) + (this.dropDownState === 3 ? this.defaultOffset : 0)
                        if (this.top >= this.defaultOffset) {
                            this.dropDownState = 2
                            e.preventDefault()
                        } else {
                            this.dropDownState = 1
                            // 去掉会导致ios无法刷新
                            e.preventDefault()
                        }
                    }
                } else {
                    this.isDropDown = false
                    this.dropDownState = 1
                }
            },

            /**
             * 触摸结束，手指离开屏幕时
             * @param {object} e Touch 对象包含的属性
             */
            touchEnd() {
                if (this.isDropDown && !this.isRefreshing) {
                    if (this.top >= this.defaultOffset) {
                        // do refresh
                        this.refresh()
                        this.isRefreshing = true
                    } else {
                        // cancel refresh
                        this.isRefreshing = false
                        this.isDropDown = false
                        this.dropDownState = 1
                        this.top = 0
                    }
                }
            },

            /**
             * 刷新
             */
            refresh() {
                this.dropDownState = 3
                this.top = this.defaultOffset
                // 这是全是静态数据,延时1200毫秒，给用户一个刷新的感觉，如果是接口数据的话，直接调接口即可
                this.$emit("startRefresh", this.refreshDone);
                // setTimeout(() => {
                //     console.log(this);
                //     this.onRefresh&&this.onRefresh(this.refreshDone)
                // }, 1200)
            },

            /**
             * 刷新完成
             */
            refreshDone() {
                this.transition = `transform 500ms`;
                this.isRefreshing = false
                this.isDropDown = false
                this.dropDownState = 1
                this.top = 0;
                setTimeout(()=>{
                    this.transition = `none`;
                },500);
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .refresh-moudle {
        width: 100%;
        margin-top: -100px;
        -webkit-overflow-scrolling: touch; /* ios5+ */
    }

    .pull-refresh {
        width: 100%;
        color: #999;
        transition-duration: 200ms;
        font-size: 24px;
    }

    .refresh-moudle .down-tip,
    .up-tip,
    .refresh-tip {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100px;
    }
    .loading-img{
        display: inline-block;
        vertical-align: middle;
        width: 35px;
        margin-right: 10px;
    }
    .loading-img.loading{
        width: 48px;
    }


    .down-img {
        width: 35px;
        height: 35px;
        margin-right: 15px;
        transform: rotate(0deg);
        animation: anticlockwise 0.8s ease;
    }

    @keyframes anticlockwise {
        0% {
            transform: rotate(-180deg);
        }
        100% {
            transform: rotate(0deg);
        }
    }

    .up-img {
        width: 35px;
        height: 35px;
        margin-right: 15px;
        transform: rotate(180deg);
        animation: clockwise 0.8s ease;
    }

    @keyframes clockwise {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(-180deg);
        }
    }

    .refresh-img {
        width: 35px;
        height: 35px;
        margin-right: 15px;
        animation: rotating 1.5s linear infinite;
    }

    @keyframes rotating {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(1turn);
        }
    }
</style>