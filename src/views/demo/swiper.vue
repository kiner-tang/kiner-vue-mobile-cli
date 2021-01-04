<template>
  <div class="index-container">
    <div class="swiper-box">
      <swiper :options="swiperOption" ref="mySwiper" @slideChange="slideChange">
        <!-- slides -->
        <swiper-slide>页面 1</swiper-slide>
        <swiper-slide>页面 2</swiper-slide>
        <swiper-slide>页面 3</swiper-slide>
        <swiper-slide>页面 4</swiper-slide>
        <swiper-slide>页面 5</swiper-slide>
        <swiper-slide>页面 6</swiper-slide>
        <swiper-slide>页面 7</swiper-slide>
        <!-- Optional controls -->
        <div class="swiper-pagination" slot="pagination"></div>
        <!-- <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>-->
        <!-- <div class="swiper-scrollbar" slot="scrollbar"></div> -->
      </swiper>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console */

export default {
  name: "Index",
  components: {},
  data() {
    return {
      swiperOption: {
        direction: "vertical",
        pagination: {
          el: ".swiper-pagination"
        }
      }
    };
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  async mounted() {
    this.swiper.slideTo(3, 1000, false);
  },
  methods: {
    slideChange() {
      console.log(`swiper回调：`, this.swiper.activeIndex);
    }
  }
};
</script>

<style scoped lang="less">
.index-container {
  width: 100%;
  height: 100vh;
  .swiper-box {
    height: 100%;
    background: orange;
    .swiper-container {
      height: 100%;
      .swiper-slide {
        text-align: center;
        color: #ffffff;
        font-size: 48px;
        line-height: 100vh;
      }
    }

    .swiper-pagination-bullet {
      width: 20px;
      height: 20px;
    }
  }
}
</style>