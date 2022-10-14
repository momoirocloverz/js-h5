<!-- 资金申请记录审核进度 -->
<template>
  <div class="fund-approval">
    <div class="box">
      <p class="title" :class="ZLBFitForOld ? 'topTitleOld' : ''">审核进度</p>
      <Procresss :procressData="procressData" :step="step"></Procresss>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onMounted, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import Procresss from '@/components/procressCopy'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
export default defineComponent({
  name: 'fundApproval',
  components: { Procresss },
  setup() {
    const route = useRoute()
    const state = reactive({
      ZLBFLAG: isZLB(),
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false
    })
    const step = ref(1)
    const procressData = ref([
      { label: '材料递交', time: '', opinion: '' },
      { label: '项目管理负责人', time: '', opinion: '' },
      //   { label: '分管领导审核', time: '', opinion: '' },
      //   { label: '主要领导审核', time: '', opinion: '' },
      { label: '资金拨付', time: '', opinion: '' }
    ])

    const getAmountApplyInfo = () => {
      // console.log('拨款申请详情')
      Request.amountApplyInfo({
        id: route.query.id
      }).then((res) => {
        if (res.code === 0) {
          if (res.data.is_check == '4' && res.data.check_schedule == '4') {
            step.value = +res.data.check_schedule + 1 // 第几步
          } else {
            step.value = res.data.check_schedule // 第几步
          }
          procressData.value[0].time = res.data.created_at || ''
          procressData.value[1].time = res.data.principal_at || '' // 项目负责人
          procressData.value[1].opinion = res.data.principal_reason || '' // 项目负责人 意见
          //   procressData.value[2].time = res.data.leader_at || '' // 分管领导
          //   procressData.value[2].opinion = res.data.leader_reason || '' // 分管领导 意见
          //   procressData.value[3].time = res.data.important_at || '' // 主要领导审核
          //   procressData.value[3].opinion = res.data.important_reason || '' // 主要领导审核
          //   procressData.value[4].time = res.data.refuse_at || '' // 资金拨付
          //   procressData.value[4].real_fund_amount = res.data.real_fund_amount || '' // 资金拨付
          //   procressData.value[4].opinion = res.data.fund_reason || '' // 资金拨付

          if (step.value > 1) {
            procressData.value[2].time = res.data.refuse_at || '' // 资金拨付
            procressData.value[2].real_fund_amount = res.data.real_fund_amount || '' // 资金拨付
            procressData.value[2].opinion = res.data.fund_reason || '' // 资金拨付
          }
        }
      })
    }

    onMounted(() => {
      getAmountApplyInfo()
    })
    return {
      ...toRefs(state),
      procressData,
      step
    }
  }
})
</script>
<style lang="less" scoped>
.fund-approval {
  .box {
    padding: 0.2rem;
    margin: 0.2rem 0.3rem;
    background: #fff;
    border-radius: 0.16rem;
    .title {
      font-weight: 600;
      font-size: 0.3rem;
      height: 0.3rem;
      line-height: 0.3rem;
      border-left: 0.05rem solid #1b82ec;
      text-indent: 0.1rem;
      margin: 0.2rem 0 0.4rem;
    }
    .topTitleOld {
      font-size: 0.4rem;
    }
    .input_item {
      padding: 0.1rem;
      background: #fff;
      overflow: hidden;
      p {
        margin: 0 0 0.2rem;
        font-size: 0.28rem;
        white-space: pre-wrap;
        line-height: 0.5rem;
      }
      .itemTitleOld {
        font-size: 0.35rem;
      }
      :deep(.van-cell) {
        background: #f9f9f9;
        border: 0.02rem solid #ccc;
        font-size: 0.26rem;
        .van-field__control {
          max-height: 100px;
          overflow: scroll;
        }
      }
    }
    .audit_item {
      margin-left: 0.1rem;
      position: relative;
      padding: 0 0 0.5rem 0.2rem;
      border-left: 0.04rem dashed rgba(27, 130, 236, 1);
      &:nth-last-of-type(1) {
        border: 0;
        padding-bottom: 0;
      }
      &:before {
        content: '';
        position: absolute;
        left: -0.16rem;
        top: 0;
        width: 0.3rem;
        height: 0.3rem;
        background: #1b82ec;
        border-radius: 50%;
      }
      p {
        &:nth-of-type(1) {
        }
        &:nth-of-type(2) {
          margin-top: 0.2rem;
          color: #999;
          font-size: 0.24rem;
        }
      }
    }
  }
}
</style>
