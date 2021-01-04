<template>
  <div class="bg-music-container">
    <div :class="`music-btn ${playingStatus}`" @click="toggleMusic">
      <audio ref="audio" :src="src" :loop="loop" :autoplay="autoplay"></audio>
    </div>
  </div>
</template>

<script>
import _ from "@/utils/_tools.js";
export default {
  name: "",
  data() {
    return {
      playingStatus: "stopped"
    };
  },
  props: {
    src: {
      type: String,
      required: true
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    loop: {
      type: Boolean,
      default: true
    }
  },
  components: {},
  mounted() {
    let audio = this.$refs.audio;
    if (this.autoplay) {
      if (_.borrower.isWeiXin()) {
        console.log("微信浏览器");
        window.wx.ready(() => {
          this.play();
          console.log("微信jssdk准备完毕，播放音乐");
        });
        this.play();
      } else {
        this.play();
      }
    }
    audio.addEventListener(
      "play",
      () => {
        this.playingStatus = "playing";
      },
      false
    );
    audio.addEventListener(
      "pause",
      () => {
        this.playingStatus = "stopped";
      },
      false
    );
  },
  methods: {
    play() {
      let audio = this.$refs.audio;
      this.playingStatus = "playing";
      audio.play();
    },
    pause() {
      let audio = this.$refs.audio;
      this.playingStatus = "stopped";
      audio.pause();
    },
    toggleMusic() {
      if (this.playingStatus === "stopped") {
        this.play();
      } else {
        this.pause();
      }
    }
  }
};
</script>

<style lang="less" scoped>
.bg-music-container {
  .music-btn {
    position: fixed;
    right: 10px;
    top: 10px;
    z-index: 999999;
    width: 50px;
    height: 50px;

    background-repeat: no-repeat;
    background-size: 100px 50px;
    &.stopped {
      background-image: url("../assets/images/music-btn.png");
      background-position: -50px 0;
    }
    &.playing {
      background-image: url("../assets/images/music-btn.png");
      background-position: 0 0;
      animation: rotate 2s infinite linear;
    }
  }
  @keyframes rotate {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
</style>