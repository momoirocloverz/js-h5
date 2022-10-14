<!-- 粮油补贴申请 -->
<template>
  <div>
    <BeeProgress activeStep="1" :textList="['基本信息', '种植信息', '材料填写']"></BeeProgress>
    <div class="help-farmer-container" :class="{ 'fit-old': ZLBFitForOld }">
      <div class="panel">
        <div class="form-conatiner">
          <div class="form-title">
            <span>基本信息</span>
            <div class="right">
              <span class="fill-btn" @click="autoFill" v-if="isDraft == 1">自动填充</span>
              <div class="policy-btn" @click="jump2Policy">查看政策</div>
            </div>
          </div>
          <van-form @submit="onSubmit" @failed="onFailed" :disabled="status > 0" label-width="140" validate-trigger="onSubmit" ref="acForm">
            <van-field v-model="formData.main_name" required label="粮食生产经营主体" name="main_name" placeholder="请填写经营主体姓名" :rules="[{ required: true, message: '请填写经营主体姓名' }]">
            </van-field>
            <van-field v-model="formData.principal" required name="principal" label="负责人" placeholder="请输入负责人" :rules="[{ required: true, message: '请填写负责人' }]" />
            <van-field
              v-model="formData.idcard"
              required
              name="idcard"
              label="身份证"
              placeholder="请填写身份证"
              :rules="[
                { required: true, message: '请填写身份证' },
                { validatorIDCard, message: '身份证号码格式错误' }
              ]"
            />
            <van-field v-model="formData.company_credit_code" name="company_credit_code" label="企业信用代码" placeholder="请填写企业信用代码" />
            <van-field
              v-model="formData.city"
              required
              readonly
              name="city"
              label="办公地址"
              placeholder="请填写办公地址"
              @click="openPicker('showVillagePicker', index)"
              :rules="[{ required: true, message: '请填写办公地址' }]"
            />
            <van-cell title="" class="van-cell_noname">
              <template #value>
                <van-field v-model="formData.bg_address" name="bg_address" label-width="0" input-align="left" placeholder="请填写详细办公地址" />
              </template>
            </van-cell>
            <van-field v-model="formData.mobile" required type="tel" name="mobile" label="电话" placeholder="请填写电话" :rules="[{ required: true, message: '请填写电话' }]" />
            <div class="contract-item">
              <van-field
                required
                readonly
                v-model="formData.cb_address"
                class="half-field"
                name="cb_address"
                label="承包面积"
                placeholder="请选择所在村"
                :rules="[{ required: true, message: '请选择所在村' }]"
              />
              <van-field
                required
                v-model="formData.cb_area"
                label="亩数"
                type="number"
                class="half-field pdl0"
                name="cb_area"
                placeholder="请输入亩数"
                :rules="[{ required: true, message: '请输入亩数' }]"
              />
            </div>
            <div class="uploadCon">
              <AcUploader
                :fileList="cnsFileList"
                title="粮油生产经营主体承诺书"
                tipText="删除图片可重新签署"
                :witchType="71"
                @deleteCb="getData"
                @choiceImg="choiceImg"
                :status="status"
                readonly
                v-show="hasSignature"
              ></AcUploader>
              <div class="has-no-signature" v-show="!hasSignature">
                <div class="title">粮油生产经营主体承诺书</div>
                <div class="condition">请通过下方按钮进行签名，签名完成将自动生成承诺书</div>
                <van-button type="primary" class="signature-btn" @click="jump2Signature">电子签名</van-button>
              </div>
            </div>
          </van-form>
        </div>
      </div>
      <!-- 审核流程 -->
      <div class="bottom-btn">
        <div class="btn plain" style="width: 33.333%" @click="onSubmit(null, true)">保存草稿</div>
        <div class="btn" style="width: 66.666%" @click="validateForm">下一步</div>
      </div>

      <!-- 承包面积-村 -->
      <van-popup v-model:show="showVillagePicker" round position="bottom">
        <van-cascader v-model="villagePickerValue" title="请选择所在村" :field-names="fieldNames" :options="addressData.children" @finish="confirmVillage" @close="showVillagePicker = false" />
        <!-- <van-picker
        title="选择所在村"
        :columns="villages"
        :defaultIndex="0"
        @confirm="confirmVillage"
        @cancel="showVillagePicker = false"
      /> -->
      </van-popup>

      <!-- 农作物种植-作物类型 -->
      <van-popup v-model:show="showCropsPicker" round position="bottom">
        <van-picker title="选择作物类型" :columns="PLANT_TYPE_OPTIONS" :defaultIndex="0" :columns-field-names="{ text: 'label' }" @confirm="confirmCrops" @cancel="showCropsPicker = false" />
      </van-popup>

      <div class="publishCircle" v-if="link_tel" @click="popSheet">
        <!-- <div class="contact-btn-zlb" @click="consultTrigger" v-if="ZLBFLAG"></div>
        <a :href="'tel:' + link_tel" class="tel-link" v-else></a> -->
      </div>

      <input ref="inputTarget" id="takepicture" type="file" accept="image/*" style="display: none" @change="beforeUpload" />

      <!-- 允许上传pdf、word -->
      <input
        ref="fileInputTarget"
        id="takeFile"
        type="file"
        accept="image/*, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        style="display: none"
        @change="beforeUpload"
      />

      <Loading :visiable="loading" :text="loadingText"></Loading>
      <van-action-sheet v-model:show="newState.sheetShow" :actions="newState.actions" cancel-text="取消" close-on-click-action @select="onSelect" />
    </div>
  </div>
