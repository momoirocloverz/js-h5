<!-- 设置 -->
<template>
  <div class="page-config">
    <van-cell-group>
      <van-cell
        title="关于江农投"
        value="版本V1.0.0"
        title-class="title"
        value-class="value"
      />
    </van-cell-group>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
export default {
  name: "config",
  setup() {
    const state = reactive({});
    onMounted(() => {});
    return {
      ...toRefs(state),
    };
  },
};
</script>
<style lang='less' scoped>
.page-config {
  padding: 0.3rem;
  :global(.van-cell-group) {
    border-radius: 0.16rem;
    overflow: hidden;
  }

  :global(.title) {
    width: 2rem;
    flex: none;
  }

  :global(.value) {
    text-align: left;
  }
}
</style>