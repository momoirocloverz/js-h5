<template>
  <div class="masterCon">
    <div class="masterInner marBottom20">
      <div class="title">
        <div class="homeTag marBottom20">
          <div class="tagLine"></div>
          <div class="tagText" :class="state.ZLBFitForOld ? 'tagTextOld' : ''">
            {{ state.detail.title }}
          </div>
        </div>
      </div>
      <div class="timeCon" :class="state.ZLBFitForOld ? 'timeConOld' : ''">
        <div>发布时间：</div>
        <div class="timeContent">
          {{ state.detail.issue_at && state.detail.issue_at.split(' ')[0] }}
        </div>
      </div>
      <div class="contentCon" :class="state.ZLBFitForOld ? 'contentConOld' : ''">
        <div v-html="state.detail.content"></div>
      </div>
      <div class="pdfCon" v-if="state.detail.accessory && state.detail.accessory.length" :class="state.ZLBFitForOld ? 'pdfConOld' : ''">
        查看附件：
        <template v-for="(item, index) in state.detail.accessory" :key="index">
          <div class="itemCon" @click="checkPdf(item)">{{ index + 1 + '：' + item.name }}</div>
        </template>
      </div>
    </div>
    <div class="masterInner" v-if="state.detail.understand_paper_id">
      <div class="title">
        <div class="homeTag marBottom20">
          <div class="tagLine"></div>
          <div class="tagText" :class="state.ZLBFitForOld ? 'tagTextOld' : ''">明白纸</div>
        </div>
        <div class="timeCon" :class="state.ZLBFitForOld ? 'timeConOld' : ''">
          <div>发布时间：</div>
          <div class="timeContent">{{ state.underStandDetail.created_at }}</div>
        </div>
        <div class="underStandDetailContentCon" :class="state.ZLBFitForOld ? 'contentConOld' : ''">
          <div v-html="state.underStandDetail.content"></div>
        </div>
      </div>
    </div>
    <div class="btnsCon">
      <van-button v-if="state.ZLBFLAG" class="saveBtn" :class="state.ZLBFitForOld ? 'btnTextOld' : ''" round @click="consultTrigger">咨询</van-button>
      <a v-else class="saveBtn van-button van-button--default van-button--normal van-button--round" :href="state.detail && state.detail.linkman && 'tel:' + state.detail.linkman.mobile">
        <div :class="state.ZLBFitForOld ? 'btnTextOld' : ''">咨询</div>
      </a>
      <template v-if="state.detail.type == 2">
        <van-button
          class="submitBtn"
          :class="state.ZLBFitForOld ? 'btnTextOld' : ''"
          v-if="!Route.query.hide"
          round
          :disabled="state.projectSubSwitch != 1 || state.detail.project_can_apply != 1"
          @click="toHandle"
          type="primary"
          >{{ state.detail.project_can_apply != 1 ? '申报已截止' : state.projectSubSwitch != 1 ? '申报结束' : '在线申报' }}</van-button
        >
      </template>
      <template v-else>
        <van-button
          class="submitBtn"
          :class="state.ZLBFitForOld ? 'btnTextOld' : ''"
          v-if="!Route.query.hide"
          round
          :disabled="state.projectSwitch != 1 || state.detail.project_can_apply != 1"
          @click="toHandle"
          type="primary"
          >{{ state.detail.project_can_apply != 1 ? '申报已截止' : state.projectSwitch != 1 ? '申报结束' : '在线申报' }}</van-button
        >
      </template>
    </div>
    <Loading :visiable="state.visible"></Loading>
    <van-popup v-model:show="state.show" round position="bottom">
      <div class="addressOperateCon">
        <div class="cancelBtn" @click="state.show = false">取消</div>
        <div class="confirmBtn" @click="confirmAddress">确定</div>
      </div>
      <van-cascader :closeable="state.negative" v-model="state.cascaderValue" :title="state.areaPopTitle" :field-names="fieldNames" :options="state.options" @finish="onFinish" />
    </van-popup>
    <van-popup v-model:show="state.typeShow" round position="bottom">
      <van-picker title="请选择补助类型" :columns="state.columns" @cancel="state.typeShow = false" @confirm="onType" :defaultIndex="state.typeDefaultIndex" />
    </van-popup>
  </div>
