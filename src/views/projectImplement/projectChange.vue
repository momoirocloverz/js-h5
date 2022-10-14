<template>
  <div class="main projectImplementChangeCon">
    <div class="topTitle" :class="newState.ZLBFitForOld ? 'topTitleOld' : ''">项目变更申请表</div>
    <van-form @submit="submit" validate-trigger="onSubmit" v-if="state.status == '0' || state.status == '3' || state.status == '2'">
      <div class="box">
        <div class="head">
          <span :class="newState.ZLBFitForOld ? 'titleOld' : ''">材料填报</span>
        </div>
        <div class="item">
          <p :class="newState.ZLBFitForOld ? 'itemTitleOld' : ''">1. 项目名称</p>
          <div class="inputBox">
            <van-field
              v-model="formData.project_name"
              class="inputs"
              type="text"
              :class="newState.ZLBFitForOld ? 'fieldOld' : ''"
              placeholder="关于XXXXXX建设项目"
              :rules="[{ required: true, message: '请填写项目名称' }]"
            />
          </div>
        </div>
        <div class="item">
          <p :class="newState.ZLBFitForOld ? 'itemTitleOld' : ''">2. 文件名称</p>
          <div class="inputBox">
            <van-field
              v-model="formData.file_name"
              class="inputs"
              type="text"
              :class="newState.ZLBFitForOld ? 'fieldOld' : ''"
              placeholder="请输入文件名称"
              :rules="[{ required: true, message: '请输入文件名称' }]"
            />
          </div>
        </div>
        <div class="item">
          <p :class="newState.ZLBFitForOld ? 'itemTitleOld' : ''">3. 文号</p>
          <div class="inputBox">
            <van-field
              v-model="formData.file_number"
              class="inputs"
              type="text"
              :class="newState.ZLBFitForOld ? 'fieldOld' : ''"
              placeholder="请输入文件名称"
              :rules="[{ required: true, message: '请输入文号' }]"
            />
          </div>
        </div>
        <div class="item">
          <p :class="newState.ZLBFitForOld ? 'itemTitleOld' : ''">4. 申请单位</p>
          <div class="inputBox">
            <van-field
              v-model="formData.apply_unit"
              class="inputs"
              type="text"
              :class="newState.ZLBFitForOld ? 'fieldOld' : ''"
              placeholder="请输入申请单位"
              :rules="[{ required: true, message: '请输入申请单位' }]"
            />
          </div>
        </div>
        <div class="item">
          <p :class="newState.ZLBFitForOld ? 'itemTitleOld' : ''">5. 联系人</p>
          <div class="inputBox">
            <van-field
              v-model="formData.link_person"
              class="inputs"
              type="text"
              :class="newState.ZLBFitForOld ? 'fieldOld' : ''"
              placeholder="请输入项目联系人"
              :rules="[{ required: true, message: '请输入项目联系人' }]"
            />
          </div>
        </div>
        <div class="item">
          <p :class="newState.ZLBFitForOld ? 'itemTitleOld' : ''">6. 联系电话</p>
          <div class="inputBox">
            <van-field
              v-model="formData.link_mobile"
              maxlength="11"
              class="inputs"
              type="text"
              :class="newState.ZLBFitForOld ? 'fieldOld' : ''"
              placeholder="请输入联系电话"
              :rules="[{ required: true, message: '请输入联系电话' }]"
            />
          </div>
        </div>
        <div class="item">
          <p :class="newState.ZLBFitForOld ? 'itemTitleOld' : ''">7. 建设期限</p>
          <div class="inputBox">
            <van-field
              type="text"
              v-model="formData.build_start_month"
              required
              disabled
              class="removeDisabled inputs removeDisableColor"
              name="build_start_month"
              :class="state.ZLBFitForOld ? 'fieldOld' : ''"
              placeholder="请选择建设期限起始月份"
              @click="openStartDatePicker"
              :rules="[{ required: true, message: '请选择建设期限起始月份' }]"
            />
          </div>
          <div class="inputBox mt10">
            <van-field
              type="text"
              v-model="formData.build_end_month"
              required
              disabled
              class="removeDisabled inputs removeDisableColor"
              name="build_start_month"
              :class="state.ZLBFitForOld ? 'fieldOld' : ''"
              placeholder="请选择建设期限结束月份"
              @click="openEndDatePicker"
              :rules="[{ required: true, message: '请选择建设期限起始月份' }]"
            />
          </div>
        </div>
        <div class="item">
          <p :class="newState.ZLBFitForOld ? 'itemTitleOld' : ''">8. 文件下达建设内容</p>
          <div class="inputBox">
            <van-field
              v-model="formData.construction_content"
              class="removeDisabled inputs"
              disabled
              type="textarea"
              :class="newState.ZLBFitForOld ? 'fieldOld' : ''"
              placeholder="1000字以内"
              :rules="[{ required: true, message: '请填写文件下达建设内容' }]"
            />
          </div>
        </div>
        <div class="item">
          <p :class="newState.ZLBFitForOld ? 'itemTitleOld' : ''">9. 申请变更内容</p>
          <div class="inputBox">
            <van-field
              v-model="formData.change_apply_content"
              class="inputs"
              type="textarea"
              :class="newState.ZLBFitForOld ? 'fieldOld' : ''"
              placeholder="1000字以内"
              :rules="[{ required: true, message: '请填写申请变更内容' }]"
            />
          </div>
        </div>
        <div class="item">
          <p :class="newState.ZLBFitForOld ? 'itemTitleOld' : ''">10. 变更原因</p>
          <div class="inputBox">
            <van-field
              v-model="formData.apply_reason"
              class="inputs"
              type="textarea"
              :class="newState.ZLBFitForOld ? 'fieldOld' : ''"
              placeholder="1000字以内"
              :rules="[{ required: true, message: '请填写变更原因' }]"
            />
          </div>
        </div>
        <div class="item">
          <p :class="newState.ZLBFitForOld ? 'itemTitleOld' : ''">11. 变更后项目建设计划</p>
          <div class="inputBox">
            <van-field
              v-model="formData.after_build_plan"
              class="inputs"
              type="textarea"
              :class="newState.ZLBFitForOld ? 'fieldOld' : ''"
              placeholder="1000字以内"
              :rules="[{ required: true, message: '请填写变更后项目建设计划' }]"
            />
          </div>
        </div>
        <div class="item">
          <p :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">12. 是否延期</p>
          <div class="selectBox">
            <div :class="[formData.is_delay == '1' ? 'ac' : null, state.ZLBFitForOld ? 'selectBoxItemOld' : '']" @click="changeIsPro('1')">是</div>
            <div :class="[formData.is_delay == '0' ? 'ac' : null, state.ZLBFitForOld ? 'selectBoxItemOld' : '']" @click="changeIsPro('0')">否</div>
          </div>
        </div>
        <div class="item" v-if="formData.is_delay == '1'">
          <p :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">13.延期开始时间</p>
          <div class="inputBox">
            <van-field
              type="text"
              v-model="formData.delay_start_date"
              required
              disabled
              class="removeDisabled inputs removeDisableColor"
              name="build_start_month"
              :class="state.ZLBFitForOld ? 'fieldOld' : ''"
              placeholder="请选择延期开始时间"
              @click="openDelayStartDatePicker"
              :rules="[{ required: true, message: '请选择延期开始时间' }]"
            />
          </div>
        </div>
      </div>
      <div class="subBox" v-if="state.status == '3' || state.status == '0'">
        <van-button class="submit" round block type="info" native-type="submit" :class="newState.ZLBFitForOld ? 'submitBtnOld' : ''">提交</van-button>
      </div>
    </van-form>
    <div class="box" v-if="state.status != 0">
      <div class="head">
        <span>审核流程</span>
      </div>
      <Procresss :procressData="procressData" :step="step"></Procresss>
    </div>
    <van-popup v-model:show="newState.showStartDatePicker" round position="bottom"
      >.
      <van-datetime-picker
        v-model="newState.select_start_date"
        type="year-month"
        title="选择起始月份"
        @cancel="newState.showStartDatePicker = false"
        @confirm="confirmStartDate"
        :min-date="newState.minDate"
        :max-date="newState.maxDate"
      />
    </van-popup>
    <van-popup v-model:show="newState.showEndDatePicker" round position="bottom"
      >.
      <van-datetime-picker
        v-model="newState.select_end_date"
        type="year-month"
        title="选择结束月份"
        @cancel="newState.showEndDatePicker = false"
        @confirm="confirmEndDate"
        :min-date="newState.minDate"
        :max-date="newState.maxDate"
      />
    </van-popup>
    <van-popup v-model:show="newState.showDelayStartDatePicker" round position="bottom"
      >.
      <van-datetime-picker
        v-model="newState.delay_start_date"
        type="date"
        title="选择延期开始时间"
        @cancel="newState.showDelayStartDatePicker = false"
        @confirm="confirmDelayStartDate"
        :min-date="newState.minDate"
        :max-date="newState.maxDate"
      />
    </van-popup>
  </div>
