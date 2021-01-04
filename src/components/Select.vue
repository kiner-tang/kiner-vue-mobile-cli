<template>
    <div :class="{'select-container': true, 'show': isShowing}" v-show="showModal">
        <div class="mask" v-if="mask"></div>
        <div class="select-content-container">
            <div class="header-container">
                <div class="title">地区选择</div>
                <div class="select-values">
                    <div class="select-value-item">{{values[0]?values[0]:"请选择"}}</div>
                    <div class="select-value-item">{{values[1]?values[1].school:"请选择"}}</div>
                </div>
            </div>
            <div class="select-panel">
                <div class="col">
                    <swiper
                            :options="swiperOption"
                            ref="provinceSwiper"
                            @slideChange="slideChangeProvince"
                            v-show="provinceList.length"
                            v-if="swiperOption.virtual.slides.length!==0"
                    >
<!--                        <swiper-slide v-for="(item, index) in provinceList" :key="index">-->
<!--                            <div class="select-item">{{item}}</div>-->
<!--                        </swiper-slide>-->
                    </swiper>
                </div>
                <div class="col">
                    <swiper
                            :options="swiperOption2"
                            ref="schoolSwiper"
                            @slideChange="slideChangeSchool"
                            v-if="swiperOption2.virtual.slides.length!==0&&isSchoolSwiperShow"
                    >
<!--                        <swiper-slide v-for="(item, index) in schoolList" :key="index">-->
<!--                            <div class="select-item">{{item.school}}</div>-->
<!--                        </swiper-slide>-->
                    </swiper>
                </div>
            </div>
            <div class="footer">
                <div class="btn btn-cancel" @click="doCancel">取消</div>
                <div class="btn btn-ok" @click="doSure">确定</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Select",
        props: {
            list: {
                type: Object,
                default: ()=>{}
            },
            mask: {
                type: Boolean,
                default: true
            },
            show:{
                type: Boolean,
                default(){
                    return false
                }
            },
        },
        model: {
            prop: 'show',
            event: 'change'
        },
        computed: {
            provinceSwiper(){
                return this.$refs.provinceSwiper.swiper
            },
            schoolSwiper(){
                return this.$refs.schoolSwiper.swiper
            }
        },
        data() {
            if(this.show){
                setTimeout(()=>{
                    this.isShowing = true;
                },10);
            }
            const provinceNameList = Object.keys(this.list);

            const schoolList = this.list[provinceNameList[0]].children;
            // console.log('---->',schoolList);
            this.$emit('selectChange', 'initial', [provinceNameList[0], schoolList[0]]);
            this.selectedItem = schoolList[0];
            return {
                isShowing: false,
                values: [provinceNameList[0], schoolList[0]],
                showModal: this.show,
                provinceList: provinceNameList,
                swiperOption: {
                    direction: "vertical",
                    slidesPerView: 9,
                    slideToClickedSlide: true,
                    centeredSlides: true,
                    loop: false,
                    virtual: {
                        slides: provinceNameList,
                        renderSlide: function (slide) {
                            return `<div class="swiper-slide"><div class="select-item">${slide}</div></div>`;
                        },
                        cache: false
                    }
                },
                swiperOption2: {
                    direction: "vertical",
                    slidesPerView: 9,
                    slideToClickedSlide: true,
                    centeredSlides: true,
                    loop: false,
                    virtual: {
                        slides: schoolList,
                        renderSlide: function (slide) {
                            console.log(slide.school);
                            return `<div class="swiper-slide"><div class="select-item">${slide.school}</div></div>`;
                        },
                        cache: false
                    }
                },
                isSchoolSwiperShow: true
            };
        },
        created() {

        },
        methods: {
            slideChangeProvince() {
                this.schoolSwiper.virtual.removeAllSlides();
                this.schoolSwiper.virtual.slides = this.list[this.provinceList[this.provinceSwiper.activeIndex]].children;
                this.selectedItem = this.schoolSwiper.virtual.slides[0];
                this.values = [this.provinceList[this.provinceSwiper.activeIndex], this.selectedItem];
                this.$emit('selectChange', 'province', [this.provinceList[this.provinceSwiper.activeIndex], this.selectedItem]);
                this.schoolSwiper.update();
                this.schoolSwiper.virtual.update();

            },
            slideChangeSchool() {
                this.selectedItem = this.schoolSwiper.virtual.slides[this.schoolSwiper.activeIndex];
                this.values = [this.provinceList[this.provinceSwiper.activeIndex], this.selectedItem];
                this.$emit('selectChange', 'school', [this.provinceList[this.provinceSwiper.activeIndex], this.selectedItem]);
            },
            closeModal(cb) {
                this.isShowing = false;
                setTimeout(()=>{
                    this.$emit('change',false);
                    cb&&cb();
                },500);
            },
            doCancel(){
                this.closeModal(()=>this.$emit('cancel'));
            },
            doSure(){
                this.$emit('ok', [this.provinceList[this.provinceSwiper.activeIndex], this.selectedItem], this.closeModal)
            }
        },
        watch: {
            show(newValue) {
                if(newValue){
                    this.showModal = newValue;
                    setTimeout(()=>{
                        this.isShowing = newValue;
                        this.schoolSwiper.update();
                        this.provinceSwiper.update();
                    },10);

                }else{
                    this.isShowing = newValue;
                    setTimeout(()=>{
                        this.$emit('change',false);
                        this.showModal = newValue;
                    },500);
                }

            }
        },
    }
