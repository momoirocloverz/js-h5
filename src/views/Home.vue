<template>
  <div class="homeMaster">
    <router-view />
    <div
      class="nav-bottom fixBottom"
      :class="state.ZLBFitForOld ? 'navBottomOld' : ''"
      :style="{
        paddingBottom: state.isAndroid ? `0.2rem` : '0.3rem'
      }"
    >
      <div v-for="(item, i) in state.menuList" :key="i" @click="toPage(item)">
        <img :class="item.id == 'voiceFindServe' ? 'voice-img' : ''" :src="state.cur_path === item.router ? item.icon_s : item.icon" />
        <p
          :style="{
            color: state.cur_path === item.router ? '#1B82EC' : '#333'
          }"
          :class="state.ZLBFitForOld ? 'bottomTextOld' : ''"
        >
          {{ item.title }}
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { isZLB } from '@/util/index'
export default {
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      ZLBFLAG: isZLB(),
      isAndroid: false,
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
      menuList: [
        {
          icon: 'https://img.hzanchu.com/acimg/cfab63cd5a2cfa7b4406f96b9995c2bb.png',
          icon_s: 'https://img.hzanchu.com/acimg/3ff1657b7e72cb9e1cac6d61e3f9f88b.png',
          title: '首页',
          router: '/newHome'
        },
        {
          icon: 'https://img.hzanchu.com/acimg/66f1c230a6bbc86d05a23ec0de3c25c5.png',
          icon_s: 'https://img.hzanchu.com/acimg/3690545ca592712ea9a6e5e476cef2f9.png',
          title: '投资',
          router: '/invest'
        },
        {
          icon: 'https://img.hzanchu.com/acimg/6d857364db43fcf59dd8651aaae93e94.png',
          icon_s: 'https://img.hzanchu.com/acimg/6d857364db43fcf59dd8651aaae93e94.png',
          title: '语音找服务',
          id: 'voiceFindServe',
          router: '/voiceFindServe'
        },
        {
          icon: 'https://img.hzanchu.com/acimg/247d099ca818620fc1f26cda79d6c88c.png',
          icon_s: 'https://img.hzanchu.com/acimg/8416cee6e36fcad1f4441b80b6055730.png',
          title: '明白纸',
          router: '/understandPolicy'
        },
        {
          icon: 'https://img.hzanchu.com/acimg/550f621920127f25172807ecf51a1c4c.png',
          icon_s: 'https://img.hzanchu.com/acimg/ed9db01822af9f156a94501c0bd1a104.png',
          title: '我的',
          router: '/mine'
        }
      ]
    })
    const isAndroid = () => {
      const u = navigator.userAgent,
        app = navigator.appVersion
      state.isAndroid = u.indexOf('Android') > -1 //android终端或者uc浏览器
    }
    onMounted(() => {
      isAndroid() //判断是否是安卓或者ios
      state.cur_path = Route.path
    })
    watch(
      () => Route.path,
      (count, prevCount) => {
        state.cur_path = count
      }
    )
    const toPage = (item) => {
      if (item.title != '投资') {
        sessionStorage.removeItem('investCode1')
      }
      Router.replace(item.router)
      state.cur_path = item.router
    }
    return {
      state,
      toPage
    }
  }
}
</script>
<style lang="less" scoped>
.fixBottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.homeMaster {
  padding-bottom: 1rem;
  box-sizing: border-box;
}
.nav-bottom {
  height: 0.9rem;
  width: 100%;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  padding-bottom: 0.3rem; //用于避免被ios自带返回按钮遮挡
  left: 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  z-index: 999;
  div {
    // overflow: hidden;
    text-align: center;
    flex: 1;
    .voice-img {
      width: 1.4rem;
      height: 1.4rem;
      margin-bottom: -0.18rem;
    }
    img {
      width: 0.5rem;
      height: 0.5rem;
      margin-bottom: 0.1rem;
    }
    p {
      font-size: 0.22rem;
      font-weight: 500;
    }
    .bottomTextOld {
      font-size: 0.3rem;
    }
  }
}
.navBottomOld {
  height: 1.3rem;
}
</style>