</template>

<script>
import { watch, defineComponent, onMounted, reactive, ref, toRefs, onActivated, onDeactivated } from 'vue'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import { Toast, Dialog } from 'vant'
import Request from '@/service/request'
import { isZLB, filterAttachment } from '@/util/index'
// import { autoUpload } from './components/auto-upload'
import Loading from '@/components/loading'
import BreakApprovalSteps from './components/BreakApprovalSteps'
import { util } from '@/util/index.js'
import AcUploader from '@/components/AcUploader'
import BeeProgress from '@/components/beeProgress'
import lrz from 'lrz'
import OSS from 'ali-oss'
import { OSSLINK, PLANT_TYPE, FILE_MAX_SIZE } from '@/util/const'

export default defineComponent({
  components: { AcUploader, Loading, BreakApprovalSteps, BeeProgress },
  setup(props, context) {
    const Router = useRouter()
    const Route = useRoute()
    const newState = reactive({
      sheetShow: false,
      actions: [{ name: '电话呼叫' }, { name: '咨询意见' }]
    })
    const state = reactive({
      client: {},
      ZLBFLAG: isZLB(),
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
      formData: reactive({
        main_name: ref(''),
        city: ref(''),
        bg_address: ref(''),
        principal: ref(''),
        idcard: ref(''),
        company_credit_code: ref(''), // 肥料来源
        mobile: ref(''),
        bg_city_id: '',
        bg_town_id: '',
        bg_village_id: '',
        cb_city_id: '',
        cb_town_id: '',
        cb_village_id: '',
        cb_area: ref('')
      }),
      crop_list: reactive([{ crop_type: '', type_text: '', list: [{ dist_name: '', area: '' }] }]),
      loading: false,
      loadingText: ref(''),
      showVillagePicker: ref(false), // 村选择
      showCropsPicker: ref(false), // 农作物-作物类型选择
      currentCropsIndex: ref(0), // 当前选择的作物类型对应索引
      status: ref(0), // 审核状态
      addressData: ref(null), // 地址数据
      cnsFileList: ref([]), // 采购合同图片列表
      lzhtFileList: ref([]),
      lzqcFileList: ref([]),
      sytFileList: ref([]),
      zfpzFileList: ref([]),
      fileList: ref([]),
      fileListMap: {
        71: 'cnsFileList'
        // 72: 'lzhtFileList',
        // 73: 'lzqcFileList',
        // 74: 'sytFileList',
        // 75: 'zfpzFileList'
      },
      imgList: ref(null),
      link_tel: '',
      approvalData: reactive({}),
      currentWitchType: ref(null),
      fieldNames: Object.freeze({
        text: 'name',
        value: 'id',
        children: 'children'
      }),
      villagePickerValue: ref(''),
      PLANT_TYPE_OPTIONS: ref(PLANT_TYPE),
      refreshSignature: ref(false),
      hasSignature: false,
      auto: ref(0), // 自动填充
      isDraft: ref(0)
    })

    watch(
      () => state.imgList,
      (newVal) => {
        if (state.imgList && state.imgList[71] && state.imgList[71].length) {
          state.hasSignature = true
        } else {
          state.hasSignature = false
        }
      },
      { deep: true }
    )

    // 身份证验证
    const validatorIDCard = (val) => {
      const card15 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$/
      const card18 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
      return card15.test(val) || card18.test(val)
    }

    let acForm = ref(null)
    let inputTarget = ref(null)
    let fileInputTarget = ref(null)

    onBeforeRouteLeave(async (to, from) => {
      if (to && to.name == 'signature') {
        state.refreshSignature = true
      }
    })

    onMounted(() => {})

    onActivated(() => {
      Promise.all([getAddressData(), getData()]).then((res) => {
        createAddressStr()
        if (state.refreshSignature) {
          updateSignature()
        }
      })
      if (state.ZLBFLAG) {
        fetchOssinfo()
      }
      getDocumentInfo()
    })

    onDeactivated(() => {
      state.imgList = null
    })

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
          state.client.path = after.path_class
        }
      })
    }

    const beforeUpload = async (e) => {
      let fileObj = e.target.files[0]
      if (fileObj.size / 1024 > FILE_MAX_SIZE) {
        return Toast('文件大小不能大于50M')
      }
      let acceptType = ['image/jpeg', 'image/png']
      if (state.currentWitchType == 74) {
        acceptType.push('application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
      }
      let type = acceptType.includes(fileObj.type)
      if (type) {
        if ([74].includes(state.currentWitchType)) {
          // 不压缩
          upload(null, fileObj)
            .then(() => {
              getData(true, type)
              e.target.value = ''
              state.loadingText = ''
            })
            .finally(() => {
              state.loading = false
            })
        } else {
          // 压缩
          lrz(fileObj, { width: 600 }).then(async (result) => {
            upload(result, fileObj)
              .then(() => {
                getData(true, type)
                e.target.value = ''
                state.loadingText = ''
              })
              .finally(() => {
                state.loading = false
              })
          })
        }
      } else {
        Toast(`支持上传文件格式：jpg、jpeg、png${state.currentWitchType == 74 ? '、pdf、doc' : ''}`)
      }
    }

    // 上传图片
    const upload = (result, fileObj) => {
      return new Promise((resolve, reject) => {
        // 开始上传 loading
        state.loading = true
        state.loadingText = '上传中'
        if (state.ZLBFLAG) {
          let url = `${state.client.path}/${fileObj.name.split('.')[0]}-${Date.parse(new Date()) / 1000}.${fileObj.type.split('/')[1]}`
          let reader = new FileReader()
          reader.readAsDataURL(fileObj)
          reader.onloadend = () => {
            state.client.multipartUpload(url, fileObj).then(async (data) => {
              console.log(' LOAD END', data)
              state.fileList.push({
                url: OSSLINK + data.name
              })
              // e.target.value = ''
              let newParams = {
                fileOriginName: fileObj.name,
                cl_type: 1,
                fileUrl: state.fileList[0].url,
                which_type: state.currentWitchType,
                policy_document_id: Route.query.policy_document_id || Route.query.policyId,
                project_id: Route.query.project_id || Route.query.projectId
              }
              state.fileList = [] // 清空
              Request.projectUploadMaterials(newParams)
                .then((res) => {
                  if (res.code === 0) {
                    // getData(true, type)
                    resolve()
                  }
                })
                .catch(() => {
                  reject()
                })
                .finally(() => {
                  state.loading = false
                })
            })
          }
        } else {
          let params = new FormData()
          params.append('file', result ? result.file : fileObj, fileObj.name)
          params.append('which_type', state.currentWitchType)
          params.append('cl_type', 1)
          params.append('policy_document_id', Route.query.policy_document_id || Route.query.policyId)
          params.append('project_id', Route.query.project_id || Route.query.projectId)
          Request.projectUploadMaterials(params, {
            onUploadProgress: onUploadProgress
          })
            .then((res) => {
              if (res.code === 0) {
                resolve()
              }
            })
            .catch(() => {
              reject()
            })
            .finally(() => {
              state.loading = false
            })
        }
      })
    }

    const onUploadProgress = (e) => {
      if (e.lengthComputable) {
        var rate = e.loaded / e.total //已上传的比例
        console.log('进度', `${parseInt(rate * 100)}%`)
        // if (rate < 1) {
        //   // 这里的进度只能表明文件已经上传到后台，但是后台有没有处理完还不知道
        //   // 因此不能直接显示为100%，不然用户会误以为已经上传完毕，关掉浏览器的话就可能导致上传失败
        //   // 等响应回来时，再将进度设为100%
        //   vm.uploadRate = rate
        //   vm.uploadStyle.width = (rate * 100).toFixed(2) + '%'
        // }
      }
    }

    // 点击提交按钮 验证表单
    const validateForm = (e) => {
      if (state.status > 0) {
        Router.push({
          name: 'lyDeclare2',
          query: {
            project_id: Route.query.project_id,
            policy_document_id: Route.query.policy_document_id,
            auto: state.auto
          }
        })
      } else {
        acForm.value.submit((values) => {
          console.log('表单验证', values)
        })
      }
    }

    // 验证通过 表单submit事件触发
    const onSubmit = (e, isDraft) => {
      if (state.status == 82) {
        return Toast('申请已通过')
      }

      if (state.status > 0) {
        return Toast('申请已提交，请耐心等待审核结果')
      }

      const { crop_list, ZLBFLAG } = state
      const params = {
        ...state.formData,
        crop_list: ZLBFLAG ? JSON.stringify(crop_list) : crop_list,
        form_status: 0,
        project_id: Route.query.project_id
      }
      if (crop_list && crop_list.length && !crop_list[0].crop_type) {
        params.crop_list = []
      }
      if (!isDraft && !checkImages()) {
        return Toast('缺少材料，每类材料都需上传')
      }
      state.loading = true
      // return console.log('粮油补贴提交参数', JSON.stringify(params))
      Request.applyLySubsidy(params)
        .then((res) => {
          if (res && res.code == 0) {
            if (isDraft) {
              return Toast('保存成功')
            }
            Router.push({
              name: 'lyDeclare2',
              query: {
                project_id: Route.query.project_id,
                policy_document_id: Route.query.policy_document_id,
                auto: state.auto
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
    // 唤起picker
    const openPicker = (key, index) => {
      if (state.status > 0) {
        return Toast('申请已提交，请耐心等待审核结果')
      }
      state[key] = true
      if ((key = 'showCropsPicker')) {
        state.currentCropsIndex = index
      }
    }

    // 确认选择村
    const confirmVillage = (e) => {
      if (e.selectedOptions.length) {
        state.formData.bg_city_id = 1
        state.formData.bg_town_id = e.selectedOptions[0].id
        state.formData.bg_village_id = e.selectedOptions[1].id
        state.formData.city = `${e.selectedOptions[0].name}\/${e.selectedOptions[1].name}`
        state.showVillagePicker = false
      }
    }

    // 确认选择作物类型-农作物
    const confirmCrops = (e) => {
      // console.log(e)
      const { currentCropsIndex } = state
      state.crop_list[currentCropsIndex].crop_type = e.value
      state.crop_list[currentCropsIndex].type_text = e.label
      state.showCropsPicker = false
      // 禁用当前类型
      const index = state.PLANT_TYPE_OPTIONS.findIndex((v) => v.value == e.value)
      state.PLANT_TYPE_OPTIONS[index].disabled = true
      state.PLANT_TYPE_OPTIONS = JSON.parse(JSON.stringify(state.PLANT_TYPE_OPTIONS))
    }

    const onChangeArea = (index) => {
      let list = state.crop_list[index].list
      let total_area = 0
      list.forEach((v) => {
        if (!isNaN(Number(v.area))) {
          total_area += Number(v.area)
        }
      })
      state.crop_list[index].total_area = total_area.toFixed(1)
    }

    // 生成地址字符串 根据 city_id town_id etc.
    const createAddressStr = () => {
      try {
        const {
          addressData,
          formData: { bg_city_id, bg_town_id, bg_village_id, cb_city_id, cb_town_id, cb_village_id }
        } = state
        if (!addressData) return
        let city = addressData.name
        let townItem = addressData.children.find((town) => town.id == cb_town_id)
        let villageItem = townItem ? townItem.children.find((village) => village.id == cb_village_id) : null
        if (townItem && villageItem) {
          state.formData.cb_address = `${townItem.name}/${villageItem.name}` // 承包地址回显
        }
        if (bg_town_id && bg_village_id) {
          let bg_townItem = addressData.children.find((town) => town.id == bg_town_id)
          let bg_villageItem = bg_townItem.children.find((village) => village.id == bg_village_id)
          state.formData.city = `${city}/${bg_townItem.name}/${bg_villageItem.name}`
          state.villagePickerValue = bg_village_id
        }
      } catch (e) {
        console.log(e)
      }
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
        Request.getLySubsidy({
          policy_document_id: Route.query.policy_document_id,
          project_id: Route.query.project_id
        })
          .then((res) => {
            if (!refreshImg) {
              const newData = Object.assign({}, res.data.sub_ly_info)
              // 过滤之前填过的数据
              Object.keys(state.formData).forEach((key) => {
                if (Object.prototype.toString.call(key) === '[object Array]') {
                } else if (state.formData[key]) {
                  newData[key] = state.formData[key]
                }
              })
              state.formData = newData
              const { crop_list } = res.data.sub_ly_info
              if (crop_list && crop_list.length) {
                state.crop_list = crop_list.map((item) => {
                  return item
                })
              }
              handleApprovalData(res.data)

              delete res.data.crop_list
            }

            if (refreshImg || !state.imgList) {
              let materials_list = res.data.materials_list
              state.imgList = materials_list
              delete res.data.materials_list
              getBase64Images(type)
            }

            if (state.formData.cb_city_id) {
              createAddressStr()
            }

            state.loading = false
            state.isDraft = res.data.is_draft
            state.status = res.data.status

            resolve()
          })
          .catch((err) => {
            console.log(err)
            reject()
          })
      })
    }

    // 获取最近一次正式数据填充
    const getLastestData = () => {
      return new Promise((resolve, reject) => {
        Request.getLySubsidy()
          .then((res) => {
            if (res.code === 0) {
              resolve(res.data)
            } else {
              resolve(null)
              Toast('获取最近一次数据出错')
            }
          })
          .catch((e) => {
            console.log(e)
            resolve(null)
            Toast('获取最近一次数据出错')
          })
      })
    }

    // 自动填充
    const autoFill = async () => {
      Dialog.confirm({
        title: '提示',
        message: `此操作将覆盖已填写数据，确定使用最近一次申报信息填充吗？`
      })
        .then(async () => {
          try {
            state.loading = true
            const result = await getLastestData()
            console.log('result', result)
            if (result && result.sub_ly_info) {
              const newData = Object.assign({}, result.sub_ly_info)
              state.formData = { ...newData }
              const { crop_list } = result.sub_ly_info
              if (crop_list && crop_list.length) {
                state.crop_list = crop_list.map((item) => {
                  return item
                })
              }
              createAddressStr()
              // // 材料填充 本页面只需填充承诺书71 图片填充需自动调用上传接口
              // let materials_list = result.materials_list
              // const autoCallback = await autoUpload({ 71: materials_list[71] }, Route.query.project_id, Route.query.policy_document_id)
              // console.log('自动上传回调', autoCallback)
              // if (autoCallback == 'success') {
              //   // 自动上传成功 更新 71 图片
              //   updateSignature()
              // }
              state.loading = false
              state.auto = 1 // 置1，带入下一步路由参数，下一步进入自动获取数据填充
            } else {
              Toast('未获取到最近一次申报数据')
            }
          } catch (e) {
            console.log(e)
            state.loading = false
          } finally {
            state.loading = false
          }
        })
        .catch((e) => {
          // on cancel
          console.log(e)
        })
    }

    // 处理审核数据
    const handleApprovalData = (data) => {
      // 将附件按照格式分类
      let lyCunPublicAttachments = filterAttachment(data.ly_cun_public_attachment)
      data.ly_cun_public_attachment = lyCunPublicAttachments[0]
      data.ly_cun_public_attachment_doc = lyCunPublicAttachments[1]
      let lyCunAuditAttachments = filterAttachment(data.ly_cun_audit_attachment)
      data.ly_cun_audit_attachment = lyCunAuditAttachments[0]
      data.ly_cun_audit_attachment_doc = lyCunAuditAttachments[1]
      let lyVillageNjzxAttachments = filterAttachment(data.ly_village_njzx_attachment)
      data.ly_village_njzx_attachment = lyVillageNjzxAttachments[0]
      data.ly_village_njzx_attachment_doc = lyVillageNjzxAttachments[1]
      let lyVillageAuditAttachments = filterAttachment(data.ly_cun_public_attachment)
      data.ly_village_audit_attachment = lyVillageAuditAttachments[0]
      data.ly_village_audit_attachment_doc = lyVillageAuditAttachments[1]
      let lyRuralAuditAttachments = filterAttachment(data.ly_rural_audit_attachment)
      data.ly_rural_audit_attachment = lyRuralAuditAttachments[0]
      data.ly_rural_audit_attachment_doc = lyRuralAuditAttachments[1]
      let lyThreeCompanyAttachments = filterAttachment(data.ly_three_company_attachment)
      data.ly_three_company_attachment = lyThreeCompanyAttachments[0]
      data.ly_three_company_attachment_doc = lyThreeCompanyAttachments[1]
      let lyPublicGovnAttachments = filterAttachment(data.ly_public_govn_attachment)
      data.ly_public_govn_attachment = lyPublicGovnAttachments[0]
      data.ly_public_govn_attachment_doc = lyPublicGovnAttachments[1]
      let lyFundAttachments = filterAttachment(data.ly_fund_attachment)
      data.ly_fund_attachment = lyFundAttachments[0]
      data.ly_fund_attachment_doc = lyFundAttachments[1]
      state.approvalData = data
    }

    // 获取图片材料 type:指定转换图片的wich_type
    const getBase64Images = (type) => {
      const { imgList, fileListMap } = state
      if (type && imgList[type]) {
        state[fileListMap[type]] = imgList[type] || []
      } else {
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

    // 材料图片校验
    const checkImages = () => {
      let img_types = Object.keys(state.fileListMap)
      return img_types.every((key) => state.imgList && state.imgList.hasOwnProperty(key))
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

    const choiceImg = (witchType) => {
      state.currentWitchType = witchType
      if (witchType == 74) {
        // 触发可上传二进数据的input
        return fileInputTarget.value.click()
      }
      inputTarget.value.click()
    }

    // 跳转审核记录
    const jump2record = () => {
      Router.push({
        name: 'approvalRecord',
        query: {
          project_id: Route.query.project_id,
          record_type: 11
        }
      })
    }

    // 跳转签名页
    const jump2Signature = () => {
      const project_id = Route.query.project_id
      const policy_document_id = Route.query.policy_document_id
      Router.push({
        name: 'signature',
        query: {
          project_id,
          policy_document_id
        }
      })
    }

    // 更新承诺书图片
    const updateSignature = () => {
      Request.getLySubsidy({
        policy_document_id: Route.query.policy_document_id,
        project_id: Route.query.project_id
      }).then((res) => {
        if (res.data.materials_list[71]) {
          if (state.imgList) {
            state.imgList[71] = res.data.materials_list[71]
          } else {
            state.imgList = { 71: res.data.materials_list[71] }
          }
          getBase64Images(71)
          state.refreshSignature = false
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
      onSubmit,
      onFailed,
      acForm,
      validateForm,
      num2Char: util.num2Char,
      getData,
      jump2Policy,
      beforeUpload,
      choiceImg,
      inputTarget,
      fileInputTarget,
      consultTrigger,
      jump2record,
      validatorIDCard,
      openPicker,
      PLANT_TYPE,
      confirmVillage,
      confirmCrops,
      onChangeArea,
      jump2Signature,
      autoFill
    }
  }
})
</script>

<style scoped lang="less">
.help-farmer-container {
  .uploadCon {
    margin-top: 20px;
  }
  .has-no-signature {
    padding: 0 0.3rem 0.3rem;
    .title {
      font-size: 0.28rem;
      color: var(--van-field-label-color);
      margin-bottom: 0.3rem;

      &::before {
        content: '*';
        margin-right: 2px;
        color: var(--van-field-required-mark-color);
      }
    }
    .condition {
      font-size: 0.24rem;
      color: #999999;
    }

    .signature-btn {
      height: 0.6rem;
      margin: 0.2rem 0 0;
    }
  }
  .panel {
    .contract-item {
      position: relative;
      display: flex;
      // align-items: flex-end;

      .van-cell {
        padding-bottom: 0;

        &.half-field {
          &:nth-of-type(1) {
            padding-right: 0.3rem;
          }
          .van-cell__value {
            width: 50%;
          }
        }

        &.pdl0 {
          padding-left: 0;
        }

        &.flex-row {
          flex-direction: row;
          align-items: center;
        }
      }

      :deep(.half-field) {
        &:last-child {
          .van-cell__title {
            color: #fff;

            &::before {
              content: none;
            }
          }
        }
      }
    }

    .crops-content {
      .crops-item {
        margin-top: 0.3rem;
        position: relative;

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 6.3rem;
          height: 1px;
          transform: translateX(-50%) scaleY(0.5);
          background: #ccc;
        }

        &:first-child {
          margin-top: 0;
        }
      }

      .dist-item {
        margin: 0.3rem;
        display: flex;
        align-items: flex-start;
        box-shadow: 0 0 0.12rem #ebedf0;
        position: relative;

        :deep(.van-cell) {
          display: flex;

          .van-cell__title {
            width: auto !important;
            display: flex-start;
            align-items: center;
          }
        }
      }
    }
    .item-fields {
      .van-cell {
        &.bold {
          .van-cell__title {
            font-weight: bold;
          }
        }
      }
    }
    .del-btn {
      position: absolute;
      right: var(--van-cell-horizontal-padding);
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

    .add-btn {
      padding: 0.3rem;
      display: flex;
      align-items: center;
      width: 2rem;

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

<style lang="less">
@import './farmer-common';
</style>
