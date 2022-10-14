<template>
  <div class="loading" v-if="visiable">
    <van-loading color="#1989fa" size="36px" class="loadingComponent" vertical>
      {{ text }}
    </van-loading>
  </div>
</template>

<script>
export default {
  name: "loading",
  props: {
    visiable: {  // loading的显隐开关
      type: Boolean
    },
    text: {  // loading的下方显示的字体
      type: String,
      default: () => ''
    },

  },
  setup(props, {emit}) {
    // console.log(props.visiable)  //JS里的调用
    // setTimeout(()=>{
    //   emit("showSYCM",'allen')
    // },1000);
    return {}
  }
}
</script>

<style scoped lang="less">
.loading {
  position: fixed;
  z-index: 1000;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: rgba(255, 255, 255, .6);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>