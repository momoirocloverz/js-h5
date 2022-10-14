<template>
  <div class="masterPolicyCon">
    <declareHome />
  </div>
</template>
<script>
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'
import dayjs from 'dayjs'
import declareHome from '../declare/declareHome.vue'
import { Toast } from 'vant'
import { isZLB } from '@/util/index'
export default defineComponent({
  components: { declareHome },
  setup(props, { emit }) {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      ZLBFLAG: isZLB(),
      ZLBFitForOld:
        localStorage.getItem('fitForOld') &&
        localStorage.getItem('fitForOld') == 1
          ? true
          : false,
    })
    onMounted(() => {})
    return {
      state,
      dayjs,
    }
  },
})
</script>
<style scoped lang="less">
.masterPolicyCon {
  box-sizing: border-box;
  width: 100%;
}
</style>
