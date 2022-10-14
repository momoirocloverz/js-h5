<template>
  <div class="help-farmer-container" :class="{ 'fit-old': ZLBFitForOld }">
    <div class="panel">
      <div class="form-conatiner">
        <div class="form-title">
          <span>基本信息</span>
          <div class="policy-btn" @click="jump2Policy">查看政策</div>
        </div>
        <van-form @submit="onSubmit" @failed="onFailed" :disabled="status > 0" label-width="200" validate-trigger="onSubmit" ref="acForm">
          <van-field
            v-model="formData.subject_name"
            required
            label="申报使用主体名称"
            name="subject_name"
            placeholder="请输入使用主体姓名"
            :rules="[{ required: true, message: '请填写使用主体姓名' }]"
          >
          </van-field>

          <van-field v-model="formData.city" required readonly name="city" label="地址" placeholder="选择地址" :rules="[{ required: true, message: '请选择地址' }]" />
          <van-cell title="" class="van-cell_noname">
            <template #value>
              <van-field v-model="formData.address" required name="address" label-width="0" input-align="left" placeholder="请输入详细地址" :rules="[{ required: true, message: '请填写详细地址' }]" />
            </template>
          </van-cell>
          <van-field v-model="formData.apply_name" required name="apply_name" label="申报人姓名" placeholder="请输入申报人姓名" :rules="[{ required: true, message: '请填写申报人姓名' }]" />
          <van-field
            v-model="formData.apply_mobile"
            required
            type="tel"
            name="apply_mobile"
            label="申报人联系电话"
            placeholder="请输入电话"
            :rules="[{ required: true, message: '请填写申报人电话' }]"
          />
          <van-field v-model="formData.manure_from" required name="manure_from" label="肥料来源" placeholder="请输入来源" :rules="[{ required: true, message: '请填写来源' }]" />
          <van-field v-model="formData.use_num" required type="number" name="use_num" label="使用数量(吨)" placeholder="请输入数量" :rules="[{ required: true, message: '请填写数量' }]" />
          <van-field v-model="formData.use_crop" required name="use_crop" label="应用作物" placeholder="请输入作物名称" :rules="[{ required: true, message: '请填写作物名称' }]" />
          <van-field v-model="formData.use_area" required type="number" name="use_area" label="应用面积(亩)" placeholder="请输入面积" :rules="[{ required: true, message: '请填写面积' }]" />

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

          <div class="form-title">使用情况</div>
          <div class="batch-content">
            <div class="batch-item" v-for="(batch, index) in batchList" :key="index">
              <div class="del-btn" v-if="index" @click="deleteBatch">删除</div>
              <van-field
                required
                readonly
                v-model="batch.start_at"
                class="batch-date"
                :name="`batchRange${index}`"
                :label="`批次${num2Char(index)}使用日期`"
                @click="openStartDatePicker(index)"
                placeholder="请选择起始日期"
                :rules="[{ required: true, message: '请填写使用起始日期' }]"
              />
              <span class="date-line">至</span>
              <van-field
                required
                readonly
                :label="`批次${num2Char(index)}使用日期`"
                v-model="batch.end_at"
                class="batch-date"
                :name="`batchRange${index}`"
                @click="openEndDatePicker(index)"
                placeholder="请选择结束日期"
                :rules="[{ required: true, message: '请填写使用结束日期' }]"
              />
            </div>
            <div class="add-batch" @click="addBatch">
              <img src="https://img.hzanchu.com/acimg/0ef025121076713f8ae14f333b521f70.png" alt="新增" class="icon" />
              <div class="add-text">新增批次</div>
            </div>
          </div>

          <div class="form-title">补贴信息</div>
          <van-field
            v-model="formData.subsidy_amount"
            required
            type="number"
            label="申请补贴资金(元)"
            name="subsidy_amount"
            placeholder="请输入金额"
            :rules="[{ required: true, message: '请填写金额' }]"
          >
          </van-field>
          <van-field v-model="formData.purchas_amount" required type="number" label="采购价格(元)" name="purchas_amount" placeholder="请输入价格" :rules="[{ required: true, message: '请填写价格' }]">
          </van-field>

          <div class="form-title">材料上传</div>

          <AcUploader :fileList="cghtFileList" title="1.采购合同" :witchType="11" @afterRead="cghtAfterRead" @deleteCb="getData" @choiceImg="choiceImg" :status="status"></AcUploader>
          <AcUploader :fileList="fpFileList" title="2.发票" :witchType="12" @afterRead="fpAfterRead" @deleteCb="getData" @choiceImg="choiceImg" :status="status"></AcUploader>
          <AcUploader
            :fileList="cgpjFileList"
            title="3.采购凭据（销售方的销货票客户联、销货方出库单客户联"
            :witchType="13"
            @afterRead="cgpjAfterRead"
            @deleteCb="getData"
            @choiceImg="choiceImg"
            :status="status"
          ></AcUploader>
          <AcUploader
            :fileList="dkzfFileList"
            title="4.货款支付凭证（不得现金支付）"
            :witchType="14"
            @afterRead="dkzfpzAfterRead"
            @deleteCb="getData"
            @choiceImg="choiceImg"
            :status="status"
          ></AcUploader>
          <AcUploader :fileList="tdlzhtFileList" title="5.土地流转合同" :witchType="15" @afterRead="tdlzhtAfterRead" @deleteCb="getData" @choiceImg="choiceImg" :status="status"></AcUploader>
          <AcUploader
            :fileList="syzpFileList"
            title="6.有关标有地址时间水印照片（一车一照及不同批次肥料使用过程照片若干张"
            :witchType="16"
            @afterRead="syzpAfterRead"
            @deleteCb="getData"
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

    <div class="bottom-btn" v-if="status != 62">
      <div class="btn plain" style="width: 33.333%" @click="onSubmit(null, true)">保存草稿</div>
      <div class="btn" style="width: 66.666%" @click="validateForm">提交</div>
    </div>

    <van-popup v-model:show="showStartDatePicker" round position="bottom"
      >.
      <van-datetime-picker v-model="select_start_date" type="date" title="选择起始日期" @cancel="showStartDatePicker = false" @confirm="confirmStartDate" :min-date="minDate" :max-date="maxDate" />
    </van-popup>

    <van-popup v-model:show="showEndDatePicker" round position="bottom">
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
      currentBatchIndex: ref(null), // 当前操作的批次索引
      formData: reactive({
        subject_name: ref(''),
        city: ref(''),
        address: ref(''),
        apply_name: ref(''),
        apply_mobile: ref(''),
        manure_from: ref(''), // 肥料来源
        use_num: ref(''), // 肥料使用数量吨
        use_crop: ref(''), // 应用作物
        use_area: ref(''), // 应用面积
        subject_promise: ref(''), // 承诺
        subsidy_amount: ref(''), // 补贴资金
        purchas_amount: ref('') // 采购价格
      }),
      loading: false,
      batchRange: ref(''), // 批次日期范围
      batchList: reactive([{ start_at: ref(''), end_at: ref('') }]), // 批次信息
      selectingBatchIndex: ref(null), // 当前选择的批次索引
      calenderShow: false, // 范围日历
      defaultDate: ref([]), // 日历默认显示日期
      status: ref(0), // 审核状态
      addressData: ref([]), // 地址数据
      cghtFileList: ref([]), // 采购合同图片列表
      fpFileList: ref([]),
      cgpjFileList: ref([]),
      dkzfFileList: ref([]),
      tdlzhtFileList: ref([]),
      syzpFileList: ref([]),
      fileList: ref([]),
      fileListMap: {
        11: 'cghtFileList',
        12: 'fpFileList',
        13: 'cgpjFileList',
        14: 'dkzfFileList',
        15: 'tdlzhtFileList',
        16: 'syzpFileList'
      },
      imgList: ref(null),
      link_tel: '',
      currentWitchType: ref(null)
    })
    let acForm = ref(null)
    let inputTarget = ref(null)

    // 1.采购合同选择图片回调
    const cghtAfterRead = (e) => {
      // console.log('采购合同上传回调', e)
      uploadImage(e, 11)
    }
    // 2.发票选择图片回调
    const fpAfterRead = (e) => {
      // console.log('发票选择图片回调', e)
      uploadImage(e, 12)
    }
    // 3.采购凭据选择图片回调
    const cgpjAfterRead = (e) => {
      // console.log('采购凭据选择图片回调', e)
      uploadImage(e, 13)
    }
    // 4.货款支付凭证选择图片回调
    const dkzfpzAfterRead = (e) => {
      // console.log('货款支付凭证选择图片回调', e)
      uploadImage(e, 14)
    }
    // 5.土地流转合同选择图片回调
    const tdlzhtAfterRead = (e) => {
      // console.log('土地流转合同选择图片回调', e)
      uploadImage(e, 15)
    }
    // 6.水印照片选择图片回调
    const syzpAfterRead = (e) => {
      // console.log('水印照片选择图片回调', e)
      uploadImage(e, 16)
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
                state.fileList = [] // 清空
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
      if (state.status > 0) {
        return Toast('申请已提交，请耐心等待审核结果')
      }
      const { batchList } = state
      const params = {
        ...state.formData,
        use_condition: JSON.stringify(batchList),
        form_status: isDraft ? 0 : 1,
        project_id: Route.query.project_id
      }

      if (!isDraft && !checkImages()) {
        return Toast('缺少材料，每类材料都需上传')
      }

      state.loading = true
      // return console.log('提交参数', params)
      Request.applyYjfSubsidy(params)
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

    // key: 日历组件model; index: 点击的批次索引
    const showCalender = (key, index) => {
      if (state.status > 0) {
        return Toast('申请已提交，不可修改')
      }
      state[key] = true
      state.selectingBatchIndex = index
    }

    const onCalenderConfirm = (e) => {
      // console.log('范围日历选择回调', e)
      if (e[0] && e[1]) {
        let { selectingBatchIndex, batchList } = state
        batchList[selectingBatchIndex].batchDate = `${dayjs(e[0]).format('YYYY/MM/DD')}-${dayjs(e[1]).format('YYYY/MM/DD')}`
        state.calenderShow = false
      }
    }

    // 日历组件唤起触发
    const onCalenderOpen = () => {
      const { selectingBatchIndex, batchList } = state
      if (selectingBatchIndex >= 0 && batchList[selectingBatchIndex].batchDate) {
        const batchDate = batchList[selectingBatchIndex].batchDate
        let [start, end] = [batchDate.split('-')[0], batchDate.split('-')[1]]
        state.defaultDate = [dayjs(start).toDate(), dayjs(end).toDate()]
      } else {
        state.defaultDate = [(dayjs().toDate(), dayjs().toDate())]
      }
    }

    // 新增批次
    const addBatch = () => {
      if (state.status > 0) {
        return Toast('申请已提交，不可修改')
      }
      state.batchList.push({ start_at: ref(''), end_at: ref('') })
    }

    // 删除批次
    const deleteBatch = () => {
      if (state.status > 0) {
        return Toast('申请已提交，不可修改')
      }
      state.batchList.pop()
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
        Request.getYjfSubsidy({
          policy_document_id: Route.query.policy_document_id,
          project_id: Route.query.project_id
        })
          .then((res) => {
            if (!refreshImg) {
              state.formData = Object.assign({}, res.data)
              const { use_condition } = res.data
              if (use_condition) {
                state.batchList = use_condition.map((item) => {
                  if (item.hasOwnProperty('batchDate')) {
                    // 老数据结构
                    return {
                      start_at: item.batchDate.split('-')[0],
                      end_at: item.batchDate.split('-')[1]
                    }
                  } else {
                    return item
                  }
                })
              }

              delete res.data.use_condition
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

    onMounted(() => {
      Promise.all([getAddressData(), getData()]).then((res) => {
        createAddressStr()
      })
      if (state.ZLBFLAG) {
        fetchOssinfo()
      }
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

    const choiceImg = (witchType) => {
      state.currentWitchType = witchType
      inputTarget.value.click()
    }

    // 跳转审核记录
    const jump2record = () => {
      Router.push({
        name: 'approvalRecord',
        query: {
          project_id: Route.query.project_id,
          record_type: 5
        }
      })
    }

    // 唤起日期选择 index：批次索引
    const openStartDatePicker = (index) => {
      if (state.status > 0) {
        return Toast('申请已提交，不可修改')
      }
      state.currentBatchIndex = index
      const { batchList } = state
      if (batchList[index] && batchList[index].start_at) {
        state.select_start_date = dayjs(batchList[index].start_at).toDate()
      }
      state.showStartDatePicker = true
    }
    const openEndDatePicker = (index) => {
      if (state.status > 0) {
        return Toast('申请已提交，不可修改')
      }
      state.currentBatchIndex = index
      const { batchList } = state
      if (batchList[index] && batchList[index].end_at) {
        state.select_end_date = dayjs(batchList[index].end_at).toDate()
      }
      state.showEndDatePicker = true
    }
    const confirmStartDate = (e) => {
      const { currentBatchIndex } = state
      if (currentBatchIndex >= 0) {
        state.batchList[currentBatchIndex].start_at = dayjs(e).format('YYYY/MM/DD')
      }
      state.showStartDatePicker = false
    }
    const confirmEndDate = (e) => {
      const { currentBatchIndex } = state
      if (currentBatchIndex >= 0) {
        state.batchList[currentBatchIndex].end_at = dayjs(e).format('YYYY/MM/DD')
      }
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
      showCalender,
      onCalenderConfirm,
      onCalenderOpen,
      cghtAfterRead,
      fpAfterRead,
      cgpjAfterRead,
      dkzfpzAfterRead,
      tdlzhtAfterRead,
      syzpAfterRead,
      addBatch,
      acForm,
      validateForm,
      ...util,
      getData,
      jump2Policy,
      upload,
      choiceImg,
      inputTarget,
      deleteBatch,
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
    .batch-content {
      .batch-item {
        position: relative;
        display: flex;
        // align-items: flex-end;

        :deep(.batch-date) {
          &:last-child {
            .van-cell__title {
              color: #fff;

              &::before {
                content: none;
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

        .date-line {
          height: 0.8rem;
          line-height: 0.8rem;
          position: absolute;
          left: 50%;
          top: 0.9rem;
          transform: translateX(-50%);
          z-index: 1;
        }

        .van-cell {
          padding-bottom: 0;

          &.batch-date {
            .van-cell__value {
              width: 45%;
            }
          }
        }
      }

      .add-batch {
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
}
</style>

<style lang="less">
@import './farmer-common';
</style>
