<template>
  <div class="masterCon">
    <div class="declare_form">
      <div class="search">
        <input
          type="text"
          v-model.trim="state.inputVal"
          placeholder="请输入关键字"
          :class="state.ZLBFitForOld ? 'searchInputOld' : ''"
        />
        <van-icon name="search" />
        <span @click="onSearch" :class="state.ZLBFitForOld ? 'searchInputOld' : ''">搜索</span>
      </div>
      <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="state.loading"
          :finished="state.finished"
          :immediate-check="false"
          finished-text="没有更多了"
          @load="onLoad"
        >
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
                    <div
                      class="
                        saveBtn
                        van-button van-button--default van-button--normal van-button--round
                      "
                      v-if="item.linkman && item.linkman.mobile"
                    >
                      <div :class="state.ZLBFitForOld ? 'saveBtnOld' : ''">咨询</div>
                      <div
                        class="contact-btn-zlb"
                        @click="consultTrigger(item.linkman.mobile)"
                        v-if="state.ZLBFLAG"
                      ></div>
                      <a
                        class="tel-link"
                        :href="item.linkman && 'tel:' + item.linkman.mobile"
                        v-else
                      >
                      </a>
                    </div>
                    <van-button
                      class="submitBtn"
                      round
                      :disabled="
                       ( item.type == 1 ? state.projectSwitch != 1 : state.projectSubSwitch != 1)||(item.project_can_apply != 1 )
                      "
                      :class="state.ZLBFitForOld ? 'submitBtnOld' : ''"
                      @click="popAddress(item)"
                      type="primary"
                    >
                      <template v-if="item.type == 1">
                        {{  item.project_can_apply != 1  ?'申报已截止' : state.projectSwitch == 1 ? '在线申报' : '申报结束' }}
                      </template>
                      <template v-if="item.type == 2">
                        {{  item.project_can_apply != 1  ?'申报已截止' : state.projectSubSwitch == 1 ? '在线申报' : '申报结束' }}
                      </template>
                      <!-- {{ item.type == 2 ? '申报结束' : '在线申报' }} -->
                    </van-button>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <van-popup v-model:show="state.show" round position="bottom">
      <div class="addressOperateCon">
        <div class="cancelBtn" @click="state.show = false">取消</div>
        <div class="confirmBtn" @click="confirmAddress">确定</div>
      </div>
      <van-cascader
        :closeable="state.negative"
        v-model="state.cascaderValue"
        :title="state.areaPopTitle"
        :field-names="fieldNames"
        :options="state.options"
        @finish="onFinish"
      />
    </van-popup>

    <van-popup v-model:show="state.typeShow" round position="bottom">
      <van-picker
        title="请选择补助类型"
        :columns="state.columns"
        @cancel="state.typeShow = false"
        @confirm="onType"
        :defaultIndex="state.typeDefaultIndex"
      />
    </van-popup>
  </div>
