<!-- 治理端首页 -->
<template>
  <div class="page-dashboard">
    <div class="board-list">
      <div
        class="board-list-item"
        v-for="(item, index) in boardList"
        :key="index"
        :style="{
          background: `url(${item.bg}) no-repeat`,
          backgroundSize: '100% 100%',
        }"
      >
        <div class="left">
          <img :src="item.icon" alt="icon" class="icon" />
        </div>
        <div class="right">
          <div class="title">{{ item.title }}</div>
          <div class="value">
            <div class="number">{{ boardData[item.key] || 0 }}</div>
            <div class="symbol">{{ item.suffix }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="chart-block">
      <div class="item-title">项目占比情况分析</div>
      <div class="chart-content">
        <ChartComponent chartId="ring-chart" :option="option" height="6.6" />
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, shallowRef } from "vue";
import ChartComponent from "@/components/Chart";
import Request from "@/service/operation";

export default {
  name: "dashboard",
  components: { ChartComponent },
  setup() {
    const state = reactive({
      boardList: [
        {
          title: "线上申报项目总数",
          icon: "https://img.hzanchu.com/acimg/8ce9603d00d026ed6b315a9bd287447c.png",
          bg: "https://img.hzanchu.com/acimg/d80993b76761e33d1d11c0ab20621830.png",
          suffix: "件",
          key: "project_sum",
        },
        {
          title: "待办项目数量",
          icon: "https://img.hzanchu.com/acimg/2b331260bafdda32b650e97d8be44c67.png",
          bg: "https://img.hzanchu.com/acimg/d7a7dd8aa35ff6efc3d0b1c7645f9a61.png",
          suffix: "件",
          key: "project_todo",
        },
        {
          title: "上级下达资金总数",
          icon: "https://img.hzanchu.com/acimg/0209befa3e7ac505ff85e4979b188604.png",
          bg: "https://img.hzanchu.com/acimg/8ce06e508abd13731eccf39fbfbc27ea.png",
          suffix: "万元",
          key: "project_amount",
        },
        {
          title: "已兑现资金",
          icon: "https://img.hzanchu.com/acimg/7195aea8aa85a4bdd4b9e57bb1a13676.png",
          bg: "https://img.hzanchu.com/acimg/b2b8ad1c8aec22b2d5893e7da6486acd.png",
          suffix: "万元",
          key: "already_amount",
        },
        {
          title: "已下达项目数量",
          icon: "https://img.hzanchu.com/acimg/a423152e4b5443189c433b98d92b01d3.png",
          bg: "https://img.hzanchu.com/acimg/bfddf6584912b7f84817a5fc154895e1.png",
          suffix: "个",
          key: "project_num",
        },
        {
          title: "明白纸发布数量",
          icon: "https://img.hzanchu.com/acimg/50bd37e72e95a2657779fb8766fde6c3.png",
          bg: "https://img.hzanchu.com/acimg/0e30307e0e75c3548f24f37e0733fb35.png",
          suffix: "条",
          key: "understand_page",
        },
        {
          title: "注册用户数量",
          icon: "https://img.hzanchu.com/acimg/aa0d8c0fd4898f7aa93d739b32237962.png",
          bg: "https://img.hzanchu.com/acimg/d80993b76761e33d1d11c0ab20621830.png",
          suffix: "人",
          key: "register_users",
        },
        {
          title: "逾期项目",
          icon: "https://img.hzanchu.com/acimg/a8312cbca86e2d49396f7e1d0a87ddf8.png",
          bg: "https://img.hzanchu.com/acimg/01d4d6cac5766a987f35cfb16b7e1eaa.png",
          suffix: "个",
          key: "overdue_project_count",
        },
      ],
      option: shallowRef({}), // 圆环图配置
      boardData: reactive({}), // 看板数据
      chartData: reactive([]), // 图表数据
    });

    onMounted(() => {
      getData();
      setChartOption();
    });

    const getData = () => {
      Request.getHomeData()
        .then((res) => {
          const {
            business_sum,
            business_sum: { project_analyse },
            overdue_project_count,
            project_situation_info,
          } = res.data;
          state.boardData = {
            ...business_sum,
            ...project_analyse,
            overdue_project_count,
          };
          delete state.boardData.project_analyse;
          if (project_situation_info) {
            const { jzx, yjf, jg, hy, whh } = project_situation_info;
            state.chartData = [
              { name: "胡羊", value: hy },
              { name: "有机肥", value: yjf },
              { name: "秸秆", value: jg },
              { name: "无害化", value: whh },
              { name: "竞争性", value: jzx },
            ];
            setChartOption();
          }
        })
        .catch((err) => {});
    };

    const setChartOption = () => {
      state.option = {
        tooltip: {
          show: false,
          trigger: "item",
        },
        legend: {
          bottom: "5%",
          left: "center",
          itemWidth: 12,
          itemHeight: 12,
          icon: "rect",
          textStyle: {
            fontSize: 12,
          },
        },
        series: [
          {
            name: "项目占比分析",
            type: "pie",
            center: ["50%", "40%"],
            radius: ["35%", "45%"],
            hoverAnimation: false,
            avoidLabelOverlap: false,
            label: {
              formatter: "{b}:\n{d}%",
              minMargin: 5,
              edgeDistance: 10,
              lineHeight: 15,
              color: "#333",
            },
            labelLine: {
              // length: 15,
              // length2: 0,
              //  color: "#fft",
              // maxSurfaceAngle: 80,
            },
            data: state.chartData,
          },
        ],
      };
    };
    return {
      ...toRefs(state),
    };
  },
};
</script>

<style lang='less' scoped>
.page-dashboard {
  padding: 0.3rem;

  .board-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    &-item {
      width: 3.3rem;
      height: 1.6rem;
      background-color: #fff;
      margin-bottom: 0.3rem;
      display: flex;
      align-items: center;
      padding-left: 0.2rem;

      .left {
        .icon {
          width: 0.82rem;
          height: 0.82rem;
          margin-right: 0.15rem;
        }
      }
      .right {
        color: #fff;
        .title {
          font-family: "YouSheBiaoTiHei";
          margin-bottom: 0.1rem;
        }

        .value {
          display: flex;
          align-items: baseline;
          .number {
            font-size: 0.48rem;
            font-weight: 500;
          }
          .symbol {
            font-size: 0.24rem;
          }
        }
      }
    }
  }

  .chart-block {
    .item-title {
      position: relative;
      font-size: 0.3rem;
      font-weight: bold;
      color: #333333;
      padding-left: 0.16rem;
      margin-bottom: 0.2rem;

      &::before {
        content: "";
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

    .chart-content {
      min-height: 6.6rem;
      background: #ffffff;
      border-radius: 0.16rem;
    }
  }
}
</style>