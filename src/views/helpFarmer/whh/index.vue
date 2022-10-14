<template>
  <van-tabs
    @click-tab="onTabClick"
    sticky
    class="firstTab"
    v-model:active="activeTab"
  >
    <van-tab title="项目申报" name="1"></van-tab>
    <van-tab title="申请" name="2" :disabled="status < 30"></van-tab>
  </van-tabs>

  <component :is="currentTabComponent" @getStatus="getStatus"></component>
</template>

<script>
import { defineComponent, toRefs, ref, reactive, computed } from 'vue'
import WhhDeclare from './whhDeclare.vue'
import WhhApply from './whhApply.vue'
export default defineComponent({
  components: {
    WhhDeclare,
    WhhApply,
  },
  setup() {
    const state = reactive({
      activeTab: ref('1'),
      status: ref('0'), // 项目单状态
    })

    const currentTabComponent = computed(() =>
      state.activeTab == '1' ? 'WhhDeclare' : 'WhhApply'
    )

    const getStatus = (status) => {
      state.status = status
    }

    const onTabClick = (e) => {}
    return {
      ...toRefs(state),
      onTabClick,
      currentTabComponent,
      getStatus,
    }
  },
})
</script>

<style lang="less" scoped></style>
<style lang="less">
@import '../farmer-common';
</style>