</template>
<script>
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'
import dayjs from 'dayjs'
import { Toast } from 'vant'
import { isZLB, getConfigByKey } from '@/util/index'
const helpPolicy = [
  '有机肥使用补贴',
  '秸秆综合利用补贴',
  '湖羊产业补贴',
  '病死动物无害化处理补贴',
  '粮油适度规模经营补贴',
]
export default defineComponent({
  setup(props, { emit }) {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      show: false,
      negative: false,
      listData: [],
      options: [],
      inputVal: '',
      page: 1,
      total: 0,
      refreshing: false,
      loading: false,
      finished: true,
      selectCategory_id: '',
      ZLBFLAG: isZLB(),
      ZLBFitForOld:
        localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
      ids: [],
      selectItem: {},
      typeShow: false,
      typeDefaultIndex: 0,
      columns: [
        {
          text: '农机购置补助',
          value: 1,
          path: 'njDeclare',
          api: 'getNjSubsidyId',
        },
        {
          text: '秸秆利用补助',
          value: 2,
          path: 'jgDeclare',
          api: 'getJgSubsidyId',
        },
        {
          text: '社会化服务补助',
          value: 3,
          path: 'shhDeclare',
          api: 'getShhSubsidyId',
        },
      ],
      areaPopTitle: '请选择所在地区',
      projectSubSwitch: ref(false),
      projectSwitch: ref(false),
    })
    const onLoad = () => {
      fetchList()
    }
    const unite1 = res => {
      if (res && res.code == 0) {
        const resData = res.data.data
        let previous = state.listData
        state.total = res.data.total
        resData.forEach(item => {
          // 遍历区分是竞争性还是惠农补贴
          item.type = helpPolicy.includes(item.category_name) ? 2 : 1
        })
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
          keywords: state.inputVal,
        })
          .then(res => {
            unite1(res.data)
          })
          .catch(err => {
            console.log('err', err)
            state.finished = true
          })
      } else {
        state.loading = true
        Request.fetchPolicyDocumentList({
          page: state.page,
          pagesize: 10,
          category_id: state.selectCategory_id,
          keywords: state.inputVal,
        })
          .then(res => {
            unite1(res)
          })
          .catch(err => {
            console.log('err', err)
            state.finished = true
          })
      }
    }
    onMounted(async () => {
      fetchAddress()
      onLoad()
      state.projectSubSwitch = await getConfigByKey('project_sub_apply_switch') // 惠农补贴开关
      state.projectSwitch = await getConfigByKey('project_apply_switch') // 竞争性项目开关
    })
    const onSearch = () => {
      state.listData = []
      state.page = 1
      fetchList()
    }
    const checkDetail = item => {
      Router.push({
        name: 'policyDetail',
        query: {
          id: item.id,
        },
      })
    }
    const onRefresh = () => {
      state.listData = []
      state.page = 1
      state.finished = false
      state.loading = false
      state.refreshing = true
      fetchList()
      setTimeout(() => {
        state.refreshing = false
        state.finished = true
      }, 500)
    }

    const fetchAddress = () => {
      if (state.ZLBFLAG) {
        Request.getAreaListMGOP({})
          .then(res => {
            state.options = res.data.data && res.data.data.list
          })
          .catch(err => {
            console.log('err', err)
          })
      } else {
        Request.getAreaList({})
          .then(res => {
            if (res && res.code == 0) {
              state.options = res.data.list
            } else {
              Toast(res.msg)
            }
          })
          .catch(err => {
            console.log('err', err)
          })
      }
    }
    const fieldNames = {
      text: 'name',
      value: 'id',
      children: 'children',
    }
    const popAddress = item => {
      state.ids = []
      state.cascaderValue = ''
      if (item.category_name == '粮油适度规模经营补贴') {
        state.areaPopTitle = '请选择承包地址'
      } else {
        state.areaPopTitle = '请选择所在地区'
      }
      state.show = true
      state.selectItem = item
    }
    const onFinish = ({ selectedOptions }) => {
      state.ids = [selectedOptions[0].id, selectedOptions[1].id, selectedOptions[2].id]
    }
    // 秸秆补贴类型选择
    const onType = e => {
      state.typeShow = false
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
        city_id: ids[0],
        town_id: ids[1],
        village_id: ids[2],
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
      // return console.log(apiName, params)
      state.spining = true
      Request[apiName](params)
        .then(res => {
          if (res && res.code === 0) {
            Router.push({
              name: routerName,
              query: {
                project_id: apiName == 'setPorjectArea' ? res.data.project_id : res.data,
                policy_document_id: selectItem.id,
              },
            })
          } else {
            Toast(res.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          state.spining = false
        })
    }

    // 浙里办拨打电话
    const consultTrigger = tel => {
      ZWJSBridge.phoneCall({
        corpId: tel,
      })
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    }

    return {
      state,
      onSearch,
      checkDetail,
      dayjs,
      onRefresh,
      onLoad,
      fieldNames,
      popAddress,
      onFinish,
      confirmAddress,
      onType,
      consultTrigger,
    }
  },
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
}
.masterCon {
  box-sizing: border-box;
  padding: 0.3rem;
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
    line-height: 45px;
    color: #333;
    margin-bottom: 5px;
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
    line-height: 0.48rem;
  }
  .timeOld {
    font-size: 0.35rem;
  }
}
.declare_form {
  position: relative;
  border-radius: 0.15rem;
  overflow: hidden;
}
.submitBtn {
  height: 0.5rem;
  margin-top: 0.2rem;
  font-size: 0.24rem;
}
.submitBtnOld {
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
.saveBtnOld {
  font-size: 0.25rem !important;
}

.leftCon {
  width: 70%;
}
.rightCon {
  width: 32%;
  display: flex;
  flex-direction: column;
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
  background-color: #ccccccb3 !important;
  border-color: #ccccccb3 !important;
}
</style>
