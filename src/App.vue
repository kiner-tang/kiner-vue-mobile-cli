<template>
    <div id="app">
        <router-view/>
        <Modal v-model="modalDemoShow">
            <div class="modal-content-container modal-demo-container">
                <div class="close" @click="modalDemoShow=false"></div>
                <div class="content-box">
                    这是弹框内容
                </div>
            </div>
        </Modal>
        <!--</DropDownRefresh>-->
    </div>
</template>

<script>
    import eventBus from "./utils/eventBus";
    import Modal from "./components/Modal";
    import config from "./utils/config";

    export default {
        name: "app",
        components: {
            Modal
        },
        data() {
            return {
                modalDemoShow: false
            };
        },
        methods: {
            initModalListener(key, hanlder){
                eventBus.$on(key, hanlder);
                if(!window.modal){
                    window.modal = {};
                }
                window.modal[key] = hanlder;
            }
        },
        created() {
            if (config.refreshToIndex) {
                if (this.$route.path !== "/") {
                    this.$router.replace({path: "/"});
                }
            }

            this.initModalListener("modalDemoShow", () => {
                this.modalDemoShow = true;
            });

        },
        watch: {
        }
    };
</script>

<style lang="less">
    * {
        padding: 0;
        margin: 0;
    }
    .modal-content-container{
        &.modal-demo-container{
            background: #f2f3f7;
            width: 100vw;
            height: 100vh;
            line-height: 100vh;
            color: #333333;
            text-align: center;
            font-size: 26px;
        }
    }
</style>
