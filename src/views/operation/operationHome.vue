<template>
  <div class="homeMaster app-operation">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" v-if="$route.meta.keepAlive" />
      </keep-alive>
      <component :is="Component" v-if="!$route.meta.keepAlive" />
    </router-view>
    <div class="nav-bottom fixBottom">
      <div
        class="tab-item"
        v-for="(item, i) in menuList"
        :key="i"
        @click="toPage(item)"
      >
        <img :src="cur_path === item.router ? item.icon_s : item.icon" />
        <p
          :style="{
            color: cur_path === item.router ? '#1B82EC' : '#333',
          }"
        >
          {{ item.title }}
        </p>
        <div class="tag" v-if="item.hasTag && auditCount">{{ auditCount }}</div>
      </div>
    </div>
    <van-dialog />
  </div>
</template>
<script>
import { ref, reactive, onMounted, watch, toRefs } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { isZLB } from '@/util/index'
import Request from '@/service/operation'
import { Dialog } from 'vant'

export default {
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      auditCount: ref(0), // 待审核数量
      menuList: [
        {
          icon: 'https://img.hzanchu.com/acimg/311e56c25ffd805394fbff5d56c67f5f.png?x-oss-process=image/resize,l_300',
          icon_s:
            'https://img.hzanchu.com/acimg/f44854e43c57fbca29aafe01b917a6c3.png?x-oss-process=image/resize,l_300',
          title: '首页',
          router: '/operation/dashboard',
        },
        {
          icon: 'https://img.hzanchu.com/acimg/a0c4c6eacd45feb80bac93286f5c5f8e.png?x-oss-process=image/resize,l_300',
          icon_s:
            'https://img.hzanchu.com/acimg/f682b5b2fb8031835db00324ae2deb27.png?x-oss-process=image/resize,l_300',
          title: '审核',
          router: '/operation/approval',
          hasTag: true, // 是否需要渲染角标
        },
        {
          icon: 'https://img.hzanchu.com/acimg/0facb1e423eb759609644ac4b78919ad.png?x-oss-process=image/resize,l_300',
          icon_s:
            'https://img.hzanchu.com/acimg/c460e2df3d937f6ee11b8281cfab8d7a.png?x-oss-process=image/resize,l_300',
          title: '项目监测',
          router: '/operation/monitor',
        },
        {
          icon: 'https://img.hzanchu.com/acimg/8426bc77f6948610a506a5f4a3921d06.png?x-oss-process=image/resize,l_300',
          icon_s:
            'https://img.hzanchu.com/acimg/2e2d572fc544268038ccdc6281910779.png?x-oss-process=image/resize,l_300',
          title: '我的',
          router: '/operation/mine',
        },
      ],
      cur_path: ref(''),
    })
    onMounted(() => {
      state.cur_path = Route.path
      getAuditData()
    })
    watch(
      () => Route.path,
      (count, prevCount) => {
        state.cur_path = count
      }
    )
    const toPage = (item) => {
      Router.replace(item.router)
      state.cur_path = item.router
    }

    const getAuditData = () => {
      Request.getAuditCount()
        .then((res) => {
          state.auditCount = res.data.info
            ? res.data.info.project_reserve_count
            : 0
        })
        .catch((err) => {
          console.log('err', err)
        })
    }

    return {
      ...toRefs(state),
      toPage,
    }
  },
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
  box-shadow: 0px -0.02rem 0.14rem rgba(0, 0, 0, 0.1);
  height: 1rem;
  width: 100%;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 999;
  .tab-item {
    // overflow: hidden;
    text-align: center;
    flex: 1;
    position: relative;
    img {
      width: 0.5rem;
    }
    p {
      font-size: 0.22rem;
      font-weight: 500;
    }
    .tag {
      width: 0.3rem;
      height: 0.3rem;
      color: #fff;
      font-size: 0.12rem;
      border-radius: 51%;
      background: #ff5471;
      text-align: center;
      line-height: 0.3rem;
      position: absolute;
      top: -0.05rem;
      left: 52%;
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

<style lang="less">
.app-operation {
  box-sizing: border-box;

  div,
  span {
    box-sizing: border-box;
  }
}
</style>
