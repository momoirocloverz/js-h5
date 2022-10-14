<template>
  <div class="mineCon">
    <div class="gradientCon" :class="[state.ZLBFLAG ? 'point1Padding' : '']">
      <div class="gradientLeft" @click="toLogin">
        <img :src="state.userInfo && state.userInfo.avatar ? state.userInfo.avatar : state.avatarSrc" />
        <div class="infoArea">
          <div class="name" :class="state.ZLBFitForOld ? 'nameOld' : ''">
            {{ state.userInfo && state.userInfo.real_name && state.userInfo.real_name ? state.userInfo.real_name.replace(state.userInfo.real_name.substr(0, 1), '*') : '登录/注册' }}
          </div>
          <div class="editTrigger" @click="toEdit">
            编辑资料
            <img src="https://img.hzanchu.com/acimg/74c3480c25378fb9582af1f7f38e3503.png" />
          </div>
        </div>
      </div>
      <div class="gradientRight" @click="popVideo">
        <img class="mainimg" src="https://img.hzanchu.com/acimg/d2b730e91c60900f9a5e06cbbab5794c.png" />
        <div>操作视频</div>
        <img class="mainArrow" src="https://img.hzanchu.com/acimg/1a3b1f7515430a2a52edeae7c61ec83b.png" />
      </div>
    </div>
    <div class="operateCon">
      <template v-for="(item, index) in state.linkArray" :key="index">
        <div class="item" @click="checkDetail(item)">
          <div class="itemLeft">
            <img :src="item.image" />
            <div class="itemLeftText" :class="state.ZLBFitForOld ? 'itemLeftTextOld' : ''">
              {{ item.text }}
            </div>
          </div>
          <van-icon name="arrow" />
        </div>
      </template>
    </div>
    <van-overlay :show="state.showVideo" @click="state.showVideo = false">
      <video
        id="video"
        class="vid111eo"
        controls
        x5-video-player-type="h5"
        x5-video-player-fullscreen="true"
        style="object-fit: fill"
        src="https://jiangshan-tzyjs.oss-cn-hangzhou.aliyuncs.com/live/jiangshan_tzyjs/%E7%A7%BB%E5%8A%A8%E7%AB%AF%281%29.mp4"
        poster="https://img.hzanchu.com/acimg/bdf0b8636fbb46af1cad40340126e7b2.jpeg"
      >
        <source src="https://jiangshan-tzyjs.oss-cn-hangzhou.aliyuncs.com/live/jiangshan_tzyjs/%E7%A7%BB%E5%8A%A8%E7%AB%AF%281%29.mp4" />
      </video>
    </van-overlay>
  </div>
