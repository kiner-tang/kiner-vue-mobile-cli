<template>
  <div id="app">
    <div id="nav">
      <cube-tab-bar v-model="selectedLabelDefault" :data="tabs" @change="changeHandler"></cube-tab-bar>
    </div>
    <transition :name="transition">
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      selectedLabelDefault: this.$route.path,
      transition: "slide-left",
      tabs: [
        {
          value: "/loading",
          label: "加载页",
          icon: "cubeic-like"
        },
        {
          value: "/aliPlayer",
          label: "视频播放器",
          icon: "cubeic-home"
        },
        {
          value: "/swiper",
          label: "swiper",
          icon: "cubeic-vip"
        }
      ]
    };
  },
  created() {},
  watch: {
    $route() {
      let back = this.$router.back;
      if (back) {
        //点击了返回
        this.transition = "slide-right";
      } else {
        this.transition = "slide-left";
      }
      this.$router.back = false;
    }
  },
  methods: {
    changeHandler(value) {
      this.$router.push({ path: value });
    }
  }
};
</script>

<style lang="less">
* {
  padding: 0;
  margin: 0;
}
#nav {
  font-size: 24px;
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  background: #ffffff;
  z-index: 99999;
  border-top: 1px solid #e6e6e6;
  height: 100px;
  box-sizing: border-box;
  padding-top: 10px;
  i {
    display: inline-block;
    margin-bottom: 10px;
  }
}

//转场动画
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  // 启用硬件加速
  will-change: transform;
  transition: all 1s;
  position: fixed;
}
.slide-right-enter {
  transform: translate(-100%, 0);
  transition-timing-function: ease-in;
}
.slide-left-enter {
  transform: translate(100%, 0);
  transition-timing-function: ease-in;
}
</style>
