<template>
  <div class="masterPolicyCon">
    <div class="declare_form">
      <div class="titleCon">
        <div class="titleRightSide">
          <div class="title" :class="state.ZLBFitForOld ? 'titleOld' : ''">申报材料</div>
          <div class="limitBlue" @click="popPreserve" v-if="state.preserveList && state.preserveList.length">
            <img src="https://img.hzanchu.com/acimg/0a5300c3e94504726b2dbc863578e04f.png" />
            <div class="preserveText ellipsis" :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">{{ state.bindPreserveId ? state.bindPreserveText : '关联储备项目' }}</div>
          </div>
        </div>
        <div class="fakeBtn" v-if="Route.query && (Route.query.policy_document_id || Route.query.policyId)" :class="state.ZLBFitForOld ? 'fakeBtnOld' : ''" @click="toPolicyDetail">查看政策</div>
      </div>
      <template v-for="(item, index) in state.list" :key="index">
        <div class="itemCon">
          <div class="itemTitleCon">
            <div class="itemTitle" :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">{{ index + 1 }}.{{ item.title }}</div>
            <div class="itemTitleRight" v-if="item.type == '1'">
              <!-- <div class="blueBtn" @click="gotoAnother(item)" :class="[state.ZLBFitForOld ? 'blueBtnOld' : '', state.contactInfo.project_can_apply != 1 && state.justForShow != '1' ? 'greyBtn' : '']">
                {{ state.justForShow == '1' ? '查看' : '填写' }}
              </div> -->
              <div class="blueBtn" @click="gotoAnother(item)" :class="[state.ZLBFitForOld ? 'blueBtnOld' : '', checkAbleAction() && state.justForShow != '1' ? 'greyBtn' : '']">
                {{ state.justForShow == '1' ? '查看' : '填写' }}
              </div>
            </div>
          </div>
          <div class="contentCon">
            <div class="" v-if="item.type == '1'">
              <div v-if="item.status == '1'" class="finishedBar" :class="state.ZLBFitForOld ? 'finishedBarOld' : ''">已完成</div>
              <div v-else class="redBar" :class="state.ZLBFitForOld ? 'redBarOld' : ''">待填报</div>
            </div>
            <div v-else>
              <div class="pic">
                <div class="picDescribe" :class="state.ZLBFitForOld ? 'picDescribeOld' : ''">支持上传文件格式：jpg、jpeg、png（单个文件大小在10M以内）</div>
                <div class="pic-list">
                  <div v-for="(item, sub) in state.list[index] && state.list[index].fileList && state.list[index].fileList" :key="item.id" class="image-box">
                    <van-icon class="delete" name="clear" v-if="state.justForShow != 1" @click="toDelete1(index, sub, item)" />
                    <img @click="popView(item)" :src="imgIconFilter(item)" alt />
                  </div>
                  <div class="upload-btn" @click="choiceImg1(item, index)" v-if="state.justForShow != 1">
                    <van-icon name="plus" />
                    <span>上传图片</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <van-button
      v-if="state.currentDetail.status < 45 && state.justForShow == '0'"
      @click="SubmitAction"
      class="submitBtn"
      round
      block
      :class="[state.ZLBFitForOld ? 'submitBtnOld' : '']"
      type="primary"
      >提交</van-button
    >
    <input ref="inputTarget" id="takepicture" type="file" accept="image/*" style="display: none" @change="upload" />
    <div class="stepsCon" v-if="props.showStep">
      <div class="homeTag">
        <div class="tagLine"></div>
        <div class="tagText" :class="state.ZLBFitForOld ? 'tagTextOld' : ''">审核流程</div>
        <div class="record" @click="jump2record">审核记录</div>
      </div>
      <van-steps class="resetStep" :class="state.ZLBFitForOld ? 'resetStepOld' : ''" direction="vertical" :active="state.activeStep - 1">
        <van-step>
          <h3>材料递交</h3>
          <h3 v-if="state.stage1Status">{{ state.stage1Status }}</h3>
          <p>{{ state.stage1Time }}</p>
        </van-step>
        <!-- <van-step>
          <h3>乡镇审核</h3>
          <h3 v-if="state.stage2Status">{{ state.stage2Status }}</h3>
          <p>{{ state.stage2Time }}</p>
        </van-step>
        <van-step>
          <h3>材料审核</h3>
          <h3 v-if="state.stage3Status">{{ state.stage3Status }}</h3>
          <p>{{ state.stage3Time }}</p>
        </van-step> -->
        <van-step>
          <h3>材料审核</h3>
          <h3 v-if="state.stage3Status">{{ state.stage3Status }}</h3>
          <p>{{ state.stage3Time }}</p>
        </van-step>
        <van-step>
          <h3>评审</h3>
          <h3 v-if="state.stage4Status">{{ state.stage4Status }}</h3>
          <p>{{ state.stage4Time }}</p>
        </van-step>
        <van-step>
          <h3>联审</h3>
          <h3 v-if="state.stage5Status">{{ state.stage5Status }}</h3>
          <p>{{ state.stage5Time }}</p>
          <div @click="checkEdit" v-if="state.showBridgeBtn" class="fakeAdviceBtn">查看修改意见</div>
        </van-step>
        <van-step>
          <h3>公示</h3>
          <h3 v-if="state.stage6Status">{{ state.stage6Status }}</h3>
          <p>{{ state.stage6Time }}</p>
        </van-step>
        <van-step>
          <h3>文件下达</h3>
          <h3 v-if="state.stage7Status">{{ state.stage7Status }}</h3>
          <p>{{ state.stage7Time }}</p>
        </van-step>
      </van-steps>
    </div>
    <Loading :visiable="state.visble"></Loading>
    <div class="publishCircle" :class="state.ZLBFitForOld ? 'publishCircleOld' : ''" @click="popSheet"></div>
    <!-- <div class="contact-btn-zlb" @click="consultTrigger" v-if="state.ZLBFLAG"></div> -->
    <!-- <a :href="state.contactInfo && state.contactInfo.linkman && 'tel:' + state.contactInfo.linkman.mobile" class="tel-link" v-else> </a> -->
    <van-action-sheet v-model:show="state.sheetShow" :actions="state.actions" cancel-text="取消" close-on-click-action @select="onSelect" />
    <van-popup v-model:show="state.typeShow" round position="bottom">
      <van-picker :columns="state.columns" @cancel="cancelProjectPicker()" :columns-field-names="customFieldName" @confirm="onType" :defaultIndex="state.typeDefaultIndex" />
    </van-popup>
  </div>
