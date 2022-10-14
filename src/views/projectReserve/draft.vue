<template>
  <div class="masterCon">
    <div class="declare_form">
      <div class="search">
        <input
          type="text"
          v-model.trim="state.inputVal"
          placeholder="请输入关键字"
          :class="state.ZLBFitForOld ? 'searchSpanOld' : ''"
        />
        <van-icon name="search" />
        <span
          @click="onSearch"
          :class="state.ZLBFitForOld ? 'searchSpanOld' : ''"
          >搜索</span
        >
      </div>
      <van-tabs
        @click-tab="onClick"
        sticky
        class="firstTab"
        title-inactive-color="#9fa2a4"
        v-model:active="state.activeName"
        :class="state.ZLBFitForOld ? 'firstTabOld' : ''"
      >
        <van-tab title="竞争性财政支农项目" name="1">
          <template #title>
            <div class="long-title">
              <div>竞争性财政</div>
              <div>支农项目</div>
            </div>
          </template>
        </van-tab>
        <van-tab title="惠农补贴" name="2"></van-tab>
        <van-tab title="项目储备" name="3"></van-tab>
      </van-tabs>
      <div class="listCon">
        <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh">
          <van-list
            v-model:loading="state.loading"
            :finished="state.finished"
            :immediate-check="false"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <template v-for="(item, index) in state.listData" :key="index">
              <div class="itemCon">
                <div
                  class="itemInnerCon"
                  :class="[
                    state.listData.length - 1 == index ? 'removeBorder' : '',
                  ]"
                  @click="checkDetail(item)"
                >
                  <div class="top">
                    <div
                      class="title ellipsis"
                      :class="state.ZLBFitForOld ? 'titleOld' : ''"
                    >
                      {{ item.project_name || item.title || '未命名项目' }}
                    </div>
                    <div class="del-btn" @click.stop="delItem(item)">删除</div>
                  </div>
                  <div class="bottomLine">
                    <div
                      class="type"
                      :class="state.ZLBFitForOld ? 'typeOld' : ''"
                    >
                      {{ state.typeMap[item.project_type] }}
                    </div>
                    <div
                      class="time"
                      :class="state.ZLBFitForOld ? 'timeOld' : ''"
                    >
                      {{ dayjs(item.created_at).format('YYYY-MM-DD') }}
                    </div>
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
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'
import dayjs from 'dayjs'
import { isZLB, util } from '@/util/index'
import { mgop } from '@aligov/jssdk-mgop'
import { Toast, Dialog } from 'vant'
export default defineComponent({
  setup(props, { emit }) {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      ZLBFLAG: isZLB(),
      ZLBFitForOld:
        localStorage.getItem('fitForOld') &&
        localStorage.getItem('fitForOld') == 1
          ? true
          : false,
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
    })

    const onLoad = () => {
      let typeArr = [1, 2, '1', '2'] // 1-竞争性 2-普惠 数字&字符串以防出错
      typeArr.includes(state.activeName) ? getProjectList() : fetchList()
    }

    const onRefresh = () => {
      state.listData = []
      state.page = 1
      // state.finished = false
      // state.loading = false
      state.refreshing = true
      onLoad()
      setTimeout(() => {
        state.refreshing = false
      }, 500)
    }

    // 处理项目储备数据
    const unite1 = (res) => {
      if (res && res.code == 0) {
        const resData = res.data.data
        let previous = state.listData
        state.total = res.data.total
        if (resData.length == 0) {
          state.finished = true
        } else if (resData.length < 10) {
          state.finished = true
        } else if (resData.length >= 10) {
          state.finished = false
          state.page++
        }
        state.refreshing = false
        state.loading = false
        state.listData = previous.concat(resData)
      } else {
        Toast(res.msg)
        state.finished = true
      }
    }

    // 处理竞争性&惠农补贴数据
    const handleProjectData = (res) => {
      if (res && res.code == 0) {
        const resData = res.data.data
        let previous = state.listData
        state.total = res.data.total
        resData.forEach((item) => {
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
        if (resData.length == 0) {
          state.finished = true
          state.listData = previous.concat(resData)
        } else if (resData.length < 10) {
          state.finished = true
          state.listData = previous.concat(resData)
        } else if (resData.length >= 10) {
          state.finished = false
          state.page++
        }
        state.refreshing = false
        state.loading = false
        state.listData = previous.concat(resData)
      } else {
        Toast(res.msg)
        state.finished = true
      }
    }

    // 查询项目储备列表
    const fetchList = () => {
      state.loading = true
      if (state.ZLBFLAG) {
        Request.fetchProjectReserveListMGOP({
          searchStatus: 0,
          page: state.page,
          pagesize: 10,
          searchProjectName: state.inputVal,
          searchIsDraft: 1,
        })
          .then((res) => {
            unite1(res.data)
          })
          .catch((err) => {
            console.log('err', err)
            state.finished = true
          })
      } else {
        Request.fetchProjectReserveList({
          search_status: 0,
          page: state.page,
          pagesize: 10,
          search_project_name: state.inputVal,
          search_is_draft: 1,
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

    // 查询项目列表 竞争性&普惠
    const getProjectList = () => {
      state.loading = true
      if (state.ZLBFLAG) {
        Request.getProjectListMGOP({
          page: state.page,
          pagesize: 10,
          searchKeyword: state.inputVal,
          searchIsDraft: 1,
          type: state.activeName,
        })
          .then((res) => {
            handleProjectData(res)
          })
          .catch((err) => {
            console.log('err', err)
            state.finished = true
          })
      } else {
        Request.getProjectList({
          page: state.page,
          pagesize: 10,
          search_keyword: state.inputVal,
          search_is_draft: 1,
          type: state.activeName,
        })
          .then((res) => {
            handleProjectData(res)
          })
          .catch((err) => {
            console.log('err', err)
            state.finished = true
          })
      }
    }

    // tab切换
    const onClick = util.throttling(
      (e) => {
        onRefresh()
      },
      500,
      true
    )

    onMounted(() => {
      onLoad()
    })

    // 搜索
    const onSearch = util.throttling(
      () => {
        state.page = 1
        state.listData = []
        if (state.activeName < 3) {
          getProjectList()
        } else {
          fetchList()
        }
      },
      1000,
      true
    )

    const checkDetail = (item) => {
      const { form_type, project_type } = item
      if (form_type) {
        // 惠农补贴
        let types = {
          11: 'yjfDeclare',
          21: 'njDeclare',
          22: 'jgDeclare',
          23: 'shhDeclare',
          24: 'hyDeclare',
          25: 'whh',
          26: 'lyDeclare',
        }
        Router.push({
          name: types[form_type],
          query: {
            project_id: item.project_id,
            policy_document_id: item.policy_document_id,
          },
        })
      } else if (project_type) {
        // 项目储备
        Router.push({
          name: 'projectReserveDraftDetail',
          query: {
            id: item.id,
          },
        })
      } else {
        // 竞争性
        Router.push({
          name: 'projectPerform',
          query: {
            active: 0, // 跳转进去后的tab 默认第一个
            projectId: item.project_id,
            policyId: item.policy_document_id,
          },
        })
      }
    }

    // 删除条目
    const delItem = (item) => {
      // console.log('要删除的草稿', item)
      Dialog.confirm({
        title: '提示',
        message: '删除后将无法恢复，是否删除？',
        confirmButtonColor: '#1B82EC',
      }).then(() => {
        if (item.hasOwnProperty('project_type')) {
          // 项目储备草稿删除
          deleteProjectReserve(item.id)
        } else {
          if (item.hasOwnProperty('form_type')) {
            // 惠农补贴草稿删除
            deleteProject(item.project_id, 2)
          } else {
            // 竞争性项目草稿删除
            deleteProject(item.project_id, 1)
          }
        }
        return
      })
    }
    // 删除竞争性&惠农补贴
    const deleteProject = async (id, type) => {
      const result = await Request.deleteMyProject({
        project_id: id,
        type,
      })
      if (result.code === 0) {
        Toast('删除成功')
        onRefresh()
      } else {
        Toast(result.msg)
      }
    }
    // 删除项目储备
    const deleteProjectReserve = async (id) => {
      const result = await Request.deleteProjectReserve({
        id: id,
      })
      if (result.code === 0) {
        Toast('删除成功')
        onRefresh()
      } else {
        Toast(result.msg)
      }
    }

    return {
      state,
      onSearch,
      checkDetail,
      dayjs,
      onLoad,
      onRefresh,
      onClick,
      delItem,
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
  height: 1.75rem;
  box-sizing: border-box;
  padding: 0.3rem 0.3rem 0;
  background-color: #fff;
  position: relative;

  div {
    box-sizing: border-box;
  }

  .itemInnerCon {
    height: 100%;
    padding-bottom: 0.2rem;
    border-bottom: 0.01rem solid #f5f5f5;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &:last-child {
    .itemInnerCon {
      border: none;
    }
  }

  .removeBorder {
    border: none;
  }

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title {
      font-size: 0.28rem;
      line-height: 0.3rem;
      width: 100%;
      font-weight: 500;
      // line-height: 45px;
      color: #333;
      // line-height: 0.36rem;
    }
    .titleOld {
      font-size: 0.4rem;
      line-height: 0.45rem;
    }

    .del-btn {
      width: 1.6rem;
      height: 0.5rem;
      background: #ffffff;
      border: 0.02rem solid #1b82ec;
      border-radius: 0.3rem;
      font-size: 0.26rem;
      color: #1b82ec;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .time {
    font-size: 0.24rem;
    color: #666;
    // line-height: 0.48rem;
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

  :deep(.van-tabs__wrap) {
    height: 0.9rem;

    .van-tab--active {
      font-weight: bold;
    }
  }

  :deep(.van-tab__text) {
    -webkit-line-clamp: 2;
    text-align: center;
    .long-title {
      line-height: 0.3rem;
    }
  }

  :deep(.van-pull-refresh) {
    min-height: 50vh;
  }

  .firstTabOld {
    :deep(.van-tabs__wrap) {
      height: 1.1rem;
      .long-title, .van-tab__text {
        font-size: 0.3rem;
      }
    }
  }

  .firstTab {
    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 0.01rem;
      background: #f5f5f5;
      z-index: 1;
      // transform: scaleY(0.5);
    }
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
</style>
