<template>
  <div class="help-farmer-container" :class="{ 'fit-old': ZLBFitForOld }">
    <div class="panel">
      <div class="form-title">
        <span>基本信息</span>
        <div class="policy-btn" @click="jump2Policy">查看政策</div>
      </div>
      <div class="form-conatiner">
        <van-form @submit="onSubmit" @failed="onFailed" :disabled="status > 0" label-width="200" validate-trigger="onSubmit" ref="acForm">
          <van-field v-model="formData.subject_name" required label="主体名称" name="subject_name" placeholder="请输入使用主体姓名" :rules="[{ required: true, message: '请填写使用主体姓名' }]">
          </van-field>

          <van-field v-model="formData.city" required readonly name="city" label="地址" placeholder="选择地址" :rules="[{ required: true, message: '请选择地址' }]" />
          <van-cell title="" class="van-cell_noname">
            <template #value>
              <van-field v-model="formData.address" required name="address" label-width="0" input-align="left" placeholder="请输入详细地址" :rules="[{ required: true, message: '请填写详细地址' }]" />
            </template>
          </van-cell>
          <van-field v-model="formData.principal" required name="principal" label="负责人" placeholder="请输入负责人姓名" :rules="[{ required: true, message: '请填写负责人姓名' }]" />
          <van-field v-model="formData.mobile" required type="tel" name="mobile" label="联系电话" placeholder="请输入电话" :rules="[{ required: true, message: '请填写电话' }]" />

          <van-field
            v-model="formData.subject_promise"
            required
            :autosize="{ minHeight: 100 }"
            type="textarea"
            name="subject_promise"
            label="使用主体承诺"
            placeholder="本人承诺该申报补贴的有机肥没有用于水产养殖和粮食功能区内非粮食作物种植等项目，并没有享受过其他财政补助的情况"
            :rules="[{ required: true, message: '请填写承诺' }]"
            class="text-area"
          />

          <div class="form-title">秸秆利用农机社会化服务补助资金申请</div>
          <van-field
            v-model="formData.agricultural_type"
            required
            label="开展服务农机类型"
            name="agricultural_type"
            placeholder="请输入农机类型"
            :rules="[{ required: true, message: '请填写农机类型' }]"
          >
          </van-field>
          <van-field
            v-model="formData.serve_area"
            required
            type="number"
            label="服务面积（亩）"
            name="serve_area"
            placeholder="请输入服务面积"
            :rules="[{ required: true, message: '请填写服务面积' }]"
          >
          </van-field>
          <van-field v-model="formData.serve_way" required label="服务方式" name="serve_way" placeholder="请输入服务方式" :rules="[{ required: true, message: '请填写服务方式' }]"> </van-field>
          <van-field
            v-model="formData.serve_start_at"
            required
            readonly
            label="服务开始时间"
            name="serve_start_at"
            @click="openStartDatePicker()"
            placeholder="请输入服务开始时间"
            :rules="[{ required: true, message: '请填写服务开始时间' }]"
          >
          </van-field>
          <van-field
            v-model="formData.serve_end_at"
            required
            readonly
            label="服务结束时间"
            name="serve_end_at"
            @click="openEndDatePicker()"
            placeholder="请输入服务结束时间"
            :rules="[{ required: true, message: '请填写服务结束时间' }]"
          >
          </van-field>
          <!-- <van-field
            v-model="formData.serve_at"
            required
            readonly
            label="服务时间"
            name="serve_at"
            @click="showCalender('calenderShow', index)"
            placeholder="请输入服务时间"
            :rules="[{ required: true, message: '请填写服务时间' }]"
          >
          </van-field> -->
          <van-field v-model="formData.serve_address" required label="服务地点" name="serve_address" placeholder="请输入服务地点" :rules="[{ required: true, message: '请填写服务地点' }]"> </van-field>
          <van-field
            v-model="formData.apply_price"
            required
            type="number"
            label="申请补助资金(万元)"
            name="apply_price"
            placeholder="请输入申请补助资金"
            :rules="[{ required: true, message: '请填写申请补助资金' }]"
          >
          </van-field>

          <div class="form-title">材料上传</div>

          <AcUploader :fileList="zyfwFileList" title="1.作业服务清单" @afterRead="zyfwAfterRead" @deleteCb="getData" :witchType="41" @choiceImg="choiceImg" :status="status"></AcUploader>
          <AcUploader :fileList="syzpFileList" title="2.水印照片（社会化服务补助）" @afterRead="syzpAfterRead" @deleteCb="getData" :witchType="42" @choiceImg="choiceImg" :status="status"></AcUploader>
        </van-form>
      </div>
    </div>

    <!-- 审核流程 -->
    <div class="panel approval-process">
      <div class="form-title">
        <div class="left">审核流程</div>
        <div class="record" @click="jump2record">审核记录</div>
      </div>
      <ApprovalSteps :status="status" :approval-data="formData"></ApprovalSteps>
    </div>

    <div class="bottom-btn" v-if="status != 62">
      <div class="btn plain" style="width: 33.333%" @click="onSubmit(null, true)">保存草稿</div>
      <div class="btn" style="width: 66.666%" @click="validateForm">提交</div>
    </div>

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

    <div class="publishCircle" v-if="link_tel" @click="popSheet">
      <!-- <div class="contact-btn-zlb" @click="consultTrigger" v-if="ZLBFLAG"></div>
      <a :href="'tel:' + link_tel" class="tel-link" v-else></a> -->
    </div>

    <input ref="inputTarget" id="takepicture" type="file" accept="image/*" style="display: none" @change="upload" />

    <Loading :visiable="loading"></Loading>
    <van-action-sheet v-model:show="newState.sheetShow" :actions="newState.actions" cancel-text="取消" close-on-click-action @select="onSelect" />
  </div>
