<template>
  <div class="serve-box">
    <div class="whiteIconCon">
      <van-icon name="arrow-left" class="whiteIcon" @click="goBack" />
    </div>
    <!-- <div class="serve-box-header">
        语音找服务
    </div> -->
    <div class="serve-box-center">
      <img src="https://img.hzanchu.com/acimg/df8df39b457b6aff24b269dccaaee290.png" alt="" />
      <div class="talking-center">
        <div class="talking-box">请说出您要找的申报内容关键字，系统将为您找到相应的申报入口。</div>
        <div v-if="state.voiceValue && state.isShowBox" class="talking-right-box">
          {{ state.voiceValue }}
        </div>
        <div v-if="(state.dataList || []).length == 0 && state.finished" class="talking-box">未搜索到匹配内容，请切换关键字重新搜索。</div>
        <div v-if="(state.dataList || []).length > 0" class="talking-box">
          <div>
            <p>为您匹配到以下内容:</p>
            <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh">
              <van-list v-model:loading="state.loading" :finished="state.finished" :immediate-check="false">
                <div class="listCon">
                  <template v-for="(item, index) in state.dataList" :key="index">
                    <div class="itemCon">
                      <div class="itemInnerCon">
                        <div class="leftCon" @click="checkDetail(item)">
                          <div class="title" :class="state.ZLBFitForOld ? 'titleOld' : ''">
                            {{ item.title }}
                          </div>
                          <div class="time" :class="state.ZLBFitForOld ? 'timeOld' : ''">
                            {{ dayjs(item.issue_at).format('YYYY-MM-DD') }}
                          </div>
                        </div>
                        <div class="rightCon">
                          <van-button
                            class="submitBtn"
                            round
                            :disabled="item.project_can_apply != 1 || (item.category_name == '竞争性财政支农项目' ? state.projectSwitch != 1 : state.projectSubSwitch != 1)"
                            :class="state.ZLBFitForOld ? 'submitBtnOld' : ''"
                            type="primary"
                            @click="popAddress(item, state.projectSwitch)"
                          >
                            <div>
                              {{
                                item.project_can_apply != 1
                                  ? '申报已截止'
                                  : item.category_name == '竞争性财政支农项目'
                                  ? state.projectSubSwitch == 1
                                    ? '去申报'
                                    : '申报结束'
                                  : state.projectSubSwitch == 1
                                  ? '去申报'
                                  : '申报结束'
                              }}
                            </div>
                          </van-button>
                        </div>
                      </div>
                    </div>
                  </template>
                  <van-button class="checkBtn" round type="default" @touchstart="showTranscribePopup" @touchend="end"> 重新识别 </van-button>
                </div>
              </van-list>
            </van-pull-refresh>
          </div>
        </div>
      </div>
    </div>
    <div class="serve-box-feet">
      <van-button round type="primary" @click="showTranscribePopup" style="width: 100%; font-size: 0.3rem"> 点击开始录音 </van-button>
    </div>
    <GetVoice :isShow="state.show" @end="end" @getVoiceVale="getVoiceVale" />
    <van-popup v-model:show="state.isShowAddress" round position="bottom">
      <div class="addressOperateCon">
        <div class="cancelBtn" @click="state.isShowAddress = false">取消</div>
        <div class="confirmBtn" @click="confirmAddress">确定</div>
      </div>
      <van-cascader :closeable="state.negative" v-model="state.cascaderValue" :title="state.areaPopTitle" :field-names="fieldNames" :options="state.options" @finish="onFinish" />
    </van-popup>
    <van-popup v-model:show="state.typeShow" round position="bottom">
      <van-picker title="请选择补助类型" :columns="state.columns" @cancel="state.typeShow = false" @confirm="onType" :defaultIndex="state.typeDefaultIndex" />
    </van-popup>
    <Loading :visiable="state.visible"></Loading>
  </div>
