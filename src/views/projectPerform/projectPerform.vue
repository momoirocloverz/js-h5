<template>
  <div class="perform">
    <van-tabs
      class="fixedTab"
      v-model:active="state.activeTab"
      @change="changeTab"
      :class="state.ZLBFitForOld ? 'fixedTabOld' : ''"
    >
      <van-tab
        v-for="item in state.tabs"
        :title="item.name"
        :key="item.name"
        :disabled="item.disabled"
      ></van-tab>
    </van-tabs>
    <declareHome v-if="state.activeTab === 0" :showStep="true" />
    <implement :project-info="projectInfo" v-if="state.activeTab === 2" />
    <projectImplement v-if="state.activeTab === 1" />
    <pay-for v-if="state.activeTab === 3" />
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import declareHome from '../declare/declareHome.vue'
import implement from '@/views/implement/implement'
import projectImplement from '@/views/projectImplement/index'
import payFor from '@/views/payFor/payFor'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
export default {
  components: {
    implement,
    payFor,
    projectImplement,
    declareHome,
  },
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const projectInfo = ref({})
    const state = reactive({
      ZLBFLAG: isZLB(),
      ZLBFitForOld:
        localStorage.getItem('fitForOld') &&
        localStorage.getItem('fitForOld') == 1
          ? true
          : false,
      tabs: [
        { name: '项目申报', disabled: false },
        { name: '项目实施', disabled: false }, // 234应该默认true
        { name: '项目验收', disabled: false },
        { name: '资金兑换', disabled: false },
      ],
      activeTab: 1,
    })
    const changeTab = (e) => {
      state.activeTab = e
      Router.replace({
        name: Router.name,
        query: {
          active: state.activeTab,
          policyId: Route.query.policyId,
          projectId: Route.query.projectId,
        },
      })
    }
    const getSchedule = async () => {
      const result = await Request.getProjectSchedule({
        project_id: +Route.query.projectId,
      })
      if (result.code === 0) {
        projectInfo.value = result.data.info
        if (projectInfo.value.status >= 62) projectInfo.value.isYs = true // 当status >=62时，验收通过，验收资料不可修改修改。
        if (result.data.info.status >= 45) {
          state.tabs[1].disabled = false
          state.tabs[2].disabled = false
          state.tabs[3].disabled = false
        }
      }
    }
    onMounted(() => {
      state.tabs[1].disabled = true
      state.tabs[2].disabled = true
      state.tabs[3].disabled = true
      state.activeTab = +Route.query.active || 0
      getSchedule()
    })
    return {
      state,
      changeTab,
      projectInfo,
    }
  },
}
</script>
<style lang="less" scoped>
.perform {
  padding-top: 0.8rem;
  box-sizing: border-box;
  .fixedTab {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 5;
  }
  :deep(.van-tabs) {
    .van-tab--active .van-tab__text {
      color: #1b82ec;
    }
    .van-tabs__line {
      background: #1b82ec;
      height: 0.04rem;
    }
  }
  .fixedTabOld {
    :deep(.van-tab) {
      font-size: 0.35rem;
    }
  }
}
</style>
