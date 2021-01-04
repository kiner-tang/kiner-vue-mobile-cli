<template>
    <div class="index-container">
        <router-view/>
    </div>
</template>

<script>
    /* eslint-disable no-console */

    import {mapGetters, mapActions} from "vuex";

    export default {
        name: "Index",
        components: {},
        data() {
            return {};
        },
        computed: {
            ...mapGetters(['initData'])
        },
        async mounted() {
            this.saveInitData();
        },
        methods: {
            ...mapActions({
                saveInitData: "saveInitData"
            }),
            jumpRoute() {
                this.$router.push({path: "/demo"});
            }
        }
    };
</script>

<style scoped lang="less">
    .index-container {
        .btn-group {
            padding: 30px;
            a {
                color: #ffffff;
            }
        }
    }
</style>