</template>
<script>
import { onMounted, reactive, ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { Toast } from 'vant'
import Request from '@/service/request'
import { isZLB, getConfigByKey } from '@/util/index'
import Loading from '@/components/loading'
import GetVoice from '@/components/getVoice'

export default {
  components: { Loading, GetVoice },
  setup() {
    const Router = useRouter()
    const fieldNames = {
      text: 'name',
      value: 'id',
      children: 'children'
    }
    const state = reactive({
      visible: false,
      show: false, //语音输入框
      lading: false,
      finished: false,
      loading: false,
      isShowBox: false, //消息盒子
      isShowAddress: false, //地址选择框
      typeShow: false,
      voiceValue: '',
      areaPopTitle: '请选择所在地区',
      dataList: [],
      options: [],
      ids: [],
      client: {}, //存储oss信息
      isZLB: isZLB(), //是否是浙里办
      projectSubSwitch: ref(false),
      projectSwitch: ref(false),
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false
    })
    const fetchAddress = () => {
      //获取地址
      if (state.isZLB) {
        Request.getAreaListMGOP({})
          .then((res) => {
            state.options = res.data.data && res.data.data.list
          })
          .catch((err) => {
            console.log('err', err)
          })
      } else {
        Request.getAreaList({})
          .then((res) => {
            if (res && res.code == 0) {
              state.options = res.data.list
            } else {
              Toast(res.msg)
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      }
    }
    const showTranscribePopup = () => {
      //开始语音录制并且清空数据和各种状态
      if (state.isZLB) {
        Toast('该环境暂不支持') //浙里办暂不支持
        return
      }
      state.show = true
      state.voiceValue = '' //重新录制语音清空
      state.isShowBox = false
      state.finished = false
      state.dataList = []
    }
    // 选择地址确定outSymbolFn
    const confirmAddress = () => {
      const { selectItem } = state
      if (state.ids.length === 0) {
        Toast('请选择地址')
        return
      }
      state.show = false // 关闭地址选择框
      if (selectItem.category_name == '秸秆综合利用补贴') {
        // 继续选择补贴类型
        state.typeShow = true
      } else {
        setAddressAndJump()
      }
    }
    // 设置项目所在地 path：秸秆补贴跳转路由 api：秸秆补贴获取id api
    const setAddressAndJump = (path, api) => {
      const { ids, selectItem } = state
      const params = {
        project_id: '',
        policy_document_id: selectItem.id || null,
        // is_apply_check: 1, // 非必传,不传时不判断 (是否检测在线申报时判重 1=判断 0=不判断)
        city_id: ids[0],
        town_id: ids[1],
        village_id: ids[2]
      }
      let routerName = 'policyList'
      let apiName = 'setPorjectArea'
      if (selectItem.category_name == '有机肥使用补贴') {
        routerName = 'yjfDeclare'
        apiName = 'getYjfSubsidyId'
      } else if (selectItem.category_name == '秸秆综合利用补贴') {
        routerName = path
        apiName = api
      } else if (selectItem.category_name == '湖羊产业补贴') {
        routerName = 'hyDeclare'
        apiName = 'getHySubsidyId'
      } else if (selectItem.category_name == '病死动物无害化处理补贴') {
        routerName = 'whh'
        apiName = 'getWhhSubsidyId'
      } else if (selectItem.category_name == '粮油适度规模经营补贴') {
        routerName = 'lyDeclare'
        apiName = 'getLySubsidyId'
        params.cb_city_id = ids[0]
        params.cb_town_id = ids[1]
        params.cb_village_id = ids[2]
      }
      state.spining = true
      Request[apiName](params)
        .then((res) => {
          if (res && res.code === 0) {
            Router.push({
              name: routerName,
              query: {
                project_id: apiName == 'setPorjectArea' ? res.data.project_id : res.data,
                policy_document_id: selectItem.id
              }
            })
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          state.spining = false
        })
    }
    // 秸秆补贴类型选择
    const onType = (e) => {
      state.typeShow = false
      // console.log('秸秆补贴类型选择', e)
      setAddressAndJump(e.path, e.api)
    }
    const fetchList = () => {
      //获取服务列表
      if (state.isZLB) {
        state.loading = true
        Request.fetchPolicyDocumentListMGOP({
          page: 1,
          pagesize: 100,
          category_id: 0, //默认获取全部列表
          keywords: state.voiceValue
        })
          .then((res) => {
            if (res.data && res.data.data && res.data.data.data) {
              state.dataList = res.data.data.data //浙里办返回多一层data
            }

            state.finished = true
            state.loading = false
          })
          .catch((err) => {
            console.log('err', err)
            state.finished = true
            state.loading = false
          })
      } else {
        state.loading = true
        Request.fetchPolicyDocumentList({
          page: 1,
          pagesize: 100,
          category_id: 0, //默认获取全部列表
          keywords: state.voiceValue
        })
          .then((res) => {
            if (res.data && res.data.data) {
              state.dataList = res.data.data
            }

            state.finished = true
            console.log(res, 'res')
            state.loading = false
          })
          .catch((err) => {
            console.log('err', err)
            state.finished = true
            state.loading = false
          })
      }
    }
    //调用接口获取声音信息
    const getVoiceVale = (voiceValue) => {
      state.show = false
      state.isShowBox = true
      state.voiceValue = voiceValue
      fetchList()
    }
    onMounted(async () => {
      fetchAddress() //获取地址信息
      state.projectSubSwitch = await getConfigByKey('project_sub_apply_switch') // 惠农补贴开关
      state.projectSwitch = await getConfigByKey('project_apply_switch') // 竞争性项目开关
    })
    const end = () => {
      state.show = false
      console.log('结束')
    }

    const popAddress = (item, activeName) => {
      state.ids = []
      state.cascaderValue = ''
      if (item && item.category_name == '粮油适度规模经营补贴') {
        state.areaPopTitle = '请选择承包地址'
      } else {
        state.areaPopTitle = '请选择所在地区'
      }
      state.selectItem = item
      if (activeName == 1) {
        // 是在线申报 查询是否申报过
        hadApply(item).then((e) => {
          console.log('---------------', e)
          if (e.code !== 0) {
            Toast(e.msg)
          } else {
            state.isShowAddress = true
          }
        })
      } else {
        state.isShowAddress = true
      }
    }
    // 判断是否申报过
    const hadApply = (selectItem) => {
      // 判断是否申报过
      const params = {
        policy_document_id: selectItem.id || null
        // form_type: 1, // 子表单类型 仅(21=农机购置补助 22=秸秆利用补助 23=社会化服务补助)需要传, 其他情况都是非必传
      }
      let apiName = 'checkCanApply'
      return Request[apiName](params)
    }
    const onFinish = ({ selectedOptions }) => {
      state.ids = [selectedOptions[0].id, selectedOptions[1].id, selectedOptions[2].id]
    }
    const goBack = () => {
      Router.replace({
        name: 'newHome'
      })
    }
    return {
      state,
      dayjs,
      fieldNames,
      end,
      showTranscribePopup,
      popAddress,
      confirmAddress,
      onType,
      onFinish,
      getVoiceVale,
      goBack
    }
  }
}
</script>
<style scoped lang="less">
.serve-box {
  padding-bottom: 0.8rem;
  height: scaleY(80);
  .serve-box-center {
    padding: 0.3rem;
    background: #fff;
    .checkBtn {
      color: #1b82ec;
      width: 60%;
      font-size: 0.3rem;
      margin-left: 1.1rem;
      font-family: PingFang SC;
      font-weight: bold;
    }
    img {
      width: 100%;
    }
    .talking-center {
      padding: 0 0.2rem;
      .talking-box {
        display: flex;
        width: 80%;
        justify-content: center;
        align-items: center;
        font-family: PingFang SC;
        margin-top: 0.2rem;
        line-height: 0.4rem;
        min-height: 0.4rem;
        background: linear-gradient(90deg, #2d8df0 0%, #65b0fa 100%);
        border-radius: 24px;
        font-size: 0.3rem;
        color: rgba(255, 255, 255, 1);
        padding: 0.3rem;
        position: relative;
        box-shadow: 0px 2px 16px rgba(2, 62, 123, 0.24);
        p {
          font-size: 0.3rem;
          margin-bottom: 0.2rem;
        }
        .itemCon {
          padding-left: 0.3rem;
          padding-right: 0.3rem;
          padding-top: 0.3rem;
          margin-bottom: 0.3rem;
          border-radius: 0.2rem;
          background-color: #fff;
          .submitBtn {
            height: 0.5rem;
            font-size: 0.24rem;
            line-height: 0.5rem;
            // margin-top: 0.2rem;
          }
          .submitBtnOld {
            font-size: 0.25rem !important;
          }
          .saveBtnOld {
            font-size: 0.25rem !important;
          }
          .saveBtn {
            height: 0.5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            align-content: center;
            position: relative;
            font-size: 0.24rem;

            .tel-link,
            .contact-btn-zlb {
              position: absolute;
              width: 100%;
              height: 100%;
              left: 0;
              top: 0;
            }
          }
          .itemInnerCon {
            border-bottom: 1px solid #ededed;
            padding-bottom: 0.3rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            align-content: center;

            .leftCon {
              width: 58%;
            }
            .rightCon {
              width: 40%;
              display: flex;
              flex-direction: column;
            }
          }
          &:last-child {
            .itemInnerCon {
              border: none;
            }
          }
          .title {
            font-size: 0.28rem;
            width: 100%;
            font-weight: 500;
            line-height: 0.45rem;
            color: #333;
            margin-bottom: 0.3rem;
            line-height: 0.36rem;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .titleOld {
            font-size: 0.4rem;
            line-height: 0.45rem;
          }
          .time {
            font-size: 0.24rem;
            color: #666;
          }
          .timeOld {
            font-size: 0.35rem;
          }
        }
      }
      .talking-box:before {
        content: '';
        border: 0.3rem solid transparent;
        border-right-color: rgba(45, 141, 240, 1);
        position: absolute;
        left: -0.53rem;
        top: auto;
        // margin-top:-20px;
      }
      .talking-right-box {
        display: flex;
        justify-content: center;
        align-items: center;
        line-height: 0.4rem;
        font-family: PingFang SC;
        font-size: 0.3rem;
        margin-left: 20%;
        margin-top: 0.2rem;
        min-height: 0.4rem;
        background: linear-gradient(90deg, #2d8df0 0%, #65b0fa 100%);
        border-radius: 24px;
        color: rgba(255, 255, 255, 1);
        padding: 0.3rem;
        position: relative;
        box-shadow: 0px 2px 16px rgba(2, 62, 123, 0.24);
      }
      .talking-right-box:before {
        content: '';
        border: 0.3rem solid transparent;
        border-left-color: #65b0fa;
        position: absolute;
        right: -0.53rem;
        top: auto;
        // margin-top:-20px;
      }
    }
  }
  .serve-box-feet {
    margin-top: auto;
    background: #fff;
    width: 95%;
    padding: 0.2rem;
    position: fixed;
    bottom: 0;
  }
}
</style>
<style lang="less">
.serve-box {
  .whiteIconCon {
    height: 0.8rem;
    padding-left: 0.2rem;
    box-sizing: border-box;
    background: #fff;
    display: flex;
    align-items: center;
  }
  .whiteIcon {
    font-size: 0.4rem;
  }
  .addressOperateCon {
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
    .confirmBtn {
      margin-top: 0.3rem;
      margin-right: 0.3rem;
      font-size: 0.3rem;
    }
    .cancelBtn {
      margin-top: 0.3rem;
      margin-left: 0.3rem;
      font-size: 0.3rem;
    }
  }
}
</style>
