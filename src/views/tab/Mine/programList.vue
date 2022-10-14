<template>
  <div class="program-list">
    <div class="name" :class="state.ZLBFitForOld ? 'nameOld' : ''">
      {{ detail.project_name || detail.title || '-' }}
    </div>
    <div class="timeConFlex">
      <div class="time" :class="state.ZLBFitForOld ? 'timeOld' : ''">申报时间：{{ detail.created_at }}</div>
      <div class="markSelf" @click="toPreserveDetail(detail.project_reserve_id)" v-if="detail.project_reserve_id">储备</div>
    </div>
    <div class="status" :class="[getStatusClass(detail.status, detail.form_type), state.ZLBFitForOld ? 'statusOld' : '']">
      {{ getStatusText(detail.status, detail.form_type) }}
    </div>
    <div class="btns">
      <div @click="toDetail(detail)" :class="state.ZLBFitForOld ? 'btnsOld' : ''">查看</div>
      <div @click="deleteProject(detail.project_id)" v-if="getIfShowDelBtn(detail.status, type)" :class="state.ZLBFitForOld ? 'btnsOld' : ''">删除</div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Request from '@/service/request'
import { Toast, Dialog } from 'vant'
export default defineComponent({
  props: {
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    },
    type: {
      type: String,
      default: '1'
    }
  },
  setup(props, { emit }) {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false
    })
    const toPreserveDetail = (id) => {
      Router.push({
        name: 'projectReserveDetail',
        query: {
          id: id
        }
      })
    }
    const formatStatus = (status) => {
      switch (status) {
        case 0:
          if (props.detail.is_draft == 0) {
            return '驳回待修改'
          }
        case 1:
        case 3:
        case 0:
        case 10:
        case 20:
        case 30:
          return '申报中'
        case 40:
        case 45:
          return '申报办结'
        case 50:
          return '实施中'
        case 51:
        case 53:
          return '变更中'
        case 52:
          return '变更办结'
        case 60:
        case 61:
          return '验收中'
        case 62:
          return '验收办结'
        case 9:
        case 29:
        case 39:
        case 59:
        case 69:
        case 79:
          if (props.detail.is_draft == 0) {
            return '驳回待修改'
          }
          return '未通过'
        case 11:
        case 21:
        case 31:
        case 43:
          return '已退回'
        case 70:
        case 71:
          return '资金拨付'
        case 72:
          return '拨款办结'
      }
    }

    const formatClass = (status) => {
      switch (status) {
        case 0:
          if (props.detail.is_draft == 0) {
            return 'grey'
          }
        case 1:
        case 3:
        case 0:
        case 10:
        case 20:
        case 30:
        case 40:
        case 45:
        case 70:
        case 71:
          return ''
        case 50:
        case 51:
        case 52:
        case 53:
          return 'orange'
        case 60:
        case 61:
        case 62:
          return 'blue'
        case 9:
        case 29:
        case 39:
        case 59:
        case 69:
        case 79:
          if (props.detail.is_draft == 0) {
            return 'grey'
          }
          return 'red'
        case 11:
        case 21:
        case 31:
        case 43:
          return 'grey'
      }
    }

    const formatHelperStatus = (status, form_type) => {
      status = status.toString()
      if ([11, 21, 22, 23].includes(form_type)) {
        if (status == 62) {
          // 完成资金拨付
          return '已通过'
        } else if (status.startsWith('2') || status.startsWith('5')) {
          return '公示中'
        } else if (status == 0) {
          if (props.detail.is_draft == 0) {
            return '驳回待修改'
          }
          return '未提交'
        } else {
          return '审核中'
        }
      } else if (form_type == 24) {
        // 湖羊
        if (status == 52) {
          return '已通过'
        } else if (status.startsWith('4')) {
          return '公示中'
        } else if (status == 0) {
          if (props.detail.is_draft == 0) {
            return '驳回待修改'
          }
          return '未提交'
        } else {
          return '审核中'
        }
      } else if (form_type == 25) {
        // 无害化
        if (status == 30) {
          return '申请未提交'
        } else if (status == 33) {
          return '驳回待修改'
        } else if (status == 0) {
          if (props.detail.is_draft == 0) {
            return '驳回待修改'
          }
          return '未提交'
        } else if (status == 42) {
          return '已通过'
        } else if (status.startsWith('2') || status.startsWith('4')) {
          return '公示中'
        } else {
          return '审核中'
        }
      } else if (form_type == 26) {
        // 粮油补贴
        if (status == 82) {
          return '已通过'
        } else if (status.startsWith('1') || status.startsWith('7')) {
          return '公示中'
        } else if (status == 0) {
          if (props.detail.is_draft == 0) {
            return '驳回待修改'
          }
          return '未提交'
        } else {
          return '审核中'
        }
      }
      return '-'
    }

    const formatHelperClass = (status, form_type) => {
      status = status.toString()
      if ([11, 21, 22, 23].includes(form_type)) {
        if (status == 62) {
          // 完成资金拨付
          return 'blue'
        } else if (status.startsWith('2') || status.startsWith('5')) {
          return 'orange'
        } else if (status == 0) {
          return 'grey'
        } else {
          return ''
        }
      } else if (form_type == 24) {
        // 湖羊
        if (status == 52) {
          return 'blue'
        } else if (status.startsWith('4')) {
          return 'orange'
        } else if (status == 0) {
          return 'grey'
        } else {
          return ''
        }
      } else if (form_type == 25) {
        // 无害化
        if (status == 30 || status == 33) {
          return 'grey'
        } else if (status == 0) {
          return 'grey'
        } else if (status == 42) {
          return 'blue'
        } else if (status.startsWith('2') || status.startsWith('4')) {
          return 'orange'
        } else {
          return ''
        }
      } else if (form_type == 26) {
        // 粮油补贴
        if (status == 82) {
          return 'blue'
        } else if (status.startsWith('1') || status.startsWith('7')) {
          return 'orange'
        } else if (status == 0) {
          if (props.detail.is_draft == 0) {
            return 'grey'
          }
          return 'grey'
        } else {
          return ''
        }
      }
    }

    const toDetail = (detail) => {
      const { form_type } = detail
      if (form_type) {
        let types = {
          11: 'yjfDeclare',
          21: 'njDeclare',
          22: 'jgDeclare',
          23: 'shhDeclare',
          24: 'hyDeclare',
          25: 'whh',
          26: 'lyDeclare'
        }
        Router.push({
          name: types[form_type],
          query: {
            project_id: detail.project_id,
            policy_document_id: detail.policy_document_id
          }
        })
      } else {
        Router.push({
          name: 'projectPerform',
          query: {
            active: 0, // 跳转进去后的tab 默认第一个
            projectId: detail.project_id,
            policyId: detail.policy_document_id
          }
        })
      }
    }

    const deleteProject = (id) => {
      Dialog.confirm({
        title: '提示',
        message: '删除后将无法恢复，是否删除？',
        confirmButtonColor: '#1B82EC'
      }).then(() => {
        onDelete(id)
      })
    }

    const onDelete = async (id) => {
      try {
        const result = await Request.deleteMyProject({
          project_id: id,
          type: props.type
        })
        if (result.code === 0) {
          Toast('删除成功')
          emit('deleteItem', id)
        } else {
          Toast(result.msg)
        }
      } catch (err) {
        Toast('服务器错误')
      }
    }

    // 获取状态内容 status：状态 form_type：表单类型 11：有机肥 21-23：秸秆 24：湖羊 25：无害化
    const getStatusText = (status, form_type) => {
      if ([11, 21, 22, 23, 24, 25, 26].includes(form_type)) {
        return formatHelperStatus(status, form_type)
      } else {
        return formatStatus(status)
      }
    }

    // 获取状态类名 status：状态 form_type：表单类型 11：有机肥 21-23：秸秆 24：湖羊 25：无害化
    const getStatusClass = (status, form_type) => {
      if ([11, 21, 22, 23, 24, 25, 26].includes(form_type)) {
        return formatHelperClass(status, form_type)
      } else {
        return formatClass(status)
      }
    }

    // 判断删除按钮是否展示
    const getIfShowDelBtn = (status, type) => {
      if (type == 1) {
        return status === 0 || status === 3
      } else {
        // 惠农补贴
        return status === 0
      }
    }

    return {
      state,
      toDetail,
      formatStatus,
      formatClass,
      deleteProject,
      getStatusText,
      getStatusClass,
      getIfShowDelBtn,
      toPreserveDetail
    }
  }
})
</script>

