<!-- 地图弹窗 -->
<template>
  <div class="page-map-modal">
    <van-dialog v-model:show="showModal" :show-confirm-button="false">
      <div class="dialog-content">
        <div class="dialog-title">
          <div>{{ townName }}</div>
          <van-icon
            name="cross"
            class="close-icon"
            color="#B3B5B9"
            @click="closeModal"
          />
        </div>
        <div class="list" v-if="modalData.length">
          <div class="item" v-for="item in modalData" :key="item.project_id">
            <div class="item-content">
              <div class="title">项目名称</div>
              <div class="value">{{ item.project_name || "-" }}</div>
            </div>
            <div class="item-content">
              <div class="title"></div>
              <div class="tag" :style="{ background: `${item.overdue_color}` }">
                {{ item.overdue_text || "-" }}
              </div>
            </div>
            <div class="item-content">
              <div class="title">计划建设内容</div>
              <div class="value">{{ item.build_main_content || "-" }}</div>
            </div>
            <div class="item-content">
              <div class="title">计划建设时间</div>
              <div
                class="value"
                v-if="item.build_start_at && item.build_end_at"
              >
                {{
                  `${dayjs(item.build_start_at).format("YYYY年MM月")}-${dayjs(
                    item.build_end_at
                  ).format("YYYY年MM月")}`
                }}
              </div>
              <div class="value" v-else>-</div>
            </div>
          </div>
        </div>
        <div class="empty" v-else>当前地区暂无<br />竞争性财政支农项目申报</div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, watch } from "vue";
import dayjs from "dayjs";

export default {
  name: "MapModal",
  props: {
    modalData: {
      type: Array,
      default: [],
    },
    showModal: {
      type: Boolean,
      default: false,
    },
    townName: {
      type: String,
      default: "",
    },
  },
  setup(props, context) {
    const state = reactive({});
    onMounted(() => {
      console.log("3.-组件挂载到页面之后执行-------onMounted");
    });

    const closeModal = () => {
      context.emit("closeModal");
    };
    return {
      ...toRefs(state),
      closeModal,
      dayjs,
    };
  },
};
</script>
<style lang='less' scoped>
.page-map-modal {
  .dialog-title {
    height: 0.88rem;
    padding: 0;
    line-height: 0.88rem;
    text-align: center;
    font-size: 0.32rem;
    color: #333333;
    font-weight: bold;
    position: relative;

    :deep(.van-icon) {
      position: absolute;
      right: 0.3rem;
      top: 0.28rem;
    }
  }

  .list {
    padding: 0.14rem 0.24rem;
    max-height: 7rem;
    overflow-y: auto;
    overflow-x: hidden;
    .item {
      background: #f6faff;
      margin-bottom: 0.3rem;
      padding: 0.2rem 0.3rem 0.3rem;

      .item-content {
        display: flex;
        align-items: flex-start;
        margin-bottom: 0.16rem;
        &:last-child {
          margin-bottom: 0;
        }
        .title {
          width: 1.6rem;
          margin-right: 0.15rem;
          font-size: 0.26rem;
          color: #333333;
          text-align: right;
        }

        .value {
          flex: 1;
          font-size: 0.26rem;
          color: #666666;
          word-break: break-all;
        }

        .tag {
          padding: 0 0.16rem;
          height: 0.32rem;
          line-height: 0.32rem;
          text-align: center;
          border-radius: 0.16rem;
          color: #fff;
          font-size: 0.2rem;
        }
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .empty {
    font-size: 0.26rem;
    font-weight: 400;
    line-height: 0.34rem;
    color: #333333;
    text-align: center;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 0.6rem;
  }
}
</style>