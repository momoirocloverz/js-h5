<!-- 图表组件 -->
<template>
  <div
    class="chart-component"
    :id="chartId"
    :ref="chartId"
    :style="{
      width: width ? `${width}rem` : '100%',
      height: height ? `${height}rem` : '100%',
    }"
  ></div>
</template>

<script>
import { reactive, toRefs, onMounted, onBeforeUnmount, watch } from "vue";
import * as echarts from "echarts";
const chartDefaultOption = {
  grid: {
    containLabel: true,
    top: '10%',
    right: '10%',
    bottom: '10%',
    left: '10%',
  },
  tooltip: {
    trigger: "axis",
  },
  legend: {
    orient: "vertical",
    left: "left",
  },
  xAxis: {
    data: [],
  },
  yAxis: {},
  series: [
    {
      name: "xxx",
      type: "bar",
      radius: "50%",
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
      data: [],
    },
  ],
};
export default {
  props: {
    option: {
      type: Object,
      default: chartDefaultOption,
    }, // 传入的自定义图表配置信息
    chartId: String,
    width: {
      type: String,
      default: "",
    },
    height: {
      type: String,
      default: "",
    },
  },
  name: "ChartComponent",
  setup(props, context) {
    const state = reactive({});
    const color = [
      "#FF5471",
      "#FFD52E",
      "#52CC3D",
      "#30FFF1",
      "#409CFF",
      "#FF5471",
      "#FFD52E",
      "#52CC3D",
      "#30FFF1",
    ];
    onMounted(() => {
      initChart();
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", resizeChart);
    });

    watch(
      () => props.option,
      (newVal) => {
        initChart();
      }
    );

    // 初始化、更新图表
    const initChart = () => {
      const chartInstance = echarts.init(
        document.getElementById(props.chartId)
      );
      chartInstance.setOption({ ...props.option, color }, true);
      window.addEventListener("resize", resizeChart);
    };

    const resizeChart = () => {
      chartInstance && chartInstance.resize();
    };

    return {
      ...toRefs(state),
    };
  },
};
</script>
<style lang='less' scoped>
.chart-component {
}
</style>