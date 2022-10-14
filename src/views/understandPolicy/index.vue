<template>
  <div class="masterCon" @click="clickPage">
    <header style="overflow: inherit">
      <div class="search">
        <input type="text" v-model.trim="state.inputVal" placeholder="请输入搜索关键词" @focus="onFocus" />
        <van-icon name="search" />
        <img @click="showTranscribePopup" src="https://img.hzanchu.com/acimg/855aed52af22592798536215fdac1878.png" :style="{ right: showSearchBtn ? '1.3rem' : '0.55rem' }" alt="" />
        <Transition name="fade">
          <span @click="onSearch" v-show="showSearchBtn">搜索</span>
        </Transition>
        <div class="search-keywords" v-show="showSearchKeywords">
          <div class="content">
            <template v-if="keywordsList.length" v-for="keyword in keywordsList" :key="keyword.id">
              <div class="item" @click.stop="selectKeyword(keyword.name)">{{ keyword.name }}</div>
            </template>
            <template v-else>
              <div style="padding-top: 0.2rem; color: #666">暂无搜索历史</div>
            </template>
          </div>
        </div>
      </div>
      <Tabbar :list="state.tabList" @getSelectTab="getSelectTab"></Tabbar>
    </header>
    <div class="declare_form">
      <van-pull-refresh v-model="state.refreshing" @refresh="onRefresh">
        <van-list v-model:loading="state.loading" :finished="state.finished" :immediate-check="false" finished-text="没有更多了" @load="onLoad">
          <div class="listCon">
            <template v-for="(item, index) in state.listData" :key="index">
              <div class="itemCon">
                <div class="itemInnerCon" @click="checkDetail(item)">
                  <div class="title ellipsis">{{ item.title }}</div>
                  <div class="time">
                    发布时间: {{ dayjs(item.created_at).format('YYYY-MM-DD') }}
                    <span><img src="https://img.hzanchu.com/acimg/3cf10ec179ec879f8148d2d07f17e00c.png" alt="" /> {{ item.pv ? item.pv : 0 }}</span>
                  </div>
                  <div class="time rate">匹配程度: <van-rate v-model="item.starValue" readonly allow-half color="#1B82EC" /></div>
                </div>
              </div>
            </template>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- 问答专区 -->
    <!-- <div class="QA">
      <div class="folding-bar">
        <div class="title" @click="setListState">
          <span>问答专区</span>
          <van-icon name="arrow-down" :style="{ transform: isOpen ? 'rotate(180deg)' : '' }" />
        </div>
        <div class="more" @click="toMore">
          <span>更多</span>
          <van-icon name="arrow" />
        </div>
      </div>
      <div :class="isOpen ? 'list open' : 'list shut'">
        <template v-for="item in questionList" :key="item.id">
          <QACard :data="item" @setLike="setLikeState" @sendComment="commentSucccess" />
        </template>
      </div>
    </div> -->
    <GetVoice :showPosistion="'top'" :isShow="state.show" :isGetJurisdiction="state.isGetJurisdiction" @end="end" @getVoiceVale="getVoiceVale" />
    <!-- <ConsultingBtn /> -->
    <Ask />
  </div>
</template>

