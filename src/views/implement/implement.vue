<template>
  <div class="implement">
    <div class="box">
      <p class="title" :class="state.ZLBFitForOld ? 'topTitleOld' : ''">验收材料</p>
      <div class="item1" v-for="item in stepList1" :key="item.index">
        <div class="name">
          <p :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">
            {{ item.index + '. ' + item.name }}
          </p>
          <p @click="toPage(item.path)" :class="state.ZLBFitForOld ? 'blueBtnOld' : ''">
            {{ projectInfo.isYs ? '查看' : item.id ? '修改' : '填写' }}
          </p>
        </div>
        <div class="status" :class="[{ field: item.id }, state.ZLBFitForOld ? 'finishedBarOld' : '']">
          {{ item.id ? '已填报' : '待填报' }}
        </div>
      </div>
      <materials v-for="item in stepList2" :detail="item" :project-info="projectInfo" :key="item.index" />
    </div>

    <div class="btn">
      <van-button class="submitBtn" round block type="primary" native-type="submit" :disabled="projectInfo.isYs" @click="submitAll" :class="state.ZLBFitForOld ? 'submitBtnOld' : ''">提交</van-button>
    </div>

    <div class="box">
      <div class="title" :class="state.ZLBFitForOld ? 'tagTextOld' : ''">
        <span>审核流程</span>
        <div class="record" @click="jump2record">审核记录</div>
      </div>
      <div class="step-wrapper" :class="{ short: audit && audit[1] && !audit[1].reason }">
        <div class="audit_item" :class="[item.status === 69 ? 'rejected' : !item.date ? 'is_padding' : '', state.ZLBFitForOld ? 'resetStepOld' : '']" v-for="item in audit" :key="item">
          <p>{{ item.name }}</p>
          <p v-if="item.reason">意见：{{ item.reason }}</p>
          <p>{{ item.date }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, watch, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import materials from './modules/materials'
import Request from '@/service/request'
import { Toast } from 'vant'
import { isZLB } from '@/util/index'
export default defineComponent({
  props: {
    projectInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {
    materials
  },
  setup(props) {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      ZLBFLAG: isZLB(),
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false
    })
    const stepList1 = ref([
      {
        index: 1,
        type: 1,
        path: 'applyFor',
        name: '局财政支农项目验收申请书',
        id: 0,
        key: 'ys_finance_application_id'
      },
      {
        index: 2,
        type: 1,
        path: 'summarize',
        name: '项目实施工作总结（提纲）',
        id: 0,
        key: 'ys_work_summary_id'
      },
      {
        index: 3,
        type: 1,
        path: 'compare',
        name: '完成情况对比表',
        id: 0,
        key: 'ys_complete_compare_id'
      },
      {
        index: 4,
        type: 1,
        path: 'sketch',
        name: '竣工验收示意图',
        id: 0,
        key: 'ys_completed_sketch_id'
      },
      {
        index: 5,
        type: 1,
        path: 'compareChart',
        name: '实施前后对照图片',
        id: 0,
        key: 'ys_comparison_pic_id'
      }
    ])
    const stepList2 = ref([
      {
        index: 6,
        type: 2,
        which_type: 16,
        name: '项目审计报告',
        id: 0,
        list: [],
        key: 'ys_audit_report_status'
      },
      {
        index: 7,
        type: 2,
        which_type: 17,
        name: '财政凭证复印件（发票除农民工工资外，其余必须为国税或地税等认可的发票；包括工程招投标材料、工程建设合同及工程验收材料、预算决算书、有关票据等；按建设内容分项归类）',
        id: 0,
        list: [],
        key: 'ys_financial_status'
      },
      {
        index: 8,
        type: 2,
        which_type: 18,
        name: '项目其他相关材料',
        id: 0,
        list: [],
        key: 'ys_other_materials_status'
      }
    ])
    const audit = ref([
      { name: '材料递交', date: '' },
      { name: '验收审核', date: '', status: '' }
    ])
    const toPage = (path) => {
      Router.push({
        name: path,
        query: {
          projectId: Route.query.projectId,
          declareUnit: props.projectInfo.declare_unit,
          address: encodeURIComponent(props.projectInfo.area_detail),
          projectName: encodeURIComponent(props.projectInfo.project_name),
          city: encodeURIComponent(props.projectInfo.area_ids.join('')),
          isYs: props.projectInfo.isYs ? true : ''
        }
      })
    }
    const getStatus = async () => {
      const result = await Request.getProjectYsDetail({
        project_id: Route.query.projectId
      })
      if (result.code === 0) {
        if (!Array.isArray(result.data.info)) {
          //   audit.value[0].date = result.data.info.created_at?.substr(0, 10)
          audit.value[0].date = result.data && result.data.info && result.data.info.created_at.substr(0, 10)
          stepList1.value.map((item) => {
            Object.keys(result.data.info).forEach((key) => {
              if (item.key === key) item.id = result.data.info[key]
            })
          })
          stepList2.value.map((item) => {
            Object.keys(result.data.info).forEach((key) => {
              if (item.key === key) item.id = result.data.info[key]
            })
          })
        }
        // audit.value[1].reason = result.data?.info?.ys_suggest
        audit.value[1].reason = result.data && result.data.info && result.data.info.ys_suggest
      }
    }
    const submitAll = async () => {
      const result = await Request.submitProjectYs({
        project_id: +Route.query.projectId
      })
      if (result.code === 0) {
        Toast('提交成功')
      } else {
        Toast(result.msg)
      }
    }
    // 跳转审核记录
    const jump2record = () => {
      Router.push({
        name: 'approvalRecord',
        query: {
          project_id: Route.query.projectId,
          record_type: 3
        }
      })
    }
    watch(
      () => props.projectInfo,
      (val) => {
        // audit.value[1].date = val.ys_action_at?.substr(0, 10)
        audit.value[1].date = val.ys_action_at && val.ys_action_at.substr(0, 10)
        audit.value[1].status = val.status
      },
      { immediate: true }
    )
    onMounted(() => {
      getStatus()
    })
    return {
      stepList1,
      stepList2,
      audit,
      toPage,
      submitAll,
      state,
      jump2record
    }
  }
})
</script>

