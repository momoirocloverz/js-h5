<template>
  <div class="help-farmer-container" :class="{ 'fit-old': ZLBFitForOld }">
    <div class="panel">
      <div class="form-conatiner">
        <div class="form-title">
          <span>基本信息</span>
          <div class="policy-btn" @click="jump2Policy">查看政策</div>
        </div>
        <van-form @submit="onSubmit" @failed="onFailed" :disabled="status > 0" label-width="200" validate-trigger="onSubmit" ref="acForm">
          <van-field v-model="formData.month" required readonly name="month" label="月份" placeholder="请选择月份" @click="openMonthPicker" :rules="[{ required: true, message: '请填写月份' }]" />

          <van-field v-model="formData.city" required readonly name="city" label="地址" placeholder="选择地址" :rules="[{ required: true, message: '请选择地址' }]" />

          <van-field v-model="formData.link_mobile" required type="tel" name="link_mobile" label="联系电话" placeholder="请输入电话" :rules="[{ required: true, message: '请填写申报人电话' }]" />

          <van-field v-model="formData.duty_company" required name="duty_company" label="责任公司" placeholder="请输入公司名称" :rules="[{ required: true, message: '请填写公司名称' }]" />

          <van-field name="is_insurance" label="是否有保险" required :rules="[{ required: true, message: '请选择是否有保险' }]">
            <template #input>
              <van-radio-group v-model="formData.is_insurance" :disabled="status > 0" direction="horizontal">
                <van-radio :name="1">是</van-radio>
                <van-radio :name="2">否</van-radio>
              </van-radio-group>
            </template>
          </van-field>

          <div class="form-title">汇总清单</div>
          <div class="help-content">
            <div class="help-item" v-for="(item, index) in helpList" :key="index">
              <div class="del-btn" v-if="index" @click="deleteHelp">删除</div>
              <div class="item-fields">
                <van-field
                  v-model="item.typeText"
                  required
                  readonly
                  name="typeText"
                  :label="`类型${num2Char(index)}`"
                  placeholder="请选择类型"
                  @click="openTypePicker(index)"
                  :rules="[{ required: true, message: '请选择类型' }]"
                />
                <van-field
                  v-model="item.number"
                  :required="!item.number_disabled"
                  :disabled="item.number_disabled || status > 0"
                  type="number"
                  name="number"
                  label="数量"
                  placeholder="请输入数量"
                  :rules="[{ required: !item.number_disabled, message: '请填写数量' }]"
                />
                <van-field
                  v-model="item.weight"
                  :required="!item.weight_disabled"
                  :disabled="item.weight_disabled || status > 0"
                  type="number"
                  name="weight"
                  label="重量"
                  placeholder="请输入重量"
                  :rules="[{ required: !item.weight_disabled, message: '请填写重量' }]"
                />
                <van-field
                  v-model="item.number_no_ins"
                  required
                  type="number"
                  name="number_no_ins"
                  label="其中无保险数量"
                  placeholder="请输入无保险数量"
                  :rules="[{ required: true, message: '请填写无保险数量' }]"
                />
                <van-field v-model="item.remark" required name="remark" label="备注" placeholder="请输入备注" :rules="[{ required: true, message: '请填写备注' }]" />
              </div>
            </div>
            <div class="add-help" @click="helpList.push({ ...itemTpl })" v-if="status == 0">
              <img src="https://img.hzanchu.com/acimg/0ef025121076713f8ae14f333b521f70.png" alt="新增" class="icon" />
              <div class="add-text">新增类型</div>
            </div>
          </div>

          <div class="uploader-content">
            <div class="form-title">材料上传</div>

            <AcUploader :fileList="tzmxFileList" title="台账明细清单" @afterRead="tzmxAfterRead" @deleteCb="getData" :witchType="61" @choiceImg="choiceImg" :status="status"></AcUploader>
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
      <ApprovalSteps :status="status" :approval-data="formData" :process-data="processData"></ApprovalSteps>
    </div>

    <div class="bottom-btn" v-if="status != 42">
      <div class="btn plain" style="width: 33.333%" @click="onSubmit(null, true)">保存草稿</div>
      <div class="btn" style="width: 66.666%" @click="validateForm">提交</div>
    </div>

    <div class="publishCircle" v-if="link_tel" @click="popSheet">
      <!-- <div class="contact-btn-zlb" @click="consultTrigger" v-if="ZLBFLAG"></div>
      <a :href="'tel:' + link_tel" class="tel-link" v-else></a> -->
    </div>

    <!-- date picker -->
    <van-popup v-model:show="showMonthPicker" round position="bottom">
      <van-datetime-picker
        v-model="monthDate"
        type="year-month"
        title="选择年月"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
        @change="onMonthChange"
        @confirm="confirmMonth"
        @cancel="showMonthPicker = false"
      />
    </van-popup>

    <!-- 类型 选择 -->
    <van-popup v-model:show="showTypePicker" round position="bottom">
      <van-picker title="选择类型" :columns="columns" :defaultIndex="defaultIndex" @confirm="confirmType" @cancel="showTypePicker = false" />
    </van-popup>

    <input ref="inputTarget" id="takepicture" type="file" accept="image/*" style="display: none" @change="upload" />

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
import AcUploader from '@/components/AcUploader'
import OSS from 'ali-oss'
import { OSSLINK } from '@/util/const'
const PHONEREGULAR = /^1[3-9]\d{9}$/
import lrz from 'lrz'
export default defineComponent({
  components: { AcUploader, Loading, ApprovalSteps },
  setup(props, context) {
    const Router = useRouter()
    const Route = useRoute()
    const newState = reactive({
      sheetShow: false,
      actions: [{ name: '电话呼叫' }, { name: '咨询意见' }]
    })
    const state = reactive({
      contentChanged: false, // 当前表单是否做了修改，退出前提示
      client: {},
      ZLBFLAG: isZLB(),
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
      minDate: new Date('2019/01/01'),
      maxDate: new Date('2023/12/31'),
      formData: reactive({
        month: ref(''),
        city: ref(''),
        link_mobile: ref(''),
        duty_company: ref(''),
        is_insurance: ref(null)
      }),
      monthDate: ref(new Date()),
      itemTpl: reactive({
        typeText: ref(''),
        number: ref(''),
        weight: ref(''),
        number_no_ins: ref(''),
        remark: ref(''),
        number_disabled: ref(false),
        weight_disabled: ref(false)
      }),
      helpList: reactive([
        {
          typeText: ref(''),
          number: ref(''),
          weight: ref(''),
          number_no_ins: ref(''),
          remark: ref(''),
          number_disabled: ref(false),
          weight_disabled: ref(false)
        }
      ]),
      loading: false,
      status: ref(0), // 审核状态
      addressData: ref([]), // 地址数据
      tzmxFileList: ref([]), // 台账明细图片列表
      fileList: ref([]),
      fileListMap: {
        61: 'tzmxFileList'
      },
      imgList: ref(),
      link_tel: '',
      processData: {
        0: { title: '材料提交', at: 'submit_at' },
        1: {
          title: '养殖中心审核',
          at: 'whh_farm_at',
          not_at: 'whh_farm_not_at',
          reason: 'whh_farm_reason',
          attachment: 'whh_farm_attachment'
        },
        2: {
          title: '公示',
          at: 'whh_public_at',
          not_at: 'whh_public_not_at',
          reason: 'whh_public_reason',
          attachment: 'whh_public_attachment'
        }
      },
      showMonthPicker: ref(false),
      showTypePicker: ref(false),
      currentPickingIndex: null, // 当前选择的是类型几
      defaultIndex: ref(0), // 类型默认选中项
      currentWitchType: ref(null)
    })
    let acForm = ref(null)
    let inputTarget = ref(null)
    const columns = ['猪', '牛', '羊', '家禽', '死胎', '胎衣', '其他']
    const typeMap = {
      猪: 1,
      牛: 2,
      羊: 3,
      家禽: 4,
      死胎: 5,
      胎衣: 6,
      其他: 7
    }

    // 台账明细选择图片回调
    const tzmxAfterRead = (e) => {
      // console.log('台账明细上传回调', e)
      uploadImage(e, 61)
    }

    const fetchOssinfo = () => {
      Request.fetchOssInfo().then((res) => {
        let shazam = res.data
        if (shazam && shazam.code === 0) {
          let after = shazam.data.info
          state.client = new OSS({
            // region: after.endpoint_upload,
            region: 'oss-cn-hangzhou',
            accessKeyId: after.access_key,
            accessKeySecret: after.secret_key,
            bucket: after.bucket
          })
          console.log(state.client, 'state.client')
          state.client.path = after.path_class
        }
      })
    }

    // input上传图片回调
    const upload = (e) => {
      let fileObj = e.target.files[0]
      let type = fileObj.type === 'image/jpeg' || fileObj.type === 'image/png'
      if (type) {
        lrz(fileObj, { width: 600 }).then(async (result) => {
          if (state.ZLBFLAG) {
            let url = `${state.client.path}/${fileObj.name.split('.')[0]}-${Date.parse(new Date()) / 1000}.${fileObj.type.split('/')[1]}`
            let reader = new FileReader()
            reader.readAsDataURL(fileObj)
            reader.onloadend = () => {
              state.client.multipartUpload(url, fileObj).then(async (data) => {
                state.fileList.push({
                  url: OSSLINK + data.name
                })
                e.target.value = ''
                let newParams = {
                  fileOriginName: fileObj.name,
                  cl_type: 1,
                  fileUrl: state.fileList[0].url,
                  which_type: state.currentWitchType,
                  policy_document_id: Route.query.policy_document_id || Route.query.policyId,
                  project_id: Route.query.project_id || Route.query.projectId
                }
                state.fileList = []
                Request.projectUploadMaterials(newParams).then((res) => {
                  if (res.code === 0) {
                    getData(true, type)
                  }
                })
              })
            }
          } else {
            let params = new FormData()
            params.append('file', result.file, fileObj.name)
            params.append('which_type', state.currentWitchType)
            params.append('cl_type', 1)
            params.append('policy_document_id', Route.query.policy_document_id || Route.query.policyId)
            params.append('project_id', Route.query.project_id || Route.query.projectId)
            Request.projectUploadMaterials(params).then((res) => {
              if (res.code === 0) {
                getData(true, type)
                e.target.value = ''
              }
            })
          }
        })
      } else {
        Toast('支持上传文件格式：jpg、jpeg、png')
      }
    }

    // 上传图片
    const uploadImage = (e, type) => {
      try {
        state.loading = true
        const params = new FormData()
        params.append('file', e.file)
        params.append('which_type', type)
        params.append('cl_type', 1)
        params.append('policy_document_id', Route.query.policy_document_id)
        params.append('project_id', Route.query.project_id)
        // return console.log(params)
        Request.projectUploadMaterials(params)
          .then((res) => {
            getData(true, type)
          })
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {
            state.loading = false
          })
      } catch (error) {
        state.loading = false
      }
    }

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
      if (state.status == 30 || state.status == 33) {
        return Toast('申报已通过，请提交申请')
      }
      if (state.status > 30) {
        return Toast('申报已通过，请耐心等待申请审核结果')
      }

      const { helpList } = state
      let list = JSON.parse(JSON.stringify(helpList))
      if (list.length) {
        list.forEach((item) => {
          item.type = typeMap[item.typeText]
          !item.number && (item.number = 0)
          !item.weight && (item.weight = 0)
        })
      }

      const params = {
        ...state.formData,
        form_status: isDraft ? 0 : 1,
        collect_list: JSON.stringify(list),
        project_id: Route.query.project_id
      }

      if (!isDraft && !checkImages()) {
        return Toast('缺少材料，每类材料都需上传')
      }

      state.loading = true

      // return console.log('提交参数', params)
      Request.applyWhhSubsidy(params)
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

    // 获取已有申报数据 refreshImg:是否刷新图片 type:刷新图片的wich_type
    const getData = (refreshImg, type) => {
      return new Promise((resolve, reject) => {
        state.loading = true
        Request.getWhhSubsidy({
          project_id: Route.query.project_id,
          policy_document_id: Route.query.policy_document_id
        })
          .then((res) => {
            if (!refreshImg) {
              state.formData = Object.assign({}, res.data)
              const { collect_list } = res.data
              if (collect_list && collect_list.length && collect_list[0] && collect_list[0].type) {
                // type映射到typeText
                collect_list.forEach((item) => {
                  item.number === 0 && (item.number = '')
                  item.weight === 0 && (item.weight = '')
                  item.typeText = columns[--item.type]
                })
                state.helpList = collect_list
              }
            }

            if (refreshImg || !state.imgList) {
              state.imgList = res.data.materials_list
              delete res.data.materials_list
              getBase64Images(type)
            }

            if (state.formData.city) {
              createAddressStr()
            }

            state.loading = false

            state.status = res.data.status
            context.emit('getStatus', res.data.status)
            resolve()
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

    // 获取图片材料 type:指定转换图片的wich_type
    const getBase64Images = (type) => {
      const { imgList, fileListMap } = state
      if (type && imgList[type]) {
        state[fileListMap[type]] = imgList[type] || []
      } else {
        if (!imgList) return
        Object.keys(imgList).forEach((key) => {
          state[fileListMap[key]] = imgList[key] || []
        })
        if (type) {
          state[fileListMap[type]] = []
        }
      }
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

    // 显示年月选择
    const openMonthPicker = () => {
      if (state.status > 0) return
      state.showMonthPicker = true
    }

    // 年月选项格式化
    const formatter = (type, val) => {
      if (type === 'year') {
        return `${val}年`
      }
      if (type === 'month') {
        return `${val}月`
      }
      return val
    }

    const onMonthChange = (e) => {
      state.formData.month = dayjs(e).format('YYYY/MM')
    }

    // 年月确认
    const confirmMonth = (e) => {
      state.formData.month = dayjs(e).format('YYYY/MM')
      state.showMonthPicker = false
    }

    // 类型确认
    const confirmType = (val, index) => {
      // console.log('类型确认', val, index)
      const { currentPickingIndex } = state
      state.helpList[currentPickingIndex].typeText = val
      // 判断类型 控制数量与重量
      const filed_status = controlNumAndWeightIpt(typeMap[val])
      state.helpList[currentPickingIndex].number_disabled = filed_status[0]
      state.helpList[currentPickingIndex].weight_disabled = filed_status[1]
      if (filed_status[0]) {
        state.helpList[currentPickingIndex].number = ''
      }
      if (filed_status[1]) {
        state.helpList[currentPickingIndex].weight = ''
      }
      state.showTypePicker = false
    }

    // 根据所选type 判断数量与重量
    const controlNumAndWeightIpt = (type) => {
      // 判断类型 控制数量与重量
      if (type == 7) {
        // 其他
        return [false, false]
      } else if (type <= 3) {
        // 猪牛羊
        return [false, true]
      } else if (type > 3) {
        // 家禽胎衣死胎
        return [true, false] // 第一项：是否禁用数量输入 第二项：是否禁用重量输入
      }
    }

    // 唤起类型确认弹窗
    const openTypePicker = (index) => {
      if (state.status > 0) {
        return Toast('项目申报已提交，不可修改')
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

    // 材料图片校验
    const checkImages = () => {
      let img_types = Object.keys(state.fileListMap)
      return img_types.every((key) => state.imgList && state.imgList.hasOwnProperty(key))
    }

    onMounted(() => {
      Promise.all([getAddressData(), getData()]).then((res) => {
        fetchOssinfo()
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

    const choiceImg = (witchType) => {
      state.currentWitchType = witchType
      inputTarget.value.click()
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
      if (state.status > 0) {
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
      tzmxAfterRead,
      acForm,
      validateForm,
      ...util,
      getData,
      jump2Policy,
      openMonthPicker,
      formatter,
      onMonthChange,
      confirmMonth,
      confirmType,
      columns,
      openTypePicker,
      upload,
      choiceImg,
      inputTarget,
      deleteHelp,
      consultTrigger,
      jump2record
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