</template>
<script>
import { defineComponent, onMounted, reactive, ref } from 'vue'
import Procresss from '@/components/procress'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { Toast } from 'vant'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
export default defineComponent({
  components: { Procresss },
  setup(props, { emit }) {
    const Route = useRoute()
    const newState = reactive({
      ZLBFLAG: isZLB(),
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
      minDate: new Date('2018-01-01'),
      maxDate: new Date('2028-01-01'),
      select_start_date: new Date(),
      select_end_date: new Date(),
      showStartDatePicker: false,
      showEndDatePicker: false,
      showDelayStartDatePicker: false,
      fetchStart: '',
      fetchEnd: ''
    })
    const Router = useRouter()
    const formData = ref({
      project_id: Route.query.projectId,
      project_name: '', //项目名称
      file_name: '', // 文件名称
      file_number: '', // 文号
      apply_unit: '', // 申请单位
      link_person: '',
      link_mobile: '', //
      change_apply_content: '', //申请变更内容
      construction_content: '', //建设内容
      apply_reason: '', // 变更原因
      build_start_month: '',
      build_end_month: '',
      after_build_plan: '',
      is_delay: 1,
      delay_start_date: ''
    })
    const step = ref(1)
    const isFirst = ref(true)
    // 是否存在问题
    const procressData = reactive([
      { label: '变更审核', time: '', opinion: '' },
      { label: '材料递交', time: '2021-10-18', opinion: '' }
    ])
    const state = ref({
      status: '0'
    })
    const formatData = () => {
      formData.value = {
        project_id: Route.query.projectId,
        project_name: '', //项目名称
        file_name: '', // 文件名称
        file_number: '', // 文号
        apply_unit: '', // 申请单位
        link_person: '',
        link_mobile: '', //
        change_apply_content: '', //申请变更内容
        construction_content: '', //建设内容
        apply_reason: '',
        build_start_month: '',
        build_end_month: '',
        after_build_plan: '',
        is_delay: 1,
        delay_start_date: ''
      }
    }
    onMounted(() => {
      // change_apply  "is_check（1 待审 2 通过 3 拒绝 4 撤回）":2,
      getInfo()
    })
    const fetchImplement = () => {
      Request.fetchProjectImplementPlanDetail({
        project_id: Route.query.projectId
      })
        .then((res) => {
          if (res && res.code == 0) {
            formData.value.construction_content = res.data.info.build_main_content
            newState.fetchStart = res.data.info.build_start_at
            newState.fetchEnd = res.data.info.build_end_at
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    const submit = () => {
      let data = {
        ...formData.value,
        build_start_month: dayjs(formData.value.build_start_month).format('YYYY-MM'),
        build_end_month: dayjs(formData.value.build_end_month).endOf('month').format('YYYY-MM'),
        change_apply_content:
          '建设期限由' +
          dayjs(newState.fetchStart).format('YYYY年MM月') +
          '至' +
          dayjs(newState.fetchEnd).format('YYYY年MM月') +
          '更改为' +
          dayjs(formData.value.build_start_month).format('YYYY年MM月') +
          '至' +
          dayjs(formData.value.build_end_month).format('YYYY年MM月') +
          '<br/>' +
          formData.value.change_apply_content
      }
      console.log('data', data)
      // 处理多张图片 用逗号分割
      if (isFirst.value) {
        // 添加
        Request.changeApplyAdd(data)
          .then((res) => {
            if (res.code === 0) {
              Toast(res.msg)
            } else {
              Toast(res.msg)
            }
          })
          .catch((err) => {
            Toast('Request Error: ', err)
          })
          .finally(() => {
            getInfo()
          })
      } else {
        console.log('编辑')
        Request.changeApplyEdit(data)
          .then((res) => {
            if (res.code === 0) {
              Toast(res.msg)
            } else {
              Toast(res.msg)
            }
          })
          .catch((err) => {
            Toast('Request Error: ', err)
          })
          .finally(() => {
            getInfo()
          })
      }
    }
    const getInfo = () => {
      Request.changeApplyAddInfo({ id: Route.query.projectId }).then((res) => {
        if (res.code === 0) {
          if (JSON.stringify(res.data) == '[]') {
            isFirst.value = true
            fetchImplement()
          } else {
            let d = res.data
            isFirst.value = false
            formData.value = d
            state.value.status = d.is_check //1 待审 2 通过 3 拒绝 4 撤回
            if (d.is_check == 1 || d.is_check == 2) {
            } else {
              let track = formData.value.change_apply_content.split('<br/>')[1]
              if (track) {
                formData.value.change_apply_content = track
              }
            }
            let obj = {
              1: '待审',
              2: '操作：通过',
              3: '操作：拒绝',
              4: '撤回'
            }
            procressData[1].time = d.created_at || ''
            if (d.is_check != 1) {
              step.value = 2
              procressData[0].opinion = obj[d.is_check] || ''
              procressData[0].reason = d.check_reason || ''
              procressData[0].time = d.updated_at || ''
            }
            fetchImplement()
          }
        }
      })
    }
    const openDelayStartDatePicker = () => {
      if (formData.value.build_start_month) {
        newState.delay_start_date = dayjs(formData.value.delay_start_date).toDate()
      }
      newState.showDelayStartDatePicker = true
    }
    const openStartDatePicker = () => {
      if (formData.value.build_start_month) {
        newState.select_start_date = dayjs(formData.value.build_start_month).toDate()
      }
      newState.showStartDatePicker = true
    }
    const openEndDatePicker = () => {
      if (formData.value.build_end_month) {
        newState.select_end_date = dayjs(formData.value.build_end_month).toDate()
      }
      newState.showEndDatePicker = true
    }
    const confirmDelayStartDate = (e) => {
      formData.value.delay_start_date = dayjs(e).format('YYYY/MM/DD')
      newState.showDelayStartDatePicker = false
    }
    const confirmStartDate = (e) => {
      formData.value.build_start_month = dayjs(e).format('YYYY/MM')
      newState.showStartDatePicker = false
    }
    const confirmEndDate = (e) => {
      formData.value.build_end_month = dayjs(e).format('YYYY/MM')
      newState.showEndDatePicker = false
    }
    const changeIsPro = (val) => {
      if (isFirst.value) {
        formData.value.is_delay = val
      }
    }
    return {
      changeIsPro,
      procressData,
      step,
      submit,
      formData,
      formatData,
      isFirst,
      getInfo,
      state,
      newState,
      openStartDatePicker,
      openEndDatePicker,
      confirmStartDate,
      confirmEndDate,
      fetchImplement,
      openDelayStartDatePicker,
      confirmDelayStartDate
    }
  }
})
</script>
<style scoped lang="less">
::v-deep {
  .removeDisableColor {
    input {
      color: #323233;
      -webkit-text-fill-color: #323233;
    }
  }
}
.mt10 {
  margin-top: 10px;
}
.main {
  width: 100%;
  font-size: 0.28rem;

  .topTitle {
    font-size: 0.34rem;
    font-weight: bold;
    padding: 0.2rem 0.3rem 0 0.3rem;
  }
  .topTitleOld {
    font-size: 0.4rem;
  }

  .subBox {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    padding: 0.5rem 0.8rem;

    .submit {
      width: 100%;
      color: #fff;
      background-color: rgba(27, 130, 236, 1);
      text-align: center;
      border-radius: 0.4rem;
      margin: 0.3rem auto;
    }
    .submitBtnOld {
      font-size: 0.45rem;
    }
  }

  .box {
    padding: 0.2rem;
    margin: 0.2rem 0.3rem;
    background: #fff;
    border-radius: 0.16rem;

    .item:last-of-type {
      padding-bottom: 0;
    }

    .item {
      width: 100%;
      padding-bottom: 0.3rem;

      .error {
        color: red;
        font-size: 0.22rem;
        margin-top: 0.1rem;
      }

      p {
        font-weight: normal;
        font-size: 0.28rem;
        color: rgba(0, 0, 0, 1);
        margin-bottom: 0.3rem;
      }
      .itemTitleOld {
        font-size: 0.35rem;
      }
      .item2 {
        margin: 0.25rem 0;

        .name {
          line-height: 0.4rem;
        }

        .tips {
          color: #999;
          font-size: 0.24rem;
          line-height: 0.3rem;
          margin: 0.2rem 0;
        }
      }

      .selectBox {
        width: 100%;
        padding: 0.2rem 0.3rem;
        box-sizing: border-box;
        background-color: rgba(249, 249, 249, 1);
        border: 0.01rem solid rgba(204, 204, 204, 1);
        display: flex;
        justify-content: space-between;

        div {
          width: 48%;
          text-align: center;
          line-height: 0.6rem;
          height: 0.6rem;
          border: 0.01rem solid rgba(27, 130, 236, 1);
          color: rgba(27, 130, 236, 1);
        }
        .selectBoxItemOld {
          font-size: 0.4rem;
        }
        .ac {
          background: rgba(27, 130, 236, 0.14);
        }
      }

      .inputBox {
        width: 100%;
        padding: 0.2rem 0.3rem;
        box-sizing: border-box;
        background-color: rgba(249, 249, 249, 1);
        border: 0.01rem solid rgba(204, 204, 204, 1);

        .inputs {
          padding: 0;
          background-color: #f9f9f9;
        }

        input,
        textarea {
          border: none;
          outline: none;
          background: none;
          width: 100%;
          display: block;
          height: auto;
          resize: none;
        }
      }
    }

    .head {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      position: relative;

      span {
        font-weight: 600;
        font-size: 0.3rem;
        height: 0.3rem;
        line-height: 0.3rem;
        border-left: 0.05rem solid #1b82ec;
        text-indent: 0.1rem;
        margin: 0.2rem 0 0.4rem;
      }
      .titleOld {
        font-size: 0.4rem;
      }
    }
  }
}
</style>
<style lang="less">
.projectImplementChangeCon {
  .fieldOld {
    .van-cell__title {
      font-size: 0.35rem;
    }
    .van-cell__value {
      font-size: 0.35rem;
    }
  }
}
</style>
