<template>
  <div class="main">
    <div class="item" v-for="(item, index) in list.value" :key="index">
      <div class="left">
        <div :class="num <= list.value.length - index - 1 ? 'circle  opacity3' : 'circle'"></div>
        <div :class="num < list.value.length - index ? 'dashed  opacity3' : 'dashed'"></div>
      </div>
      <div class="right" :class="state.ZLBFitForOld ? 'resetStepOld' : ''">
        <p>
          {{ item.label }} <b>{{ item.opinion }}</b>
        </p>
        <p v-if="item.reason">
          意见：<b>{{ item.reason }}</b>
        </p>
        <p>{{ item.time }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { isZLB } from '@/util/index'
export default defineComponent({
  props: {
    procressData: {
      // 流程
      type: Array
    },
    step: {
      // 步骤
      type: Number,
      default: 1
    }
  },
  setup(props, { emit }) {
    const list = reactive([])
    const state = reactive({
      ZLBFLAG: isZLB(),
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false
    })
    const num = ref(1)
    onMounted(() => {
      list.value = props.procressData
      num.value = props.step || 1
    //   console.log(props.step)
    })
    watch(
      () => props.step,
      (newValue, oldValue) => {
        // console.log(newValue, oldValue)
        num.value = newValue || 1
      }
    )
    return {
      list,
      num,
      state
    }
  }
})
</script>
<style scoped lang="less">
.opacity3 {
  opacity: 0.3;
}

.main {
  width: 100%;
  font-size: 0.28rem;

  .item:last-child {
    .left {
      .dashed {
        border: none;
      }
    }
  }

  .main .item:last-child .right {
    min-height: 0;
  }

  .item {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: space-between;
    position: relative;

    .left {
      width: 0.3rem;
      height: auto;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      overflow: hidden;

      .circle {
        width: 0.3rem;
        height: 0.3rem;
        border-radius: 50%;
        background-color: rgba(13, 115, 255, 1);
      }

      .dashed {
        position: absolute;
        width: 0;
        border-right: 0.04rem dashed rgba(13, 115, 255, 1);
        height: 100%;
        left: 0;
        right: 0;
        margin-right: auto;
        margin-left: auto;
        top: 0.3rem;
      }
    }

    .right {
      width: 100%;
      padding-left: 0.5rem;
      min-height: 1.5rem;

      p {
        font-size: 0.28rem;
        color: rgba(51, 51, 51, 1);
        font-weight: bold;
        margin-bottom: 0.2rem;
      }

      p:nth-child(2) {
        color: rgba(153, 153, 153, 1);
        font-weight: normal;
        margin-top: 0.2rem;
        font-size: 0.24rem;
      }

      p:last-child {
        color: rgba(153, 153, 153, 1);
        font-weight: normal;
        margin-top: 0.2rem;
        font-size: 0.24rem;
      }
    }
    .resetStepOld {
      p,
      br {
        font-size: 0.35rem;
      }
    }
  }
}
</style>