<style scoped lang="less">
.program-list {
  position: relative;
  box-sizing: border-box;
  height: 2.33rem;
  background: #fff;
  border-radius: 0.16rem;
  overflow: hidden;
  .name {
    height: 0.4rem;
    line-height: 0.4rem;
    font-size: 0.28rem;
    width: 4rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .time {
    height: 0.3rem;
    color: #999;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
  }
  .nameOld {
    font-size: 0.4rem;
  }
  .timeOld {
    font-size: 0.35rem;
  }
  .timeConFlex {
    margin-top: 0.2rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    .markSelf {
      color: #ffa100;
      padding: 0.15rem 0.2rem;
      margin-left: 0.1rem;
      background: rgba(255, 161, 0, 0.1);
      border-radius: 4px 4px 4px 4px;
      cursor: pointer;
    }
  }
  .btns {
    display: flex;
    justify-content: flex-end;
    margin-top: 0.2rem;
    height: 0.5rem;
    div {
      width: 1.6rem;
      height: 0.5rem;
      line-height: 0.5rem;
      text-align: center;
      background: #1b82ec;
      border-radius: 0.25rem;
      font-size: 0.28rem;
      color: #fff;
      margin-left: 0.2rem;
      box-sizing: border-box;
      &:nth-of-type(2) {
        border: 0.02rem solid #1b82ec;
        color: #1b82ec;
        background: #fff;
      }
    }
    .btnsOld {
      font-size: 0.35rem;
    }
  }
  .status {
    box-sizing: border-box;
    position: absolute;
    top: 0;
    right: 0;
    min-width: 2rem;
    height: 0.6rem;
    padding: 0 0.3rem;
    line-height: 0.6rem;
    text-align: center;
    font-size: 0.28rem;
    color: #fff;
    background: #3399ff;
    border-radius: 0 0 0 0.6rem;
  }
  .statusOld {
    font-size: 0.35rem;
  }
  .grey {
    background: #ccc;
  }
  .orange {
    background: #ffaa33;
  }
  .blue {
    background: #33d684;
  }
  .red {
    background: #ff6259;
  }
}
</style>
