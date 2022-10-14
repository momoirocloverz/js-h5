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
        <span
          @click="onSearch"
          :class="state.ZLBFitForOld ? 'searchSpanOld' : ''"
          >搜索</span
        >
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
                <div class="itemInnerCon" @click="checkDetail(item)">
                  <div
                    class="title ellipsis"
                    :class="state.ZLBFitForOld ? 'titleOld' : ''"
                  >
                    {{ item.title }}
                  </div>
                  <div
                    class="time"
                    :class="state.ZLBFitForOld ? 'timeOld' : ''"
                  >
                    {{ dayjs(item.created_at).format('YYYY-MM-DD') }}
                  </div>
                </div>
              </div>
            </template>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'
import dayjs from 'dayjs'
import { isZLB } from '@/util/index'
import { mgop } from '@aligov/jssdk-mgop'
export default defineComponent({
  setup(props, { emit }) {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      listData: [],
      inputVal: '',
      page: 1,
      total: 0,
      refreshing: false,
      loading: false,
      finished: true,
      ZLBFLAG: isZLB(),
      ZLBFitForOld:
        localStorage.getItem('fitForOld') &&
        localStorage.getItem('fitForOld') == 1
          ? true
          : false,
    })
    const fetchList = () => {
      state.loading = true
      if (state.ZLBFLAG) {
        Request.fetchNoticeDetailMGOP({
          page: state.page,
          pagesize: 10,
          title: state.inputVal,
        })
          .then((res) => {
            unite1(res.data)
          })
          .catch((err) => {
            console.log('err', err)
            state.finished = true
          })
      } else {
        Request.fetchNoticeList({
          page: state.page,
          pagesize: 10,
          title: state.inputVal,
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
    const onLoad = () => {
      fetchList()
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
    onMounted(() => {
      fetchList()
    })
    const onSearch = () => {
      let keyWards = state.inputVal
      state.listData = []
      state.page = 1
      fetchList()
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
    const checkDetail = (item) => {
      Router.push({
        name: 'noticeDetail',
        query: {
          id: item.id,
        },
      })
    }
    return {
      state,
      onSearch,
      checkDetail,
      dayjs,
      onRefresh,
      onLoad,
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
  .searchSpanOld {
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
  padding-top: 0.4rem;
  background-color: #fff;
  .itemInnerCon {
    border-bottom: 1px solid #ededed;
    padding-bottom: 0.3rem;
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
</style>
