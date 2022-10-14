<!-- 项目监测地图 -->
<template>
  <div style="height: 100%">
    <div class="map" id="map"></div>
    <Loading :visiable="loading"></Loading>
  </div>
</template>

<script>
import { reactive, toRefs, watch, onMounted, ref } from "vue";
import * as echarts from "echarts";
import axios from "axios";
import { Toast } from "vant";
import dayjs from "dayjs";
import Loading from "@/components/loading";

export default {
  name: "MapMonitor",
  components: { Loading },
  props: {
    list: {
      type: Array,
      default: [],
    },
  },
  setup(props, context) {
    const state = reactive({
      highlight_region: reactive([]), // 高亮区域
      points: reactive([]), // 打点数据
      overdue_0_list: reactive([]), // 正常数据
      overdue_0_5_list: reactive([]), // 逾期0.5年
      overdue_1_list: reactive([]), // 逾期1年
      overdue_2_list: reactive([]), // 逾期2年
      loading: ref(false),
    });
    let chartInstance = null;

    onMounted(() => {
      initMap();
    });

    // 地区名称与pinyin（对应地图数据文件名）
    const cityMap = {
      江山市: "jiangshan",
      上余镇: "shangyu",
      清湖街道: "qinghu",
      四都镇: "sidu",
      坛石镇: "tanshi",
      大桥镇: "daqiao",
      新塘边镇: "xintangbian",
      长台镇: "changtai",
      凤林镇: "fenglin",
      石门镇: "shimen",
      大陈乡: "dachen",
      双塔街道: "shuangta",
      虎山街道: "hushan",
      廿八都镇: "nianbadu",
      峡口镇: "xiakou",
      贺村镇: "hecun",
      碗窑乡: "wanyao",
      保安乡: "baoan",
      张村乡: "zhangcun",
      塘源口乡: "tangyuankou",
    };

    // 项目图标 0-正常未逾期 1-逾期半年 2-逾期一年 3-逾期两年
    const projectIcon = {
      0: "image://https://img.hzanchu.com/acimg/26327920ae99896a6e57bbb8569430a8.png",
      1: "image://https://img.hzanchu.com/acimg/59a800550aa7dbf20cd99bf319086205.png",
      2: "image://https://img.hzanchu.com/acimg/c45c5050fc84d353b7fa5931161636d6.png",
      3: "image://https://img.hzanchu.com/acimg/c0d0492af690290ec12c6a72271ed2af.png",
    };

    const extendsMap = function (id, opt) {
      // 实例
      var myChart = echarts.init(document.getElementById(id));

      var curGeoJson = {};

      var geoCoordMap = {
        虎山街道: [118.627228, 28.73796],
        清湖街道: [118.609773, 28.676428],
        峡口镇: [118.521078, 28.46682],
        张村乡: [118.675298, 28.561335],
        塘源口乡: [118.742384, 28.598293],
      };

      var defaultOpt = {
        mapName: "china", // 地图展示
        goDown: false, // 是否下钻
        bgColor: "#fff", // 画布背景色
        activeArea: [], // 区域高亮,同echarts配置项
        data: [],
        // 下钻回调(点击的地图名、实例对象option、实例对象)
        callback: function (name, option, instance) {},
      };
      if (opt) opt = echarts.util.extend(defaultOpt, opt);

      // 层级索引
      var name = [opt.mapName];
      var idx = 0;
      var pos = {
        leftPlus: 90,
        leftCur: 0,
        left: 10,
        top: 10,
      };

      var line = [
        [0, 0],
        [8, 11],
        [0, 22],
      ];

      var style = {
        font: '18px "Microsoft YaHei", sans-serif',
        textColor: "#333",
        lineColor: "#333",
      };

      var handleEvents = {
        /**
         * i 实例对象
         * o option
         * n 地图名
         **/
        resetOption: function (i, o, n) {
          var breadcrumb = this.createBreadcrumb(n);

          var j = name.indexOf(n);
          var l = o.graphic.length;
          if (j < 0) {
            o.graphic.push(breadcrumb);
            o.graphic[0].children[0].shape.x2 = 145;
            o.graphic[0].children[1].shape.x2 = 145;
            if (o.graphic.length > 2) {
              for (var x = 0; x < opt.data.length; x++) {
                if (n === opt.data[x].name + "市") {
                  // o.series[0].data = handleEvents.initSeriesData([opt.data[x]]);
                  o.series[0].data = state.points;
                  break;
                } else o.series[0].data = [];
              }
            }
            name.push(n);
            idx++;
          } else {
            o.graphic.splice(j + 2, l);
            if (o.graphic.length <= 2) {
              o.graphic[0].children[0].shape.x2 = 70;
              o.graphic[0].children[1].shape.x2 = 70;
              // o.series[0].data = handleEvents.initSeriesData(opt.data);
              o.series[0].data = state.points;
            }
            name.splice(j + 1, l);
            idx = j;
            pos.leftCur -= pos.leftPlus * (l - j - 1);
          }

          o.geo.map = n;
          o.geo.zoom = 0.4;
          i.clear();
          i.setOption(o);
          this.zoomAnimation();
          opt.callback(n, o, i);
        },

        /**
         * name 地图名
         **/
        createBreadcrumb: function (name) {
          var breadcrumb = {
            type: "group",
            id: name,
            left: pos.leftCur + pos.leftPlus,
            top: pos.top + 3,
            children: [
              {
                type: "polyline",
                left: -90,
                top: -8,
                shape: {
                  points: line,
                },
                style: {
                  stroke: "#333",
                  key: name,
                },
                onclick: function () {
                  var name = this.style.key;
                  handleEvents.resetOption(myChart, option, name);
                },
              },
              {
                type: "text",
                left: -68,
                top: "middle",
                style: {
                  text: name,
                  textAlign: "center",
                  fill: style.textColor,
                  font: style.font,
                },
                onclick: function () {
                  var name = this.style.text;
                  handleEvents.resetOption(myChart, option, name);
                },
              },
              {
                type: "text",
                left: -68,
                top: 10,
                style: {
                  name: name,
                  text: cityMap[name] ? cityMap[name].toUpperCase() : "",
                  textAlign: "center",
                  fill: style.textColor,
                  font: '12px "Microsoft YaHei", sans-serif',
                },
                onclick: function () {
                  // console.log(this.style);
                  var name = this.style.name;
                  handleEvents.resetOption(myChart, option, name);
                },
              },
            ],
          };

          pos.leftCur += pos.leftPlus;

          return breadcrumb;
        },

        // 设置effectscatter
        initSeriesData: function (data) {
          var temp = [];
          for (var i = 0; i < data.length; i++) {
            var geoCoord = geoCoordMap[data[i].name];
            if (geoCoord) {
              temp.push({
                ...data[i],
                value: geoCoord.concat(data[i].value),
              });
            }
          }
          console.log(temp);
          return temp;
        },

        zoomAnimation: function () {
          var count = null;
          var zoom = function (per) {
            if (!count) count = per;
            count = count + per;
            // console.log(per,count);
            myChart.setOption({
              geo: {
                zoom: count,
              },
            });
            if (count < 1)
              window.requestAnimationFrame(function () {
                zoom(0.2);
              });
          };
          window.requestAnimationFrame(function () {
            zoom(0.2);
          });
        },
      };

      var option = {
        backgroundColor: opt.bgColor,
        legend: {
          selectedMode: false,
          itemWidth: 17,
          itemHeight: 20,
          right: 10,
          bottom: 10,
          width: 200,
          orient: "vertical",
          itemStyle: {
            color: "#333",
            fontSize: 20,
          },
          data: [
            {
              name: "正常",
              icon: projectIcon[0],
            },
            {
              name: "逾期半年",
              icon: projectIcon[1],
            },
            {
              name: "逾期一年",
              icon: projectIcon[2],
            },
            {
              name: "逾期两年",
              icon: projectIcon[3],
            },
          ],
        },
        graphic: [
          {
            type: "group",
            left: pos.left,
            top: pos.top - 4,
            children: [
              {
                type: "line",
                left: 0,
                top: -20,
                shape: {
                  x1: 0,
                  y1: 0,
                  x2: 70,
                  y2: 0,
                },
                style: {
                  stroke: style.lineColor,
                },
              },
              {
                type: "line",
                left: 0,
                top: 20,
                shape: {
                  x1: 0,
                  y1: 0,
                  x2: 70,
                  y2: 0,
                },
                style: {
                  stroke: style.lineColor,
                },
              },
            ],
          },
          {
            id: name[idx],
            type: "group",
            left: pos.left + 2,
            top: pos.top,
            children: [
              {
                type: "polyline",
                left: 90,
                top: -12,
                shape: {
                  points: line,
                },
                style: {
                  stroke: "transparent",
                  key: name[0],
                },
                onclick: function () {
                  var name = this.style.key;
                  handleEvents.resetOption(myChart, option, name);
                },
              },
              {
                type: "text",
                left: 0,
                top: "middle",
                style: {
                  text: name[0] === "江山" ? "江山市" : name[0],
                  textAlign: "center",
                  fill: style.textColor,
                  font: style.font,
                },
                onclick: function () {
                  handleEvents.resetOption(myChart, option, "江山");
                },
              },
              {
                type: "text",
                left: 0,
                top: 10,
                style: {
                  text: "JIANGSHAN",
                  textAlign: "center",
                  fill: style.textColor,
                  font: '12px "Microsoft YaHei", sans-serif',
                },
                onclick: function () {
                  handleEvents.resetOption(myChart, option, "江山");
                },
              },
            ],
          },
        ],
        geo: {
          map: opt.mapName,
          scaleLimit: {
            min: 1,
            max: 10,
          },
          roam: true,
          label: {
            show: true,
            color: "#4F565E",
          },
          itemStyle: {
            borderColor: "#8CC0F5",
            borderWidth: 1,
            areaColor: "#D1E6FB",
          },
          emphasis: {
            label: { color: "#4F565E" },
            itemStyle: {
              borderColor: "#8CC0F5",
              borderWidth: 1,
              areaColor: "#8CC0F5",
            },
          },
          regions: [],
        },
        series: [
          {
            name: "正常",
            type: "scatter",
            coordinateSystem: "geo",
            symbolSize: [25, 30],
            itemStyle: {
              opacity: 1,
            },
            data: state.overdue_0_list,
          },
          {
            name: "逾期半年",
            type: "scatter",
            coordinateSystem: "geo",
            symbolSize: [25, 30],
            itemStyle: {
              opacity: 1,
            },
            data: state.overdue_0_5_list,
          },
          {
            name: "逾期一年",
            type: "scatter",
            coordinateSystem: "geo",
            symbolSize: [25, 30],
            itemStyle: {
              opacity: 1,
            },
            data: state.overdue_1_list,
          },
          {
            name: "逾期两年",
            type: "scatter",
            coordinateSystem: "geo",
            symbolSize: [25, 30],
            itemStyle: {
              opacity: 1,
            },
            data: state.overdue_2_list,
          },
        ],
      };

      myChart.setOption(option);

      // 添加事件
      myChart.on("click", function (params) {
        if (params.seriesType == "scatter") {
          // 点击的标记点
          const pointValue = params.data; // 点数据
          context.emit("getList", pointValue.value[2]);
        } else {
          // 点击的地图 下钻 重置数据触发父组件查询方法
          context.emit("getList", params.name);
          // var _self = this;
          // if (opt.goDown && params.name !== name[idx]) {
          //   if (cityMap[params.name]) {
          //     var city_pinyin = cityMap[params.name];
          //     import(`@/assets/geojson/${city_pinyin}`).then((response) => {
          //       curGeoJson = response.default;
          //       echarts.registerMap(params.name, response.default);
          //       handleEvents.resetOption(_self, option, params.name);
          //     });
          //   }
          // }
        }
      });

      myChart.setMap = function (mapName) {
        var _self = this;
        if (mapName.indexOf("市") < 0) mapName = mapName + "市";
        var citySource = cityMap[mapName];
        if (citySource) {
          var url = "./map/" + citySource + ".json";
          axios.get(url).then((response) => {
            // console.log(response);
            curGeoJson = response;
            echarts.registerMap(mapName, response);
            handleEvents.resetOption(_self, option, mapName);
          });
        }
        // handleEvents.resetOption(this, option, mapName);
      };

      return myChart;
    };

    const initMap = () => {
      import("@/assets/geojson/jiangshan")
        .then((geoJson) => {
          echarts.registerMap("江山", geoJson.default);
          chartInstance = new extendsMap("map", {
            bgColor: "#F4F6FA", // 画布背景色
            mapName: "江山", // 地图名
            goDown: false, // 是否下钻
            // 下钻回调
            callback: function (name, option, instance) {
              console.log(name, option, instance);
            },
            data: [],
          });
        })
        .catch((err) => {
          console.log(err);
          state.loading = false;
        });
    };

    // 处理返回数据 过滤出点和需高亮项
    const handleList = (list) => {
      if (!list || !list.length) return;
      try {
        state.loading = true;
        let highlight_region = [];
        let points = [];
        let overdue_0_list = [];
        let overdue_0_5_list = [];
        let overdue_1_list = [];
        let overdue_2_list = [];
        list.forEach((item) => {
          if (item.is_hign) {
            highlight_region.push(item.town_name);
          }
          const project_overview = item.project_overview;
          if (project_overview && project_overview.list.length) {
            // 遍历项目对象 组装地图打点数据
            project_overview.list.forEach((v) => {
              if (v.build_end_at) {
                const diffDays = dayjs(new Date()).diff(v.build_end_at, "day");
                if (diffDays >= 0 && diffDays <= 183) {
                  // 逾期半年内
                  overdue_0_5_list.push({
                    name: item.town_name,
                    symbol: projectIcon[1],
                    value: v.WGS84.concat([item.id]),
                  });
                } else if (diffDays > 183 && diffDays <= 365) {
                  // 逾期一年内
                  overdue_1_list.push({
                    name: item.town_name,
                    symbol: projectIcon[2],
                    value: v.WGS84.concat([item.id]),
                  });
                } else if (diffDays > 365) {
                  // 逾期两年内
                  overdue_2_list.push({
                    name: item.town_name,
                    symbol: projectIcon[3],
                    value: v.WGS84.concat([item.id]),
                  });
                } else {
                  // 正常
                  overdue_0_list.push({
                    name: item.town_name,
                    symbol: projectIcon[0],
                    value: v.WGS84.concat([item.id]),
                  });
                }
              }
              points.push({
                name: item.town_name,
                symbol: projectIcon[getOverDueLevel(v.build_end_at)],
                value: v.WGS84.concat([item.id]),
              });
            });
          }
        });
        console.log("高亮数据", highlight_region);
        console.log("打点数据", points);
        state.highlight_region = highlight_region;
        state.points = points;
        state.overdue_0_list = overdue_0_list;
        state.overdue_0_5_list = overdue_0_5_list;
        state.overdue_1_list = overdue_1_list;
        state.overdue_2_list = overdue_2_list;
        chartInstance.setOption({
          // series: [{ data: state.points }],
          series: [
            { data: state.overdue_0_list },
            { data: state.overdue_0_5_list },
            { data: state.overdue_1_list },
            { data: state.overdue_2_list },
          ],
          geo: {
            regions: generateHighlightData(highlight_region),
          },
        });
        // setTimeout(() => {
        state.loading = false;
        // }, 1000);
      } catch (error) {
        console.log(error);
        state.loading = false;
      }
    };

    // 判断逾期期限 返回不同索引 对应图标地址
    function getOverDueLevel(endDate) {
      if (endDate) {
        const diffDays = dayjs(new Date()).diff(endDate, "day");
        if (diffDays >= 0 && diffDays <= 183) {
          return 1; // 逾期半年内
        } else if (diffDays > 183 && diffDays <= 365) {
          return 2; // 逾期一年内
        } else if (diffDays > 365) {
          return 3; // 逾期两年内
        } else {
          return 0; // 正常
        }
      } else {
        return 0;
      }
    }

    // 生成高亮region数据
    function generateHighlightData(data) {
      return data.map(function (item) {
        if (typeof item !== "string") {
          return {
            name: item.name,
            itemStyle: {
              areaColor: item.areaColor || "#8CC0F5",
            },
            label: {
              show: item.showLabel,
              color: "#fff",
            },
          };
        } else {
          return {
            name: item,
            itemStyle: {
              borderColor: "#8CC0F5",
              areaColor: "#8CC0F5",
            },
          };
        }
      });
    }

    watch(
      () => props.list,
      (newVal) => {
        handleList(newVal);
      },
      { deep: true }
    );

    return {
      ...toRefs(state),
    };
  },
};
</script>

<style lang='less' scoped>
.map {
  width: 100vw;
  height: 100%;
}
</style>