<template>
  <div class="masterCon">
    <div class="declare_form">
      <div class="search">
        <input
          type="text"
          v-model.trim="state.inputVal"
          placeholder="搜索"
          :class="state.ZLBFitForOld ? 'searchSpanOld' : ''"
        />
        <van-icon name="search" />
        <span @click="onSearch" :class="state.ZLBFitForOld ? 'searchSpanOld' : ''">搜索</span>
      </div>
      <van-tabs
        @click-tab="onClick"
        sticky
        class="firstTab"
        v-model:active="state.activeName"
        :class="state.ZLBFitForOld ? 'firstTabOld' : ''"
      >
        <van-tab title="已通过" :name="2"></van-tab>
        <van-tab title="审核中" :name="1"></van-tab>
        <van-tab title="未通过" :name="9"></van-tab>
      </van-tabs>
      <div class="listCon">
        <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh">
          <van-list
            v-model:loading="state.loading"
            :finished="state.finished"
            :immediate-check="false"
            :finished-text="state.listData.length ? `没有更多了` : finishedText"
            @load="onLoad"
          >
            <template v-for="(item, index) in state.listData" :key="index">
              <van-swipe-cell>
                <div class="itemCon">
                  <div
                    class="itemInnerCon"
                    :class="[state.listData.length - 1 == index ? 'removeBorder' : '']"
                    @click="checkDetail(item)"
                  >
                    <div class="title ellipsis" :class="state.ZLBFitForOld ? 'titleOld' : ''">
                      {{ item.project_name }}
                    </div>
                    <div class="bottomLine">
                      <div class="type" :class="state.ZLBFitForOld ? 'typeOld' : ''">
                        {{ state.typeMap[item.project_type] }}
                      </div>
                      <div class="time" :class="state.ZLBFitForOld ? 'timeOld' : ''">
                        {{ dayjs(item.created_at).format('YYYY-MM-DD') }}
                      </div>
                    </div>
                  </div>
                </div>
                <template #right>
                  <van-button
                    square
                    text="删除"
                    type="danger"
                    class="delete-button"
                    @click="deleteBtn(item)"
                  />
                </template>
              </van-swipe-cell>
            </template>
            <div class="emptyHolder" v-if="state.listData && !state.listData.length">
              <img src="https://img.hzanchu.com/acimg/698206a6fba0842528424a9f6f7e0cd4.png" />
            </div>
          </van-list>
        </van-pull-refresh>
      </div>
    </div>
    <div class="publishCircle" @click="goToPublish">
      <img
        class="iconCircle"
        src="https://img.hzanchu.com/acimg/c0bd3c2e4aaab43cd5a6057b34e732c4.png"
      />
      <div class="publishText" :class="state.ZLBFitForOld ? 'publishTextOld' : ''">申报</div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'
import dayjs from 'dayjs'
import { isZLB } from '@/util/index'
import { Toast, SwipeCell, Dialog } from 'vant'
import { mgop } from '@aligov/jssdk-mgop'

export default defineComponent({
  setup(props, { emit }) {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      ZLBFLAG: isZLB(),
      ZLBFitForOld:
        localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
      refreshing: false,
      finished: false,
      loading: false,
      page: 1,
      total: 0,
      listData: [],
      inputVal: '',
      typeMap: {
        1: '种植业',
        2: '养殖业',
        3: '加工业',
        4: '乡村建设',
        9: '其他',
      },
      activeName: 2,
    })

    const finishedText = computed(() => {
      if (state.activeName == 2) {
        return '您当前暂无已通过的项目储备申报记录'
      } else if (state.activeName == 1) {
        return '您当前暂无审核中的项目储备申报记录'
      } else if (state.activeName == 9) {
        return '您当前暂无未通过的项目储备申报记录'
      }
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

    const unite1 = res => {
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
      state.loading = true
      if (state.ZLBFLAG) {
        Request.fetchProjectReserveListMGOP({
          searchStatus: state.activeName,
          page: state.page,
          pagesize: 10,
          searchProjectName: state.inputVal,
        })
          .then(res => {
            unite1(res.data)
          })
          .catch(err => {
            console.log('err', err)
            state.finished = true
          })
      } else {
        Request.fetchProjectReserveList({
          search_status: state.activeName,
          page: state.page,
          pagesize: 10,
          search_project_name: state.inputVal,
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

    onMounted(() => {
      onLoad()
    })

    const onSearch = () => {
      let keyWards = state.inputVal
      state.listData = []
      state.page = 1
      fetchList()
    }

    const checkDetail = item => {
      if (state.activeName == 9) {
        // 未通过可修改 跳转发布页
        return Router.replace({
          name: `projectReservePublish`,
          query: {
            id: item.id,
          },
        })
      }
      Router.push({
        name: 'projectReserveDetail',
        query: {
          id: item.id,
        },
      })
    }

    const goToPublish = () => {
      Router.replace({
        name: 'projectReservePublish',
      })
      // Router.push({
      //   name: 'projectReserveLegend',
      // })
    }

    // 切换tab
    const onClick = e => {
      state.activeName = e.name
      state.listData = []
      onRefresh()
    }

    // 点击删除
    const deleteBtn = item => {
      const { id, status } = item
      if (status == 2) {
        return Toast('已通过项目不可删除')
      }
      Dialog.confirm({
        title: '删除后将无法恢复，是否删除？',
      })
        .then(async e => {
          const result = await Request.deleteProjectReserve({ id })
          if (result.code === 0) {
            Toast('删除成功')
            onRefresh()
          } else {
            Toast(result.msg)
          }
        })
        .catch(e => {})
    }

    return {
      state,
      onSearch,
      checkDetail,
      dayjs,
      goToPublish,
      onLoad,
      onRefresh,
      onClick,
      finishedText,
      deleteBtn,
    }
  },
})
</script>

<style scoped lang="less">
.publishCircle {
  position: fixed;
  right: 0.3rem;
  bottom: 210px;
  width: 1.44rem;
  height: 1.44rem;
  background-color: #fff;
  border-radius: 0.72rem;
  box-shadow: 0px 0px 10px rgba(56, 54, 50, 0.24);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  .iconCircle {
    width: 0.42rem;
  }
  .publishText {
    font-size: 0.32rem;
    font-weight: 500;
    color: #1b82ec;
    margin-top: 0.1rem;
  }
  .publishTextOld {
    font-size: 0.4rem;
  }
}
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
  .searchSpanOld {
    font-size: 0.35rem;
  }
}
.masterCon {
  box-sizing: border-box;
  padding: 0.3rem;
}
.itemCon {
  background-color: #fff;
  .itemInnerCon {
    padding: 0.3rem;
    border-bottom: 1px solid #ededed;
    padding-bottom: 0.3rem;
  }
  .removeBorder {
    border: none;
  }
  .title {
    font-size: 0.28rem;
    width: 100%;
    font-weight: 500;
    line-height: 45px;
    color: #333;
    margin-bottom: 5px;
    line-height: 0.36rem;
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
  .type {
    font-size: 0.24rem;
    color: #666;
  }
  .typeOld {
    font-size: 0.35rem;
  }
  .timeOld {
    font-size: 0.35rem;
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
:deep(.van-swipe-cell__right) {
  .van-button {
    height: 100%;
  }
}
</style>
