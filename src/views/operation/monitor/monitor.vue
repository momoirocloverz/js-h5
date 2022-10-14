<!-- 治理端项目监测 -->
<template>
  <div class="page-monitor">
    <div class="filter-content">
      <div class="filter">
        <div class="filter-item">
          <div class="title">地点</div>
          <div class="value van-ellipsis">
            {{
              currentTowns.length
                ? currentTowns
                    .filter((v) => v.selected)
                    .map((v) => v.text)
                    .join(",")
                : "全部"
            }}
          </div>
        </div>
        <div class="filter-item">
          <div class="title">是否逾期</div>
          <div class="value van-ellipsis">
            {{
              currentOverDues.length
                ? currentOverDues
                    .filter((v) => v.selected)
                    .map((v) => v.text)
                    .join(",")
                : "全部"
            }}
          </div>
        </div>
        <van-button
          class="filter-btn"
          color="#1b82ec"
          @click="openFilterModal"
          v-if="!showFilterModal"
          >筛选</van-button
        >
        <van-button
          class="filter-btn plain"
          color="#fff"
          @click="showFilterModal = false"
          v-else
          >筛选 ×</van-button
        >
      </div>
    </div>

    <div class="map-container">
      <MapMonitor :list="list" @getData="getData" @getList="getList" />
    </div>

    <van-popup
      class="filter-modal"
      style="top: 0.88rem"
      v-model:show="showFilterModal"
      position="top"
    >
      <div class="filter-modal-content">
        <div class="filter-item">
          <div class="filter-item-title">地区</div>
          <div class="filter-item-list">
            <div
              class="item"
              :class="{ selected: item.selected }"
              v-for="(item, index) in towns"
              :key="index"
              @click="tapRegion(item)"
            >
              {{ item.text }}
            </div>
          </div>
        </div>
        <div class="filter-item">
          <div class="filter-item-title">是否逾期</div>
          <div class="filter-item-list">
            <div
              class="item"
              :class="{ selected: item.selected }"
              v-for="(item, index) in overDues"
              :key="index"
              @click="tapOverDues(item)"
            >
              {{ item.text }}
            </div>
          </div>
        </div>
        <div class="bottom-btn">
          <div class="btn plain" @click="reset">重置</div>
          <div class="btn" @click="startFilter">确定</div>
        </div>
      </div>
    </van-popup>

    <van-popup v-model:show="showTownPicker" round position="bottom">
      <van-picker
        :columns="towns"
        @cancel="showTownPicker = false"
        @confirm="onConfirmTown"
      />
    </van-popup>
    <van-popup v-model:show="showOverduePicker" round position="bottom">
      <van-picker
        :columns="overDues"
        @cancel="showOverduePicker = false"
        @confirm="onConfirmOverDues"
      />
    </van-popup>

    <MapModal
      :modalData="modalData"
      :showModal="showModal"
      :townName="townName"
      @closeModal="closeModal"
    ></MapModal>

    <Loading :visiable="loading"></Loading>
  </div>
</template>

<script>
import { reactive, toRefs, onBeforeMount, onMounted, ref } from "vue";
import Request from "@/service/operation";
import { util } from "@/util/index";
import MapMonitor from "@/components/MapMonitor.vue";
import Loading from "@/components/loading";
import MapModal from "./MapModal.vue";