</script>

<style scoped lang="less">
    @borderColor: #9d3839;
    @selectedColor: #ff445f;
    .select-container{
        width: 100vw;
        height: 100vh;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 999999;
        transform: translate3d(0,0,0);
        .mask {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 10;
            opacity: 0;
            transition: opacity .5s;
        }
        .select-content-container{
            width: 90%;
            border: 3px solid @borderColor;
            border-bottom: none;
            box-sizing: border-box;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%) translateY(200%);
            background: #FFFFFF;
            z-index: 11;
            border-radius: 20px 20px 0 0;
            display: flex;
            flex-direction: column;
            transition: 800ms all;
            .header-container{
                .title{
                    font-size: 33px;
                    color: #000000;
                    text-align: center;
                    padding: 30px 0;
                }
                .select-values{
                    display: flex;
                    justify-content: space-between;
                    .select-value-item{
                        height: 60px;
                        line-height: 60px;
                        flex: 1;
                        &:nth-child(2){
                            flex: 1.5;
                        }
                        text-align: center;
                        font-size: 27px;
                        color: #000000;
                    }
                }
            }

            .select-panel{
                height: 800px;
                box-sizing: border-box;
                border-top: 3px solid @borderColor;
                display: flex;
                justify-content: space-between;
                .col{
                    flex: 1;
                    &:nth-child(2){
                        flex: 1.5;
                    }
                    height: 100%;
                    overflow: hidden;
                    /deep/ .swiper-container{
                        height: 100%;
                        perspective: 1000px;
                        .select-item{
                            width: 100%;
                            font-size: 20px;
                            color: #c3c3c3;
                            display: inline-block;
                            vertical-align: middle;
                            text-align: center;
                            transition: 500ms all;
                            opacity: .8;
                            transform:  rotateX(25deg) scale(.8);
                        }
                        .swiper-slide-active{
                            .select-item{
                                color: @selectedColor;
                                opacity: 1;
                                transform:rotateX(0) scale(1) ;
                                font-size: 28px;
                            }

                        }
                    }
                }
            }
            .footer{
                height: 80px;
                line-height: 80px;
                box-sizing: border-box;
                border-top: 3px solid @borderColor;
                display: flex;
                justify-content: space-between;
                .btn{
                    flex: 1;
                    font-size: 27px;
                    color: @selectedColor;
                    text-align: center;
                    &.btn-cancel{
                        color: #000000;
                        border-right: 3px solid @borderColor;
                    }
                }
            }
        }
        &.show {
            .mask{
                opacity: 1;
            }
            .select-content-container{
                transform: translate3d(-50%,0,0);
            }
        }
    }
</style>