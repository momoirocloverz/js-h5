<template>
  <div class="masterCon">
    <div class="masterInner">
      <van-field readonly v-model="state.name" label="需求人" placeholder="请输入" />
      <van-field readonly v-model="state.mobile" label="手机号码" placeholder="请输入" />
      <div class="title1">政策明白纸依据</div>
      <van-field readonly v-model="state.type" label="投资类型" placeholder="请输入" />
      <div class="title1">标签</div>
      <van-checkbox-group v-model="state.checked">
        <van-cell-group inset class="hello">
          <van-cell v-for="(item, index) in state.options" clickable :key="item.id" :title="`${item.name}`" @click="toggle(index)">
            <template #right-icon>
              <van-checkbox :name="item.id" :ref="(el) => (checkboxRefs[index] = el)" @click.stop />
            </template>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
    </div>
    <div class="fixBottom fixPaddingBottom">
      <van-button class="saveBtn" :class="state.ZLBFitForOld ? 'btnTextOld' : ''" block @click="saveAction" type="primary">确定</van-button>
    </div>
    <Loading :visiable="visiable"></Loading>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, inject, ref, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Toast } from 'vant'
import { isZLB } from '@/util/index'
import Request from '@/service/request'
import Loading from '@/components/loading'
export default defineComponent({
  name: 'understandPolicyDetail',
  components: { Loading },
  setup(props, { emit }) {
    const Router = useRouter()
    const Route = useRoute()
    const visiable = ref(true)
    const state = reactive({
      ZLBFLAG: isZLB(),
      name: '-',
      mobile: '-',
      checkList: [],
      options: [],
      checked: []
    })
    const initKeyInfo = () => {
      let track = localStorage.getItem('ourUserInfo') ? JSON.parse(localStorage.getItem('ourUserInfo')) : ''
      if (track) {
        state.name = track.real_name.replace(track.real_name.substr(0, 1), '*')
        state.mobile = track.mobile.replace(track.mobile.substr(3, 4), '****')
      }
      let array = sessionStorage.getItem('investArray1') ? JSON.parse(sessionStorage.getItem('investArray1')) : ''
      if (array) {
        state.type = array
          .map((ele) => {
            return ele.name
          })
          .join('/')
      }
    }
    const fetchList = () => {
      Request.investTagGetList({
        invest_category_id: Route.query.invest_category_id
      })
        .then((res) => {
          if (res && res.code == 0) {
            state.options = res.data.list
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
        .finally(() => {
          visiable.value = false
        })
    }
    onMounted(() => {
      initKeyInfo()
      fetchList()
      const fitForOld = localStorage.getItem('fitForOld') || 0
      fitForOld == 1 ? (document.getElementById('app').className = 'scale2') : (document.getElementById('app').className = 'scale1')
    })
    const checked = ref([])
    const checkboxRefs = ref([])
    const toggle = (index) => {
      checkboxRefs.value[index].toggle()
    }
    const saveAction = () => {
      Router.replace({
        name: 'investUnderstand',
        query: {
          invest_category_id: Route.query.invest_category_id,
          search_invest_tag_ids: state.checked.length ? JSON.stringify(state.checked) : ''
        }
      })
      emit('confirm', state.checked.length ? JSON.stringify(state.checked) : '')
    }

    return {
      state,
      visiable,
      checked,
      checkboxRefs,
      toggle,
      saveAction
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
.hello {
  margin: 0 !important;
}
.masterCon {
  box-sizing: border-box;
  background: #f5f7fa;
  height: calc(100vh - 1rem);
  overflow-y: scroll;
  padding-bottom: 1.3rem;

  .masterInner {
    margin-top: 0.1rem;
    box-sizing: border-box;
  }
}
.title1 {
  font-size: 0.3rem;
  font-weight: 400;
  color: #999999;
  padding: 0.24rem 0.32rem 0.18rem 0.32rem;
}
.fixBottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
}
.fixPaddingBottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
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
      display: inline-block;
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
