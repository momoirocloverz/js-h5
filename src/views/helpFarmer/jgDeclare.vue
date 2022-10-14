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
          <van-cell title=" " class="van-cell_noname">
            <template #value>
              <van-field v-model="formData.address" required name="address" label-width="0" input-align="left" placeholder="请输入详细地址" :rules="[{ required: true, message: '请选择详细地址' }]" />
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

          <div class="form-title">秸秆综合利用补助资金申请</div>
          <van-field v-model="formData.straw_type" required label="秸秆类型" name="straw_type" placeholder="请输入秸秆类型" :rules="[{ required: true, message: '请填写秸秆类型' }]" />
          <van-field v-model="formData.collect_num" required type="number" label="收集数量（吨)" name="collect_num" placeholder="请输入数量" :rules="[{ required: true, message: '请填写数量' }]" />
          <van-field
            v-model="formData.apply_straw_amount"
            required
            type="number"
            label="申请补助资金（万元）"
            name="apply_straw_amount"
            placeholder="请输入申请补助资金"
            :rules="[{ required: true, message: '请填写资金金额' }]"
          />
          <van-field v-model="formData.straw_way" required label="利用方式" name="straw_way" placeholder="请输入利用方式" :rules="[{ required: true, message: '请填写利用方式' }]" />
          <van-field v-model="formData.dry_num" required type="number" label="折干数量（吨）" name="dry_num" placeholder="请输入折干数量" :rules="[{ required: true, message: '请填写折干数量' }]" />

          <div class="form-title">材料上传</div>

          <AcUploader :fileList="sgmxFileList" title="1.秸秆收购明细表" @afterRead="sgmxAfterRead" @deleteCb="getData" :witchType="31" @choiceImg="choiceImg" :status="status"></AcUploader>
          <AcUploader :fileList="rkFileList" title="2.入库单" @afterRead="rkAfterRead" @deleteCb="getData" :witchType="32" @choiceImg="choiceImg" :status="status"></AcUploader>
          <AcUploader :fileList="gbFileList" title="3.过磅单" @afterRead="gbAfterRead" @deleteCb="getData" :witchType="33" @choiceImg="choiceImg" :status="status"></AcUploader>
          <AcUploader
            :fileList="syzpFileList"
            title="4.水印照片（秸秆综合利用补助）"
            @afterRead="syzpAfterRead"
            @deleteCb="getData"
            :witchType="34"
            @choiceImg="choiceImg"
            :status="status"
          ></AcUploader>
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

    <div class="bottom-btn">
      <div class="btn plain" style="width: 33.333%" @click="onSubmit(null, true)">保存草稿</div>
      <div class="btn" style="width: 66.666%" @click="validateForm">提交</div>
    </div>

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
import Loading from '@/components/loading'
import { mgop } from '@aligov/jssdk-mgop'
import { util } from '@/util/index.js'
import AcUploader from '@/components/AcUploader'
import ApprovalSteps from './components/ApprovalSteps'
import lrz from 'lrz'
import OSS from 'ali-oss'
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
      ZLBFLAG: isZLB(),
      client: {},

      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
      formData: reactive({
        subject_name: ref(''),
        city: ref(''),
        address: ref(''),
        principal: ref(''),
        mobile: ref(''),
        subject_promise: ref(''), // 承诺
        straw_type: ref(''), // 秸秆类型
        collect_num: ref(''), // 收集数量
        apply_straw_amount: ref(''), // 申请资金
        straw_way: ref(''), // 利用方式
        dry_num: ref('') // 折干数量
      }),
      loading: false,
      status: ref(0), // 审核状态
      sgmxFileList: ref([]), // 图片列表
      rkFileList: ref([]),
      gbFileList: ref([]),
      syzpFileList: ref([]),
      fileList: ref([]),
      fileListMap: {
        31: 'sgmxFileList',
        32: 'rkFileList',
        33: 'gbFileList',
        34: 'syzpFileList'
      },

      approval: ref([]), // 审核流程数据
      addressData: ref([]), // 地址数据
      imgList: ref(null),
      link_tel: '',
      currentWitchType: ref(null)
    })
    let acForm = ref(null)
    let inputTarget = ref(null)

    // 1.秸秆收购明细表选择图片回调
    const sgmxAfterRead = (e) => {
      // console.log('秸秆收购明细表上传回调', e)
      uploadImage(e, 31)
    }
    // 2.入库单选择图片回调
    const rkAfterRead = (e) => {
      // console.log('入库单选择图片回调', e)
      uploadImage(e, 32)
    }
    // 3.过磅单选择图片回调
    const gbAfterRead = (e) => {
      // console.log('过磅单选择图片回调', e)
      uploadImage(e, 33)
    }
    // 4.水印照片选择图片回调
    const syzpAfterRead = (e) => {
      // console.log('水印照片选择图片回调', e)
      uploadImage(e, 34)
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
      const params = {
        ...state.formData,
        form_status: isDraft ? 0 : 1,
        project_id: Route.query.project_id
      }

      if (!isDraft && !checkImages()) {
        return Toast('缺少材料，每类材料都需上传')
      }
      state.loading = true
      // return console.log('提交参数', params)
      Request.applyJgSubsidy(params)
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

    // 获取已有申报数据
    const getData = (refreshImg, type) => {
      return new Promise((resolve, reject) => {
        state.loading = true
        Request.getJgSubsidy({
          policy_document_id: Route.query.policy_document_id,
          project_id: Route.query.project_id
        })
          .then((res) => {
            if (!refreshImg) {
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
          record_type: 7
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
      sgmxAfterRead,
      rkAfterRead,
      gbAfterRead,
      syzpAfterRead,
      validateForm,
      acForm,
      ...util,
      jump2Policy,
      getData,
      upload,
      choiceImg,
      inputTarget,
      consultTrigger,
      jump2record
    }
  }
})
</script>

<style scoped lang="less"></style>

<style lang="less">
@import './farmer-common';
</style>
