<template>
  <div class="masterCon">
    <div class="masterInner marBottom30">
      <div class="title">
        <div class="homeTag marBottom20">
          <div class="tagLine"></div>
          <div class="tagText" :class="state.ZLBFitForOld ? 'tagTextOld' : ''">
            申报范围
          </div>
        </div>
      </div>
      <div class="timeCon" :class="state.ZLBFitForOld ? 'timeConOld' : ''">
        <div>包含种植业、养殖业、加工业等多种相关产业。</div>
      </div>
    </div>

    <div class="masterInner">
      <div class="title">
        <div class="homeTag marBottom20">
          <div class="tagLine"></div>
          <div class="tagText" :class="state.ZLBFitForOld ? 'tagTextOld' : ''">
            申报对象
          </div>
        </div>
      </div>
      <div class="timeCon" :class="state.ZLBFitForOld ? 'timeConOld' : ''">
        <div>原则上申报对象为农业相关建设主体等。</div>
      </div>
    </div>
    <van-button
      class="submitBtn"
      round
      block
      @click="popDate"
      type="primary"
      :class="state.ZLBFitForOld ? 'btnTextOld' : ''"
      >开始申报
    </van-button>
  </div>
</template>

<script>
import { defineComponent, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'
import { Toast } from 'vant'
import { isZLB } from '@/util/index'
import { mgop } from '@aligov/jssdk-mgop'
export default defineComponent({
  setup(props, { emit }) {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      ZLBFLAG: isZLB(),
      ZLBFitForOld:
        localStorage.getItem('fitForOld') &&
        localStorage.getItem('fitForOld') == 1
          ? true
          : false,
    })
    const popDate = () => {
      Router.replace({
        name: 'projectReservePublish',
      })
    }
    return {
      state,
      popDate,
    }
  },
})
</script>

<style scoped lang="less">
.ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  overflow: hidden;
}
.tagLine {
  width: 0.05rem;
  height: 0.3rem;
  background: #1b82ec;
  opacity: 1;
  border-radius: 0.03rem;
  margin-right: 0.06rem;
}
.tagText {
  font-size: 0.3rem;
  line-height: 0.45rem;
  height: 0.4rem;
  color: #333;
}
.tagTextOld {
  font-size: 0.4rem;
}
.homeTag {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  box-sizing: border-box;
}
.timeCon {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  box-sizing: border-box;
  font-size: 0.24rem;
  color: #666;
}
.timeConOld {
  font-size: 0.35rem;
}
.marBottom20 {
  margin-bottom: 0.2rem;
}
.marBottom30 {
  margin-bottom: 0.3rem;
}
.masterCon {
  box-sizing: border-box;
  padding: 0.3rem;
  .masterInner {
    box-sizing: border-box;
    padding: 0.3rem;
    border-radius: 0.15rem;
    background-color: #fff;
  }
}
.submitBtn {
  position: fixed;
  width: 73.33%;
  left: 13.33%;
  right: 0;
  bottom: 1.2rem;
  font-size: 0.32rem;
  font-weight: 500;
  color: #fff;
}
.btnTextOld {
  font-size: 0.35rem;
}
</style>
