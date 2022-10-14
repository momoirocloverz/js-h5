<template>
  <div class="projectReservePublishCon">
    <div class="headTitle">项目实施方案简表</div>
    <van-form @failed="onFailed" @submit="onSubmit">
      <div class="topCon">
        <van-field
          required
          v-model="state.formData.project_name"
          :disabled="Route.query.justForShow == 1"
          input-align="right"
          type="textarea"
          name="project_name"
          rows="1"
          autosize
          label="项目名称"
          maxlength="50"
          @input="fieldChange"
          :class="state.ZLBFitForOld ? 'fieldOld' : ''"
          :rules="state.validator.project_name"
          placeholder="请输入项目名称"
        />
        <van-cell title="项目地点" class="fakeRequired">
          <template #value>
            {{ state.formData.area_ids && state.formData.area_ids.join(' ') }}
          </template>
        </van-cell>
        <van-field
          input-align="right"
          :disabled="Route.query.justForShow == 1"
          v-model="state.formData.area_detail"
          name="area_detail"
          label="详细地址"
          @input="fieldChange"
          maxlength="20"
          :rules="state.validator.area_detail"
          class="required-holder"
          :class="state.ZLBFitForOld ? 'fieldOld' : ''"
          placeholder="请输入详细地址"
        />
        <van-field
          input-align="right"
          v-model="state.formData.build_start_at"
          required
          disabled
          class="removeDisabled"
          name="build_start_at"
          label="起始月份"
          :class="state.ZLBFitForOld ? 'fieldOld' : ''"
          @click="openStartDatePicker"
          :rules="state.validator.build_start_at"
          placeholder="请选择建设期限起始月份"
        />
        <van-field
          input-align="right"
          v-model="state.formData.build_end_at"
          required
          disabled
          class="removeDisabled"
          name="build_end_at"
          label="结束月份"
          :class="state.ZLBFitForOld ? 'fieldOld' : ''"
          @click="openEndDatePicker"
          :rules="state.validator.build_end_at"
          placeholder="请选择建设期限结束月份"
        />
        <!-- <van-field
          required
          v-model="state.build_at"
          input-align="right"
          disabled
          class="removeDisabled"
          name="build_at"
          label="建设期限"
          :class="state.ZLBFitForOld ? 'fieldOld' : ''"
          @click="popCalender"
          :rules="state.validator.build_at"
          placeholder="请选择建设期限"
        /> -->
        <van-field
          required
          input-align="right"
          :disabled="Route.query.justForShow == 1"
          v-model="state.formData.declare_unit"
          name="declare_unit"
          label="建设单位"
          @input="fieldChange"
          maxlength="20"
          :class="state.ZLBFitForOld ? 'fieldOld' : ''"
          :rules="state.validator.declare_unit"
          placeholder="请输入建设单位"
        />
        <van-field
          required
          input-align="right"
          :disabled="Route.query.justForShow == 1"
          v-model="state.formData.unit_charge_name"
          name="unit_charge_name"
          label="负责人"
          @input="fieldChange"
          maxlength="10"
          :class="state.ZLBFitForOld ? 'fieldOld' : ''"
          :rules="state.validator.unit_charge_name"
          placeholder="请输入负责人"
        />
        <van-field
          required
          input-align="right"
          :disabled="Route.query.justForShow == 1"
          v-model="state.formData.unit_charge_mobile"
          name="unit_charge_mobile"
          label="联系电话"
          @input="fieldChange"
          maxlength="11"
          :class="state.ZLBFitForOld ? 'fieldOld' : ''"
          :rules="state.validator.unit_charge_mobile"
          placeholder="请输入联系电话"
        />
      </div>
      <div class="fixPaddingBottom">
        <van-button v-if="Route.query.justForShow == 1" class="submitBtn" block type="primary" @click="toNext" :class="state.ZLBFitForOld ? 'btnTextOld' : ''">下一步</van-button>
        <div v-else>
          <div class="fixBottom fixPaddingBottom" v-if="Route.query.status == 2">
            <van-button class="saveBtn" block @click="saveAction" :class="state.ZLBFitForOld ? 'btnTextOld' : ''">保存</van-button>
            <van-button class="submitBtn" block type="primary" native-type="submit" :class="state.ZLBFitForOld ? 'btnTextOld' : ''">下一步</van-button>
          </div>
          <div class="fixBottom fixPaddingBottom" v-else>
            <van-button block type="primary" native-type="submit" :class="state.ZLBFitForOld ? 'btnTextOld' : ''">下一步</van-button>
          </div>
        </div>
      </div>
    </van-form>

    <van-popup v-model:show="state.showStartDatePicker" round position="bottom"
      >.
      <van-datetime-picker
        v-model="state.select_start_date"
        type="year-month"
        title="选择起始月份"
        @cancel="state.showStartDatePicker = false"
        @confirm="confirmStartDate"
        :min-date="state.minDate"
        :max-date="state.maxDate"
      />
    </van-popup>

    <van-popup v-model:show="state.showEndDatePicker" round position="bottom"
      >.
      <van-datetime-picker
        v-model="state.select_end_date"
        type="year-month"
        title="选择结束月份"
        @cancel="state.showEndDatePicker = false"
        @confirm="confirmEndDate"
        :min-date="state.minDate"
        :max-date="state.maxDate"
      />
    </van-popup>

    <van-calendar v-model:show="state.calenderShow" :min-date="state.minDate" :max-date="state.maxDate" type="range" @confirm="onCalenderConfirm" />
  </div>
