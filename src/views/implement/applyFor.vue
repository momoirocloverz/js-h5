<template>
  <div class="apply_for">
    <p class="title">局财政支农项目验收申请书</p>
    <div class="input_box">
      <div class="form_box" v-if="step === 1">
        <van-field
          :readonly="isYs"
          v-for="item in stepList1"
          :key="item.name"
          v-model="item.value"
          :label="item.label"
          :placeholder="item.placeholder"
          input-align="right"
          :type="item.type"
          :disabled="item.disabled"
          :maxlength="item.maxlength"
        />
      </div>
      <div class="form_box" v-if="step === 2">
        <div class="item" v-for="(item, index) in stepList2" :key="index">
          <p>{{ item.name }}</p>
          <van-field :readonly="isYs" v-model="item.value" rows="4" autosize type="textarea" :maxlength="item.maxLength" :placeholder="item.placeholder" :disabled="item.disabled" show-word-limit />
        </div>
      </div>
    </div>
    <div class="btns fixPaddingBottom">
      <p v-if="step === 2" @click="setStep(1)">上一步</p>
      <p v-if="!isYs" @click="submitForm('save')">保存</p>
      <p @click="step === 1 ? setStep(2) : submitForm('submit')" v-show="!isYs || step === 1">{{ step === 1 ? '下一步' : '完成' }}</p>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Toast } from 'vant'
import Request from '@/service/request'

export default defineComponent({
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const isYs = ref(false)
    const step = ref(1)
    const formData = reactive({
      save_type: '',
      project_id: '',
      declare_unit: '',
      unit_charge_name: '',
      unit_linker_name: '',
      unit_charge_mobile: '',
      build_plan_content: '',
      build_complete_content: '',
      fund_exec_content: '',
      applicant_content: ''
    })
    const stepList1 = ref([
      {
        value: '',
        label: '项目名称',
        placeholder: '项目名称',
        disabled: true
      },
      {
        value: '',
        label: '项目地点',
        placeholder: '具体详细地址，市-镇-村(社区)',
        disabled: true
      },
      {
        value: '',
        label: '申请验收单位',
        placeholder: '请输入申请验收单位名称',
        key: 'declare_unit'
      },
      {
        value: '',
        label: '申请单位负责人',
        placeholder: '请输入负责人姓名',
        key: 'unit_charge_name'
      },
      {
        value: '',
        label: '联系人',
        placeholder: '请输入联系人姓名',
        key: 'unit_linker_name'
      },
      {
        value: '',
        label: '联系电话',
        type: 'number',
        maxLength: 11,
        placeholder: '请输入项目申报电话',
        key: 'unit_charge_mobile'
      }
    ])
    const stepList2 = ref([
      {
        name: '1. 项目计划建设内容',
        value: '',
        maxLength: 1000,
        key: 'build_plan_content',
        placeholder: '建设计划根据计划文档填写。例如：\n' + '1、基础设施建设：新建菇棚500平方米，硬化道路800米；\n' + '2、设备购置：购置冷藏车一辆',
        disabled: true
      },
      {
        name: '2. 建设内容完成情况',
        value: '',
        maxLength: 1000,
        key: 'build_complete_content',
        placeholder:
          '对照计划建设内容，逐项填写，有数据的填写\n' +
          '真实测量数据；机器设备请填写型号。例如：\n' +
          '1、基础设施建设：新建菇棚500平方米，硬化道路800米；\n' +
          '2、设备购置：购置冷藏车一辆。型号为东风fs9800'
      },
      {
        name: '3. 财务（资金）执行情况',
        value: '',
        maxLength: 1000,
        key: 'fund_exec_content',
        placeholder:
          '先填写计划投资金额，后填写完成情况。例如：计划投资80万，其中财政补助40万。实际完成投资81.2万，其中：基础设施建设68.2万，设备购置13万。截止XX月XX日，共收到财政补助20万，其余部分为自筹。'
      },
      {
        name: '4. 申请单位申明',
        value: '',
        maxLength: 200,
        key: 'applicant_content',
        placeholder: '本单位已经按要求完成项目建设任务，提供的项目验收资料真实有效，如有虚假愿承担一切责任。'
      }
    ])
    const submitForm = (type) => {
      formData.save_type = type
      Object.keys(formData).forEach((key) => {
        stepList1.value.map((item) => {
          if (key === item.key) formData[key] = item.value
        })
        stepList2.value.map((item) => {
          if (key === item.key) formData[key] = item.value
        })
      })
      onSubmit()
    }
    const fetchImplement = () => {
      Request.fetchProjectImplementPlanDetail({
        project_id: Route.query.projectId
      })
        .then((res) => {
          if (res && res.code == 0) {
            formData.build_plan_content = res.data.info.build_main_content
            stepList2.value[0].value =  res.data.info.build_main_content
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    const onSubmit = async () => {
      try {
        const result = await Request.edidProjectYsApply(formData)
        if (result.code === 0) {
          Toast('保存成功')
          setTimeout(() => {
            Router.back()
          }, 1000)
        } else {
          Toast(result.msg)
        }
      } catch (err) {
        Toast('服务器错误，请稍后重试。')
      }
    }
    const getDetail = async (id) => {
      const result = await Request.getProjectYsApply({ project_id: id })
      if (result.code === 0) {
        Object.keys(result.data.info).forEach((key) => {
          stepList1.value.map((item) => {
            if (item.key === key) item.value = result.data.info[key]
          })
          stepList2.value.map((item) => {
            if (item.key === key) item.value = result.data.info[key]
          })
        })
        fetchImplement()
      }
    }
    const setStep = (e) => {
      step.value = e
    }
    onMounted(() => {
      if (Route.query.projectId) getDetail(+Route.query.projectId)
      formData.project_id = +Route.query.projectId
      stepList1.value[0].value = decodeURIComponent(Route.query.projectName)
      stepList1.value[1].value = decodeURIComponent(Route.query.city) + decodeURIComponent(Route.query.address)
      isYs.value = Route.query.isYs === 'true'
    })
    return {
      step,
      setStep,
      submitForm,
      onSubmit,
      stepList1,
      stepList2,
      isYs
    }
  }
})
</script>

<style scoped lang="less">
.apply_for {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .title {
    font-size: 0.3rem;
    padding: 0.3rem;
    font-weight: 600;
  }
  .input_box {
    flex: 1;
    box-sizing: border-box;
    overflow: scroll;
    .form_box {
      padding: 0.3rem;
      border-radius: 0.16rem;
      overflow: hidden;
      :deep(.van-field__label) {
        white-space: nowrap;
      }
      .item {
        padding: 0.2rem;
        border-radius: 0.16rem;
        background: #fff;
        margin-bottom: 0.3rem;
        overflow: hidden;
        p {
          margin: 0 0 0.2rem;
          font-size: 0.28rem;
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
    }
  }
  .btns {
    display: flex;
    height: 0.88rem;
    line-height: 0.88rem;
    background-color: #fff;
    p {
      text-align: center;
      font-size: 0.28rem;
      box-sizing: border-box;
      border-top: 0.02rem solid #1b82ec;
      border-bottom: 0.02rem solid #1b82ec;
      &:nth-of-type(1),
      &:nth-of-type(3) {
        flex: 1;
        background: #1b82ec;
        color: #fff;
      }
      &:nth-of-type(2) {
        width: 33.3%;
        color: #1b82ec;
        border: 0.02rem solid #1b82ec;
      }
    }
  }
}
</style>
