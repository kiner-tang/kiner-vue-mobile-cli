<template>
  <div class="preload-image-container">
    <slot></slot>
    <div class="loading-container" v-if="!slot">
      <div class="loading-tip" :style="{left: `${progress}%`}">{{progressTip}}</div>
      <div class="progress-bar-box">
        <div class="progress-bar-front" :style="{width: `${progress}%`}"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      imgs: {
        type: Array,
        default: function() {
          return [];
        }
      },
      tips: {
        type: String,
        default: `已加载$progress$%,请稍后`
      }
    },
    data() {
      return {
        slot: !!this.$slots.default,
        progress: 0,
        progressTip: "",
        curImageIndex: 0
      };
    },
    created() {
      this.progressTip = this.tips.replace(/\$progress\$/g, this.progress);
      this.preloadImage();
    },
    mounted() {},
    computed: {
      total() {
        return this.imgs.length;
      }
    },
    methods: {
      preloadImage() {
        if(this.imgs.length===0){
          this.progress = 100;
          this.$emit("completed", this.progress);
          return;
        }
        this.imgs.forEach(item => {
          (item => {
            let img = new Image();
            img.src = item;
            img.onload = () => {
              this.curImageIndex++;
              this.progress = Math.floor((this.curImageIndex / this.total) * 100);
            };
          })(item);
        });
      }
    },
    watch: {
      progress(newVal) {
        this.progressTip = this.tips.replace(/\$progress\$/g, newVal);
      },
      curImageIndex(newVal) {
        if (newVal === this.total) {
          this.$emit("completed", this.progress);
        }
      }
    }
  };
</script>

<style lang="less">
  .preload-image-container {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 99999;
    background: blanchedalmond no-repeat center;
    background-size: cover;
    .loading-container {
      position: absolute;
      width: 80%;
      left: 50%;
      top: 50%;
      transform: translate3d(-50%, -50%, 0);
      .loading-tip {
        padding: 5px 10px;
        border-radius: 5px;
        background: #f2f3f7;
        position: absolute;
        color: #994242;
        display: inline-block;
        left: 0;
        top: -15px;
        transform: translate3d(-50%, -110%, 0);
        font-size: 24px;
        width: max-content;
        box-sizing: border-box;
        &::after {
          content: "";
          width: 0;
          height: 0;
          border-top: 10px solid #f2f3f7;
          border-right: 10px solid transparent;
          border-left: 10px solid transparent;
          position: absolute;
          left: 50%;
          bottom: 2px;
          transform: translate3d(-50%, 100%, 0);
        }
      }
      .progress-bar-box {
        width: 100%;
        height: 30px;
        background: #f2f3f7;
        border-radius: 30px;
        overflow: hidden;
        border: 4px solid #ffffff;
        .progress-bar-front {
          width: 0;
          height: 100%;
          background: linear-gradient(to right, #dd4242, #994242);
          border-radius: 30px;
        }
      }
    }
  }
</style>