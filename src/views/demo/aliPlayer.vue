<template>
  <div class="index-container">
    <ali-player
      @play="play"
      :useFlashPrism="true"
      :autoplay="true"
      :isLive="false"
      :rePlay="false"
      :showBuffer="true"
      showBarTime="5000"
      height="100%"
      controlBarVisibility="hover"
      :source="source"
    />
  </div>
</template>

<script>
/* eslint-disable no-console */

import AliPlayer from "../../components/AliPlayer";

export default {
  name: "Index",
  components: {
    AliPlayer
  },
  data() {
    return {
      source: "/assets/video/index-movie.mp4"
    };
  },
  methods: {
    play() {}
  }
};
</script>

<style scoped lang="less">
.index-container {
  width: 100%;
  height: 500px;
}
</style>