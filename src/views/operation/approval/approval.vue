<!-- 治理端审核 -->
<template>
  <div class="page-approval">
    <div class="project-item">
      <div class="item-title">竞争性财政支农项目</div>
      <div class="item-content">
        <div
          class="item"
          v-for="(item, index) in competitiveProjectList"
          :key="index"
          @click="jumpPage(item)"
        >
          <img :src="item.icon" class="icon" alt="icon" />
          <div class="title">{{ item.title }}</div>
        </div>
      </div>
    </div>

    <div class="project-item">
      <div class="item-title">项目储备</div>
      <div class="item-content">
        <div
          class="item"
          v-for="(item, index) in reserveProjectList"
          :key="index"
          @click="jumpPage(item)"
        >
          <img :src="item.icon" class="icon" alt="icon" />
          <div class="title">{{ item.title }}</div>
          <div class="tag" v-if="auditInfo && auditInfo.project_reserve_count">
            {{ auditInfo.project_reserve_count }}
          </div>
        </div>
      </div>
    </div>

    <div class="project-item">
      <div class="item-title">财政补贴</div>
      <div class="item-content">
        <div
          class="item"
          v-for="(item, index) in farmerProjectList"
          :key="index"
          @click="jumpPage(item)"
        >
          <img :src="item.icon" class="icon" alt="icon" />
          <div class="title">{{ item.title }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/operation'
import { Toast } from 'vant'
export default {
  name: 'approval',
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      auditInfo: {},
      competitiveProjectList: [
        {
          title: '申报审核',
          icon: 'https://img.hzanchu.com/acimg/aa98e07babe47fcf14a69925e76f835d.png',
          url: null,
        },
        {
          title: '实施审核',
          icon: 'https://img.hzanchu.com/acimg/e9fe6b46758724e1d3f28cad7e88e689.png',
          url: null,
        },
        {
          title: '验收审核',
          icon: 'https://img.hzanchu.com/acimg/6d7fb2293215ca9b225be64db9a1dde1.png',
          url: null,
        },
        {
          title: '资金审核',
          icon: 'https://img.hzanchu.com/acimg/6aa61cb1e53508135f9f62547178cb17.png',
          url: null,
        },
      ], // 竞争性财政支农项目
      reserveProjectList: [
        {
          title: '项目储备',
          icon: 'https://img.hzanchu.com/acimg/bac0e3d8bd1878fa34caacd428ecac86.png',
          url: 'operationProjectReserve',
        },
      ], // 项目储备
      farmerProjectList: [
        {
          title: '有机肥使\n用补贴项目',
          icon: 'https://img.hzanchu.com/acimg/d3b4cfc942e8867ce7e7cadacc2e5580.png',
          url: null,
        },
        {
          title: '秸秆综合\n利用项目',
          icon: 'https://img.hzanchu.com/acimg/2c19bdd7f51069aacd9a7ca6e8fcad38.png',
          url: null,
        },
        {
          title: '湖羊产业\n扶持项目',
          icon: 'https://img.hzanchu.com/acimg/f2995ee6b45dcf7bcc34e55b96555bc3.png',
          url: null,
        },
        {
          title: '病死动物\n无害化处理',
          icon: 'https://img.hzanchu.com/acimg/0556bbf9fbde45bbfdc39ccdf7580a80.png',
          url: null,
        },
      ], // 财政补贴
    })
    onMounted(() => {
      fetchSession()
    })
    const fetchSession = () => {
      Request.getAuditCount()
        .then((res) => {
          state.auditInfo = res.data.info
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    const jumpPage = (item) => {
      if (!item.url) {
        return Toast('暂未开放')
      } else {
        Router.push({
          name: item.url,
        })
      }
    }

    return {
      ...toRefs(state),
      jumpPage,
    }
  },
}
</script>
<style lang="less" scoped>
.page-approval {
  padding: 0.3rem;

  .project-item {
    margin-bottom: 0.32rem;

    .item-title {
      position: relative;
      font-size: 0.3rem;
      font-weight: bold;
      color: #333333;
      padding-left: 0.16rem;
      margin-bottom: 0.2rem;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 0.05rem;
        height: 0.28rem;
        background: #1b82ec;
        border-radius: 0.03rem;
      }
    }

    .item-content {
      min-height: 1.62rem;
      background: #ffffff;
      border-radius: 0.16rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.3rem;

      .item {
        width: 1.4rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
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
        &:active {
          background-color: #f0efef;
        }

        .icon {
          width: 0.76rem;
          height: 0.76rem;
          margin-bottom: 0.12rem;
        }

        .title {
          font-size: 0.28rem;
          line-height: 0.34rem;
          color: #333333;
          text-align: center;
        }
      }
    }
  }
}
</style>
