<template>
  <div class="masterCon">
    <div class="masterInner">
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
        <div class="timeContent">{{ state.detail.created_at }}</div>
      </div>
      <div class="contentCon" :class="state.ZLBFitForOld ? 'contentConOld' : ''">
        <div v-html="state.detail.content"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Toast } from 'vant'
import { isZLB } from '@/util/index'
import Request from '@/service/request'
import { genHtmlTableWraper } from '@/util/index'

export default defineComponent({
  setup(props, { emit }) {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      detail: {},
      ZLBFLAG: isZLB(),
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false
    })
    const fetchList = () => {
      if (Route.query.id) {
        if (state.ZLBFLAG) {
          Request.fetchAttractInvestmentInfoMGOP({ id: Route.query.id }).then((res) => {
            if (res) {
              res.data.data.content = genHtmlTableWraper(res.data.data.content)
              state.detail = res.data.data
            } else {
              Toast(res.msg)
            }
          })
        } else {
          Request.fetchAttractInvestmentInfo({ id: Route.query.id }).then((res) => {
            if (res && res.code == 0) {
              res.data.content = genHtmlTableWraper(res.data.content)
              state.detail = res.data
            } else {
              Toast(res.msg)
            }
          })
        }
      }
    }
    onMounted(() => {
      fetchList()
    })
    const onSearch = () => {
      let keyWards = state.inputVal
      if (keyWards) {
        state.listData = state.listData.filter((item) => item.title.includes(keyWards))
      } else {
        fetchList()
      }
    }
    const checkDetail = (item) => {
      Router.push({
        name: item.name
      })
    }
    return {
      state,
      onSearch,
      checkDetail
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
  background: #1b82ec;
  opacity: 1;
  border-radius: 0.03rem;
  margin-right: 0.06rem;
  margin-top: 0.02rem;
}
.tagText {
  font-size: 0.3rem;
  line-height: 0.35rem;
  color: #333;
}
.tagTextOld {
  font-size: 0.4rem;
  line-height: 0.43rem;
}
.homeTag {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
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
.contentCon {
  margin-top: 0.4rem;
  font-weight: 500;
  :deep(p) {
    line-height: 0.36rem !important;
    color: #333 !important;
    font-size: 0.28rem !important;
  }
  :deep(span) {
    line-height: 0.36rem !important;
    color: #333 !important;
    font-size: 0.28rem !important;
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
  width: 100%;
  td,
  th {
    border: 1px solid #333;
    border-collapse: collapse;
  }
  td {
    width: 100px !important;

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
