<template>
  <div class="help-farmer-container" :class="{ 'fit-old': ZLBFitForOld }">
    <div class="panel">
      <div class="form-conatiner">
        <div class="form-title">
          <span>基本信息</span>
        </div>
        <van-form @submit="onSubmit" @failed="onFailed" :disabled="status > 30 && status != 33" label-width="200" validate-trigger="onSubmit" ref="acForm">
          <van-field
            v-model="formData.start_section"
            required
            readonly
            name="start_section"
            label="时间区间起始日期"
            placeholder="请选择时间区间起始日期"
            @click="openStartDatePicker()"
            :rules="[{ required: true, message: '请填写时间区间起始日期' }]"
          />
          <van-field
            v-model="formData.end_section"
            required
            readonly
            name="end_section"
            label="时间区间结束日期"
            placeholder="请选择时间区间结束日期"
            @click="openEndDatePicker()"
            :rules="[{ required: true, message: '请填写时间区间结束日期' }]"
          />
          <!-- <van-field
            v-model="formData.date_range"
            required
            readonly
            name="date_range"
            label="时间区间"
            placeholder="请选择时间区间"
            @click="showCalender('calenderShow')"
            :rules="[{ required: true, message: '请填写时间区间' }]"
          /> -->

          <van-field v-model="formData.apply_company" required name="apply_company" label="申请单位" placeholder="请输入申请单位" :rules="[{ required: true, message: '请填写申报人申请单位' }]" />

          <van-field v-model="formData.js_person" required name="js_person" label="经手人" placeholder="请输入经手人" :rules="[{ required: true, message: '请填写经手人' }]" />
          <van-field
            v-model="formData.js_person_mobile"
            required
            type="tel"
            name="js_person_mobile"
            label="经手人联系电话"
            placeholder="请输入经手人电话"
            :rules="[{ required: true, message: '请填写经手人电话' }]"
          />
          <van-field v-model="formData.link_principal" required name="link_principal" label="负责人" placeholder="请输入负责人" :rules="[{ required: true, message: '请填写负责人' }]" />
          <van-field
            v-model="formData.link_principal_mobile"
            required
            type="tel"
            name="link_principal_mobile"
            label="负责人联系电话"
            placeholder="请输入负责人电话"
            :rules="[{ required: true, message: '请填写负责人电话' }]"
          />
          <van-field v-model="formData.check_person" required name="check_person" label="审核人" placeholder="请输入审核人" :rules="[{ required: true, message: '请填写审核人' }]" />
          <van-field
            v-model="formData.check_person_mobile"
            required
            type="tel"
            name="check_person_mobile"
            label="审核人联系电话"
            placeholder="请输入审核人电话"
            :rules="[{ required: true, message: '请填写审核人电话' }]"
          />

          <div class="form-title">汇总清单</div>
          <div class="help-content" style="padding-bottom: 0.3rem">
            <div class="help-item" v-for="(item, index) in helpList" :key="index">
              <div class="del-btn" v-if="index" @click="deleteHelp">删除</div>
              <div class="item-fields">
                <van-field v-model="item.typeText" required readonly name="content" :label="`类型${num2Char(index)}`" placeholder="请选择类型" :rules="[{ required: true, message: '请选择类型' }]" />
                <van-field v-model="item.number" required readonly type="number" name="number" label="数量" placeholder="请输入数量" :rules="[{ required: true, message: '请填写数量' }]" />
                <van-field
                  v-model="item.weight"
                  required
                  :readonly="!item.filed_writable"
                  type="number"
                  name="weight"
                  label="重量"
                  placeholder="请输入重量"
                  :rules="[{ required: !item.filed_writable, message: '请填写重量' }]"
                />
                <van-field
                  v-model="item.subsidy_standard"
                  required
                  :readonly="!item.filed_writable"
                  name="subsidy_standard"
                  label="补贴标准"
                  placeholder="补贴标准"
                  :rules="[{ required: true, message: '缺少补贴标准' }]"
                />
                <van-field
                  v-model="item.subsidy_amount"
                  required
                  :readonly="!item.filed_writable"
                  type="number"
                  name="subsidy_amount"
                  label="补贴金额"
                  placeholder="补贴金额"
                  @update:model-value="changePrePay(item)"
                  :rules="[{ required: true, message: '缺少补贴金额' }]"
                />
                <van-field
                  v-model="item.pre_pay"
                  required
                  readonly
                  type="number"
                  name="pre_pay"
                  label="预拨付70%"
                  placeholder="根据补贴金额自动计算"
                  :rules="[{ required: true, message: '缺少预拨付' }]"
                />
              </div>
            </div>
            <div class="add-help" @click="helpList.push({ ...itemTpl })" v-if="false">
              <img src="https://img.hzanchu.com/acimg/0ef025121076713f8ae14f333b521f70.png" alt="新增" class="icon" />
              <div class="add-text">新增类型</div>
            </div>
          </div>
        </van-form>
      </div>
    </div>

    <!-- 审核流程 -->
    <div class="panel approval-process">
      <div class="form-title">
        <div class="left">审核流程</div>
        <div class="record" @click="jump2record">审核记录</div>
      </div>
      <ApprovalSteps :status="status" :approval-data="formData" :process-data="processData" :unique="true"></ApprovalSteps>
    </div>

    <div class="bottom-btn" v-if="status != 42">
      <div class="btn plain" style="width: 33.333%" @click="onSubmit(null, true)">保存草稿</div>
      <div class="btn" style="width: 66.666%" @click="validateForm">提交</div>
    </div>

    <div class="publishCircle" v-if="link_tel" @click="popSheet">
      <!-- <div class="contact-btn-zlb" @click="consultTrigger" v-if="ZLBFLAG"></div>
      <a :href="'tel:' + link_tel" class="tel-link" v-else></a> -->
    </div>

    <!-- 类型 选择 -->
    <van-popup v-model:show="showTypePicker" round position="bottom">
      <van-picker title="选择类型" :columns="columns" :defaultIndex="defaultIndex" @confirm="confirmType" @cancel="showTypePicker = false" />
    </van-popup>

    <van-popup v-model:show="showStartDatePicker" round position="bottom"
      >.
      <van-datetime-picker v-model="select_start_date" type="date" title="选择起始日期" @cancel="showStartDatePicker = false" @confirm="confirmStartDate" :min-date="minDate" :max-date="maxDate" />
    </van-popup>

    <van-popup v-model:show="showEndDatePicker" round position="bottom"
      >.
      <van-datetime-picker v-model="select_end_date" type="date" title="选择结束日期" @cancel="showEndDatePicker = false" @confirm="confirmEndDate" :min-date="minDate" :max-date="maxDate" />
    </van-popup>

    <van-calendar
      v-model:show="calenderShow"
      :default-date="defaultDate"
      type="range"
      :lazy-render="false"
      :min-date="minDate"
      :max-date="maxDate"
      @open="onCalenderOpen"
      @confirm="onCalenderConfirm"
    />

    <Loading :visiable="loading"></Loading>
    <van-action-sheet v-model:show="newState.sheetShow" :actions="newState.actions" cancel-text="取消" close-on-click-action @select="onSelect" />
  </div>
