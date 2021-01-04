<template>
  <div :class="{'show': isShowing, 'modal-container': true}" v-show="showModal">
    <div class="mask" @click="handleClickMask"></div>
    <div class="content" @click="handleClickMask">
      <div class="container-box">
        <slot></slot>
        <div v-if="showCloseBtn" :class="`close`" @click="handleClickBackBtn" />
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "modal",
    props: {
      showCloseBtn: {
        type: Boolean,
        default: true
      },
      closeBtnBg: {
        type: Boolean,
        default: false
      },
      click2hide: {
        type: Boolean,
        default: false
      },
      show:{
        type: Boolean,
        default(){
          return false
        }
      },
      backHandle:{
        type: Function,
        default(){
          return function(){}
        }
      }

    },
    data() {
      // console.log(this.showCloseBtn);
      if(this.show){
        setTimeout(()=>{
          this.isShowing = true;
        },10);
      }
      return {
        isShowing: false,
        showModal: this.show
      };
    },
    components: {},
    mounted() {
      this.$emit("onOpen");
    },
    methods: {
      handleClickMask() {
        if (this.click2hide) {
          this.closeModal();
          this.$emit("onClose");
        }
      },
      closeModal(cb) {
        this.isShowing = false;
        setTimeout(()=>{
          this.$emit('change',false);
          cb&&cb();
        },500);
      },
      handleClickBackBtn(){
        this.$emit('closeBtn');
        let res = this.backHandle(this.closeModal);
        if(res!==false){
          this.closeModal();
        }
      }
    },
    model: {
      prop: 'show',
      event: 'change'
    },
    watch: {
      show(newValue) {
        if(newValue){
          this.showModal = newValue;
          setTimeout(()=>{
            this.isShowing = newValue;
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
  };
</script>

<style lang="less" scoped>
  .modal-container {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 800;
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
    .content {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
      .container-box{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate3d(-50%, -100vh, 0);
        transition: 500ms all linear;
      }
    }

    &.show {
      .mask{
        opacity: 1;
      }
      .container-box{
        transform: translate3d(-50%,-50%,0);
      }
    }
  }
</style>