export default {
  name: "monitor",
  components: { MapMonitor, Loading, MapModal },
  setup() {
    const state = reactive({
      towns: reactive([]), // 待选城镇列表
      currentTowns: reactive([]), // 当前已选城镇列表 直接关闭筛选不点确定 towns重置为currentTowns
      overDues: reactive([
        { text: "全部", value: -1, selected: true },
        { text: "未逾期", value: 0, selected: false },
        { text: "逾期", value: 1, selected: false },
      ]), // 待选城镇列表
      currentOverDues: reactive([
        { text: "全部", value: -1, selected: true },
        { text: "未逾期", value: 0, selected: false },
        { text: "逾期", value: 1, selected: false },
      ]), // 当前已选逾期列表
      selectedTowns: reactive([]), // 已选中地区列表
      selectedOverdues: ref(-1), // 逾期状态
      showTownPicker: ref(false),
      showOverduePicker: ref(false),
      showFilterModal: ref(false),
      list: reactive([]), // 地区逾期数据
      loading: ref(false),
      showModal: ref(false), // 地图弹窗控制
      townName: ref(""), // 当前查看城镇名
      modalData: reactive([]), // 弹窗展示数据
    });

    onBeforeMount(() => {
      getTown();
      getData();
    });

    onMounted(() => {});

    // 获取地区数据
    const getTown = () => {
      Request.getTownList()
        .then((res) => {
          let towns = [];
          towns = res.data.list.map((v) => {
            return {
              text: v.town_name,
              value: v.id,
              disabled: false,
              selected: false,
            };
          });
          towns.unshift({
            text: "全部",
            value: -1,
            disabled: false,
            selected: true,
          });
          state.towns = towns;
          state.currentTowns = JSON.parse(JSON.stringify(towns));
        })
        .catch((err) => {});
    };

    // 获取地图数据
    const getData = (name) => {
      const data = {
        marks: ["financial_distribution_list"],
      };
      data.search_is_overdue = state.selectedOverdues;
      if (name) {
        // 子组件下钻触发
        if (name == "江山") {
          data.search_town_ids = [];
        } else {
          // 根据name匹配下钻的对象
          let matchItem = state.towns.filter((v) => v.text == name);
          if (matchItem.length) {
            data.search_town_ids = [matchItem[0].value];
          }
        }
      } else {
        // 通过筛选
        data.search_town_ids =
          state.selectedTowns.length && state.selectedTowns[0] == -1
            ? []
            : state.selectedTowns;
      }
      Request.getHomeData(data)
        .then((res) => {
          state.list = res.data.financial_distribution_list;
        })
        .catch((err) => {});
    };

    // 根据town_id获取竞争性项目列表
    const getList = (town) => {
      let town_id = null;
      state.loading = true;
      const { towns } = state;
      if (Object.prototype.toString.call(town) != "[object Number]") {
        // 点击地块 传入name
        let selextedTown = towns.filter((v) => v.text == town)[0];
        town_id = selextedTown.value;
        state.townName = town;
      } else {
        let selextedTown = towns.filter((v) => v.value == town)[0];
        town_id = town;
        state.townName = selextedTown.text;
      }
      Request.getProjectListByTownId({ town_id })
        .then((res) => {
          state.modalData = res.data.list.map((v) => {
            if (v.overdue_year == 0) {
              v.overdue_text = "正常";
              v.overdue_color = "#08C961";
            } else if (v.overdue_year == 0.5) {
              v.overdue_text = "逾期半年";
              v.overdue_color = "#F8D12E";
            } else if (v.overdue_year == 1) {
              v.overdue_text = "逾期一年";
              v.overdue_color = "#FF7638";
            } else if (v.overdue_year == 1) {
              v.overdue_text = "逾期两年";
              v.overdue_color = "#E02020";
            }
            return v;
          });
          state.showModal = true;
        })
        .catch((err) => {})
        .finally(() => {
          state.loading = false;
        });
    };

    // 打开筛选弹窗
    const openFilterModal = () => {
      state.towns = JSON.parse(JSON.stringify(state.currentTowns));
      state.showFilterModal = true;
    };

    // 点击地区筛选项
    const tapRegion = (item) => {
      const value = item.value;
      const { towns } = state;
      if (value == -1 && !towns[0].selected) {
        // 点击全部 重置
        state.towns = towns.map((v, i) => {
          v.selected = !i;
          return v;
        });
        return;
      }

      // 判断“全部”是否高亮  否：高亮“全部”其他删除高亮
      if (towns[0].selected) {
        // 高亮 判断是否没有选中项 是->选中点击项 否->返回
        if (!towns.some((v) => v.value > -1 && v.selected)) {
          // 无已选中项
          towns.forEach((v) => {
            if (v.value == value) {
              v.selected = !v.selected;
            }
            return v;
          });
          towns[0].selected = false;
          state.towns = towns;
        } else {
          return;
        }
      } else {
        towns.forEach((v) => {
          if (v.value == value) {
            v.selected = !v.selected;
          }
          return v;
        });
        towns[0].selected = false;
        state.towns = towns;
        return;
      }
    };

    // 点击是否逾期筛选项 单选
    const tapOverDues = (item) => {
      const value = item.value;
      const { overDues } = state;

      if (value == -1) {
        // 选中全部 其他清空
        state.overDues = overDues.map((v, i) => {
          v.selected = !i;
          return v;
        });
        return;
      }
      state.overDues = overDues.map((v, i) => {
        v.selected = v.value == value;
        return v;
      });
    };

    // 重置筛选项
    const reset = () => {
      const { towns, overDues } = state;
      state.towns = towns.map((v, i) => {
        v.selected = i == 0;
        return v;
      });
      state.overDues = overDues.map((v, i) => {
        v.selected = i == 0;
        return v;
      });
    };

    // 确定筛选
    const startFilter = () => {
      const { towns, overDues } = state;
      state.selectedTowns = towns.filter((v) => v.selected).map((v) => v.value);
      state.selectedOverdues = overDues.filter((v) => v.selected)[0].value;
      state.currentTowns = towns;
      state.currentOverDues = overDues;
      state.showFilterModal = false;
      getData();
    };

    // 关闭弹窗
    const closeModal = () => {
      state.showModal = false;
      state.modalData = [];
    };

    const throttleGetData = util.throttling(
      () => {
        getData();
      },
      800,
      true
    );

    return {
      ...toRefs(state),
      throttleGetData,
      tapRegion,
      openFilterModal,
      tapOverDues,
      reset,
      startFilter,
      getData,
      getList,
      closeModal,
    };
  },
};
</script>