</template>
<script>
import { computed, defineComponent, nextTick, onMounted, reactive, ref, toRefs } from 'vue'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import { Toast } from 'vant'
import Request from '@/service/request'
import dayjs from 'dayjs'
import { isZLB } from '@/util/index'
import Loading from '@/components/loading'
import ApprovalSteps from '../components/ApprovalSteps'
import { mgop } from '@aligov/jssdk-mgop'
import { util } from '@/util/index.js'
const PHONEREGULAR = /^1[3-9]\d{9}$/
export default defineComponent({
  components: { Loading, ApprovalSteps },
  setup(props, context) {
    const Router = useRouter()
    const Route = useRoute()
    const newState = reactive({
      sheetShow: false,
      actions: [{ name: '电话呼叫' }, { name: '咨询意见' }]
    })
    const state = reactive({
      contentChanged: false, // 当前表单是否做了修改，退出前提示
      ZLBFLAG: isZLB(),
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
      minDate: new Date('2019/01/01'),
      maxDate: new Date('2023/12/31'),
      select_start_date: new Date(),
      select_end_date: new Date(),
      showStartDatePicker: ref(false),
      showEndDatePicker: ref(false),
      formData: reactive({
        start_section: ref(''),
        end_section: ref(''),
        date_range: ref(),
        apply_company: ref(''),
        js_person: ref(''),
        js_person_mobile: ref(''),
        link_principal: ref(''),
        link_principal_mobile: ref(''),
        check_person: ref(''),
        check_person_mobile: ref(''),
        has_insurance: ref(null)
      }),
      itemTpl: reactive({
        type: ref(''),
        number: ref(''),
        weight: ref(''),
        subsidy_standard: ref(''),
        subsidy_amount: ref(''),
        pre_pay: ref('')
      }),
      helpList: reactive([
        {
          type: ref(''),
          number: ref(''),
          weight: ref(''),
          subsidy_standard: ref(''),
          subsidy_amount: ref(''),
          pre_pay: ref('')
        }
      ]),
      loading: false,
      status: ref(0), // 审核状态
      addressData: ref([]), // 地址数据
      tzmxFileList: ref([]), // 台账明细图片列表
      fileListMap: {
        11: 'tzmxFileList'
      },
      imgList: ref(),
      link_tel: '',
      processData: {
        0: { title: '材料提交', at: 'submit_at' },
        1: {
          title: '养殖中心审核',
          at: 'whh_sq_farm_at',
          not_at: 'whh_sq_farm_not_at',
          reason: 'whh_sq_farm_reason',
          attachment: 'whh_sq_farm_attachment'
        },
        2: {
          title: '文件下达',
          at: 'whh_sq_public_at',
          not_at: 'whh_sq_public_not_at',
          reason: 'whh_sq_public_reason',
          real_fund_amount: 'real_fund_amount',
          attachment: 'whh_sq_public_attachment'
        }
      },
      showTypePicker: ref(false),
      currentPickingIndex: null, // 当前选择的是类型几
      defaultIndex: ref(0), // 类型默认选中项
      calenderShow: false, // 范围日历
      defaultDate: ref([]) // 日历默认显示日期
    })
    let acForm = ref(null)
    const columns = ['猪', '牛', '羊', '家禽', '死胎', '胎衣', '其他']

    // 点击提交按钮 验证表单
    const validateForm = (e) => {
      acForm.value.submit((values) => {
        console.log('表单验证', values)
      })
    }

    // 验证通过 表单submit事件触发
    const onSubmit = (e, isDraft) => {
      if (state.status == 42) {
        return Toast('项目已通过，请勿重复提交')
      }

      if (state.status > 30 && state.status != 33) {
        return Toast('申请已提交，请耐心等待审核结果')
      }
      state.loading = true

      const params = {
        ...state.formData,
        form_status: isDraft ? 0 : 1,
        apply_collect_list: JSON.stringify(state.helpList),
        project_id: Route.query.project_id
      }

      // return console.log('提交参数', params)
      Request.applyWhhFinalSubsidy(params)
        .then((res) => {
          if (res && res.code == 0) {
            if (isDraft) {
              return Toast('保存成功')
            }
            Router.push({
              name: 'program',
              query: {
                active: '2'
              }
            })
          } else {
            Toast(res.msg)
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .finally(() => {
          state.loading = false
        })
    }

    const onFailed = (e) => {
      console.log('提交失败', e)
      if (e.errors && e.errors[0]) {
        Toast(e.errors[0].message)
      }
    }

    // 生成地址字符串 根据 city_id town_id etc.
    const createAddressStr = () => {
      const {
        addressData,
        formData: { city_id, town_id, village_id }
      } = state
      let city = addressData.name
      let townItem = addressData.children.find((town) => town.id == town_id)
      let villageItem = townItem.children.find((village) => village.id == village_id)
      state.formData.city = `${city}/${townItem.name}/${villageItem.name}`
    }

    // 获取已有申报数据 refreshImg:是否刷新图片 type:刷新图片的wich_type
    const getData = (refreshImg, type) => {
      return new Promise((resolve, reject) => {
        state.loading = true
        Request.getWhhFinalSubsidy({
          project_id: Route.query.project_id
        })
          .then((res) => {
            if (!refreshImg) {
              const { start_section, end_section } = res.data
              if (start_section && end_section) {
                res.data.start_section = dayjs(start_section).format('YYYY/MM/DD')
                res.data.end_section = dayjs(end_section).format('YYYY/MM/DD')
              }
              // if (start_section && end_section) {
              //   res.data.date_range = `${dayjs(start_section).format(
              //     'YYYY/MM/DD'
              //   )}-${dayjs(end_section).format('YYYY/MM/DD')}`
              // } else {
              //   res.data.date_range = ''
              // }
              state.formData = Object.assign({}, res.data)
            }

            if (state.formData.city) {
              createAddressStr()
            }

            state.loading = false

            state.status = res.data.status

            if (state.status > 30) {
              // 已经提交过申请 从这个接口中取数据渲染汇总清单 否则在onmounted中调用getDetail渲染
              const { apply_collect_list } = res.data
              if (apply_collect_list) {
                let list = JSON.parse(apply_collect_list)
                list.forEach((item) => {
                  if (item.type == 7) {
                    // 其他 类型
                    item.filed_writable = true
                  }
                  item.typeText = columns[parseInt(item.type - 1)]
                })
                state.helpList = list
              }
            }

            resolve(state.status)
          })
          .catch((err) => {
            console.log(err)
            reject()
          })
          .finally(() => {
            state.loading = false
          })
      })
    }

    // 获取政策信息 取手机号
    const getDocumentInfo = () => {
      if (state.ZLBFLAG) {
        Request.fetchPolicyDocumentInfoMGOP({
          id: Route.query.policy_document_id
        }).then((res) => {
          if (res) {
            if (res.data.data.linkman) {
              state.link_tel = res.data.data.linkman.mobile
            }
          } else {
            Toast(res.msg)
          }
        })
      } else {
        Request.fetchPolicyDocumentInfo({
          id: Route.query.policy_document_id
        }).then((res) => {
          if (res && res.code == 0) {
            if (res.data.linkman) {
              state.link_tel = res.data.linkman.mobile
            }
          } else {
            Toast(res.msg)
          }
        })
      }
    }

    // 浙里办拨打电话
    const consultTrigger = () => {
      ZWJSBridge.phoneCall({
        corpId: state.link_tel
      })
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
    }

    // key: 日历组件model; index: 点击的批次索引
    const showCalender = (key, index) => {
      if (state.status > 30 && state.status != 33) {
        return Toast('申请已提交，请耐心等待审核结果')
      }
      state[key] = true
    }

    const onCalenderConfirm = (e) => {
      if (e[0] && e[1]) {
        state.formData.start_section = dayjs(e[0]).format('YYYY/MM/DD')
        state.formData.end_section = dayjs(e[1]).format('YYYY/MM/DD')
        state.formData.date_range = `${dayjs(e[0]).format('YYYY/MM/DD')}-${dayjs(e[1]).format('YYYY/MM/DD')}`

        state.calenderShow = false
      }
    }

    // 日历组件唤起触发
    const onCalenderOpen = () => {
      const {
        formData: { date_range, start_section, end_section }
      } = state
      if (date_range) {
        // let [start, end] = [date_range.split('-')[0], date_range.split('-')[1]]
        state.defaultDate = [dayjs(start_section).toDate(), dayjs(end_section).toDate()]
      } else {
        state.defaultDate = [(dayjs().toDate(), dayjs().toDate())]
      }
    }

    // 类型确认
    const confirmType = (val, index) => {
      console.log('类型确认', val, index)
      state.helpList[state.currentPickingIndex].type = val
      state.showTypePicker = false
    }

    // 唤起类型确认弹窗
    const openTypePicker = (index) => {
      if (state.status > 30 && state.status != 33) {
        return Toast('申请已提交，请耐心等待审核结果')
      }
      state.currentPickingIndex = index
      let currentType = state.helpList[index].type
      if (!currentType) {
        state.defaultIndex = 0
      } else {
        // 默认选中已选项
        console.log(columns.indexOf(currentType))
        state.defaultIndex = columns.indexOf(currentType)
      }
      nextTick(() => {
        state.showTypePicker = true
      })
    }

    // 获取地址数据
    const getAddressData = () => {
      return new Promise((resolve, reject) => {
        if (state.ZLBFLAG) {
          Request.getAreaListMGOP({})
            .then((res) => {
              if (res) {
                state.addressData = res.data.data.list[0]
              } else {
                Toast(res.msg)
              }
              resolve()
            })
            .catch((err) => {
              console.log('err', err)
              reject()
            })
        } else {
          Request.getAreaList({})
            .then((res) => {
              if (res && res.code == 0) {
                state.addressData = res.data.list[0]
              } else {
                Toast(res.msg)
              }
              resolve()
            })
            .catch((err) => {
              console.log('err', err)
              reject()
            })
        }
      })
    }

    // 获取汇总清单详情
    const getDetail = () => {
      return new Promise((resolve, reject) => {
        Request.getWhhFinalSubsidyDetail({
          project_id: Route.query.project_id
        })
          .then((res) => {
            if (res.data && res.data.length) {
              res.data.forEach((item) => {
                if (item.type == 7) {
                  // 其他 类型
                  item.filed_writable = true
                }
                item.typeText = columns[parseInt(item.type - 1)]
              })
              state.helpList = res.data
            }
            resolve()
          })
          .catch((err) => {
            console.log(err)
            reject()
          })
      })
    }

    // 补贴金额变化
    const changePrePay = (item) => {
      if (item.subsidy_amount) {
        let amount = Number(item.subsidy_amount)
        item.pre_pay = parseFloat(amount * 0.7).toFixed(1)
      } else {
        item.pre_pay = ''
      }
    }

    onMounted(() => {
      Promise.all([getData(), getAddressData()]).then((res) => {
        if (res[0] == 30) {
          getDetail()
        }
        createAddressStr()
      })
      getDocumentInfo()
    })

    const jump2Policy = () => {
      Router.push({
        name: 'policyDetail',
        query: {
          id: Route.query.policy_document_id,
          hide: true
        }
      })
    }

    onBeforeRouteLeave((to, from) => {
      if (state.contentChanged) {
        const answer = window.confirm('您的项目信息未进行保存，是否确定离开？')
        if (answer) {
        } else {
          return false
        }
      }
    })

    // 删除内容
    const deleteHelp = () => {
      if (state.status > 30 && state.status != 33) {
        return Toast('申请已提交，不可修改')
      }
      state.helpList.pop()
    }

    // 跳转审核记录
    const jump2record = () => {
      Router.push({
        name: 'approvalRecord',
        query: {
          project_id: Route.query.project_id,
          record_type: 10
        }
      })
    }

    const openStartDatePicker = () => {
      if (state.formData.start_section) {
        state.select_start_date = dayjs(state.formData.start_section).toDate()
      }
      state.showStartDatePicker = true
    }
    const openEndDatePicker = () => {
      if (state.formData.end_section) {
        state.select_end_date = dayjs(state.formData.end_section).toDate()
      }
      state.showEndDatePicker = true
    }
    const confirmStartDate = (e) => {
      state.formData.start_section = dayjs(e).format('YYYY/MM/DD')
      state.showStartDatePicker = false
    }
    const confirmEndDate = (e) => {
      state.formData.end_section = dayjs(e).format('YYYY/MM/DD')
      state.showEndDatePicker = false
    }
    const popSheet = () => {
      newState.sheetShow = true
    }
    const onSelect = (item) => {
      newState.sheetShow = false
      if (item.name == '电话呼叫') {
        if (state.ZLBFLAG) {
          consultTrigger()
        } else {
          window.location.href = 'tel:' + state.link_tel
        }
      } else {
        Router.push({
          name: 'support'
        })
      }
    }

    return {
      popSheet,
      onSelect,
      newState,
      ...toRefs(state),
      Route,
      onSubmit,
      onFailed,
      acForm,
      validateForm,
      ...util,
      getData,
      jump2Policy,
      confirmType,
      columns,
      openTypePicker,
      showCalender,
      onCalenderConfirm,
      onCalenderOpen,
      changePrePay,
      deleteHelp,
      consultTrigger,
      jump2record,
      openStartDatePicker,
      openEndDatePicker,
      confirmStartDate,
      confirmEndDate
    }
  }
})
</script>

<style scoped lang="less">
.help-farmer-container {
  .panel {
    .help-item {
      position: relative;
      padding: 0 0.3rem;
      margin-top: 0.3rem;

      .item-fields {
        box-shadow: 0 0 0.12rem #ebedf0;
        padding-bottom: 0.3rem;
        position: relative;
      }

      &:first-child {
        margin-top: 0;
      }

      .del-btn {
        position: absolute;
        right: calc(var(--van-cell-horizontal-padding) + 0.3rem);
        top: var(--van-cell-vertical-padding);
        width: 1.6rem;
        height: 0.5rem;
        background: #1b82ec;
        border-radius: 0.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 0.26rem;
        z-index: 1;
      }
      .van-cell {
        padding-bottom: 0;
      }
    }
    .add-help {
      padding: 0.3rem;
      display: flex;
      align-items: center;
      .icon {
        width: 0.32rem;
        height: 0.32rem;
        margin-right: 0.1rem;
      }
      .add-text {
        font-size: 0.24rem;
        font-weight: bold;
        color: #1b82ec;
      }
    }
  }
}
</style>
