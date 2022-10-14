<template>
  <div class="program programListCon">
    <div class="search">
      <input
        type="text"
        v-model.trim="state.keyword"
        placeholder="搜索"
        :class="state.ZLBFitForOld ? 'searchInputOld' : ''"
      />
      <van-icon name="search" />
      <span
        @click="onSearch"
        :class="state.ZLBFitForOld ? 'searchInputOld' : ''"
        >搜索</span
      >
    </div>
    <van-tabs
      @click-tab="changeTab"
      sticky
      class="firstTab"
      v-model:active="state.active"
      :class="state.ZLBFitForOld ? 'firstTabOld' : ''"
    >
      <van-tab title="竞争性财政支农项目" name="1"></van-tab>
      <van-tab title="惠农补贴" name="2"></van-tab>
    </van-tabs>
    <van-list
      :loading="state.loading"
      :finished="state.finished"
      :finished-text="
        state.list.length ? `没有更多了` : `您当前暂无项目申报记录`
      "
      loading-text="数据加载中"
      @load="getDataList"
    >
      <div class="item_box" v-if="state.list.length">
        <program-list
          v-for="item in state.list"
          :key="item.project_id"
          @delete-item="deleteItem"
          :detail="item"
          :type="state.active"
        />
      </div>
      <div class="emptyHolder" v-if="state.list && !state.list.length && state.loading === false">
        <img
          src="https://img.hzanchu.com/acimg/698206a6fba0842528424a9f6f7e0cd4.png"
        />
      </div>
      <!-- <empty v-if="state.list.length === 0 && state.loading === false" /> -->
    </van-list>
  </div>
</template>

<script>
import { ref, reactive, onMounted, nextTick, computed } from 'vue'
import Request from '@/service/request'
import empty from '@/components/empty'
import programList from './Mine/programList'
import { useRoute } from 'vue-router'
import { isZLB } from '@/util/index'
export default {
  components: {
    programList,
    empty,
  },
  setup() {
    const state = reactive({
      ZLBFLAG: isZLB(),
      ZLBFitForOld:
        localStorage.getItem('fitForOld') &&
        localStorage.getItem('fitForOld') == 1
          ? true
          : false,
      list: [],
      keyword: '',
      page: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      finished: false,
      active: ref(1),
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
      // console.log('9*1')
      try {
        // console.log('9*2')
        const params = {
          page: state.page,
          pagesize: state.pageSize,
          search_keyword: state.keyword,
          type: state.active,
        }
        // console.log('9*3')
        state.loading = true
        const result = await Request.getProjectList(params)
        // console.log('9*4',result)
        state.loading = false
        if (result.code === 0) {
          state.total = result.data.total
          state.list = [...state.list, ...result.data.data]
          if (state.active == '2') {
            // 需要转换秸秆补贴名称
            state.list.forEach((item) => {
              if (item.title && item.title.indexOf('秸秆') > -1) {
                if (item.form_type == 21) {
                  item.title = `${item.title}(农机购置补助)`
                } else if (item.form_type == 22) {
                  item.title = `${item.title}(秸秆利用补助)`
                } else if (item.form_type == 23) {
                  item.title = `${item.title}(社会化服务补助)`
                }
              }
            })
          }

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
    const debounce = (() => {//防抖
        let timer = null;
        return (fn, duration) => function(...args){
            if(typeof timer === 'number') clearTimeout(timer);
            timer = setTimeout(() => {
                fn(...args);
                timer = null;
            }, duration);
        }
    })();
    const getDataList=()=>{
      debounce(function click(){
        getList()
      },300)()
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
      state.active = useRoute().query.active || '1'
    })
    return {
      state,
      getList,
      onSearch,
      deleteItem,
      changeTab,
      getDataList
    }
  },
}
</script>
<style lang="less" scoped>
.program {
  padding-bottom: 1.3rem;
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
  .item_box {
    margin: 0 0.3rem 0.7rem;
    .program-list {
      padding: 0.3rem;
      margin-top: 0.3rem;
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