</template>
<script>
import { defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'
import dayjs from 'dayjs'
import { OSSLINK } from '@/util/const'
var duration = require('dayjs/plugin/duration')
dayjs.extend(duration)
import { Toast, ImagePreview, Dialog } from 'vant'
import lrz from 'lrz'
import { isZLB } from '@/util/index'
import { mgop } from '@aligov/jssdk-mgop'
import Loading from '@/components/loading'
import OSS from 'ali-oss'

const whichTypeMap = {
  3: '营业执照复印件',
  4: '土地流转协议等用地手续',
  6: '项目有关工程设计及投资情况佐证材料',
  7: '项目建设内容布置示意图及区域现状照片',
  8: '涉及生产设施用房建设的需提供设施用地审批材料',
  9: '项目建设区域内近二年各级财政资金扶持情况',
  10: '根据项目建设需要提供的其他材料'
}

export default defineComponent({
  components: { Loading },
  props: {
    showStep: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  setup(props, { emit }) {
    const Router = useRouter()
    const Route = useRoute()
    const inputTarget = ref(null)
    const state = reactive({
      sheetShow: false,
      actions: [{ name: '电话呼叫' }, { name: '咨询意见' }],
      typeDefaultIndex: 0,
      typeShow: false,
      justForShow: 0,
      fileList: [],
      client: {},
      ZLBFLAG: isZLB(),
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
      uploadIndex: 0,
      activeStep: -1,
      showInnerStep: false,
      uploadItem: {},
      list: [],
      visble: false,
      currentDetail: {},
      docIcon: 'https://img.hzanchu.com/acimg/18b4db2f0a34e503869c5ea5e515f24b.png',
      docxIcon: 'https://img.hzanchu.com/acimg/baf327802e8e5536d75a619da1e41703.png',
      rarIcon: 'https://img.hzanchu.com/acimg/21f96594470ebf4190f90b7a313207f1.png',
      pdfIcon: 'https://img.hzanchu.com/acimg/55b8d7dceaca8e5d8526f32dc8c8d603.png',
      zipIcon: 'https://img.hzanchu.com/acimg/35fc02369154eb26c99f0dac911c850b.png',
      type1Validate: true,
      type2Validate: true,
      type3Validate: true,
      type4Validate: true,
      type5Validate: true,
      type6Validate: true,
      type7Validate: true,
      type8Validate: true,
      validateList: [],
      stage1Status: '',
      stage1Time: '',
      stage2Status: '',
      stage2Time: '',
      stage3Status: '',
      stage3Time: '',
      stage4Status: '',
      stage4Time: '',
      stage5Status: '',
      stage5Time: '',
      stage6Status: '',
      stage6Time: '',
      stage7Status: '',
      stage7Time: '',
      contactInfo: {},
      preserveList: [],
      columns: [],
      bindPreserveId: '',
      bindPreserveText: '',
      showBridgeBtn: false
    })
    watch(
      () => props.showStep,
      (count, prevCount) => {
        state.showInnerStep = count
      }
    )
    const checkEdit = () => {
      sessionStorage.setItem('projectPerformLocal', JSON.stringify(state.currentDetail))
      Router.push({
        name: 'projectPerformBaseInfo'
      })
    }
    const customFieldName = {
      text: 'project_name',
      value: 'id'
    }
    const onType = (e) => {
      const { id } = e
      const { project_reserve_id } = state.currentDetail
      if (id && project_reserve_id && id != project_reserve_id) {
        Dialog.confirm({
          title: '提示',
          message: `确定更换关联储备项目为"${e.project_name}"?`
        })
          .then(() => {
            // on confirm
            state.typeShow = false
            state.bindPreserveId = e.id
            state.bindPreserveText = e.project_name
            syncAction()
          })
          .catch(() => {
            // on cancel
          })
      } else {
        state.typeShow = false
        state.bindPreserveId = e.id
        state.bindPreserveText = e.project_name
        syncAction()
      }
    }

    // 修改关联的项目储备
    const syncAction = () => {
      Request.projectChangeProjectReserveSyncForm({
        project_id: Route.query.project_id || Route.query.projectId,
        project_reserve_id: state.bindPreserveId || 0
      })
        .then((res) => {
          if (res && res.code == 0) {
            Request.getProjectSchedule({
              project_id: Route.query.project_id || Route.query.projectId
            })
              .then((res) => {
                if (res && res.code == 0) {
                  state.currentDetail = res.data.info
                }
              })
              .catch((err) => {
                console.log('err', err)
              })
          } else {
            //
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    const popPreserve = () => {
      state.typeShow = true
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
    const unite1 = (res) => {
      if (res && res.code == 0) {
        const resData = res.data
        state.list = []
        state.validateList = []
        if (resData.is_declaration == 2) {
          state.list.push({
            title: '项目申报书',
            index: '1',
            type: '1',
            status: state.currentDetail.declaration_id > 0 ? '1' : '2'
          })
          if (state.currentDetail.declaration_id > 0) {
            state.type1Validate = true
            state.validateList.push(state.type1Validate)
          } else {
            state.type1Validate = false
            state.validateList.push(state.type1Validate)
          }
        }
        if (resData.is_scheme == 2) {
          state.list.push({
            title: '项目实施方案简表',
            index: '2',
            type: '1',
            status: state.currentDetail.implement_plan_id > 0 ? '1' : '2'
          })
          if (state.currentDetail.implement_plan_id > 0) {
            state.type2Validate = true
            state.validateList.push(state.type2Validate)
          } else {
            state.type2Validate = false
            state.validateList.push(state.type2Validate)
          }
        }
        const needRequestFileWhichType = [] // 需要请求的文件的类型
        if (resData.is_business_license == 2) {
          needRequestFileWhichType.push(3)
        }
        if (resData.is_land == 2) {
          needRequestFileWhichType.push(4)
        }
        if (resData.is_device_list == 2) {
          needRequestFileWhichType
          Request.fetchProjectFacilityDetail({
            project_id: Route.query.project_id || Route.query.projectId
          }).then((res) => {
            if (res && res.code == 0) {
              state.list.push({
                title: '项目购置设备设施清单（包括型号、预估价）',
                index: '5',
                type: '1',
                status: res.data && res.data.list && res.data.list.facility_list && res.data.list.facility_list.length ? '1' : '2'
              })
            } else {
              state.list.push({
                title: '项目购置设备设施清单（包括型号、预估价）',
                index: '5',
                type: '1',
                status: '1'
              })
              Toast(res.msg)
            }
          })
        }
        if (resData.is_engineering_design == 2) {
          needRequestFileWhichType.push(6)
        }
        if (resData.is_facility == 2) {
          needRequestFileWhichType.push(8)
        }
        if (resData.is_other_material == 2) {
          needRequestFileWhichType.push(10)
        }
        if (resData.is_financial_support == 2) {
          needRequestFileWhichType.push(9)
        }
        if (resData.is_regional_photo == 2) {
          needRequestFileWhichType.push(7)
        }

        if (needRequestFileWhichType.length) {
          Promise.all(needRequestFileWhichType.map((v) => getFileByWitchtype(v))).then((res) => {
            state.list.sort((a, b) => {
              return +a.index - +b.index
            })
            state.visble = false
          })
        }
      } else {
        state.visble = false
        Toast(res.msg)
      }
    }

    // 根据witchType获取文件材料
    const getFileByWitchtype = (which_type) => {
      return new Promise((resolve, reject) => {
        Request.fetchProjectMaterialsDetail({
          project_id: Route.query.project_id || Route.query.projectId,
          which_type
        }).then((res) => {
          if (res && res.code == 0) {
            state.list.push({
              title: whichTypeMap[which_type],
              index: which_type,
              type: '2',
              status: '1',
              fileList: res.data && res.data.list ? res.data.list : []
            })
          } else {
            state.list.push({
              title: '项目建设内容布置示意图及区域现状照片',
              index: '7',
              type: '2',
              status: '1',
              fileList: []
            })
            Toast(res.msg)
          }
          resolve()
        })
      })
    }

    const fetchList = () => {
      if (Route.query.policy_document_id || Route.query.policyId) {
        state.visble = true
        Request.getProjectSchedule({
          project_id: Route.query.project_id || Route.query.projectId
        })
          .then((res) => {
            if (res && res.code == 0) {
              state.currentDetail = res.data.info
              let x, y
              switch (state.currentDetail.status) {
                case 0:
                  state.activeStep = -1
                  break
                case 1:
                  state.activeStep = 1
                  state.stage2Status = '审核中'
                  break
                case 3:
                  state.activeStep = 1
                  state.stage2Status = '不通过'

                  break
                case 9:
                  state.activeStep = 1
                  state.stage2Status = '审核不通过'
                  break
                case 10:
                  state.activeStep = 2
                  state.stage3Status = '材料审核中'
                  y = dayjs(state.currentDetail.village_start_audit_at)
                  x = dayjs(Date.now())
                  var duration = dayjs.duration(x.diff(y)).format('D')
                  console.log(duration)
                  state.stage3Time = duration + '天'
                  break
                case 11:
                  state.activeStep = 2
                  state.stage3Status = '不通过'
                  y = dayjs(state.currentDetail.declare_notice_at)
                  x = dayjs(Date.now())
                  var duration = dayjs.duration(x.diff(y)).format('D')
                  console.log(duration)
                  state.stage3Time = duration + '天'
                  break
                case 20:
                  state.activeStep = 3
                  state.stage4Status = '评审中'
                  y = dayjs(state.currentDetail.start_review_at)
                  x = dayjs(Date.now())
                  var duration = dayjs.duration(x.diff(y)).format('D')
                  console.log(duration)
                  state.stage4Time = duration + '天'
                  break
                case 21:
                  state.activeStep = 3
                  state.stage4Status = '不通过'
                  y = dayjs(state.currentDetail.review_notice_at)
                  x = dayjs(Date.now())
                  var duration = dayjs.duration(x.diff(y)).format('D')
                  console.log(duration)
                  state.stage4Time = duration + '天'
                  break
                case 29:
                  state.activeStep = 3
                  state.stage4Status = '不通过'
                  y = dayjs(state.currentDetail.review_nopass_at)
                  x = dayjs(Date.now())
                  var duration = dayjs.duration(x.diff(y)).format('D')
                  console.log(duration)
                  state.stage4Time = duration + '天'
                  break
                case 30:
                  state.activeStep = 4
                  state.stage5Status = '联审中'
                  y = dayjs(state.currentDetail.start_unit_at)
                  x = dayjs(Date.now())
                  var duration = dayjs.duration(x.diff(y)).format('D')
                  console.log(duration)
                  state.stage5Time = duration + '天'
                  break
                case 31:
                  state.activeStep = 4
                  state.stage5Status = '不通过'
                  y = dayjs(state.currentDetail.unit_notice_at)
                  x = dayjs(Date.now())
                  var duration = dayjs.duration(x.diff(y)).format('D')
                  console.log(duration)
                  state.stage5Time = duration + '天'
                  break
                case 39:
                  state.activeStep = 4
                  state.stage5Status = '不通过'
                  y = dayjs(state.currentDetail.unit_nopass_at)
                  x = dayjs(Date.now())
                  var duration = dayjs.duration(x.diff(y)).format('D')
                  console.log(duration)
                  state.stage5Time = duration + '天'
                  break
                case 40:
                  state.activeStep = 5
                  state.stage6Status = '公示中'
                  y = dayjs(state.currentDetail.pass_at)
                  x = dayjs(Date.now())
                  var duration = dayjs.duration(x.diff(y)).format('D')
                  console.log(duration)
                  state.stage6Time = duration + '天'
                  break
                case 43:
                  state.activeStep = 5
                  state.stage6Status = '不通过'
                  y = dayjs(state.currentDetail.pass_at)
                  x = dayjs(Date.now())
                  var duration = dayjs.duration(x.diff(y)).format('D')
                  console.log(duration)
                  state.stage6Time = duration + '天'
                  break
                case 45:
                case 50:
                case 51:
                case 52:
                case 59:
                case 60:
                case 61:
                case 62:
                case 69:
                case 70:
                case 71:
                case 72:
                case 73:
                case 74:
                case 79:
                  state.activeStep = 6
                  //   y = dayjs(state.currentDetail.pass_at)
                  //   x = dayjs(Date.now())
                  //   var duration = dayjs.duration(x.diff(y)).format('D')
                  //   console.log(duration)
                  //   state.stage7Time = duration + '天'
                  break
              }
              const { project_name, project_reserve_id } = res.data.info
              if (project_name && project_reserve_id) {
                // 默认显示关联的项目储备
                state.bindPreserveText = project_name
                state.bindPreserveId = project_reserve_id
              }
              //   console.log('state.currentDetail.status', state.currentDetail.status)
              state.showBridgeBtn = state.currentDetail && state.currentDetail.project_baseinfo_backup_info && state.currentDetail.project_baseinfo_backup_info.project_id ? true : false
              state.justForShow =
                state.currentDetail.status == 40 ||
                state.currentDetail.status == 1 ||
                state.currentDetail.status == 10 ||
                state.currentDetail.status == 20 ||
                state.currentDetail.status == 30 ||
                state.currentDetail.status >= 45
                  ? 1
                  : 0
              Request.getPolicyInfo({
                id: Route.query.policy_document_id || Route.query.policyId
              })
                .then((res) => {
                  unite1(res)
                })
                .catch((err) => {
                  console.log('err', err)
                  state.visble = false
                })
            } else {
              Toast(res.msg)
              state.visble = false
            }
          })
          .catch((err) => {
            console.log('err', err)
            state.visble = false
          })
      }
    }
    onMounted(() => {
      fetchList()
      fetchContact()
      fetchPreserveData()
      if (state.ZLBFLAG) {
        fetchOssinfo()
      }
    })
    const fetchPreserveData = () => {
      Request.fetchProjectReserveList({
        search_status: 2,
        page: 1,
        pagesize: 9999999
      })
        .then((res) => {
          if (res && res.code == 0) {
            state.preserveList = res.data.data
            state.columns = res.data.data
          } else {
            state.preserveList = []
            state.columns = []
          }
        })
        .catch((err) => {
          console.log('err', err)
          state.preserveList = []
          state.columns = []
        })
    }
    const fetchContact = () => {
      if (state.ZLBFLAG) {
        Request.fetchPolicyDocumentInfoMGOP({
          id: Route.query.policyId || Route.query.policy_document_id
        }).then((res) => {
          if (res) {
            state.contactInfo = res.data.data
          } else {
            Toast(res.msg)
          }
        })
      } else {
        Request.fetchPolicyDocumentInfo({
          id: Route.query.policyId || Route.query.policy_document_id
        }).then((res) => {
          if (res && res.code == 0) {
            state.contactInfo = res.data
          } else {
            Toast(res.msg)
          }
        })
      }
    }
    const checkDetail = (item) => {
      Router.push({
        name: 'policyDetail',
        query: {
          id: item.id
        }
      })
    }
    const toPolicyDetail = () => {
      Router.push({
        name: 'policyDetail',
        query: {
          id: Route.query.policy_document_id || Route.query.policyId
        }
      })
    }
    const upload = (e) => {
      let fileObj = e.target.files[0]
      // console.log('fileObj')
      console.log(fileObj)
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
                  fileOriginName: fileObj.name.split('.')[0],
                  fileUrl: state.fileList[0].url,
                  which_type: state.uploadItem.index,
                  policy_document_id: Route.query.policy_document_id || Route.query.policyId,
                  project_id: Route.query.project_id || Route.query.projectId
                }
                state.fileList = []
                Request.projectUploadMaterials(newParams).then((res) => {
                  if (res.code === 0) {
                    fetchList()
                  }
                })
              })
            }
          } else {
            let params = new FormData()
            params.append('file', result.file, fileObj.name)
            params.append('which_type', state.uploadItem.index)
            params.append('policy_document_id', Route.query.policy_document_id || Route.query.policyId)
            params.append('project_id', Route.query.project_id || Route.query.projectId)
            Request.projectUploadMaterials(params).then((res) => {
              if (res.code === 0) {
                fetchList()
                e.target.value = ''
              }
            })
          }
        })
      } else {
        Toast('支持上传文件格式：jpg、jpeg、png')
      }
    }
    const toDelete1 = (index, sub, item) => {
      Request.projectRemoveMaterials({
        materials_id: item.id
      }).then((res) => {
        if (res && res.code == 0) {
          fetchList()
          //   state.list[index].fileList.splice(sub, 1)
        } else {
          Toast(res.msg)
        }
      })
    }
    const choiceImg1 = (item, index) => {
      state.uploadIndex = index
      state.uploadItem = item
      inputTarget.value.click()
    }
    const checkAbleAction = () => {
      if (state.currentDetail.is_draft) {
        if (state.contactInfo.project_can_apply != 1) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
    const gotoAnother = (item) => {
      //   if (state.contactInfo.project_can_apply == 1) {
      let source = checkAbleAction()
      if (!source) {
        if (item && item.index) {
          if (item.index == 1) {
            Router.push({
              name: 'declareReport',
              query: {
                project_id: Route.query.project_id || Route.query.projectId,
                policy_document_id: Route.query.policy_document_id || Route.query.policyId,
                justForShow: state.justForShow,
                status: item.status,
                mobile: state.contactInfo.linkman.mobile,
                project_reserve_id: state.currentDetail.project_reserve_id,
                is_declaration_reserve_change: state.currentDetail.is_declaration_reserve_change
              }
            })
          }
          if (item.index == 2) {
            Router.push({
              name: 'declareImplementationPlant',
              query: {
                project_id: Route.query.project_id || Route.query.projectId,
                policy_document_id: Route.query.policy_document_id || Route.query.policyId,
                area_ids: encodeURIComponent(state.currentDetail.area_ids),
                justForShow: state.justForShow,
                status: item.status,
                mobile: state.contactInfo.linkman.mobile,
                project_reserve_id: state.currentDetail.project_reserve_id,
                is_implement_plan_reserve_change: state.currentDetail.is_implement_plan_reserve_change
              }
            })
          }
          if (item.index == 5) {
            Router.push({
              name: 'projectEquipment',
              query: {
                project_id: Route.query.project_id || Route.query.projectId,
                policy_document_id: Route.query.policy_document_id || Route.query.policyId,
                justForShow: state.justForShow,
                mobile: state.contactInfo.linkman.mobile
              }
            })
          }
        }
      } else {
        if (item && item.index) {
          if (item.index == 1) {
            Router.push({
              name: 'declareReport',
              query: {
                project_id: Route.query.project_id || Route.query.projectId,
                policy_document_id: Route.query.policy_document_id || Route.query.policyId,
                justForShow: state.justForShow,
                status: item.status,
                mobile: state.contactInfo.linkman.mobile,
                project_reserve_id: state.currentDetail.project_reserve_id,
                is_declaration_reserve_change: state.currentDetail.is_declaration_reserve_change
              }
            })
          }
          if (item.index == 2) {
            Router.push({
              name: 'declareImplementationPlant',
              query: {
                project_id: Route.query.project_id || Route.query.projectId,
                policy_document_id: Route.query.policy_document_id || Route.query.policyId,
                area_ids: encodeURIComponent(state.currentDetail.area_ids),
                justForShow: state.justForShow,
                status: item.status,
                mobile: state.contactInfo.linkman.mobile,
                project_reserve_id: state.currentDetail.project_reserve_id,
                is_implement_plan_reserve_change: state.currentDetail.is_implement_plan_reserve_change
              }
            })
          }
          if (item.index == 5) {
            Router.push({
              name: 'projectEquipment',
              query: {
                project_id: Route.query.project_id || Route.query.projectId,
                policy_document_id: Route.query.policy_document_id || Route.query.policyId,
                justForShow: state.justForShow,
                mobile: state.contactInfo.linkman.mobile
              }
            })
          }
        }
      }
    }
    const SubmitAction = () => {
      console.log(state.validateList)
      let validate = state.validateList.every((ele) => {
        return ele
      })
      if (validate) {
        state.visble = true
        Request.submitProjectAction({
          project_id: Route.query.project_id || Route.query.projectId
        })
          .then((res) => {
            if (res && res.code == 0) {
              Toast('提交成功')
              Router.replace({
                name: 'program'
              })
            } else {
              Toast(res.msg)
            }
          })
          .finally(() => {
            state.visble = false
          })
      } else {
        Dialog.confirm({
          title: '提示',
          message: '您的申报材料未补充完整，请将必填项补充完整！'
        })
          .then(() => {
            // on confirm
          })
          .catch(() => {
            // on cancel
          })
      }
    }
    const imgIconFilter = (ele) => {
      let part =
        ele.suffix.toUpperCase() == 'PNG' || ele.suffix.toUpperCase() == 'JPG' || ele.suffix.toUpperCase() == 'JPEG'
          ? ele.src
          : ele.suffix.toUpperCase() == 'ZIP'
          ? state.zipIcon
          : ele.suffix.toUpperCase() == 'RAR'
          ? state.rarIcon
          : ele.suffix.toUpperCase() == 'PDF'
          ? state.pdfIcon
          : ele.suffix.toUpperCase() == 'DOC'
          ? state.docIcon
          : ele.suffix.toUpperCase() == 'DOCX'
          ? state.docxIcon
          : ''
      let obj = part
      return obj
    }
    const popView = (item) => {
      let part =
        item.suffix.toUpperCase() == 'PNG' || item.suffix.toUpperCase() == 'JPG' || item.suffix.toUpperCase() == 'JPEG'
          ? item.src
          : item.suffix.toUpperCase() == 'ZIP'
          ? state.zipIcon
          : item.suffix.toUpperCase() == 'RAR'
          ? state.rarIcon
          : item.suffix.toUpperCase() == 'PDF'
          ? state.pdfIcon
          : item.suffix.toUpperCase() == 'DOC'
          ? state.docIcon
          : item.suffix.toUpperCase() == 'DOCX'
          ? state.docxIcon
          : ''
      ImagePreview({
        images: [part],
        closeable: true
      })
    }
    const consultTrigger = () => {
      if (state.contactInfo.linkman && state.contactInfo.linkman.mobile) {
        ZWJSBridge.phoneCall({
          corpId: state.contactInfo.linkman.mobile
        })
          .then((res) => {
            console.log(res)
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }

    // 跳转审核记录
    const jump2record = () => {
      Router.push({
        name: 'approvalRecord',
        query: {
          project_id: Route.query.projectId,
          record_type: 1
        }
      })
    }

    // 取消关联项目储备
    const cancelProjectPicker = () => {
      state.bindPreserveId = 0
      syncAction()
      state.typeShow = false
    }
    const popSheet = () => {
      state.sheetShow = true
    }
    const onSelect = (item) => {
      state.sheetShow = false
      if (item.name == '电话呼叫') {
        if (state.ZLBFLAG) {
          consultTrigger()
        } else {
          window.location.href = 'tel:' + state.contactInfo.linkman.mobile
        }
      } else {
        Router.push({
          name: 'support'
        })
      }
    }

    return {
      props,
      checkEdit,
      popView,
      imgIconFilter,
      state,
      Route,
      checkDetail,
      dayjs,
      toPolicyDetail,
      upload,
      toDelete1,
      choiceImg1,
      inputTarget,
      gotoAnother,
      SubmitAction,
      consultTrigger,
      jump2record,
      fetchPreserveData,
      onType,
      customFieldName,
      popPreserve,
      syncAction,
      cancelProjectPicker,
      popSheet,
      onSelect,
      checkAbleAction
    }
  }
})
</script>

<style scoped lang="less">
.masterPolicyCon {
  box-sizing: border-box;
  padding: 0.3rem;
  width: 100%;
}

.title {
  font-size: 0.34rem;
  font-weight: bold;
  color: #000;
}
.titleOld {
  font-size: 0.42rem;
}
.titleCon {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  margin-bottom: 0.3rem;
}
.titleRightSide {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
}
.fakeBtn {
  padding-left: 0.1rem;
  padding-right: 0.1rem;
  width: 1.6rem;
  display: flex;
  justify-content: center;
  height: 0.5rem;
  color: #1b82ec;
  border: 1px solid #1b82ec;
  border-radius: 0.25rem;
  box-sizing: border-box;
  line-height: 0.5rem;
}
.fakeBtnOld {
  font-size: 0.3rem;
}
.blueBtn {
  width: 100%;
  display: flex;
  justify-content: center;
  height: 0.5rem;
  color: #fff;
  border: 1px solid #1b82ec;
  background-color: #1b82ec;
  border-radius: 0.25rem;
  box-sizing: border-box;
  line-height: 0.5rem;
}
.blueBtnOld {
  font-size: 0.35rem;
}
.greyBtn {
  background-color: #ccc !important;
  border-color: #ccc !important;
}
.limitBlue {
  //   width: auto !important;
  //   padding-left: 0.2rem;
  //   padding-right: 0.2rem;
  margin-left: 0.2rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  img {
    width: 0.28rem;
    height: 0.28rem;
  }
  .preserveText {
    font-size: 0.28rem;
    color: #1b82ec;
    text-decoration: underline;
    max-width: 2.6rem;
  }
}
.declare_form {
  position: relative;
  border-radius: 0.15rem;
  padding: 0.3rem;
  overflow: hidden;
  background-color: #fff;
}
.submitBtn {
  width: 73.33%;
  margin: 0 auto;
  font-size: 0.32rem;
  font-weight: 500;
  color: #fff;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
.submitBtnOld {
  font-size: 0.45rem;
}
.saveBtn {
  height: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
}
.itemCon {
  margin-bottom: 0.3rem;
}
.itemTitleCon {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  align-content: center;
  min-height: 0.5rem;
}
.itemTitle {
  width: 74%;
  font-size: 0.28rem;
  line-height: 0.46rem;
  color: #000;
}
.itemTitleRight {
  width: 1.6rem;
}
.itemTitleOld {
  font-size: 0.35rem;
}

.finishedBar {
  width: 100%;
  height: 0.6rem;
  background-color: rgba(26, 130, 236, 0.2);
  font-size: 0.28rem;
  color: #1b82ec;
  padding-right: 0.3rem;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  align-content: center;
  margin-top: 25px;
}

.redBar {
  width: 100%;
  height: 0.6rem;
  background-color: rgba(249, 32, 34, 0.2);
  font-size: 0.28rem;
  color: #fa2222;
  padding-right: 0.3rem;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  align-content: center;
  margin-top: 25px;
}
.finishedBarOld {
  font-size: 0.32rem;
}
.redBarOld {
  font-size: 0.32rem;
}
.pic {
  background-color: #fff;
  box-sizing: border-box;
  .picDescribe {
    font-size: 0.22rem;
    color: #999;
    font-size: 0.24rem;
    line-height: 0.4rem;
  }
  .picDescribeOld {
    font-size: 0.3rem;
  }
  p {
    font-size: 0.28rem;
    color: #666;
    margin-left: 0.1rem;
  }
  .pic-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .image-box {
      height: 1.8rem;
      width: 28%;
      position: relative;
      margin: 0.3rem 0.2rem 0 0;
      .delete {
        position: absolute;
        font-size: 0.36rem;
        top: -0.18rem;
        right: -0.18rem;
        color: #ccc;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    .upload-btn {
      width: 30%;
      //   height: 2rem;
      box-sizing: border-box;
      border: 2px dashed #ccc;
      text-align: center;
      overflow: hidden;
      border-radius: 10px;
      margin: 0.3rem 0.2rem 0 0;
      .van-icon {
        font-size: 0.8rem;
        color: #ccc;
        margin-top: 0.3rem;
      }
      span {
        font-size: 0.26rem;
        color: #ccc;
        margin-top: 0.2rem;
        display: block;
        margin-bottom: 0.3rem;
      }
    }
  }
}
.pic:nth-last-child(1) {
  border: 0;
}
.stepsCon {
  margin-top: 0.5rem;
  background-color: #fff;
  padding-top: 0.3rem;
  box-sizing: border-box;
}
.resetStep {
  margin-left: 0.2rem;
}
.resetStepOld {
  h3 {
    font-size: 0.35rem !important;
  }
  p {
    font-size: 0.35rem !important;
  }
}
.tagLine {
  width: 0.05rem;
  height: 0.3rem;
  margin-top: 0.07rem;
  background: #1b82ec;
  opacity: 1;
  border-radius: 0.03rem;
  margin-right: 0.06rem;
}
.tagText {
  font-size: 0.3rem;
  line-height: 0.45rem;
  color: #333;
}
.tagTextOld {
  font-size: 0.4rem;
}
.homeTag {
  margin-left: 0.3rem;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: center;
  box-sizing: border-box;
  position: relative;
}
.record {
  width: 1.6rem;
  height: 0.5rem;
  background: #1b82ec;
  border: 1px solid #1b82ec;
  border-radius: 0.3rem;
  color: #fff;
  font-size: 0.26rem;
  text-align: center;
  line-height: 0.5rem;
  position: absolute;
  right: 0.3rem;
  top: 0;
}
.fakeAdviceBtn {
  width: 2rem;
  height: 0.5rem;
  background: #1b82ec;
  border: 1px solid #1b82ec;
  border-radius: 0.3rem;
  color: #fff;
  font-size: 0.26rem;
  text-align: center;
  line-height: 0.5rem;
}
.stepsCon :deep(.van-step__circle) {
  background-color: rgba(13, 115, 255, 0.3);
}
.stepsCon :deep(.van-step__circle-container) {
  font-size: 0.35rem;
}
.stepsCon :deep(.van-step__circle) {
  width: 0.3rem;
  height: 0.3rem;
}

.stepsCon :deep(.van-step--vertical) {
  &:not(:last-child) {
    &::after {
      border-width: 0;
    }
  }
}
.publishCircle {
  position: fixed;
  right: 0;
  bottom: 210px;
  width: 1.44rem;
  height: 1.44rem;
  border-radius: 0.72rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  background: url('https://img.hzanchu.com/acimg/c9f781d6fec5ef2d76f46689b9e15d99.png') no-repeat;
  background-size: 100% 100%;
  .tel-link,
  .contact-btn-zlb {
    width: 100%;
    height: 100%;
    border-radius: 51%;
  }
}
.publishCircleOld {
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 0.9rem;
}
</style>