<script>
import Request from '@/service/request'
import dayjs from 'dayjs'
import { Toast } from 'vant'
import { isZLB } from '@/util/index'
import { defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Tabbar from '@/components/Tabbar'
import QACard from '@/components/QACard'
import ConsultingBtn from '../QASection/modules/ConsultingBtn.vue'
import Ask from '../QASection/modules/ask.vue'
import GetVoice from '@/components/getVoice'
export default defineComponent({
  name: 'understandPolicy',
  components: {
    Tabbar,
    QACard,
    ConsultingBtn,
    Ask,
    GetVoice
  },
  setup() {
    const Router = useRouter()
    const state = reactive({
      ZLBFLAG: isZLB(),
      listData: [],
      tabList: [], //tab标签列表
      active: 0, //当前选中tab
      inputVal: '',
      page: 1,
      total: 0,
      refreshing: false,
      loading: false,
      show: false,
      finished: true,
      isGetJurisdiction: 'isIcon'
    })
    const showSearchBtn = ref(false)
    const rollingState = reactive({
      rollingDistance: 0,
      oldRollingDistance: 0,
      isRolling: false
    })
    const isOpen = ref(true)
    const questionList = ref([])
    const keywordsList = ref([])
    const showSearchKeywords = ref(false)

    const onLoad = () => {
      fetchList()
      getTabList()
    }
    const showTranscribePopup = () => {
      //开始语音录制并且清空数据和各种状态
      if (state.ZLBFLAG) {
        Toast('该环境暂不支持') //浙里办暂不支持
        return
      }
      state.show = true
      state.voiceValue = '' //重新录制语音清
      state.isShowBox = false
      state.dataList = []
    }
    const end = (a) => {
      //录音结束
      state.show = false
      console.log('结束')
    }
    //调用接口获取声音信息
    const getVoiceVale = (voiceValue) => {
      state.show = false
      state.isShowBox = true
      state.inputVal = voiceValue
      state.page = 1 //默认展示第一页
      state.listData = [] //清空当前已有数据重新搜索
      fetchList()
    }
    const getSelectTab = (value) => {
      const { id } = value
      state.active = Number(id) //vant的tab action标签内容必须为number类型才奏效
      state.page = 1 //默认展示第一页
      state.listData = [] //清空当前已有数据重新搜索
      getDataList()
    }
    const getTabList = () => {
      Request.getUnderstandCategoryTabList({})
        .then((res) => {
        //   state.tabList = res?.data
          state.tabList = res&&res.data
        })
        .catch((err) => {
          console.log('err=>', err)
        })
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
        fetchList()
      }, 300)()
    }

    const setListState = () => {
      isOpen.value ? (isOpen.value = false) : (isOpen.value = true)
    }

    const unite1 = (res) => {
      if (res && res.code == 0) {
        const resData = res.data.data
        // 计算star
        resData.forEach((v) => {
          v.starValue = v.star / 20
        })
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
        Request.getPolicyListMGOP({
          page: state.page,
          pagesize: 10,
          keywords: state.inputVal,
          category_id: state.active
        })
          .then((res) => {
            unite1(res.data)
          })
          .catch((err) => {
            console.log('err', err)
            state.finished = true
          })
      } else {
        Request.getPolicyList({
          page: state.page,
          pagesize: 10,
          category_id: state.active,
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
    const onSearch = () => {
      state.page = 1 //回到第一页
      state.listData = [] //清空当前已有数据重新搜索
      getDataList()
    }
    const checkDetail = (item) => {
      Router.push({
        name: 'understandPolicyDetail',
        query: {
          id: item.id
        }
      })
    }

    const setLikeState = (e) => {
      let arr = questionList.value
      arr.map((item) => {
        if (item.id === e) {
          if (item.is_like) {
            item.is_like = 0
            item.like_count--
          } else {
            item.is_like = 1
            item.like_count++
          }
        }
      })
      questionList.value = arr
    }

    const commentSucccess = () => {
      getList()
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

    const getList = async () => {
      const result = await Request.questionList({
        page: 1,
        pagesize: 2
      })
      if (result.code === 0) {
        questionList.value = result.data.data
      }
    }

    const toMore = () => {
      Router.push('/QASection')
    }

    // 搜索聚焦
    const onFocus = async () => {
      try {
        const result = await Request.getTopSearchKeyWords({ which_search: 1 })
        if (result.code === 0) {
          keywordsList.value = result.data.list.splice(0, 10) || []
          showSearchKeywords.value = true
        } else {
          Toast(result.msg)
        }
      } catch (e) {
        console.log(e)
      }
    }

    // 选择关键词
    const selectKeyword = (name) => {
      // console.log(name)
      state.inputVal = name
      showSearchKeywords.value = false
      onSearch()
    }

    const clickPage = (e) => {
      showSearchKeywords.value = false
    }

    onMounted(() => {
      onLoad()
      getList()
      const fitForOld = localStorage.getItem('fitForOld') || 0
      fitForOld == 1 ? (document.getElementById('app').className = 'scale2') : (document.getElementById('app').className = 'scale1')
    })

    watch(
      () => state.inputVal,
      (val) => {
        if (!!val) {
          showSearchBtn.value = true
        } else {
          onSearch() //当搜索内容清空后重新搜索
          showSearchBtn.value = false
        }
      },
      { immediate: true }
    )

    return {
      state,
      dayjs,
      onSearch,
      checkDetail,
      onRefresh,
      fetchList,
      onLoad,
      showSearchBtn,
      rollingState,
      isOpen,
      setListState,
      questionList,
      setLikeState,
      commentSucccess,
      toMore,
      showTranscribePopup,
      end,
      getVoiceVale,
      getSelectTab,
      onFocus,
      keywordsList,
      showSearchKeywords,
      selectKeyword,
      clickPage
    }
  }
})
</script>

<style scoped lang="less">
.masterCon {
  box-sizing: border-box;
  min-height: 100vh;
  // position: relative;
  header {
    overflow: hidden;
    background: #fff;
    .search {
      // position: relative;
      padding: 0.3rem 0.2rem 0 0.2rem;
      display: flex;
      background: #fff;
      align-items: center;
      justify-content: space-between;
      padding: 0 0.3rem 0;
      height: 0.88rem;
      img {
        width: 0.35rem;
        position: absolute;
        pointer-event: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
      }
      .van-icon-search {
        position: absolute;
        font-size: 0.36rem;
        left: 0.5rem;
        color: #999;
        font-weight: bold;
      }
      span {
        font-size: 0.28rem;
        font-weight: 500;
        color: #666;
        margin-left: 0.3rem;
      }
      input {
        background-color: #f6f6f6;
        height: 0.64rem;
        flex: 1;
        border-radius: 0.3rem;
        font-size: 0.28rem;
        text-indent: 0.6rem;
        line-height: normal;
      }

      .search-keywords {
        width: 100vw;
        padding: 0 0.32rem;
        position: absolute;
        top: 0.88rem;
        left: 0;
        box-sizing: border-box;
        z-index: 1;

        .content {
          border-radius: 0.08rem;
          box-shadow: 0px 0.04rem 0.16rem rgba(0, 0, 0, 0.16);
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          background: #fff;
          padding: 0.12rem 0.32rem 0.32rem;
          .item {
            padding: 0.04rem 0.16rem;
            background: #f6f7f8;
            opacity: 1;
            border-radius: 0.32rem;
            margin-right: 0.16rem;
            font-size: 0.24rem;
            font-weight: 500;
            line-height: 0.26rem;
            color: #666666;
            margin-top: 0.2rem;
          }
        }
      }
    }
  }
  .declare_form {
    position: relative;
    border-radius: 0.16rem;
    overflow: hidden;
    padding: 0 0.3rem;
    padding-bottom: 0.5rem;
    width: 6.26rem;
    width: 83.4%;
    margin: 0.3rem auto 0;
    background: #fff;
    .itemCon {
      padding-top: 0.4rem;
      background-color: #fff;
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
  }

  .QA {
    width: 6.86rem;
    margin: 0.32rem auto 1rem;
    border-radius: 0.16rem;
    overflow: hidden;
    background: #fff;
    .folding-bar {
      height: 0.98rem;
      display: flex;
      align-items: center;
      position: relative;
      border-bottom: 1px solid #e8e9ec;
      &::before {
        content: '';
        display: block;
        width: 0.08rem;
        height: 0.4rem;
        background: url('./img/side.png') no-repeat;
        background-size: 100%;
        position: absolute;
        left: 0;
      }
      .title {
        font-size: 0.36rem;
        color: #2b333f;
        display: flex;
        align-items: center;
        margin-left: 0.3rem;
        font-weight: bold;
        .van-icon {
          margin-left: 0.16rem;
          transition: all 0.3s;
        }
      }
      .more {
        margin: 0 0.3rem 0 auto;
        font-size: 0.24rem;
        color: #999999;
      }
    }
    .list {
      padding: 0 0.3rem;
      transition: all 0.3s;
    }
    .shut {
      height: 0;
    }
  }
}
</style>
<style lang="less">
.declare_form {
  .classify-tab {
    margin-bottom: 0.3rem;
    padding: 0 0.2rem;
    height: 1rem;
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
      margin-right: 0.2rem;
      flex: none;
    }
    .van-tab--active {
      color: #1b82ec;
      border-radius: 0.05rem;
      background: rgb(227, 240, 253);
    }
  }
  .van-rate__icon {
    font-size: 0.4rem;
  }
  .van-icon-star-o:before {
    color: #1b82ec;
  }
}
</style>
