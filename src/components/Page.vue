<template>
    <div
            class="page-container"
    >
        <div class="content-container" ref="contentContainer" :style="`transform: translateY(-50%) scale(${scale})`">
            <slot/>
        </div>
    </div>
</template>

<script>

    const scaleRate = 1008 / 1236;
    const winH = window.innerHeight;


    export default {
        name: "Page",
        props: {
            min: {
                type: Number,
                default: .85
            },
            iphone4Min:{
                type: Number,
                default: .75
            }
        },
        data() {
            return {
                scale: 1
            };
        },
        computed: {
            contentContainer() {
                return this.$refs.contentContainer
            }
        },
        mounted() {
            if (winH < 1008 * scaleRate) {
                let scale = (winH * scaleRate) / this.contentContainer.getBoundingClientRect().height;
                if (scale > 1) {
                    scale = 1;
                }

                if(winH<=553){
                    if(scale<this.iphone4Min){
                        scale = this.iphone4Min;
                    }
                }else{

                    if(scale<this.min){
                        scale = this.min;
                    }
                }

                this.scale = scale;
            }

        }
    }
</script>

<style scoped lang="less">
    .page-container {
        width: 100%;
        height: 100%;
        /*overflow: hidden;*/
        position: relative;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;

        .content-container {
            position: absolute;
            width: 100%;
            top: 50%;
            transform-origin: center center;
            height: 1200px;
            /*border: 1px solid green;*/
        }

    }
</style>
