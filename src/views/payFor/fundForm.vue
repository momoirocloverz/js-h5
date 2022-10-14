<template>
  <div class="pay_for pay_forCon">
    <van-form @submit="submit" validate-trigger="onSubmit" :readonly="!showSubmitBtn">
      <div class="box">
        <p class="title" :class="state.ZLBFitForOld ? 'topTitleOld' : ''">资金拨款申请表</p>
        <div class="input_item" v-for="(item, index) in formData" :key="index">
          <p :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">
            {{ item.name }}
          </p>
          <van-field
            v-if="item.key === 'apply_at'"
            v-model="item.value"
            disabled
            class="removeDisabled"
            :class="state.ZLBFitForOld ? 'fieldOld' : ''"
            name="apply_at"
            @click="openApplyDatePicker"
            placeholder="请选择申报日期"
            :rules="[{ required: true, message: '请选择申报日期' }]"
          />
          <van-field
            v-else-if="item.key == 'apply_amount'"
            v-model="item.value"
            @change="applyAmountChange"
            rows="4"
            autosize
            :class="state.ZLBFitForOld ? 'fieldOld' : ''"
            :type="item.type || ''"
            :maxlength="item.maxLength"
            :placeholder="item.placeholder"
            show-word-limit
            :rules="[{ required: true, message: item.placeholder }]"
          />
          <van-field
            v-else
            v-model="item.value"
            :disabled="item.disabled"
            rows="4"
            autosize
            :class="state.ZLBFitForOld ? 'fieldOld' : ''"
            :type="item.type || ''"
            :maxlength="item.maxLength"
            :placeholder="item.placeholder"
            show-word-limit
            :rules="[{ required: true, message: item.placeholder }]"
          />
        </div>
      </div>
      <div class="btn" v-if="showSubmitBtn">
        <van-button class="submitBtn" round block :class="state.ZLBFitForOld ? 'submitBtnOld' : ''" type="primary" native-type="submit" :disabled="state.submitDisable">提交</van-button>
      </div>
    </van-form>
    <van-popup v-model:show="state.showApplyDatePicker" round position="bottom"
      >.
      <van-datetime-picker v-model="state.select_apply_date" type="date" title="选择申请日期" @cancel="state.showApplyDatePicker = false" @confirm="confirmApplyDate" :min-date="state.minDate" />
    </van-popup>
    <van-calendar v-model:show="state.singleCalenderShow" @confirm="onSingleConfirm" />
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Request from '@/service/request'
import { Toast } from 'vant'
import dayjs from 'dayjs'
import { isZLB } from '@/util/index'
export default defineComponent({
  name: 'fundForm',
  setup() {
    const Route = useRoute()
    const Router = useRouter()
    const state = reactive({
      singleCalenderShow: false,
      showApplyDatePicker: ref(false),
      select_apply_date: new Date(),
      minDate: new Date(),
      status: '1', // 是否展示列表
      ZLBFLAG: isZLB(),
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
      summarInfo: {},
      stableAmount: 0,
      newArray2: [],
      newArray: [],
      submitDisable: false
    })
    const step = ref(2)
    const formData = ref([
      {
        name: '1. 项目名称',
        value: '',
        placeholder: '项目名称',
        key: 'project_name',
        disabled: true
      },
      {
        name: '2. 申请单位',
        value: '',
        placeholder: '申请单位',
        key: 'apply_unit',
        disabled: true
      },
      {
        name: '3. 负责人',
        value: '',
        placeholder: '负责人姓名',
        key: 'principal'
      },
      {
        name: '4. 经手人',
        value: '',
        placeholder: '经手人姓名',
        key: 'pass_person'
      },
      {
        name: '5. 联系电话',
        value: '',
        type: 'tel',
        placeholder: '联系电话',
        key: 'link_mobile'
      },
      {
        name: '6. 申请日期',
        value: '',
        placeholder: '申请日期',
        key: 'apply_at'
      },
      {
        name: '7. 项目主要建设内容',
        value: '',
        type: 'textarea',
        maxLength: 1000,
        placeholder: '项目主要建设内容',
        key: 'construction_content',
        disabled: true
      },
      {
        name: '8. 项目实施情况及进度',
        value: '',
        type: 'textarea',
        maxLength: 1000,
        placeholder: '项目实施情况及进度',
        key: 'progress'
      },
      {
        name: '9. 申请拨款\n' + '（1）依据',
        value: '',
        type: 'textarea',
        maxLength: 100,
        placeholder: '申请拨款依据',
        key: 'allotment_according'
      },
      {
        name: '（2）计划补助金额（万元）',
        value: '',
        type: 'number',
        placeholder: '请输入金额（万元）',
        key: 'plan_subsidy',
        disabled: true
      },
      {
        name: '（3）已补助金额（万元）',
        value: '',
        type: 'number',
        placeholder: '请输入金额（万元）',
        key: 'already_subsidy',
        disabled: true
      },
      {
        name: '（4）本次申报金额（万元）',
        value: '',
        type: 'number',
        placeholder: '请输入金额（万元）',
        key: 'apply_amount'
      },
      {
        name: '（5）累计补助金额（万元）',
        value: '',
        type: 'number',
        placeholder: '请输入金额（万元）',
        key: 'total_subsidy',
        disabled: true
      },
      {
        name: '（6）开户银行',
        value: '',
        placeholder: '请输入开户银行',
        key: 'bank'
      },
      {
        name: '（7）账号',
        value: '',
        type: 'number',
        placeholder: '请输入银行账号',
        key: 'bank_account'
      }
    ])
    const procressData = ref([
      { label: '材料递交', time: '2021-10-18', opinion: '' },
      { label: '项目管理负责人', time: '2021-10-18', opinion: '' },
      { label: '分管领导审核', time: '2021-10-18', opinion: '' },
      { label: '主要领导审核', time: '2021-10-18', opinion: '' },
      { label: '资金拨付', time: '2021-10-18', opinion: '' }
    ])
    const showSubmitBtn = computed(() => Route.query.isDetail != 1)

    const popSingleCalender = () => {
      state.singleCalenderShow = true
    }
    const onSingleConfirm = (value) => {
      state.singleCalenderShow = false
      let str = dayjs(value).format('YYYY-MM-DD')
      formData.value[5].value = str
    }
    const submit = () => {
      let obj = {}
      obj.project_id = Route.query.projectId
      formData.value.map((item) => {
        obj[item.key] = item.value || ''
      })
      // return console.log(state.status, obj)
      if (state.status == '3') {
        // 重新提交
        // console.log('重新提交', obj)
        state.submitDisable = true
        Request.amountApplyEdit(obj)
          .then((res) => {
            Toast(res.msg)
            Router.go(-1)
          })
          .finally(() => {
            getAmountApplyInfo()
          })
      }

      if (state.status == '1') {
        // 首次提交
        // console.log('首次提交', obj)
        state.submitDisable = true
        Request.amountApplyAdd(obj)
          .then((res) => {
            if (res.code === 0) {
              Toast(res.msg)
              Router.go(-1)
            } else {
              Toast(res.msg)
            }
          })
          .finally(() => {
            getAmountApplyInfo()
          })
      }
    }
    const getSummarInfo = () => {
      Request.amountApplySummarInfo({ project_id: Route.query.projectId })
        .then((res) => {
          if (res.code === 0) {
            state.summarInfo = res.data
            state.stableAmount = res.data.has_total_apply_amount
            formData.value[10].value = res.data.has_total_apply_amount
            formData.value[12].value = res.data.has_total_apply_amount
          } else {
            Toast(res.msg)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }
    // 获取项目申报详情 （回填项目名称和申报单位）
    const getProjectInfo = () => {
      Request.getProjectSchedule({
        project_id: Route.query.projectId
      })
        .then((res) => {
          if (res && res.code == 0) {
            formData.value[0] && (formData.value[0].value = res.data.info.project_name)
            formData.value[1] && (formData.value[1].value = res.data.info.declare_unit)
            formData.value[2].value = res.data.info.unit_charge_name
            formData.value[4].value = res.data.info.unit_charge_mobile
            formData.value[9].value = res.data.info.plan_all_order_amount || 0
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }
    const fetchImplement = () => {
      Request.fetchProjectImplementPlanDetail({
        project_id: Route.query.projectId
      })
        .then((res) => {
          if (res && res.code == 0) {
            formData.value[6].value = res.data.info.build_main_content
            let shorter = res.data.info
            /*    let array3 = shorter.part_options.find((ele) => {
              return ele.option_name == '基础设施建设'
            })
            let array4 = shorter.part_options.find((ele) => {
              return ele.option_name == '设施设备'
            })
            if (array3 && array3.list && array3.list.length) {
              state.newArray = array3.list
            }
            if (array4 && array4.list && array4.list.length) {
              state.newArray2 = array4.list
            }
            let count7 = 0
            let temp7 = state.newArray.map((ele) => {
              if (!ele.subsidy_money) {
                return {
                  ...ele,
                  subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0
                }
              } else {
                return {
                  ...ele
                }
              }
            })
            if (temp7) {
              let res1 = temp7.reduce((acc, current) => {
                return acc + current.subsidy_money
              }, 0)
              count7 = res1
            }
            let count8 = 0
            let temp8 = state.newArray2.map((ele) => {
              if (!ele.subsidy_money) {
                return {
                  ...ele,
                  subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0
                }
              } else {
                return {
                  ...ele
                }
              }
            })
            if (temp8) {
              let res1 = temp8.reduce((acc, current) => {
                return acc + current.subsidy_money
              }, 0)
              count8 = res1
            } */
            // this.newTotal2 = count7 + count8
            // this.formData.plan_subsidy = state.newTotal2
            // formData.value[9].value = count7 + count8
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    const applyAmountChange = () => {
      formData.value[12].value = +state.stableAmount + +formData.value[11].value
    }
    const getAmountApplyInfo = () => {
      state.submitDisable = false
      if (Route.query.id) {
        Request.amountApplyInfo({
          id: Route.query.id
        })
          .then((res) => {
            if (res.code === 0) {
              let d = res.data
              let arr = JSON.parse(JSON.stringify(formData.value))
              arr &&
                arr.map((item) => {
                  item['value'] = d[item.key]
                })
              formData.value = arr
              if (res.data.is_check == '4' && res.data.check_schedule == '4') {
                step.value = res.data.check_schedule + 1 // 第几步
              } else {
                step.value = res.data.check_schedule // 第几步
              }
              procressData.value[0].time = res.data.created_at || ''
              procressData.value[1].time = res.data.principal_at || '' // 项目负责人
              procressData.value[1].opinion = res.data.principal_reason || '' // 项目负责人 意见
              procressData.value[2].time = res.data.leader_at || '' // 分管领导
              procressData.value[2].opinion = res.data.leader_reason || '' // 分管领导 意见
              procressData.value[3].time = res.data.important_at || '' // 主要领导审核
              procressData.value[3].opinion = res.data.important_reason || '' // 主要领导审核
              procressData.value[4].time = res.data.refuse_at || '' // 资金拨付
              procressData.value[4].real_fund_amount = res.data.real_fund_amount || '' // 资金拨付
              procressData.value[4].opinion = res.data.fund_reason || '' // 资金拨付
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      }
    }
    const openApplyDatePicker = () => {
      if (!showSubmitBtn.value) return
      if (formData.value[5].value) {
        state.select_apply_date = dayjs(formData.value[5].value).toDate()
      }
      state.showApplyDatePicker = true
    }
    const confirmApplyDate = (e) => {
      formData.value[5].value = dayjs(e).format('YYYY/MM/DD')
      state.showApplyDatePicker = false
    }
    onMounted(() => {
      getProjectInfo()
      if (Route.query.id) {
        getAmountApplyInfo()
      } else {
        fetchImplement()
        getSummarInfo()
      }
    })
    return {
      procressData,
      formData,
      submit,
      popSingleCalender,
      onSingleConfirm,
      state,
      step,
      openApplyDatePicker,
      confirmApplyDate,
      showSubmitBtn,
      applyAmountChange
    }
  }
})
</script>

<style scoped lang="less">
.pay_for {
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
<style lang="less">
.pay_forCon {
  .fieldOld {
    .van-cell__title {
      font-size: 0.35rem;
    }
    .van-cell__value {
      font-size: 0.35rem;
    }
    .van-field__word-limit {
      font-size: 0.3rem;
    }
  }
}
</style>
