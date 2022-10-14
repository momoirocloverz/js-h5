<template>
  <div class="progressCon">
    <div class="alignCenter">
      <img class="commonImg" :src="state.active1Current" />
      <div class="notactiveProgressText" :class="activeStep == 1 ? 'activeProgressText' : ''">
        {{ textList[0] }}
      </div>
    </div>
    <div class="dashLine"></div>
    <div class="alignCenter">
      <img class="commonImg" :src="state.active2Current" />
      <div class="notactiveProgressText" :class="activeStep == 2 ? 'activeProgressText' : ''">
        {{ textList[1] }}
      </div>
    </div>
    <div class="dashLine"></div>
    <div class="alignCenter">
      <img class="commonImg" :src="state.active3Current" />
      <div class="notactiveProgressText" :class="activeStep == 3 ? 'activeProgressText' : ''">
        {{ textList[2] }}
      </div>
    </div>
    <!-- <div class="dashLine"></div>
    <div>
      <img class="commonImg" :src="state.active3Current" />
      <div
        class="notactiveProgressText"
        :class="activeStep == 3 ? 'activeProgressText' : ''"
      >
        签约
      </div>
    </div> -->
  </div>
</template>
<script>
import { reactive, onMounted } from 'vue'
export default {
  props: {
    activeStep: {
      default: 1
    },
    textList: {
      default: ['基本信息', '种植信息', '材料填写']
    }
  },
  setup(props) {
    const state = reactive({
      active1Img: 'https://img.hzanchu.com/acimg/814abaee1bd8dfd0f7233ac68810f5f3.png',
      active2Img: 'https://img.hzanchu.com/acimg/814abaee1bd8dfd0f7233ac68810f5f3.png',
      active3Img: 'https://img.hzanchu.com/acimg/814abaee1bd8dfd0f7233ac68810f5f3.png',
      back1Img: 'https://img.hzanchu.com/acimg/814abaee1bd8dfd0f7233ac68810f5f3.png',
      back2Img: 'https://img.hzanchu.com/acimg/814abaee1bd8dfd0f7233ac68810f5f3.png',
      back3Img: 'https://img.hzanchu.com/acimg/b2a924daea5dbe42103365d511610170.png',
      border1Img: 'https://img.hzanchu.com/acimg/b2a924daea5dbe42103365d511610170.png',
      border2Img: 'https://img.hzanchu.com/acimg/b2a924daea5dbe42103365d511610170.png',
      border3Img: 'https://img.hzanchu.com/acimg/b2a924daea5dbe42103365d511610170.png',
      active1Current: '',
      active2Current: '',
      active3Current: ''
    })

    const analyse = () => {
      if (props.activeStep == 1) {
        state.active1Current = state.active1Img
        state.active2Current = state.border2Img
        state.active3Current = state.border3Img
      } else if (props.activeStep == 2) {
        state.active1Current = state.back1Img
        state.active2Current = state.active2Img
        state.active3Current = state.border3Img
      } else {
        state.active1Current = state.back1Img
        state.active2Current = state.back2Img
        state.active3Current = state.active3Img
      }
    }
    onMounted(() => {
      analyse()
    })
    return {
      state
    }
  }
}
</script>

<style lang="less" scoped>
.progressCon {
  box-sizing: border-box;
  //   padding: 0.25rem 1.16rem;
  padding: 0.25rem 1rem;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  overflow: hidden;
  .alignCenter {
    text-align: center;
  }
  .commonImg {
    height: 0.6rem;
    width: 0.6rem;
    margin-bottom: 0.1rem;
  }
  .notactiveProgressText {
    font-size: 0.24rem;
    font-weight: 400;
    color: #999999;
  }
  .activeProgressText {
    font-size: 0.24rem;
    font-weight: 500;
    color: #1b82ec;
  }
  .dashLine {
    margin-top: -0.32rem;
    border-bottom: 0.02rem dashed #d2d2d2;
    height: 0.01rem;
    width: 22%;
  }
}
</style>
