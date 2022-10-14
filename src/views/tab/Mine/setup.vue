<template>
  <div class="setupCon">
    <van-cell title="版本号" value="1.0.0"> </van-cell>
    <van-button class="submitBtn" round block type="primary" @click="quit"
      >退出登录</van-button
    >
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
export default {
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({})
    const quit = () => {
      console.log('asydhh');
      localStorage.clear();
      Router.replace('/newHome')
    }
    return {
      state,
      quit,
    }
  },
}
</script>
<style lang="less" scoped>
.setupCon {
  padding: 0.3rem;
  box-sizing: border-box;
}
.submitBtn {
  position: fixed;
  width: 73.33%;
  left: 13.33%;
  right: 0;
  bottom: 1.2rem;
  font-size: 0.32rem;
  font-weight: 500;
  color: #fff;
}
</style>
