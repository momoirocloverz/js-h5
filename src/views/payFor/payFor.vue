<template>
  <div class="fund-container">
    <div class="top">
      <div class="money-data">
        <div class="money-data-item">
          <div class="amount">{{ summarInfo.has_order_amount ? summarInfo.has_order_amount : '-' }}</div>
          <div class="title">可补助金额</div>
        </div>
        <div class="money-data-item">
          <div class="amount">{{ summarInfo.remain_can_apply_amount ? summarInfo.remain_can_apply_amount : '-' }}</div>
          <div class="title">剩余可申报<br />金额</div>
        </div>
        <div class="money-data-item">
          <div class="amount">{{ summarInfo.has_total_apply_amount ? summarInfo.has_total_apply_amount : '-' }}</div>
          <div class="title">累计补助金额</div>
        </div>
      </div>
      <van-button type="primary" round @click="toForm(null)">财政专项资金拨款申请表</van-button>
    </div>

    <div class="apply-record">
      <div class="title">申请记录</div>
      <div class="list" v-if="record.length">
        <div class="record-item" v-for="item in record" :key="item.id">
          <div class="info van-hairline--bottom">
            <div class="name van-ellipsis">{{ item.project_name }}</div>
            <div class="line">申请时间：{{ item.apply_at }}</div>
            <div class="line">申请金额：{{ item.apply_amount }}万元</div>
            <div class="line">申请状态：{{ item.is_check == 4 ? '已通过' : '审核中' }}</div>
          </div>
          <div class="operate">
            <van-button type="primary" round @click="toForm(item.id)">查看申请表</van-button>
            <van-button type="primary" round plain @click="toApprovalRecord(item.id)">查看审核进度</van-button>
          </div>
        </div>
      </div>
      <div class="emptyHolder" v-else>
        <img src="https://img.hzanchu.com/acimg/698206a6fba0842528424a9f6f7e0cd4.png" />
        <div>暂无申请记录</div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Request from '@/service/request'
import { Toast } from 'vant'
export default defineComponent({
  name: 'fund',
  setup() {
    const state = reactive({
      summarInfo: reactive({}),
      record: reactive([])
    })
    const router = useRouter()
    const route = useRoute()

    const toForm = (id) => {
      if (id) {
        router.push({ name: 'fundForm', query: { id, projectId: route.query.projectId, isDetail: 1 } })
      } else {
        router.push({ name: 'fundForm', query: { projectId: route.query.projectId } })
      }
    }

    const toApprovalRecord = (id) => {
      router.push({ name: 'fundApproval', query: { id } })
    }

    const getSummarInfo = () => {
      Request.amountApplySummarInfo({ project_id: route.query.projectId })
        .then((res) => {
          if (res.code === 0) {
            state.summarInfo = res.data
          } else {
            Toast(res.msg)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }

    // 获取申请记录
    const getRecord = () => {
      Request.amountApplyRecord({ project_id: route.query.projectId, page: 1, pagesize: Number.MAX_SAFE_INTEGER })
        .then((res) => {
          if (res.code === 0) {
            state.record = res.data.data || []
          } else {
            Toast(res.msg)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }

    onMounted(() => {
      getSummarInfo()
      getRecord()
    })
    return {
      ...toRefs(state),
      toForm,
      toApprovalRecord
    }
  }
})
</script>

<style scoped lang="less">
.fund-container {
  .top {
    padding: 0.32rem;
    background: #fff;
    text-align: center;
    margin-bottom: 0.16rem;

    .money-data {
      width: 100%;
      box-shadow: 0px 0.02rem 0.16rem rgba(0, 0, 0, 0.12);
      background: rgba(236, 245, 254, 1);
      border-radius: 0.16rem;
      display: flex;
      align-items: flex-start;
      padding-top: 0.32rem;
      padding-bottom: 0.32rem;
      margin-bottom: 0.32rem;
      position: relative;
      &-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .amount {
          font-size: 0.44rem;
          font-weight: bold;
          line-height: 0.56rem;
          color: #1b82ec;
          margin-bottom: 0.24rem;
        }
        .title {
          width: 1.6rem;
          font-size: 0.32rem;
          line-height: 0.56rem;
          color: #333333;
          word-break: break-all;
          text-align: center;
        }
      }

      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        width: 0.01rem;
        height: 1.54rem;
        margin-top: -0.77rem;
        background: rgba(27, 130, 236, 0.26);
        transform: scaleX(0.5);
      }

      &::before {
        left: 2.3rem;
      }
      &::after {
        right: 2.3rem;
      }
    }
  }

  .apply-record {
    padding: 0 0.32rem 0.32rem;
    background: #fff;

    .title {
      height: 0.96rem;
      line-height: 0.96rem;
      font-size: 0.34rem;
      font-weight: bold;
      color: #000000;
      position: relative;
      padding-left: 0.15rem;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -0.14rem;
        width: 0.05rem;
        height: 0.28rem;
        background: #1b82ec;
        border-radius: 0.03rem;
      }
    }

    .record-item {
      width: 100%;
      background: #ffffff;
      box-shadow: 0px 0.02rem 0.16rem rgba(0, 0, 0, 0.12);
      border-radius: 0.16rem;
      margin-bottom: 0.32rem;

      &:last-child {
        margin-bottom: 0;
      }

      .info {
        padding: 0.32rem;
        .name {
          font-size: 0.32rem;
          font-weight: bold;
          line-height: 0.45rem;
          color: #333333;
          margin-bottom: 0.24rem;
        }
        .line {
          font-size: 0.28rem;
          font-weight: 500;
          line-height: 0.4rem;
          color: #666666;
          margin-bottom: 0.16rem;
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
      .operate {
        padding: 0.32rem;
        text-align: right;

        :deep(.van-button) {
          height: 0.56rem;
          margin-left: 0.16rem;
          .van-button__text {
            line-height: 0.56rem;
          }
        }
      }
    }

    .emptyHolder {
      margin-top: 0.6rem;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      color: var(--van-tab-text-color);
      font-size: 0.28rem;
      img {
        width: 4rem;
        margin: 0 auto 0.2rem;
      }
    }
  }
}
</style>
