<template>

    <DropDownRefresh @startRefresh="handleRefresh">
        <div class="index-container">
            <preload-image
                    v-if="!isPreloadCompleted"
                    :imgs="preloadImages"
                    tips="进度$progress$%"
                    @completed="preloadImageCompleted"
            >
                <!-- <div>这是提示文字</div> -->
            </preload-image>
        </div>
    </DropDownRefresh>

</template>

<script>
    /* eslint-disable no-console */
    import DropDownRefresh from "../../components/DropDownRefresh";

    import PreloadImage from "../../components/PreloadImage";

    export default {
        name: "Index",
        components: {
            PreloadImage,
            DropDownRefresh
        },
        data() {
            return {
                isPreloadCompleted: false,
                preloadImages: window.imgPreloadArr
            };
        },
        created() {
        },
        methods: {
            preloadImageCompleted(progress) {
                console.log("所有图片加载完毕2", progress);
                //   this.isPreloadCompleted = true;
            },
            handleRefresh(cb) {
                console.log('正在发送请求');
                setTimeout(()=>{

                    console.log('下拉刷新成功');
                    cb();
                },2000);
            }
        }
    };
</script>

<style scoped lang="less">
    .index-container {
        width: 100%;
        height: calc(100vh - 100px);
        position: relative;
    }
</style>