<style scoped lang="less">
.implement {
  font-size: 0.28rem;
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
      position: relative;

      .record {
        width: 1.6rem;
        height: 0.5rem;
        background: #1b82ec;
        border: 1px solid #1b82ec;
        border-radius: 0.3rem;
        color: #fff;
        font-size: 0.26rem;
        text-align: center;
        line-height: 0.5rem;
        position: absolute;
        right: 0;
        top: -0.1rem;
      }
    }
    .topTitleOld {
      font-size: 0.4rem;
    }
    .tagTextOld {
      font-size: 0.4rem;
    }
    .item1 {
      margin: 0.25rem 0;
      .name {
        display: flex;
        margin-bottom: 0.25rem;
        p {
          line-height: 0.5rem;
          &:nth-of-type(1) {
            width: 0;
            flex: 1;
          }
          &:nth-of-type(2) {
            width: 1.6rem;
            height: 0.5rem;
            background: #1b82ec;
            text-align: center;
            border-radius: 0.25rem;
            color: #fff;
          }
        }
        .itemTitleOld {
          font-size: 0.35rem;
        }
        .blueBtnOld {
          font-size: 0.35rem;
        }
      }
      .status {
        background: rgba(250, 34, 34, 0.14);
        color: #fa2222;
        text-align: right;
        height: 0.6rem;
        line-height: 0.6rem;
        box-sizing: border-box;
        padding: 0 0.2rem;
      }
      .finishedBarOld {
        font-size: 0.32rem;
      }
      .field {
        background: rgba(26, 130, 236, 0.2);
        color: #1b82ec;
      }
    }
    .step-wrapper {
      position: relative;
      &::after {
        content: '';
        position: absolute;
        left: 0.1rem;
        top: 0;
        width: 0;
        height: 50%;
        border-left: 0.04rem dashed #1b82ec;
      }
      &.short {
        &::after {
          top: 0.3rem;
        }
      }
      .audit_item {
        margin-left: 0.1rem;
        position: relative;
        padding: 0 0 0.5rem 0.3rem;
        &:nth-of-type(1) {
          &:after {
            display: none;
          }
        }
        &:nth-last-of-type(1) {
          padding-bottom: 0;
        }
        &:before {
          content: '';
          position: absolute;
          left: -0.15rem;
          top: 0;
          width: 0.3rem;
          height: 0.3rem;
          background: #1b82ec;
          border-radius: 50%;
        }

        p {
          height: 0.3rem;
          &:nth-of-type(2),
          &:last-child {
            margin-top: 0.2rem;
            color: #999;
            font-size: 0.24rem;
          }
        }
      }
    }
    .resetStepOld {
      p {
        font-size: 0.35rem !important;
      }
    }
    .is_padding {
      &:before {
        background: rgba(13, 115, 255, 0.3);
      }
      &:after {
        border-color: rgba(13, 115, 255, 0.3);
      }
    }
    .rejected {
      &:before {
        background: #fa2222;
      }
    }
  }
  .btn {
    margin: 0.5rem 0.8rem;
    :deep(.van-button) {
      font-size: 0.32rem;
    }
    .submitBtnOld {
      font-size: 0.45rem;
    }
  }
}
</style>
