<template>
  <div class="masterPolicyCon">
    <div class="declare_form">
      <div class="title" :class="state.ZLBFitForOld ? 'titleOld' : ''">
        申报材料
      </div>
      <div>
        <template v-for="(item, index) in state.list" :key="index">
          <div class="itemCon" :class="state.ZLBFitForOld ? 'itemConOld' : ''">
            <div>{{ index + 1 }}.</div>
            <div>{{ item.title }}</div>
          </div>
        </template>
      </div>
    </div>
    <van-button
      class="submitBtn"
      round
      block
      type="primary"
      :class="state.ZLBFitForOld ? 'submitBtnOld' : ''"
      @click="toMain"
      >开始申报</van-button
    >
  </div>
</template>
<script>
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'
import dayjs from 'dayjs'
import { Toast } from 'vant'
import { isZLB } from '@/util/index'
export default defineComponent({
  setup(props, { emit }) {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      list: [],
      ZLBFLAG: isZLB(),
      ZLBFitForOld:
        localStorage.getItem('fitForOld') &&
        localStorage.getItem('fitForOld') == 1
          ? true
          : false,
    })
    const unite1 = (res) => {
      if (res && res.code == 0) {
        const resData = res.data
        state.list = []
        if (resData.is_declaration == 2) {
          state.list.push({
            title: '项目申报书',
            index: '1',
          })
        }
        if (resData.is_scheme == 2) {
          state.list.push({
            title: '项目实施方案简表',
            index: '2',
          })
        }
        if (resData.is_business_license == 2) {
          state.list.push({
            title: '营业执照复印件',
            index: '3',
          })
        }
        if (resData.is_land == 2) {
          state.list.push({
            title: '土地流转协议等用地手续',
            index: '4',
          })
        }
        if (resData.is_device_list == 2) {
          state.list.push({
            title: '项目购置设备设施清单（包括型号、预估价）',
            index: '5',
          })
        }
        if (resData.is_engineering_design == 2) {
          state.list.push({
            title: '项目有关工程设计及投资情况佐证材料',
            index: '6',
          })
        }
        if (resData.is_facility == 2) {
          state.list.push({
            title: '设施农用地备案情况',
            index: '8',
          })
        }
        if (resData.is_other_material == 2) {
          state.list.push({
            title: '根据项目建设需要提供的其他材料',
            index: '10',
          })
        }
        if (resData.is_financial_support == 2) {
          state.list.push({
            title: '项目建设区域内近二年各级财政资金扶持情况',
            index: '9',
          })
        }
        if (resData.is_regional_photo == 2) {
          state.list.push({
            title: '项目建设内容布置示意图及区域现状照片',
            index: '7',
          })
        }
        let hi = state.list.sort((a, b) => {
          return +a.index - +b.index
        })
      } else {
        Toast(res.msg)
      }
    }
    const fetchList = () => {
      Request.getPolicyInfo({
        id: Route.query.policy_document_id,
      })
        .then((res) => {
          unite1(res)
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    onMounted(() => {
      fetchList()
    })
    const checkDetail = (item) => {
      Router.push({
        name: 'policyDetail',
        query: {
          id: item.id,
        },
      })
    }
    const toMain = () => {
      Router.push({
        name: 'declareMain',
        query: {
          project_id: Route.query.project_id,
          policy_document_id: Route.query.policy_document_id,
        },
      })
    }
    return {
      state,
      checkDetail,
      dayjs,
      toMain,
    }
  },
})
</script>

<style scoped lang="less">
.masterPolicyCon {
  box-sizing: border-box;
  padding: 0.3rem;
  width: 100%;
}

.title {
  font-size: 0.34rem;
  font-weight: bold;
  color: #000;
}
.titleOld {
  font-size: 0.42rem;
}
.declare_form {
  position: relative;
  border-radius: 0.15rem;
  padding: 0.3rem;
  overflow: hidden;
  background-color: #fff;
}
.submitBtn {
  width: 73.33%;
  margin: 0 auto;
  font-size: 0.32rem;
  font-weight: 500;
  color: #fff;
  margin-top: 1rem;
}
.submitBtnOld {
  font-size: 0.45rem;
}
.itemCon {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  font-size: 0.28rem;
  margin-top: 0.3rem;
}
.itemConOld {
  font-size: 0.35rem;
}
</style>