</template>
<script>
import { defineComponent, onMounted, reactive, ref, toRefs, computed } from 'vue'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import { Toast } from 'vant'
import Request from '@/service/request'
import dayjs from 'dayjs'
import { isZLB } from '@/util/index'
import { mgop } from '@aligov/jssdk-mgop'
import { util } from '@/util/index.js'
import Loading from '@/components/loading'
import AcUploader from '@/components/AcUploader'
import lrz from 'lrz'
import OSS from 'ali-oss'
import ApprovalSteps from './components/ApprovalSteps'
import { OSSLINK } from '@/util/const'
const PHONEREGULAR = /^1[3-9]\d{9}$/
export default defineComponent({
  components: { AcUploader, Loading, ApprovalSteps },
  setup(props, { emit }) {
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
      select_start_date: new Date(),
      select_end_date: new Date(),
      showStartDatePicker: ref(false),
      showEndDatePicker: ref(false),
      calenderShow: false, // 范围日历
      defaultDate: ref([]), // 日历默认显示日期
      formData: reactive({
        subject_name: ref(''),
        city: ref(''),
        address: ref(''),
        principal: ref(''),
        mobile: ref(''),
        subject_promise: ref(''), // 承诺
        agricultural_type: ref(''), // 服务类型
        serve_area: ref(''), // 服务面积
        serve_way: ref(''), // 服务方式
        serve_at: ref(''), // 服务时间
        serve_address: ref(''), // 服务地点
        apply_price: ref('') // 申请资金金额
      }),
      loading: false,
      status: ref(0), // 审核状态
      addressData: ref([]), // 地址数据
      zyfwFileList: ref([]),
      syzpFileList: ref([]),
      fileList: ref([]),
      fileListMap: {
        41: 'zyfwFileList',
        42: 'syzpFileList'
      },
      imgList: ref(null),
      link_tel: '',
      currentWitchType: ref(null)
    })
    let acForm = ref(null)
    let inputTarget = ref(null)

    // 1.作业服务清单选择图片回调
    const zyfwAfterRead = (e) => {
      // console.log('作业服务清单上传回调', e)
      uploadImage(e, 41)
    }
    // 2.水印照片选择图片回调
    const syzpAfterRead = (e) => {
      // console.log('水印照片选择图片回调', e)
      uploadImage(e, 42)
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

    const upload = (e) => {
      let fileObj = e.target.files[0]
      let type = fileObj.type === 'image/jpeg' || fileObj.type === 'image/png'
      if (type) {
        lrz(fileObj, { width: 600 }).then(async (result) => {
          if (state.ZLBFLAG) {
            let shorter = result.file
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
        if (state.ZLBFLAG) {
          // 是浙里办环境
        } else {
          // h5环境
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
        }
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
      if (state.status > 0) {
        return Toast('申请已提交，请耐心等待审核结果')
      }
      // console.log('表单提交', e)
      const params = {
        ...state.formData,
        form_status: isDraft ? 0 : 1,
        project_id: Route.query.project_id
      }

      params.serve_at = `${params.serve_start_at}-${params.serve_end_at}`

      if (!isDraft && !checkImages()) {
        return Toast('缺少材料，每类材料都需上传')
      }

      state.loading = true

      Request.applyShhSubsidy(params)
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
      // console.log('提交失败', e)
      if (e.errors && e.errors[0]) {
        Toast(e.errors[0].message)
      }
    }

    // key: 日历组件model; index: 点击的批次索引
    const showCalender = (key, index) => {
      if (state.status > 0) {
        return Toast('申请已提交，不可修改')
      }
      state[key] = true
    }

    const onCalenderConfirm = (e) => {
      // console.log('范围日历选择回调', e)
      if (e[0] && e[1]) {
        state.formData.serve_at = `${dayjs(e[0]).format('YYYY/MM/DD')}-${dayjs(e[1]).format('YYYY/MM/DD')}`
        state.calenderShow = false
      }
    }

    // 日历组件唤起触发
    const onCalenderOpen = () => {
      const {
        formData: { serve_at }
      } = state
      if (serve_at) {
        let [start, end] = [serve_at.split('-')[0], serve_at.split('-')[1]]
        state.defaultDate = [dayjs(start).toDate(), dayjs(end).toDate()]
      } else {
        state.defaultDate = [(dayjs().toDate(), dayjs().toDate())]
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
        Request.getShhSubsidy({
          policy_document_id: Route.query.policy_document_id,
          project_id: Route.query.project_id
        })
          .then((res) => {
            if (!refreshImg) {
              const { serve_at } = res.data
              res.data.serve_start_at = serve_at ? serve_at.split('-')[0] : ''
              res.data.serve_end_at = serve_at ? serve_at.split('-')[1] : ''

              state.formData = Object.assign({}, res.data)
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

            resolve()
          })
          .catch((err) => {
            console.log(err)
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
        // imgList[type].forEach(async (item) => {
        //   let base64 = await util.getBase64(item.src)
        //   item.content = base64
        // })
        state[fileListMap[type]] = imgList[type] || []
      } else {
        Object.keys(imgList).forEach((key) => {
          // imgList[key].forEach(async (item) => {
          //   let base64 = await util.getBase64(item.src)
          //   item.content = base64
          // })
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

    // 材料图片校验
    const checkImages = () => {
      let img_types = Object.keys(state.fileListMap)
      return img_types.every((key) => state.imgList && state.imgList.hasOwnProperty(key))
    }

    onMounted(() => {
      Promise.all([getAddressData(), getData()]).then((res) => {
        createAddressStr()
      })
      fetchOssinfo()

      getDocumentInfo()
    })

    const choiceImg = (witchType) => {
      state.currentWitchType = witchType
      inputTarget.value.click()
    }

    const jump2Policy = () => {
      Router.push({
        name: 'policyDetail',
        query: {
          id: Route.query.policy_document_id,
          hide: true
        }
      })
    }

    // 跳转审核记录
    const jump2record = () => {
      Router.push({
        name: 'approvalRecord',
        query: {
          project_id: Route.query.project_id,
          record_type: 8
        }
      })
    }

    const openStartDatePicker = () => {
      if (state.formData.serve_start_at) {
        state.select_start_date = dayjs(state.formData.serve_start_at).toDate()
      }
      state.showStartDatePicker = true
    }
    const openEndDatePicker = () => {
      if (state.formData.serve_end_at) {
        state.select_end_date = dayjs(state.formData.serve_end_at).toDate()
      }
      state.showEndDatePicker = true
    }
    const confirmStartDate = (e) => {
      state.formData.serve_start_at = dayjs(e).format('YYYY/MM/DD')
      state.showStartDatePicker = false
    }
    const confirmEndDate = (e) => {
      state.formData.serve_end_at = dayjs(e).format('YYYY/MM/DD')
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
      showCalender,
      onCalenderConfirm,
      onCalenderOpen,
      validateForm,
      zyfwAfterRead,
      syzpAfterRead,
      ...util,
      getData,
      jump2Policy,
      upload,
      choiceImg,
      inputTarget,
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

<style scoped lang="less"></style>
<style lang="less">
@import './farmer-common';
</style>