</template>
<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Toast } from 'vant'
import { isZLB, ZLBJump } from '@/util/index'
export default {
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      showVideo: false,
      ZLBFLAG: isZLB(),
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
      avatarSrc: require('@/assets/avatarPlace.png'),
      userInfo: {},
      linkArray: [
        {
          image: 'https://img.hzanchu.com/acimg/8136d727203171cf892fb7ae7cbc8539.png',
          text: '项目办事',
          link: 'program'
        },
        {
          image: 'https://img.hzanchu.com/acimg/060eacae08014e796b65ce669a80b9e2.png',
          text: '意见建议',
          link: 'advice'
        },
        {
          image: 'https://img.hzanchu.com/acimg/9a285ea6095b443ae709ed6fe1b77f1a.png',
          text: '草稿箱',
          link: 'projectReserveDraft'
        },
        {
          image: 'https://img.hzanchu.com/acimg/1649135be7185acf0220bbed03342826.png',
          text: '设置',
          link: 'setup'
        }
      ]
    })
    const toLogin = () => {
      let zlbInfo = JSON.parse(localStorage.getItem('ourUserInfo'))
      if (!zlbInfo) {
        if (state.ZLBFLAG) {
          ZLBJump()
        } else {
          Router.push({
            name: 'login'
          })
        }
      }
    }
    const toEdit = () => {
      Router.push({
        name: 'info'
      })
    }
    const checkDetail = (item) => {
      if (state.userInfo) {
        Router.push({
          name: item.link
        })
      } else {
        Toast('请登录')
      }
    }
    const initAction = () => {
      if (state.ZLBFLAG) {
        state.linkArray = [
          {
            image: 'https://img.hzanchu.com/acimg/8136d727203171cf892fb7ae7cbc8539.png',
            text: '项目办事',
            link: 'program'
          },
          {
            image: 'https://img.hzanchu.com/acimg/c65bb77de309bb1240ce55bbfd14d064.png',
            text: '意见建议',
            link: 'advice'
          },
          {
            image: 'https://img.hzanchu.com/acimg/9a285ea6095b443ae709ed6fe1b77f1a.png',
            text: '草稿箱',
            link: 'projectReserveDraft'
          }
        ]
      }
      let zlbInfo = JSON.parse(localStorage.getItem('ourUserInfo'))
      console.log('zlbInfo', zlbInfo)
      state.userInfo = zlbInfo
    }
    onMounted(() => {
      initAction()
    })
    const popVideo = () => {
      //   state.showVideo = true
      let src = 'https://jiangshan-tzyjs.oss-cn-hangzhou.aliyuncs.com/live/jiangshan_tzyjs/%E7%A7%BB%E5%8A%A8%E7%AB%AF%281%29.mp4'
      if (state.ZLBFLAG) {
        ZWJSBridge.openLink({
          url: src
        })
      } else {
        window.location.href = src
      }
    }
    return {
      popVideo,
      state,
      checkDetail,
      toEdit,
      toLogin
    }
  }
}
</script>
<style lang="less" scoped>
.vid111eo {
  position: relative;
  width: 70%;
  display: block;
  margin: 0 auto;
  margin-top: 0.2rem;
  z-index: 999999;
}
.mineCon {
  padding: 0.3rem;
  box-sizing: border-box;
}
.item {
  border-bottom: 1px solid #ededed;
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  &:last-child {
    border-bottom: none;
  }
  .itemLeft {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    img {
      width: 0.48rem;
      height: 0.48rem;
      margin-right: 0.2rem;
    }
    .itemLeftText {
      font-size: 0.3rem;
      font-weight: 500;
      color: #333;
    }
    .itemLeftTextOld {
      font-size: 0.4rem;
    }
  }
}
.operateCon {
  background-color: #fff;
  border-radius: 0.1rem;
  padding-left: 0.3rem;
  padding-right: 0.3rem;
  box-sizing: border-box;
}
.gradientCon {
  width: 100%;
  height: 2.58rem;
  box-sizing: border-box;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: url('https://img.hzanchu.com/acimg/bcf915622fb17a23bc263ece0340d0c8.png');
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  padding-left: 0.3rem;
  padding-right: 0;
  margin-bottom: 0.3rem;
  .gradientLeft {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    img {
      width: 1.44rem;
      height: 1.44rem;
      margin-right: 0.3rem;
    }
    .infoArea {
    }
    .editTrigger {
      margin-top: 0.2rem;
      font-size: 0.24rem;
      color: #333;
      img {
        width: 0.16rem;
        height: 0.16rem;
      }
    }
    .name {
      font-size: 0.36rem;
      color: #333;
    }
    .nameOld {
      font-size: 0.5rem;
    }
  }
  .gradientRight {
    position: relative;
    width: 1.52rem;
    height: 0.52rem;
    div {
      height: 0.4rem;
      font-size: 0.24rem;
      font-weight: 400;
      color: #fff;
      position: absolute;
      top: 0.12rem;
      left: 0.24rem;
    }
    .mainimg {
      width: 1.52rem;
      height: 0.52rem;
      position: absolute;
    }
    .mainArrow {
      width: 0.2rem;
      height: 0.2rem;
      position: absolute;
      right: 0;
      top: 0.16rem;
    }
  }
}
.point1Padding {
  padding-right: 0.1rem;
}
</style>
<style lang="less">
.removeFix {
  //   position: absolute;
}
</style>
