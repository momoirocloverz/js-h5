<template>
  <div class="masterPolicyCon">
    <div class="declare_form">
      <div class="search">
        <input type="text" v-model.trim="state.inputVal" placeholder="请输入关键字" :class="state.ZLBFitForOld ? 'searchInputOld' : ''" />
        <van-icon name="search" />
        <span @click="onSearch" :class="state.ZLBFitForOld ? 'searchSpanOld' : ''">搜索</span>
      </div>
      <div class="all-tab-box">
        <van-tabs @click-tab="(name) => onClick(name, 'firstLevel')" sticky class="firstTab" v-model:active="state.activeName" :class="state.ZLBFitForOld ? 'firstTabOld' : ''">
          <template v-for="(item, index) in state.tabList" :key="item.id">
            <van-tab v-if="index != 0" :title="item.category_name + '(' + item.category_sum + ')'" :name="item.id"></van-tab>
          </template>
        </van-tabs>
        <van-tabs
          v-if="state.activeName == tabIdObj.discountCategoryId"
          @click-tab="(name) => onClick(name, 'secondLevel')"
          :sticky="true"
          class="classify-tab"
          v-model:active="state.secondTabActiveName"
          :before-change="beforeChange"
        >
          <!-- <template
            v-for="(item, index) in state.tabList.filter((item) => {
              return item.id == '19'
            })[0]?.children"
            :key="index"
          > -->
          <template v-for="(item, index) in state.splitArray" :key="index">
            <van-tab :title="item.category_name + '(' + item.category_sum + ')'" :name="item.id"></van-tab>
          </template>
        </van-tabs>
      </div>
      <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh">
        <van-list v-model:loading="state.loading" :finished="state.finished" :immediate-check="false" finished-text="没有更多了" @load="onLoad">
          <div class="listCon">
            <template v-for="(item, index) in state.listData" :key="index">
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
                    <div class="saveBtn van-button van-button--default van-button--normal van-button--round" v-if="item.linkman && item.linkman.mobile">
                      <div :class="state.ZLBFitForOld ? 'saveBtnOld' : ''">咨询</div>
                      <div class="contact-btn-zlb" @click="consultTrigger(item.linkman.mobile)" v-if="state.ZLBFLAG"></div>
                      <a class="tel-link" :href="item.linkman && 'tel:' + item.linkman.mobile" v-else> </a>
                    </div>
                    <van-button
                      class="submitBtn"
                      round
                      :disabled="item.project_can_apply != 1 || (state.activeName == tabIdObj.competeCategoryId ? state.projectSwitch != 1 : state.projectSubSwitch != 1)"
                      :class="state.ZLBFitForOld ? 'submitBtnOld' : ''"
                      type="primary"
                      @click="popAddress(item, state.projectSwitch)"
                    >
                      <template v-if="state.activeName == tabIdObj.allCategoryId">
                        {{
                          item.project_can_apply != 1
                            ? '申报已截止'
                            : item.category_name == '竞争性财政支农项目'
                            ? state.projectSubSwitch == 1
                              ? '在线申报'
                              : '申报结束'
                            : state.projectSubSwitch == 1
                            ? '在线申报'
                            : '申报结束'
                        }}
                      </template>
                      <template v-if="state.activeName == tabIdObj.competeCategoryId">
                        {{ item.project_can_apply != 1 ? '申报已截止' : state.projectSwitch == 1 ? '在线申报' : '申报结束' }}
                      </template>
                      <template v-if="state.activeName == tabIdObj.discountCategoryId">
                        {{ item.project_can_apply != 1 ? '申报已截止' : state.projectSubSwitch == 1 ? '在线申报' : '申报结束' }}
                      </template>
                    </van-button>
                    <!-- 
       :disabled="(item.project_can_apply != 1 )&& ( state.activeName == 1
                          ? state.projectSwitch != 1
                          : state.projectSubSwitch != 1)
                      " -->
                  </div>
                </div>
              </div>
            </template>
            <div class="emptyHolder" v-if="!state.loading && state.listData && !state.listData.length">
              <img src="https://img.hzanchu.com/acimg/698206a6fba0842528424a9f6f7e0cd4.png" />
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
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

    <Loading :visiable="state.spining"></Loading>
  </div>
