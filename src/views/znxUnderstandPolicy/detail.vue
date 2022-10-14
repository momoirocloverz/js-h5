<template>
  <div class="masterCon">
    <div class="masterInner">
      <div class="tagText">{{ state.detail.title }}</div>

      <div class="contentCon">
        <div v-html="state.detail.content" class="con"></div>
      </div>
    </div>
    <Loading :visiable="visiable"></Loading>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Toast } from 'vant'
import { isZLB } from '@/util/index'
import Request from '@/service/request'
import Loading from '@/components/loading'

export default defineComponent({
  name: 'understandPolicyDetail',
  components: { Loading },
  setup(props, context) {
    const Route = useRoute()
    const state = reactive({
      ZLBFLAG: isZLB(),
      detail: {}
    })

    onMounted(() => {
      Request.szUnderstandPaperGetInfo({
        id: Route.query.id
      }).then((res) => {
        if (res.code == 0) {
          console.log(res)
          state.detail = res.data.info
        }
      })
    })

    return {
      state
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
}

.tagText {
  width: 100%;
  height: auto;
  padding-bottom: 16px;
  margin-bottom: 16px;
  box-sizing: border-box;
  border-bottom: 1px solid #e8e9ec;
  line-height: 0.45rem;
  font-weight: bold;
  text-align: center;
  font-size: 0.34rem;

  color: #333;
}

.con {
  font-size: 0.28rem;
  line-height: 0.4rem;
}

.contentCon {
  margin-top: 0.3rem;
  padding-bottom: 16px;
  box-sizing: border-box;
  font-size: 0.28rem;
  font-weight: 500;
  line-height: 0.36rem;
  color: #333;
}

.marBottom20 {
  margin-bottom: 0.24rem;
}

.masterCon {
  box-sizing: border-box;
  background: #f5f7fa;
  min-height: 100vh;

  .masterInner {
    box-sizing: border-box;
    padding: 0.3rem;
    border-radius: 0.15rem;
    margin-bottom: 0.16rem;
    background-color: #fff;
  }

  .masterInner:last-child {
    margin-bottom: 0;
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
  width: 100% !important;
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
