<template>
  <div class="policy-item flex-row align-item-center">
     速度速度
  </div>
</template>

<script>
// import { useRouter } from "vue-router";
export default {
  props: {
    item: {
      type: Object,
    }, // 必传
  },
  setup() {
    // const Router = useRouter();
    return {};
  },
};
</script>

<style lang="less" scoped> 
.policy-item {
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  border-radius: 8px;
  background: linear-gradient(-90deg, rgba(13, 115, 255, 0.4), #f4f6fa);
  margin-top: 15px;
  
}
</style>