<style lang='less' scoped>
.page-monitor {
  height: calc(100vh - 1rem);
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .filter-content {
    box-shadow: 0px 0.06rem 0.1rem rgba(0, 0, 0, 0.04);
    position: relative;
    background: #fff;
    z-index: 2;
    .filter {
      height: 0.88rem;
      padding: 0 0.32rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &-item {
        display: flex;
        align-items: center;
        height: 100%;

        .title {
          position: relative;
          font-size: 0.28rem;
          font-weight: 500;
          color: #333333;
          padding-left: 0.16rem;
          margin-right: 0.16rem;

          &::before {
            content: "";
            background: #1b82ec;
            width: 0.08rem;
            height: 0.08rem;
            border-radius: 51%;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }

        .value {
          font-size: 0.28rem;
          font-weight: 500;
          color: #999999;
          width: 1.5rem;
          padding: 0.3rem 0;
        }
      }

      &-btn {
        width: 0.96rem;
        height: 0.48rem;
        background: #1b82ec;
        font-size: 0.28rem;
        padding: 0;
        color: #fff;
        opacity: 1;
        border-radius: 4px;

        &.plain {
          color: #1b82ec !important;
        }
      }
    }
  }

  :deep(.van-overlay) {
    z-index: 1 !important;
  }

  :deep(.filter-modal) {
    z-index: 1 !important;
  }

  .filter-modal {
    &-content {
      padding: 0.3rem 0.1rem 1rem 0.3rem;

      .filter-item {
        &-title {
          font-size: 0.3rem;
          font-weight: 500;
          line-height: 26px;
          margin-bottom: 0.3rem;
        }
        &-list {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          .item {
            width: 2.08rem;
            height: 0.64rem;
            background: #f7f7f7;
            border-radius: 0.04px;
            color: #333333;
            text-align: center;
            line-height: 0.64rem;
            margin-bottom: 0.2rem;
            margin-right: 0.3rem;

            &:nth-child(3n) {
              margin-right: 0;
            }

            &.selected {
              background: url("https://img.hzanchu.com/acimg/c177328a778ede2f62bb28c5d917f42b.png")
                no-repeat;
              background-size: 0.36rem 0.3rem;
              background-position: bottom right;
              background-color: #f0f8ff;
              color: #1b82ec;
            }
          }
        }
      }
    }

    .bottom-btn {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      align-content: center;

      .btn {
        height: 0.88rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        background-color: #1b82ec;
        font-size: 0.32rem;
        flex: 1;

        &.plain {
          background-color: #fff;
          color: #1b82ec;
          border: 0.02rem solid #1b82ec;
        }
      }
    }
  }

  .map-container {
    flex: 1;
  }
}
</style>