</template>
<script>
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Toast } from 'vant'
import Request from '@/service/request'
import { isZLB, getConfigByKey } from '@/util/index'
import Loading from '@/components/loading'
import { genHtmlTableWraper } from '@/util/index'

const helpPolicy = ['有机肥使用补贴', '秸秆综合利用补贴', '湖羊产业补贴', '病死动物无害化处理补贴', '粮油适度规模经营补贴']
export default defineComponent({
  components: { Loading },
  setup(props, { emit }) {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      show: false,
      typeShow: false,
      options: [],
      ids: [],
      detail: {},
      cascaderValue: '',
      visible: false,
      ZLBFLAG: isZLB(),
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
      underStandDetail: {},
      negative: false,
      typeDefaultIndex: 0,
      columns: [
        {
          text: '农机购置补助',
          value: 1,
          path: 'njDeclare',
          api: 'getNjSubsidyId'
        },
        {
          text: '秸秆利用补助',
          value: 2,
          path: 'jgDeclare',
          api: 'getJgSubsidyId'
        },
        {
          text: '社会化服务补助',
          value: 3,
          path: 'shhDeclare',
          api: 'getShhSubsidyId'
        }
      ],
      areaPopTitle: ref('请选择所在地区'),
      projectSubSwitch: ref(false),
      projectSwitch: ref(false)
    })
    const fetchList = () => {
      if (Route.query.id) {
        state.visible = true
        if (state.ZLBFLAG) {
          Request.fetchPolicyDocumentInfoMGOP({ id: Route.query.id })
            .then((res) => {
              if (res) {
                res.data.data.content = genHtmlTableWraper(res.data.data.content)
                let { accessory } = res.data.data || {}
                res.data.data.accessory = accessory && typeof accessory == 'string' ? JSON.parse(accessory) : accessory
                state.detail = res.data.data
                if (res.data.data.category && helpPolicy.includes(res.data.data.category.category_name)) {
                  state.detail.type = 2 // 2：惠农补贴
                } else {
                  state.detail.type = 1 // 1: 竞争性
                }
                if (res.data.data.understand_paper_id) {
                  fetchUnderstand()
                }
              } else {
                Toast(res.msg)
              }
            })
            .finally(() => {
              state.visible = false
            })
        } else {
          Request.fetchPolicyDocumentInfo({ id: Route.query.id })
            .then((res) => {
              if (res && res.code == 0) {
                res.data.content = genHtmlTableWraper(res.data.content)
                let { accessory } = res.data || {}
                res.data.accessory = accessory && typeof accessory == 'string' ? JSON.parse(accessory) : accessory
                state.detail = res.data
                if (res.data.category && helpPolicy.includes(res.data.category.category_name)) {
                  state.detail.type = 2 // 2：惠农补贴
                } else {
                  state.detail.type = 1 // 1: 竞争性
                }
                if (res.data.understand_paper_id) {
                  fetchUnderstand()
                }
              } else {
                Toast(res.msg)
              }
            })
            .finally(() => {
              state.visible = false
            })
        }
      }
    }
    onMounted(async () => {
      fetchList()
      fetchAddress()
      state.projectSubSwitch = await getConfigByKey('project_sub_apply_switch') // 惠农补贴开关
      state.projectSwitch = await getConfigByKey('project_apply_switch') // 竞争性项目开关
    })

    const fetchUnderstand = () => {
      if (state.ZLBFLAG) {
        Request.getPolicyDetailMGOP({
          id: state.detail.understand_paper_id
        }).then((res) => {
          unite1(res.data)
        })
      } else {
        Request.getPolicyDetail({ id: state.detail.understand_paper_id }).then((res) => {
          unite1(res)
        })
      }
    }
    const unite1 = (res) => {
      if (res && res.code == 0) {
        res.data.content = genHtmlTableWraper(res.data.content)
        state.underStandDetail = res.data
      } else {
        Toast(res.msg)
      }
    }
    const checkDetail = (item) => {
      Router.push({
        name: item.name
      })
    }
    const consultTrigger = () => {
      if (state.detail.linkman && state.detail.linkman.mobile) {
        ZWJSBridge.phoneCall({
          corpId: state.detail.linkman.mobile
        })
          .then((res) => {
            console.log(res)
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }
    const fetchAddress = () => {
      if (state.ZLBFLAG) {
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
    const toHandle = () => {
      if (state.detail.category && state.detail.category.category_name == '粮油适度规模经营补贴') {
        state.areaPopTitle = '请选择承包地址'
      } else {
        state.areaPopTitle = '请选择所在地区'
      }
      state.show = true
    }
    const fieldNames = {
      text: 'name',
      value: 'id',
      children: 'children'
    }
    const onFinish = ({ selectedOptions }) => {
      state.ids = [selectedOptions[0].id, selectedOptions[1].id, selectedOptions[2].id]
    }

    // 秸秆补贴类型选择
    const onType = (e) => {
      state.typeShow = false
      // console.log('秸秆补贴类型选择', e)
      setAddressAndJump(e.path, e.api)
    }

    // 选择地址确定
    const confirmAddress = () => {
      const { detail, ids } = state
      if (ids.length === 0) {
        Toast('请选择地址')
        return
      }
      state.show = false // 关闭地址选择框
      if (detail.category.category_name == '秸秆综合利用补贴') {
        // 继续选择补贴类型
        state.typeShow = true
      } else {
        setAddressAndJump()
      }
    }
    const checkPdf = (item) => {
      window.open(item.url)
    }

    // 设置项目所在地 path：秸秆补贴跳转路由 api：秸秆补贴获取id api
    const setAddressAndJump = (path, api) => {
      const { ids, detail } = state
      const params = {
        project_id: '',
        policy_document_id: detail.id || null,
        city_id: ids[0],
        town_id: ids[1],
        village_id: ids[2]
      }
      let routerName = 'policyList'
      let apiName = 'setPorjectArea'
      if (detail.category.category_name == '有机肥使用补贴') {
        routerName = 'yjfDeclare'
        apiName = 'getYjfSubsidyId'
      } else if (detail.category.category_name == '秸秆综合利用补贴') {
        routerName = path
        apiName = api
      } else if (detail.category.category_name == '湖羊产业补贴') {
        routerName = 'hyDeclare'
        apiName = 'getHySubsidyId'
      } else if (detail.category.category_name == '病死动物无害化处理补贴') {
        routerName = 'whh'
        apiName = 'getWhhSubsidyId'
      } else if (detail.category.category_name == '病死动物无害化处理补贴') {
        routerName = 'whh'
        apiName = 'getWhhSubsidyId'
      } else if (detail.category.category_name == '粮油适度规模经营补贴') {
        routerName = 'lyDeclare'
        apiName = 'getLySubsidyId'
        params.cb_city_id = ids[0]
        params.cb_town_id = ids[1]
        params.cb_village_id = ids[2]
      }
      // return console.log(apiName, params)
      Request[apiName](params).then((res) => {
        if (res && res.code === 0) {
          Router.push({
            name: routerName,
            query: {
              //   project_id: res.data.project_id,
              project_id: apiName == 'setPorjectArea' ? res.data.project_id : res.data,
              policy_document_id: detail.id
            }
          })
        } else {
          Toast(res.msg)
        }
      })
    }
    return {
      onType,
      state,
      checkDetail,
      fetchUnderstand,
      consultTrigger,
      toHandle,
      fieldNames,
      confirmAddress,
      checkPdf,
      onFinish,
      Route
    }
  }
})
</script>

<style scoped lang="less">
.ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  overflow: hidden;
}
.tagLine {
  width: 0.05rem;
  height: 0.3rem;
  margin-top: 0.07rem;
  background: #1b82ec;
  border-radius: 0.03rem;
  margin-right: 0.06rem;
  margin-top: 0.02rem;
}
.tagText {
  font-size: 0.34rem;
  line-height: 0.45rem;
  font-weight: bold;
  color: #333;
}
.tagTextOld {
  font-size: 0.4rem;
  line-height: 0.43rem;
}
.homeTag {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  box-sizing: border-box;
}
.timeCon {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  box-sizing: border-box;
  font-size: 0.24rem;
  color: #666;
}
.timeConOld {
  font-size: 0.3rem;
}
.itemCon {
  margin-top: 10px;
  margin-bottom: 10px;
  color: var(--van-button-primary-background-color);
  &:last-child {
    margin-bottom: 0;
  }
}
.pdfCon {
  margin-top: 0.2rem;
  font-size: 0.23rem;
  font-weight: 500;
  line-height: 0.36rem;
  color: #666;
  word-break: break-all;
  word-wrap: break-word;
}
.pdfConOld {
  font-size: 0.33rem;
}
.contentCon {
  margin-top: 0.4rem;
  font-size: 0.28rem;
  font-weight: 500;
  line-height: 0.36rem;
  color: #333;
  word-break: break-all;
  word-wrap: break-word;
  :deep(p) {
    font-size: 0.28rem !important;
    line-height: 0.4rem;
  }
  :deep(span) {
    font-size: 0.28rem !important;
    line-height: 0.4rem;
  }
}
.underStandDetailContentCon {
  margin-top: 0.4rem;
  font-size: 0.28rem;
  font-weight: 500;
  line-height: 0.5rem;
  color: #333;
  word-break: break-all;
  word-wrap: break-word;
  :deep(p) {
    font-size: 0.28rem !important;
    line-height: 0.4rem;
  }
  :deep(span) {
    font-size: 0.28rem !important;
    line-height: 0.4rem;
  }
  ::v-deep {
    img {
      width: 100%;
      object-fit: scale-down;
      height: auto;
    }
  }
}
.contentConOld {
  :deep(p) {
    line-height: 0.4rem !important;
    color: #333 !important;
    font-size: 0.35rem !important;
  }
  :deep(span) {
    line-height: 0.4rem !important;
    color: #333 !important;
    font-size: 0.35rem !important;
  }
  ::v-deep {
    img {
      width: 100%;
      object-fit: scale-down;
      height: auto;
    }
  }
}
.marBottom20 {
  margin-bottom: 0.2rem;
}
.btnsCon {
  display: flex;
  justify-content: center;
  margin-top: 0.4rem;
  margin-bottom: 0.6rem;
}
.saveBtn {
  width: 38.4%;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
}
.submitBtn {
  width: 38.4%;
  margin-left: 5%;
}
.btnTextOld {
  font-size: 0.35rem;
}
.masterCon {
  box-sizing: border-box;
  padding: 0.3rem;
  .masterInner {
    box-sizing: border-box;
    padding: 0.3rem;
    border-radius: 0.15rem;
    background-color: #fff;
  }
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
.van-button--disabled {
  color: #999;
  background-color: #ccccccb3;
  border-color: #ccccccb3;
}

// 富文本h5表格样式重置

:deep(.tableWrapper) {
  width: 100% !important;
  overflow-x: auto;
}

:deep(table) {
  border: 1px solid #333;
  border-collapse: collapse;
  table-layout: fixed;
  word-break: break-all;
  word-wrap: break-word;
  margin: 0;
  padding: 0;
  width: 100% !important;
  overflow: scroll;
  tr {
    width: 100% !important;
  }
  td,
  th {
    border: 1px solid #333;
    border-collapse: collapse;
  }
  td {
    // width: 100px !important;

    span {
      // display: inline-block;
      font-size: 0.28rem;
      font-family: 'PingFang SC Medium, PingFang SC Medium-Medium' !important;
      white-space: pre-line;
      word-wrap: break-word;
      word-break: break-all;
    }

    .MsoNormal {
      text-indent: 0 !important;
    }
  }
}

:deep(.contentCon) {
  p {
    img[src*='http'] {
      max-width: 100%;
      height: auto;
    }
  }
}
</style>
