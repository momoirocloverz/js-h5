<template>
  <div class="infoCon">
    <van-cell title="用户名" :class="state.ZLBFitForOld ? 'cellOld' : ''">
      <template #value>
        {{
          state.info.username
            ? state.info.username.replace(state.info.username.substr(0, 1), '*')
            : ''
        }}
      </template>
    </van-cell>
    <van-cell title="联系方式" :class="state.ZLBFitForOld ? 'cellOld' : ''">
      <template #value>
        {{
          state.info.mobile &&
          state.info.mobile.replace(state.info.mobile.substr(3, 4), '****')
        }}</template
      >
    </van-cell>
  </div>
</template>

<script>
import { reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
export default {
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      info: {},
      ZLBFLAG: isZLB(),
      ZLBFitForOld:
        localStorage.getItem('fitForOld') &&
        localStorage.getItem('fitForOld') == 1
          ? true
          : false,
    })
    const toEdit = () => {
      Router.push({
        name: 'infoPhoneEdit',
      })
    }
    const fetchUserInfo = () => {
      if (state.ZLBFLAG) {
        let info = localStorage.getItem('ourUserInfo')
          ? JSON.parse(localStorage.getItem('ourUserInfo'))
          : ''
        if (info) {
          state.info = {
            username: info.username,
            mobile: info.mobile,
          }
        }
      } else {
        Request.getUserInfo()
          .then((res) => {
            if (res && res.code == 0) {
              state.info = res.data.userinfo
            } else {
              Toast(res.msg)
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      }
    }
    onMounted(() => {
      fetchUserInfo()
    })
    return {
      state,
      toEdit,
    }
  },
}
</script>
<style lang="less" scoped>
.infoCon {
  padding: 0.3rem;
  box-sizing: border-box;
}
</style>

<style lang="less">
.infoCon {
  .cellOld {
    .van-cell__title {
      font-size: 0.35rem;
    }
    .van-cell__value {
      font-size: 0.35rem;
    }
  }
}
</style>
