<template>
  <div class="program programListCon">
    <van-tabs @click-tab="changeTab" sticky class="firstTab" v-model:active="state.active" :class="state.ZLBFitForOld ? 'firstTabOld' : ''">
      <van-tab title="明白纸检索" name="1"></van-tab>
      <van-tab title="明白纸需求" name="2"></van-tab>
    </van-tabs>
    <div class="tab1Con" v-show="state.active == 1">
      <div class="search">
        <input type="text" v-model.trim="state.keyword" placeholder="搜索" :class="state.ZLBFitForOld ? 'searchInputOld' : ''" />
        <van-icon name="search" />
        <span @click="onSearch" :class="state.ZLBFitForOld ? 'searchInputOld' : ''">搜索</span>
      </div>
      <van-list :loading="state.loading" :finished="state.finished" :finished-text="state.list.length ? `没有更多了` : `暂无数据`" loading-text="数据加载中" @load="getDataList">
        <div class="listCon" v-if="state.list.length">
          <template v-for="(item, index) in state.list" :key="index">
            <div class="itemCon">
              <div class="itemInnerCon" @click="checkDetail(item)">
                <div class="title ellipsis">{{ item.title }}</div>
                <div class="tagsCon">
                  <template v-for="(sub, subIndex) in item.tag_list" :key="subIndex">
                    <div class="tagBody">{{ sub.name }}</div>
                  </template>
                </div>
                <div class="time">
                  发布时间: {{ item.created_at }}
                  <span><img src="https://img.hzanchu.com/acimg/3cf10ec179ec879f8148d2d07f17e00c.png" alt="" /> {{ item.pv ? item.pv : 0 }}</span>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="emptyHolder" v-if="state.list && !state.list.length && state.loading === false">
          <img src="https://img.hzanchu.com/acimg/698206a6fba0842528424a9f6f7e0cd4.png" />
        </div>
      </van-list>
    </div>
    <div class="tab2Con" v-show="state.active == 2">
      <DetailCopy @confirm="switchTab" />
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, nextTick, computed } from 'vue'
import Request from '@/service/request'
import DetailCopy from './detailCopy.vue'
import empty from '@/components/empty'
import { useRoute, useRouter } from 'vue-router'
import { isZLB } from '@/util/index'
export default {
  components: {
    empty,
    DetailCopy
  },
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      ZLBFLAG: isZLB(),
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
      list: [],
      keyword: '',
      page: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      finished: false,
      active: 1
    })
    const onSearch = () => {
      state.list = []
      state.page = 1
      state.total = 0
      state.loading = true
      nextTick(() => {
        state.finished = false
        state.loading = false
      })
    }

    const getList = async () => {
      try {
        const params = {
          page: state.page,
          pagesize: state.pageSize,
          keywords: state.keyword,
          search_invest_tag_ids: Route.query.search_invest_tag_ids.length ? Route.query.search_invest_tag_ids : '',
          search_invest_category_id: Route.query.invest_category_id
        }
        state.loading = true
        const result = await Request.understandNewPaperList(params)
        state.loading = false
        if (result.code === 0) {
          state.total = result.data.total
          state.list = [...state.list, ...result.data.data]
          if (state.page * state.pageSize >= state.total) state.finished = true
          state.page++
        }
      } catch (e) {
        state.loading = false
        state.finished = true
      } finally {
        state.loading = false
      }
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
    const getDataList = () => {
      debounce(function click() {
        getList()
      }, 300)()
    }
    const changeTab = (e) => {
      nextTick(() => {
        onSearch()
      })
    }

    const deleteItem = (id) => {
      const index = state.list.findIndex((item) => item.project_id === +id)
      state.list.splice(index, 1)
    }

    onMounted(() => {
      state.active = Route.query.active || '1'
    })
    const switchTab = (value) => {
      state.active = 1
      changeTab()
    }
    const checkDetail = (item) => {
      Router.push({
        name: 'understandPolicyDetail',
        query: {
          id: item.id
        }
      })
    }
    return {
      state,
      getList,
      onSearch,
      deleteItem,
      changeTab,
      getDataList,
      switchTab,
      checkDetail
    }
  }
}
</script>
<style lang="less" scoped>
.tab1Con {
  height: calc(100vh - 0.88rem);
  overflow-y: scroll;
}
.program {
  background-color: #f5f7fa;
  .search {
    background: #fff;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.2rem 0.3rem;
    .van-icon-search {
      position: absolute;
      font-size: 0.3rem;
      left: 0.4rem;
      color: #999;
    }
    span {
      font-size: 0.28rem;
      font-weight: 500;
      color: #666;
      margin-left: 0.2rem;
    }
    input {
      height: 0.6rem;
      flex: 1;
      border-radius: 0.3rem;
      font-size: 0.28rem;
      text-indent: 0.5rem;
      background: #f6f6f6;
    }
    .searchInputOld {
      font-size: 0.35rem;
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
}
.itemCon {
  background-color: #fff;
  padding: 0.32rem;
  padding-bottom: 0;
  box-sizing: border-box;
  .time {
    font-size: 0.24rem;
    color: #999;
    display: flex;
    span {
      margin-left: 0.3rem;
      color: #808080;
      display: inline-flex;
      align-items: center;
      img {
        width: 0.3rem;
        margin-right: 0.1rem;
        height: 0.3rem;
      }
    }
  }

  .rate {
    display: flex;
    align-items: center;
  }

  .itemInnerCon {
    border-bottom: 1px solid #ededed;
    padding-bottom: 0.2rem;
    .ellipsis {
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  &:last-child {
    .itemInnerCon {
      border: none;
    }
  }

  .title {
    font-size: 0.32rem;
    font-weight: 500;
    width: 100%;
    .itemCon {
      padding: 0.4rem 0.2rem 0 0.2rem;
      background-color: #fff;
      .itemInnerCon {
        border-bottom: 1px solid #ededed;
        padding-bottom: 0.3rem;

        .ellipsis {
          white-space: nowrap;
          text-overflow: ellipsis;
          -o-text-overflow: ellipsis;
          overflow: hidden;
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
        color: #333;
        margin-bottom: 5px;
        line-height: 0.36rem;
      }
    }
  }
}
.listCon {
  padding-top: 0.24rem;
  padding-left: 0.3rem;
  padding-right: 0.3rem;
  box-sizing: border-box;
}
.tagsCon {
  padding-top: 0.16rem;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  flex-wrap: wrap;
}
.tagBody {
  background: #ebf5ff;
  color: #1b82ec;
  font-size: 0.28rem;
  padding: 0.08rem 0.12rem;
  margin-right: 0.16rem;
  margin-bottom: 0.13rem;
}
</style>
<style lang="less">
.programListCon {
  .firstTabOld {
    .van-tab {
      font-size: 0.35rem;
    }
  }
}
</style>