</template>
<script>
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import { Toast } from 'vant'
import Request from '@/service/request'
import dayjs from 'dayjs'
import { isZLB } from '@/util/index'
import { mgop } from '@aligov/jssdk-mgop'
const PHONEREGULAR = /^1[3-9]\d{9}$/
export default defineComponent({
  setup(props, { emit }) {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      ZLBFLAG: isZLB(),
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
      minDate: new Date('2018-01-01'),
      maxDate: new Date('2028-01-01'),
      select_start_date: new Date(),
      select_end_date: new Date(),
      showStartDatePicker: ref(false),
      showEndDatePicker: ref(false),
      contentChanged: false,
      cascaderValue: '',
      singleCalenderShow: false,
      calenderShow: false,
      show: false,
      detail: {},
      area_ids: [],
      ids: [],
      validator: {
        project_name: [{ trigger: 'onBlur', message: '请输入', required: true }],
        declare_unit: [{ trigger: 'onBlur', message: '请输入', required: true }],
        unit_charge_name: [{ trigger: 'onBlur', message: '请输入', required: true }],
        build_start_at: [{ required: true, trigger: 'onBlur', message: '请选择起始日期' }],
        build_end_at: [{ required: true, trigger: 'onBlur', message: '请选择结束日期' }],
        // build_at: [{ trigger: 'onBlur', message: '请输入', required: true }],
        area_detail: [{ trigger: 'onBlur', message: '请输入', required: false }],
        declare_at: [{ trigger: 'onBlur', message: '请输入', required: true }],
        unit_charge_mobile: [
          {
            requied: true,
            trigger: 'onBlur',
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确手机号'
          }
        ]
      },
      formData: {
        project_name: '',
        area_detail: '',
        // build_at: '',
        declare_unit: '',
        unit_charge_name: '',
        unit_charge_mobile: '',
        declare_at: '',
        build_contents: [],
        build_start_at: '',
        build_end_at: ''
      }
    })
    const normalSet = (res) => {
      let shorter = res.data.info
      if (shorter.build_start_at) {
        shorter.build_start_at = dayjs(shorter.build_start_at).format('YYYY/MM')
      }
      if (shorter.build_end_at) {
        shorter.build_end_at = dayjs(shorter.build_end_at).format('YYYY/MM')
      }
      state.formData = shorter
      state.formData.build_contents = shorter.build_contents || []
      state.formData.area_ids = decodeURIComponent(Route.query.area_ids).split(',')
      if (shorter.build_start_at) {
        // state.build_at = `${dayjs(shorter.build_start_at).format('YYYY-MM')}-${dayjs(shorter.build_end_at).format('YYYY-MM')}`
      }
      if (shorter && shorter.project_name) {
      } else {
        fetchAnother()
      }
    }
    const fetchAnother = () => {
      Request.fetchProjectDeclarationDetail({
        project_id: Route.query.project_id
      })
        .then((res) => {
          if (res && res.code == 0) {
            let simple = res.data.info
            if (simple.project_name) {
              state.formData.project_name = simple.project_name
              state.formData.area_detail = simple.area_detail
              state.formData.build_start_at = dayjs(simple.build_start_at).format('YYYY/MM')
              state.formData.build_end_at = dayjs(simple.build_end_at).format('YYYY/MM')
              //   state.formData.build_at = `${dayjs(simple.build_start_at).format('YYYY-MM')}-${dayjs(simple.build_end_at).format('YYYY-MM')}`
              state.formData.unit_charge_mobile = simple.unit_charge_mobile
              state.formData.unit_charge_name = simple.unit_charge_name
              state.formData.declare_unit = simple.declare_unit
            }
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    const layer1 = (res) => {
      state.detail = res.data.info
      if (Route.query.is_implement_plan_reserve_change == 1) {
        normalSet(res)
      } else {
        fetchPreserveData(res)
      }
    }
    const fetchPreserveData = (res) => {
      if (+Route.query.project_reserve_id) {
        Request.projectReserveDetail({
          id: Route.query.project_reserve_id
        })
          .then((res2) => {
            if (res2 && res2.code == 0) {
              let shorter = res2.data.info
              if (shorter.build_start_at) {
                shorter.build_start_at = dayjs(shorter.build_start_at).format('YYYY/MM')
              }
              if (shorter.build_end_at) {
                shorter.build_end_at = dayjs(shorter.build_end_at).format('YYYY/MM')
              }
              state.formData = shorter
              state.formData.build_contents = shorter.build_contents || []
              state.formData.area_ids = decodeURIComponent(Route.query.area_ids).split(',')
              if (shorter.build_start_at) {
                // state.build_at = `${dayjs(shorter.build_start_at).format('YYYY-MM')}-${dayjs(shorter.build_end_at).format('YYYY-MM')}`
              }
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      } else {
        normalSet(res)
      }
    }
    const fetchList = () => {
      if (Route.query.project_id) {
        Request.fetchProjectImplementPlanDetail({
          project_id: Route.query.project_id
        })
          .then((res) => {
            if (res && res.code == 0) {
              layer1(res)
            } else {
              Toast(res.msg)
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      }
    }
    onMounted(() => {
      fetchList()
    })
    onBeforeRouteLeave((to, from) => {
      if (state.contentChanged) {
        const answer = window.confirm('您的项目信息未进行保存，是否确定离开？')
        if (answer) {
        } else {
          return false
        }
      }
    })
    const onFailed = (err) => {
      console.log(err)
    }
    const onSubmit = (params) => {
      console.log('success')
      finalParams('flag')
    }
    const finalParams = (flag) => {
      let requestData = {
        part_options: state.formData.part_options,
        project_name: state.formData.project_name,
        area_detail: state.formData.area_detail,
        build_start_at: state.formData.build_start_at ? dayjs(state.formData.build_start_at).format('YYYY-MM-DD HH:mm:ss') : '',
        build_end_at: state.formData.build_end_at ? dayjs(state.formData.build_end_at).endOf('month').format('YYYY-MM-DD HH:mm:ss') : '',
        declare_unit: state.formData.declare_unit,
        unit_charge_name: state.formData.unit_charge_name ? state.formData.unit_charge_name : '',
        unit_charge_mobile: state.formData.unit_charge_mobile,
        policy_document_id: Route.query.policy_document_id,
        project_id: Route.query.project_id,
        save_type: 'save'
      }
      if (+Route.query.project_reserve_id) {
        requestData.project_reserve_id = Route.query.project_reserve_id
      }
      Request.actionProjectImplementPlan(requestData)
        .then((res) => {
          if (res && res.code == 0) {
            Toast('保存成功')
            state.contentChanged = false
            if (flag) {
              toNext()
            }
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    const saveAction = () => {
      if (state.formData.unit_charge_mobile) {
        let phoneReg = PHONEREGULAR.test(state.formData.unit_charge_mobile)
        if (phoneReg) {
        } else {
          delete state.formData.unit_charge_mobile
        }
        finalParams()
      } else {
        finalParams()
      }
    }
    const onCalenderConfirm = (values) => {
      const [start, end] = values
      state.calenderShow = false
      //   state.build_at = `${dayjs(start).format('YYYY-MM')}-${dayjs(end).format('YYYY-MM')}`
      fieldChange()
      state.formData.build_start_at = dayjs(start).format('YYYY-MM-DD HH:mm:ss')
      state.formData.build_end_at = dayjs(end).format('YYYY-MM-DD HH:mm:ss')
    }
    const popCalender = () => {
      if (Route.query.justForShow == 1) {
      } else {
        state.calenderShow = true
      }
    }
    const popSingleCalender = () => {
      state.singleCalenderShow = true
    }
    const toNext = () => {
      Router.push({
        name: 'declareImplementationPlantTwo',
        query: {
          project_id: Route.query.project_id,
          policy_document_id: Route.query.policy_document_id,
          justForShow: Route.query.justForShow,
          status: Route.query.status,
          mobile: Route.query.mobile,
          project_reserve_id: Route.query.project_reserve_id,
          is_declaration_reserve_change: Route.query.is_declaration_reserve_change
        }
      })
    }
    const onChange = () => {}
    const fieldChange = () => {
      state.contentChanged = true
    }

    const openStartDatePicker = () => {
      if (state.formData.build_start_at) {
        state.select_start_date = dayjs(state.formData.build_start_at).toDate()
      }
      state.showStartDatePicker = true
    }
    const openEndDatePicker = () => {
      if (state.formData.build_end_at) {
        state.select_end_date = dayjs(state.formData.build_end_at).toDate()
      }
      state.showEndDatePicker = true
    }
    const confirmStartDate = (e) => {
      state.formData.build_start_at = dayjs(e).format('YYYY/MM')
      state.showStartDatePicker = false
      fieldChange()
    }
    const confirmEndDate = (e) => {
      state.formData.build_end_at = dayjs(e).format('YYYY/MM')
      state.showEndDatePicker = false
      fieldChange()
    }
    return {
      fieldChange,
      Route,
      state,
      onFailed,
      onSubmit,
      onChange,
      onCalenderConfirm,
      popCalender,
      dayjs,
      popSingleCalender,
      saveAction,
      toNext,
      openStartDatePicker,
      openEndDatePicker,
      confirmStartDate,
      confirmEndDate
    }
  }
})
</script>
<style scoped lang="less">
.publishCircle {
  position: fixed;
  right: 0;
  bottom: 210px;
  width: 1.44rem;
  height: 1.44rem;
  background-color: #fff;
  border-radius: 0.72rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  img {
    width: 100%;
    height: 100%;
  }
}
.ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  overflow: hidden;
}
.fixPaddingBottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.tagLine {
  width: 0.05rem;
  height: 0.3rem;
  background: #1b82ec;
  opacity: 1;
  border-radius: 0.03rem;
  margin-right: 0.06rem;
}
.tagText {
  font-size: 0.3rem;
  line-height: 0.45rem;
  height: 0.4rem;
  color: #333;
}
.homeTag {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  box-sizing: border-box;
}
.timeCon {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  box-sizing: border-box;
  font-size: 0.24rem;
  color: #666;
}
.contentCon {
  margin-top: 0.4rem;
  font-size: 0.28rem;
  font-weight: 500;
  line-height: 0.36rem;
  color: #333;
}
.marBottom20 {
  margin-bottom: 0.2rem;
}
.projectReservePublishCon {
  box-sizing: border-box;
  padding: 0.3rem;
  padding-bottom: 1rem;

  .headTitle {
    font-size: 0.34rem;
    font-weight: bold;
    color: #000;
    margin-bottom: 0.3rem;
  }

  .topCon {
    margin-bottom: 0.3rem;
  }
  .masterInner {
    box-sizing: border-box;
    padding: 0.3rem;
    border-radius: 0.15rem;
    background-color: #fff;
  }
}
.addbtnCon {
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  background-color: #fff;
  border-radius: 0.1rem;
  margin-bottom: 0.3rem;
  .describe {
    font-size: 0.28rem;
    font-weight: 500;
    color: #333;
    line-height: 0.36rem;
    height: 0.36rem;
  }
  .describeOld {
    font-size: 0.35rem;
  }
  img {
    width: 0.36rem;
    height: 0.36rem;
    margin-right: 0.1rem;
  }
  .addbtnCenter {
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
  }
}
.summary {
  font-size: 0.32rem;
  font-weight: bold;
  color: #1b82ec;
}
.summaryOld {
  font-size: 0.35rem;
}
.marBottom30 {
  margin-bottom: 0.3rem;
}
.itemCon {
  padding: 0.3rem;
  box-sizing: border-box;
  background-color: #fff;
  .itemMoney {
    font-size: 0.28rem;
    font-weight: 500;
    color: #666;
    text-align: right;
  }
  .moneyCon {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    align-content: center;
  }
  .itemMoneyCon {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
  }
  .itemTitle {
    font-size: 0.28rem;
    font-weight: 500;
    color: #333;
  }
  .itemTitleOld {
    font-size: 0.35rem;
  }
  .itemContent {
    font-size: 0.28rem;
    color: #666;
    line-height: 0.4rem;
  }
}
.commonUnit {
  font-size: 0.28rem;
  font-weight: 500;
  color: #666;
}
.commonUnitOld {
  font-size: 0.35rem;
}
.required-holder {
  &:before {
    margin-right: 2px;
    color: #fff;
    content: '*';
  }
}
.fakeRequired {
  &:before {
    margin-right: 2px;
    color: rgb(238, 10, 36);
    content: '*';
  }
}
.littleBtn {
  margin-top: 0.2rem;
  width: 1.5rem;
  font-size: 0.3rem;
}
.littleBtnOld {
  font-size: 0.35rem;
}
.endBtn {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  align-content: center;
}
.fixBottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  .saveBtn {
    width: 33%;
    color: rgb(25, 137, 250);
    border: 1px solid rgb(25, 137, 250);
  }
  .submitBtn {
    width: 67%;
  }
  .btnTextOld {
    font-size: 0.35rem;
  }
}
</style>
<style lang="less">
.projectReservePublishCon {
  .removeDisabled {
    .van-field__label {
      color: #646566 !important;
    }
    .van-field__control:disabled {
      color: rgb(50, 50, 51) !important;
      -webkit-text-fill-color: rgb(50, 50, 51) !important;
    }
    .van-cell__value {
      color: rgb(50, 50, 51) !important;
    }
  }
  .itemMoney {
    .van-field__control {
      text-align: right;
    }
  }
  .fieldOld {
    .van-cell__title {
      font-size: 0.35rem;
    }
    .van-cell__value {
      font-size: 0.35rem;
    }
  }
  .cellOld {
    .van-cell__title {
      font-size: 0.35rem;
    }
    .van-cell__value {
      font-size: 0.35rem;
    }
  }
}
</style>
