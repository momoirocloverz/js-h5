<template>
  <div class="help-farmer-container" :class="{ 'fit-old': ZLBFitForOld }">
    <div class="panel">
      <div class="form-conatiner">
        <div class="form-title">
          <span>基本信息</span>
          <div class="policy-btn" @click="jump2Policy">查看政策</div>
        </div>
        <van-form @submit="onSubmit" @failed="onFailed" :disabled="status > 0" label-width="200" validate-trigger="onSubmit" ref="acForm">
          <van-field v-model="formData.principal" required name="principal" label="负责人" placeholder="请输入负责人姓名" :rules="[{ required: true, message: '请填写负责人姓名' }]" />

          <van-field v-model="formData.city" required readonly name="city" label="地址" placeholder="选择地址" :rules="[{ required: true, message: '请选择地址' }]" />
          <van-cell title="" class="van-cell_noname">
            <template #value>
              <van-field v-model="formData.address" required name="address" label-width="0" input-align="left" placeholder="请输入详细地址" :rules="[{ required: true, message: '请填写详细地址' }]" />
            </template>
          </van-cell>

          <van-field v-model="formData.mobile" required type="tel" name="mobile" label="电话" placeholder="请输入电话" :rules="[{ required: true, message: '请填写申报人电话' }]" />
          <van-field v-model="formData.bank" required name="bank" label="申请单位开户银行" placeholder="请输入申请单位开户银行" :rules="[{ required: true, message: '请填写申请单位开户银行' }]" />
          <van-field
            v-model="formData.bank_account"
            required
            type="number"
            name="bank_account"
            label="银行账号"
            placeholder="请输入银行账号"
            :rules="[{ required: true, message: '请填写银行账号' }]"
          />
          <van-field v-model="formData.link_person" required name="link_person" label="联系人" placeholder="请输入联系人" :rules="[{ required: true, message: '请填写联系人' }]" />

          <div class="form-title">扶持内容</div>
          <div class="help-content">
            <div class="help-item" v-for="(item, index) in helpList" :key="index">
              <div class="del-btn" v-if="index" @click="deleteHelp">删除</div>
              <div class="item-fields">
                <van-field v-model="item.content" required name="content" :label="`扶持内容${num2Char(index)}`" placeholder="请输入扶持内容" :rules="[{ required: true, message: '请填写扶持内容' }]" />
                <van-field v-model="item.number" required type="number" name="number" label="数量" placeholder="请输入数量" :rules="[{ required: true, message: '请填写数量' }]" />
                <van-field v-model="item.price" required type="number" name="price" label="单价(元)" placeholder="请输入单价" :rules="[{ required: true, message: '请填写单价' }]" />
                <van-field v-model="item.area" required type="number" name="area" label="面积(平方米)" placeholder="请输入面积" :rules="[{ required: true, message: '请填写面积' }]" />
                <van-field
                  v-model="item.help_price"
                  required
                  type="number"
                  name="help_price"
                  label="要求补助资金(万元）"
                  placeholder="请输入补助资金"
                  :rules="[{ required: true, message: '请填写补助资金' }]"
                />
                <van-field v-model="item.remark" required name="remark" label="备注" placeholder="请输入备注" :rules="[{ required: true, message: '请填写备注' }]" />
              </div>
            </div>
            <div class="add-help" @click="addHelp">
              <img src="https://img.hzanchu.com/acimg/0ef025121076713f8ae14f333b521f70.png" alt="新增" class="icon" />
              <div class="add-text">新增内容</div>
            </div>
          </div>

          <div class="uploader-content">
            <div class="form-title">材料上传</div>

            <AcUploader :fileList="ydbaFileList" title="1.设施农业用地备案" @deleteCb="getData" :witchType="51" @choiceImg="choiceImg" :status="status"></AcUploader>
            <AcUploader :fileList="hpzmFileList" title="2.环评证明" @deleteCb="getData" :witchType="52" @choiceImg="choiceImg" :status="status"></AcUploader>
            <AcUploader :fileList="yyzzFileList" title="3.营业执照" @deleteCb="getData" :witchType="53" @choiceImg="choiceImg" :status="status"></AcUploader>
            <AcUploader :fileList="yzzmFileList" title="4.引种证明材料（发票、运输证明、系谱）" @deleteCb="getData" :witchType="54" @choiceImg="choiceImg" :status="status"></AcUploader>
            <AcUploader :fileList="yzdaFileList" title="5.养殖档案" @deleteCb="getData" :witchType="55" @choiceImg="choiceImg" :status="status"></AcUploader>
            <AcUploader :fileList="qtFileList" title="6.其他证明材料" @deleteCb="getData" :witchType="56" @choiceImg="choiceImg" :status="status"></AcUploader>
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

    <div class="bottom-btn" v-if="status != 62">
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
import { computed, defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import { Toast } from 'vant'
import Request from '@/service/request'
import dayjs from 'dayjs'
import { isZLB } from '@/util/index'
import Loading from '@/components/loading'
import ApprovalSteps from './components/ApprovalSteps'
import { mgop } from '@aligov/jssdk-mgop'
import { util } from '@/util/index.js'
import AcUploader from '@/components/AcUploader'
import lrz from 'lrz'
import OSS from 'ali-oss'
import { OSSLINK } from '@/util/const'
const PHONEREGULAR = /^1[3-9]\d{9}$/
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
      client: {},
      ZLBFLAG: isZLB(),
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
      formData: reactive({
        principal: ref(''),
        city: ref(''),
        address: ref(''),
        mobile: ref(''),
        bank: ref(''),
        bank_account: ref(''),
        link_person: ref('')
      }),
      itemTpl: reactive({
        content: ref(''),
        number: ref(''),
        price: ref(''),
        area: ref(''),
        help_price: ref(''),
        remark: ref('')
      }),
      helpList: reactive([
        {
          content: ref(''),
          number: ref(''),
          price: ref(''),
          area: ref(''),
          help_price: ref(''),
          remark: ref('')
        }
      ]),
      loading: false,
      status: ref(0), // 审核状态
      addressData: ref([]), // 地址数据
      ydbaFileList: ref([]), // 用地备案图片列表
      hpzmFileList: ref([]),
      yyzzFileList: ref([]),
      yzzmFileList: ref([]),
      yzdaFileList: ref([]),
      qtFileList: ref([]),
      fileList: ref([]),
      fileListMap: {
        51: 'ydbaFileList',
        52: 'hpzmFileList',
        53: 'yyzzFileList',
        54: 'yzzmFileList',
        55: 'yzdaFileList',
        56: 'qtFileList'
      },
      imgList: ref(),
      link_tel: '',
      processData: {
        0: { title: '材料提交', at: 'submit_at' },
        1: {
          title: '乡镇经办人审核',
          at: 'hy_village_handle_at',
          not_at: 'hy_village_handle_not_at',
          reason: 'hy_village_handle_reason',
          attachment: 'hy_village_handle_attachment'
        },
        2: {
          title: '市养殖业发展服务中心审核',
          at: 'hy_farm_at',
          not_at: 'hy_farm_not_at',
          reason: 'hy_farm_reason',
          attachment: 'hy_farm_attachment'
        },
        3: {
          title: '农业农村局审核',
          at: 'hy_unit_at',
          not_at: 'hy_unit_not_at',
          reason: 'hy_unit_reason',
          attachment: 'hy_unit_attachment'
        },
        4: {
          title: '公示',
          at: 'hy_public_at',
          not_at: 'hy_public_not_at',
          reason: 'hy_public_reason',
          attachment: 'hy_public_attachment'
        },
        5: {
          title: '资金拨付',
          at: 'hy_fund_at',
          not_at: 'hy_fund_not_at',
          real_fund_amount: 'real_fund_amount',
          reason: 'hy_fund_reason',
          attachment: 'hy_fund_attachment'
        }
      },
      currentWitchType: ref(null)
    })
    let acForm = ref(null)
    let inputTarget = ref(null)

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
        support_content: JSON.stringify(state.helpList),
        project_id: Route.query.project_id
      }

      if (!isDraft && !checkImages()) {
        return Toast('缺少材料，每类材料都需上传')
      }

      state.loading = true

      // return console.log('提交参数', params)
      Request.applyHySubsidy(params)
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
        Request.getHySubsidy({
          project_id: Route.query.project_id,
          policy_document_id: Route.query.policy_document_id
        })
          .then((res) => {
            if (!refreshImg) {
              state.formData = Object.assign({}, res.data)
              res.data.support_content && (state.helpList = res.data.support_content)
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

    // 获取图片材料 type：要更新的图片的wich_type
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

    // 新增内容
    const addHelp = () => {
      if (state.status > 0) {
        return Toast('申请已提交，不可修改')
      }
      state.helpList.push(state.itemTpl)
    }

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
          record_type: 9
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
      acForm,
      validateForm,
      ...util,
      getData,
      jump2Policy,
      upload,
      choiceImg,
      inputTarget,
      deleteHelp,
      addHelp,
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
      margin-bottom: 0.3rem;

      .item-fields {
        box-shadow: 0 0 0.12rem #ebedf0;
        padding-bottom: 0.3rem;
        position: relative;
      }

      &:last-child {
        .item-fields {
          padding-bottom: 0;
        }
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

<style lang="less">
@import './farmer-common';
</style>