</template>
<script>
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'
import dayjs from 'dayjs'
import { Toast } from 'vant'
import Loading from '@/components/loading'
import { isZLB, getConfigByKey } from '@/util/index'

export default defineComponent({
  components: { Loading },
  setup(props, { emit }) {
    const Router = useRouter()
    const Route = useRoute()
    const tabIdObj = {
      competeCategoryId: 14, //竞争性财政支农项目 tabID
      discountCategoryId: 19, //政府补贴 tabID
      allCategoryId: 0 //全部 tabID
    }
    const state = reactive({
      listData: [],
      splitArray: [],
      inputVal: '',
      page: 1,
      total: 0,
      refreshing: false,
      loading: false,
      finished: true,
      selectCategory_id: '',
      track2: '',
      track1: '',
      type: '0',
      activeName: 14,
      secondTabActiveName: 19,
      ids: [],
      selectItem: {},
      negative: false,
      options: [],
      tabList: [],
      ZLBFLAG: isZLB(),
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
      typeShow: false,
      typeDefaultIndex: 0,
      show: false,
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
      spining: false, // 加载中
      areaPopTitle: '请选择所在地区',
      projectSubSwitch: ref(false),
      projectSwitch: ref(false)
    })
    const onLoad = () => {
      state.refreshing = true
      getList()
    }
    const unite1 = (res) => {
      if (res && res.code == 0) {
        const resData = res.data.data
        let previous = state.listData
        state.total = res.data.total
        if (resData.length == 0) {
          state.finished = true
          state.loading = false
          state.refreshing = false
          state.listData = previous.concat(resData)
        } else if (resData.length < 10) {
          state.finished = true
          state.loading = false
          state.refreshing = false
          state.listData = previous.concat(resData)
        } else if (resData.length >= 10) {
          state.finished = false
          state.refreshing = false
          state.loading = false
          state.page++
          state.listData = previous.concat(resData)
        }
      } else {
        Toast(res.msg)
        state.finished = true
      }
    }
    const fetchList = () => {
      if (state.ZLBFLAG) {
        state.loading = true
        Request.fetchPolicyDocumentListMGOP({
          page: state.page,
          pagesize: 10,
          category_id: state.selectCategory_id,
          keywords: state.inputVal
        })
          .then((res) => {
            unite1(res.data)
          })
          .catch((err) => {
            console.log('err', err)
            state.finished = true
          })
      } else {
        state.loading = true
        Request.fetchPolicyDocumentList({
          page: state.page,
          pagesize: 10,
          category_id: state.selectCategory_id,
          keywords: state.inputVal
        })
          .then((res) => {
            unite1(res)
          })
          .catch((err) => {
            console.log('err', err)
            state.finished = true
          })
      }
    }
    const getTabList = () => {
      Request.getPolicyCategoryTabList({})
        .then((res) => {
          //   state.tabList = res?.data
          state.tabList = res && res.data
          let track1 = state.tabList.filter((item) => {
            return item.id == '19'
          })
          if (track1 && track1[0]) {
            state.splitArray = track1[0].children
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
    onMounted(async () => {
      fetchAddress()
      fetchCategoryAction()
      getTabList()
      state.projectSubSwitch = await getConfigByKey('project_sub_apply_switch') // 政府补贴开关
      state.projectSwitch = await getConfigByKey('project_apply_switch') // 竞争性项目开关
    })
    const fetchCategoryAction = () => {
      state.type = Number(Route.query.type) || Number(tabIdObj.competeCategoryId) //vant的tab action标签内容必须为number类型才奏效
      state.activeName = Number(Route.query.type) || Number(tabIdObj.competeCategoryId) //vant的tab action标签内容必须为number类型才奏效
      state.secondTabActiveName = Number(Route.query.secondTabType) || Number(tabIdObj.discountCategoryId) //vant的tab action标签内容必须为number类型才奏效
      if (state.ZLBFLAG) {
        Request.fetchPolicyCategoryListMGOP({})
          .then((res) => {
            if (res && res.data && res.data.data) {
              if (Array.isArray(res.data.data)) {
                let track2 = res.data.data.find((ele) => {
                  return ele.category_name == '惠农补贴'
                })
                tabIdObj.discountCategoryId = track2.id
                if (track2) {
                  let track2id = track2.id
                  state.track2 = track2id
                  if (state.type == tabIdObj.discountCategoryId) {
                    state.selectCategory_id = track2.id
                    onLoad()
                  }
                }
                let track1 = res.data.data.find((ele) => {
                  return ele.category_name == '竞争性财政支农项目'
                })
                tabIdObj.competeCategoryId = track1.id
                if (track1) {
                  let track1id = track1.id
                  state.track1 = track1id
                  if (state.type == tabIdObj.competeCategoryId) {
                    state.selectCategory_id = track1.id
                    onLoad()
                  }
                }
              }
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      } else {
        Request.fetchPolicyCategoryList({}).then((res) => {
          if (res && res.code == 0) {
            if (res.data) {
              if (Array.isArray(res.data)) {
                if (Route.query.secondTabType) {
                  state.selectCategory_id = Route.query.secondTabType
                  onLoad()
                } else {
                  let track2 = res.data.find((ele) => {
                    return ele.category_name == '惠农补贴'
                  })
                  tabIdObj.discountCategoryId = track2.id
                  if (track2) {
                    let track2id = track2.id
                    state.track2 = track2id
                    if (state.type == tabIdObj.discountCategoryId) {
                      state.selectCategory_id = track2.id
                      onLoad()
                    }
                  }
                  let track1 = res.data.find((ele) => {
                    return ele.category_name == '竞争性财政支农项目'
                  })
                  tabIdObj.competeCategoryId = track1.id
                  if (track1) {
                    let track1id = track1.id
                    state.track1 = track1id
                    if (state.type == tabIdObj.competeCategoryId) {
                      state.selectCategory_id = track1.id
                      onLoad()
                    }
                  }
                }
              }
            }
          } else {
            Toast(res.msg)
          }
        })
      }
    }
    const onSearch = () => {
      state.listData = []
      state.page = 1
      getList()
    }
    const checkDetail = (item) => {
      Router.push({
        name: 'policyDetail',
        query: {
          id: item.id
        }
      })
    }
    const onRefresh = () => {
      state.listData = []
      state.page = 1
      state.finished = false
      state.loading = false
      state.refreshing = true
      getList()
      setTimeout(() => {
        state.refreshing = false
        state.finished = true
      }, 500)
    }
    const debounce = (() => {
      //防抖
      let timer = null
      return (fn, duration) =>
        function (...args) {
          if (typeof timer === 'number') clearTimeout(timer)
          timer = setTimeout(() => {
            fn(...args)
            timer = null
          }, duration)
        }
    })()
    const getList = () => {
      debounce(function click() {
        fetchList()
      }, 500)()
    }
    const onClick = ({ name }, type) => {
      if (type == 'firstLevel') {
        fetchAddress()
        state.activeName = Number(name) //vant的tab action标签内容必须为number类型才奏效
        if (state.activeName == tabIdObj.discountCategoryId) {
          //sec
          state.selectCategory_id = state.secondTabActiveName
        } else {
          //fir
          state.selectCategory_id = name
        }
      } else {
        state.secondTabActiveName = Number(name) //二级tab标签选中 //vant的tab action标签内容必须为number类型才奏效
        state.selectCategory_id = name
      }
      //   state.selectCategory_id = name
      onRefresh()
    }
    const fetchAddress = () => {
      if (state.ZLBFLAG) {
        Request.getAreaListMGOP({})
          .then((res) => {
            if (state.activeName == 14) {
              res.data.data.list[0].children.forEach((ele) => {
                ele.children = [{ id: 0, name: '本级', town_id: 0 }, ...ele.children]
              })
            }
            state.options = res.data.data && res.data.data.list
          })
          .catch((err) => {
            console.log('err', err)
          })
      } else {
        Request.getAreaList({})
          .then((res) => {
            if (res && res.code == 0) {
              if (state.activeName == 14) {
                res.data.list[0].children.forEach((ele) => {
                  ele.children = [{ id: 0, name: '本级', town_id: 0 }, ...ele.children]
                })
              }
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
    const fieldNames = {
      text: 'name',
      value: 'id',
      children: 'children'
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
          if (e.code !== 0) {
            Toast(e.msg)
          } else {
            state.show = true
          }
        })
      } else {
        state.show = true
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

    // 秸秆补贴类型选择
    const onType = (e) => {
      state.typeShow = false
      // console.log('秸秆补贴类型选择', e)
      setAddressAndJump(e.path, e.api)
    }

    // 选择地址确定
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
      // return console.log(apiName, JSON.stringify(params))
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

    // 浙里办拨打电话
    const consultTrigger = (tel) => {
      ZWJSBridge.phoneCall({
        corpId: tel
      })
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
    }

    const beforeChange = () => {
      if (state.loading) return false
      return true
    }
    return {
      state,
      tabIdObj,
      onSearch,
      checkDetail,
      dayjs,
      onRefresh,
      onLoad,
      onClick,
      debounce,
      fieldNames,
      popAddress,
      onFinish,
      confirmAddress,
      onType,
      consultTrigger,
      beforeChange
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
.search {
  position: relative;
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  justify-content: space-between;
  .van-icon-search {
    position: absolute;
    font-size: 0.3rem;
    left: 0.2rem;
    color: #999;
  }
  span {
    font-size: 0.28rem;
    font-weight: 500;
    color: #666;
    margin-left: 0.2rem;
  }
  input {
    background-color: #fff;
    height: 0.6rem;
    flex: 1;
    border-radius: 0.3rem;
    font-size: 0.28rem;
    text-indent: 0.5rem;
  }
  .searchInputOld {
    font-size: 0.35rem;
  }
  .searchSpanOld {
    font-size: 0.35rem;
  }
}
.masterPolicyCon {
  box-sizing: border-box;
  padding: 0.3rem;
  padding-bottom: 1rem;
  width: 100%;
}
.itemCon {
  padding-left: 0.3rem;
  padding-right: 0.3rem;
  padding-top: 0.3rem;
  background-color: #fff;
  .itemInnerCon {
    border-bottom: 1px solid #ededed;
    padding-bottom: 0.3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;

    .leftCon {
      width: 70%;
    }
    .rightCon {
      width: 32%;
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
.declare_form {
  position: relative;
  border-radius: 0.15rem;
  overflow: hidden;
  .all-tab-box {
    margin-bottom: 0.3rem;
  }
}
.submitBtn {
  height: 0.5rem;
  font-size: 0.24rem;
  margin-top: 0.2rem;
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
.saveBtnOld {
  font-size: 0.25rem !important;
}
.submitBtnOld {
  font-size: 0.25rem !important;
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
.emptyHolder {
  margin-top: 0.6rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  img {
    width: 4rem;
    margin: 0 auto;
  }
}
.van-button--disabled {
  color: #999;
  background-color: #ccccccb3 !important;
  border-color: #ccccccb3 !important;
}
</style>
<style lang="less">
.masterPolicyCon {
  .firstTab {
    .van-tabs__line {
      background-color: #1b82ec;
    }
    .van-tab--active {
      color: #1b82ec;
    }
  }
  .classify-tab {
    height: 1.2rem;
    display: flex;
    background: #fff;
    align-items: center;
    .van-tabs__line {
      height: 0;
    }
    .van-tab {
      background: #f6f7f8;
      border-radius: 0.05rem;
      color: #999999;
      height: 0.8rem;
      margin-right: 0.2rem;
      flex: none;
    }
    .van-tab--active {
      color: #1b82ec;
      border-radius: 0.05rem;
      background: rgb(227, 240, 253);
    }
  }
  .firstTabOld {
    .van-tab {
      font-size: 0.35rem;
    }
  }
}
</style>
