<template>
  <div class="masterCon">
    <div class="declare_form">
      <van-tabs
        @click-tab="onClick"
        sticky
        class="firstTab"
        v-model:active="state.activeName"
      >
        <van-tab title="待审核" name="1"></van-tab>
        <van-tab title="已通过" name="2"></van-tab>
        <van-tab title="已驳回" name="9"></van-tab>
      </van-tabs>
      <div class="listCon">
        <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh">
          <van-list
            v-model:loading="state.loading"
            :finished="state.finished"
            :immediate-check="false"
            :finished-text="state.listData.length ? `没有更多了` : '没有'"
            @load="onLoad"
          >
            <template v-for="(item, index) in state.listData" :key="index">
              <div class="itemCon">
                <div
                  class="itemInnerCon"
                  :class="[
                    state.listData.length - 1 == index ? 'removeBorder' : '',
                  ]"
                >
                  <div class="itemLeft">
                    <div class="title ellipsis">
                      {{ item.project_name }}
                    </div>
                    <div class="itemLeftBottom">
                      <div class="type marginRight20">
                        {{ state.typeObj[item.project_type] }}
                      </div>
                      <div class="time">
                        {{ dayjs(item.created_at).format('YYYY-MM-DD') }}
                      </div>
                    </div>
                  </div>
                  <div class="itemRight" @click="checkDetail(item)">
                    <div class="positiveRight" v-if="state.activeName == 1">
                      审核
                    </div>
                    <div class="negativeRight" v-else>查看</div>
                  </div>
                </div>
              </div>
            </template>
            <div
              class="emptyHolder"
              v-if="state.listData && !state.listData.length"
            >
              <img
                src="https://img.hzanchu.com/acimg/698206a6fba0842528424a9f6f7e0cd4.png"
              />
            </div>
          </van-list>
        </van-pull-refresh>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/operation'
import dayjs from 'dayjs'
import { Toast } from 'vant'
export default defineComponent({
  setup(props, { emit }) {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      refreshing: false,
      finished: false,
      loading: false,
      page: 1,
      total: 0,
      listData: [],
      activeName: 1,
      typeObj: {
        1: '种植业',
        2: '养殖业',
        3: '加工业',
        4: '乡村建设',
        9: '其他',
      },
    })

    const onLoad = () => {
      fetchList()
    }

    const onRefresh = () => {
      state.listData = []
      state.page = 1
      state.finished = false
      state.loading = false
      state.refreshing = true
      onLoad()
      setTimeout(() => {
        state.refreshing = false
      }, 500)
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
        state.finished = true
      }
    }
    const fetchList = () => {
      state.loading = true
      Request.projectReserveList({
        page: state.page,
        pagesize: 10,
        is_export: 0,
        search_status: +state.activeName,
      })
        .then((res) => {
          unite1(res)
        })
        .catch((err) => {
          console.log('err', err)
          state.finished = true
        })
    }
    onMounted(() => {
      state.activeName = Route.query.activeName || 1
      onLoad()
    })
    const checkDetail = (item) => {
      Router.push({
        name: 'operationProjectReserveDetail',
        query: {
          id: item.id,
          able: state.activeName == 1 ? '1' : '0',
          activeName: state.activeName,
        },
      })
    }

    // 切换tab
    const onClick = (e) => {
      state.activeName = e.name
      state.listData = []
      Router.replace({
        name: 'operationProjectReserve',
        query: {
          id: Route.query.id,
          activeName: state.activeName,
        },
      })

      onRefresh()
    }
    return {
      state,
      checkDetail,
      dayjs,
      onLoad,
      onRefresh,
      onClick,
    }
  },
})
</script>

<style scoped lang="less">
.listCon {
  margin-top: 0.3rem;
  box-sizing: border-box;
  padding-left: 0.3rem;
  padding-right: 0.3rem;
}
.ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  overflow: hidden;
}
.masterCon {
  box-sizing: border-box;
}
.itemCon {
  border-radius: 0.16rem;
  background-color: #fff;
  margin-bottom: 0.3rem;
  .itemInnerCon {
    height: 1.75rem;
    padding: 0.3rem;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    .itemLeft {
      height: 80%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: left;
      .itemLeftBottom {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        align-content: center;
        text-align: left;
      }
    }
    .positiveRight {
      width: 2.2rem;
      height: 0.7rem;
      box-sizing: border-box;
      line-height: 0.7rem;
      text-align: center;
      color: #fff;
      font-size: 0.3rem;
      background-color: #1b82ec;
      border-radius: 0.35rem;
    }
    .negativeRight {
      width: 2.2rem;
      height: 0.7rem;
      box-sizing: border-box;
      line-height: 0.66rem;
      text-align: center;
      color: #1b82ec;
      font-size: 0.3rem;
      background-color: #fff;
      border: 2px solid #1b82ec;
      border-radius: 0.35rem;
    }
    .itemRight {
    }
  }
  .removeBorder {
    border: none;
  }
  .title {
    font-size: 0.3rem;
    width: 100%;
    font-weight: 500;
    color: #333;
    margin-bottom: 5px;
    line-height: 0.36rem;
  }
  .time {
    font-size: 0.24rem;
    color: #666;
  }
  .type {
    font-size: 0.24rem;
    color: #666;
  }
  .marginRight20 {
    margin-right: 0.2rem;
  }
  .bottomLine {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
  }
}
.declare_form {
  position: relative;
  border-radius: 0.15rem;
  overflow: hidden;
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
</style>
