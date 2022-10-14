<template>
  <div class="realHome">
    <div class="headCon">
      <img
        class="headerImg"
        src="https://img.hzanchu.com/acimg/27551499dda6a96238115ae8b6b4ada0.png"
      />
      <div class="userInfoCon">
        <div class="infoCon">
          <img :src="state.avatarSrc" />
          <div class="name" :class="state.ZLBFitForOld ? 'nameOld' : ''">
            {{
              state.userInfo.real_name
                ? state.userInfo.real_name.replace(
                    state.userInfo.real_name.substr(0, 1),
                    '*'
                  )
                : ''
            }}
          </div>
        </div>
        <div
          class="colorBar"
          :class="state.ZLBFitForOld ? 'colorBarOld' : ''"
          @click="toUserInfo"
        >
          个人信息<van-icon name="arrow" />
        </div>
      </div>
    </div>
    <div class="paddingCon">
      <div class="understandEntrance">
        <div class="homeTag marBottom20">
          <div class="tagLine"></div>
          <div class="tagText" :class="state.ZLBFitForOld ? 'tagTextOld' : ''">
            明白纸
          </div>
        </div>
        <div class="understandImgCon" @click="goUrl('understandPolicy')">
          <div
            class="underConText"
            :class="state.ZLBFitForOld ? 'underConTextOld' : ''"
          >
            解读政策&nbsp;&nbsp;人人明白
          </div>
          <img
            class="understandMainImg"
            src="https://img.hzanchu.com/acimg/9f879873955cd39b47185635ef67ed9d.png"
          />
          <img
            class="underSmallImg"
            :class="state.ZLBFitForOld ? 'underSmallImgOld' : ''"
            src="https://img.hzanchu.com/acimg/bbd10a669c80835f74a128cb966b7f1c.png"
          />
        </div>
      </div>
      <div class="policyEntrance">
        <div class="homeTag marBottom20">
          <div class="tagLine"></div>
          <div class="tagText" :class="state.ZLBFitForOld ? 'tagTextOld' : ''">
            项目储备
          </div>
        </div>
      </div>
      <div class="fourPartCon">
        <template v-for="(item, index) in state.fourPartArray" :key="index">
          <div
            class="fourItem"
            @click="jumpAction(item)"
            :style="'background-image: url(' + item.image + ')'"
          >
            <div
              class="fourItemText"
              :class="state.ZLBFitForOld ? 'fourItemTextOld' : ''"
            >
              {{ item.text }}
            </div>
          </div>
        </template>
      </div>

      <div class="policyEntrance">
        <div class="homeTag marBottom20">
          <div class="tagLine"></div>
          <div class="tagText" :class="state.ZLBFitForOld ? 'tagTextOld' : ''">
            我的草稿
          </div>
        </div>
      </div>
      <div class="fourPartCon">
        <template v-for="(item, index) in state.oneArray" :key="index">
          <div
            class="fourItem"
            @click="jumpAction(item)"
            :style="'background-image: url(' + item.image + ')'"
          >
            <div
              class="fourItemText green"
              :class="state.ZLBFitForOld ? 'fourItemTextOld' : ''"
            >
              {{ item.text }}
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="serviceCon" v-if="state.ZLBFLAG">
      <div class="service" :class="state.ZLBFitForOld ? 'serviceOld' : ''">
        本服务由浙江政务服务网、江山市农业农村局提供。
      </div>
      <div class="service" :class="state.ZLBFitForOld ? 'serviceOld' : ''">
        服务咨询热线：
        <span @click="toCall">0570-4022874</span>
      </div>
    </div>
    <Loading :visiable="state.visible"></Loading>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import dayjs from 'dayjs'
import { Toast } from 'vant'
import { isZLB } from '@/util/index'
import { mgop } from '@aligov/jssdk-mgop'
import Request from '@/service/request'
import Loading from '@/components/loading'
export default {
  components: { Loading },
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      avatarSrc: require('@/assets/avatarPlace.png'),
      userInfo: {
        real_name: '',
      },
      visible: false,
      count: 0,
      ZLBFLAG: isZLB(),
      ZLBFitForOld:
        localStorage.getItem('fitForOld') &&
        localStorage.getItem('fitForOld') == 1
          ? true
          : false,
      inputVal: '',
      merchantsArray: [],
      noticeBoardArray: [],
      fourPartArray: [
        {
          image:
            'https://img.hzanchu.com/acimg/c0696307d554153f936d6d9085b1a86a.png',
          text: '完善储备项目库建设',
          link: 'projectReserve',
          source: '',
        },
      ],
      oneArray: [
        {
          image:
            'https://img.hzanchu.com/acimg/d88b6ac034f0e86431c7aae6c5dc4f17.png',
          text: '可查看保存的草稿',
          link: 'projectReserveDraft',
          source: '',
        },
      ],
    })
    const fetchHomeList = () => {
      Request.fetchHomePage({})
        .then((res) => {
          if (res && res.code == 0) {
            let temp1 = res.data.attract_investment
            if (temp1.length) {
              temp1[0].image =
                'https://img.hzanchu.com/acimg/76655791461542998b190e3f0d7cf15b.png'
              temp1[1].image =
                'https://img.hzanchu.com/acimg/25b9f87cbf07efacf3dd290f3fea7d99.png'
              temp1[2].image =
                'https://img.hzanchu.com/acimg/8f9eea1660524619579a75562a433920.png'
              state.merchantsArray = temp1
              state.noticeBoardArray = res.data.notice_board.slice(0, 4)
            }
          } else {
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    onMounted(() => {
      ticketRequest()
    })
    const ticketRequest = () => {
      if (state.ZLBFLAG) {
        if (Route.query.ticket) {
          console.log(Route.query.ticket)
          if (Route.query.sp) {
            // window.location.href =
            //   Route.query.sp + '?ticket=' + Route.query.ticket
          } else {
            let tokenFlag = localStorage.getItem('token')
              ? localStorage.getItem('token')
              : ''
            if (tokenFlag) {
              let zlbInfo = JSON.parse(localStorage.getItem('ourUserInfo'))
              state.userInfo = zlbInfo
            } else {
              console.log('准备请求')
              console.log('zhelbZhelbTicketValidation 参数', {
                st: Route.query.ticket,
              })
              state.visible = true
              mgop({
                api: 'mgop.zjanchu.jnt.zhelbZhelbTicketValidation', // 必须
                host: 'https://mapi.zjzwfw.gov.cn/',
                dataType: 'JSON',
                type: 'POST',
                data: {
                  st: Route.query.ticket,
                },
                header: {
                  Authorization: '',
                },
                appKey: '9qz1aeub+2001923948+qsmsjd', // 必须
                onSuccess: (data) => {
                  let shazam = data.data
                  if (shazam && shazam.code === 0) {
                    if (shazam.data.token) {
                      localStorage.setItem('token', shazam.data.token)
                      localStorage.setItem(
                        'zlbUserInfo',
                        JSON.stringify(shazam.data.zhelb_user_info)
                      )
                      localStorage.setItem(
                        'ourUserInfo',
                        JSON.stringify(shazam.data.user_info)
                      )
                      state.userInfo = shazam.data.user_info
                    }
                  } else {
                    Toast(shazam.msg)
                  }
                  console.log('请求成功回调', JSON.stringify(data))
                  state.visible = false
                },
                onFail: (err) => {
                  console.log('请求失败回调', JSON.stringify(err))
                  Toast(JSON.stringify(err))
                  state.visible = false
                },
              })
              setTimeout(() => {
                buriedPoint()
              }, 1000)
            }
          }
        }
      } else {
        fetchUserInfo()
        fetchHomeList()
      }
    }
    const fetchUserInfo = () => {
      state.visible = true
      Request.getUserInfo({})
        .then((res) => {
          if (res && res.code == 0) {
            state.userInfo = {
              real_name: res.data.userinfo.real_name,
            }
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
        .finally(() => {
          state.visible = false
        })
    }
    const buriedPoint = () => {
      aplus_queue.push({
        action: 'aplus.setMetaInfo',
        arguments: ['appId', '2001923948'],
      })
    }
    const toNoticeList = () => {
      Router.push({
        name: 'notice',
      })
    }
    const toAttractList = () => {
      Router.push({
        name: 'attract',
      })
    }
    const toAttractDetail = (item) => {
      Router.push({
        name: 'attractDetail',
        query: {
          id: item.id,
        },
      })
    }
    const toNoticeDetail = (item) => {
      Router.push({
        name: 'noticeDetail',
        query: {
          id: item.id,
        },
      })
    }
    const goUrl = (url) => {
      Router.push({
        name: url,
      })
    }
    const jumpAction = (item) => {
      if (item.link) {
        Router.push({
          name: item.link,
        })
      } else if (item.source) {
        if (state.ZLBFLAG) {
          ZWJSBridge.openLink({
            url: item.source,
          })
        } else {
          window.open(item.source, '_blank')
        }
      } else {
        return false
      }
    }
    const toUserInfo = () => {
      Router.push({
        name: 'info',
      })
    }
    const toCall = () => {
      ZWJSBridge.phoneCall({
        corpId: '0570-4022874',
      })
    }
    return {
      state,
      dayjs,
      toNoticeList,
      toAttractList,
      toAttractDetail,
      jumpAction,
      goUrl,
      toNoticeDetail,
      toUserInfo,
      toCall,
      ticketRequest,
      buriedPoint,
      fetchUserInfo,
    }
  },
}
</script>
<style lang="less" scoped>
.serviceCon {
  margin-bottom: 0.2rem;
  margin-top: 1rem;
  text-align: center;
}
.service {
  font-size: 0.26rem;
  color: #98999b;
  text-align: center;
  line-height: 0.4rem;
  span {
    color: #008fff;
  }
}
.serviceOld {
  font-size: 0.4rem;
}
.homeTag {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  box-sizing: border-box;
}
.marBottom20 {
  margin-bottom: 0.2rem;
}
.more {
  font-size: 0.26rem;
  line-height: 0.3rem;
  color: #666;
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
  font-size: 0.5rem;
  font-weight: 500;
}
.paddingCon {
  padding: 0.3rem;
  box-sizing: border-box;
  width: 100%;
}
.policyEntrance {
  margin-bottom: 0.3rem;
  width: 100%;
}
.understandEntrance {
  margin-bottom: 0.3rem;
  .understandImgCon {
    position: relative;
    width: 100%;
    height: 1.8rem;
  }
  .underConText {
    position: absolute;
    top: 0.38rem;
    left: 0.6rem;
    z-index: 3;
    font-size: 0.3rem;
    line-height: 0.36rem;
    color: #5282f0;
  }
  .underConTextOld {
    font-size: 0.5rem;
    font-weight: 500;
    left: 0.3rem;
  }
  .understandMainImg {
    position: absolute;
    width: 100%;
    height: 1.8rem;
  }
  .underSmallImg {
    position: absolute;
    width: 1.4rem;
    bottom: 0.3rem;
    left: 1.2rem;
  }
  .underSmallImgOld {
    width: 2.5rem;
  }
}

.fourPartCon {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
}
.fourItem {
  width: 100%;
  height: 1.8rem;
  display: flex;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  box-sizing: border-box;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  margin-bottom: 0.2rem;
}
.fourItemText {
  padding-left: 0.6rem;
  box-sizing: border-box;
  font-size: 0.3rem;
  color: #5282f0;
}
.fourItemTextOld {
  font-size: 0.5rem;
  font-weight: 500;
}
.green {
  color: #03bec4;
}
.realHome {
  .headCon {
    width: 100%;
    height: 3.23rem;
    position: relative;
    .headerImg {
      width: 100%;
      height: 100%;
    }
    .userInfoCon {
      height: 1.7rem;
      background-color: #fff;
      position: absolute;
      border-radius: 0.1rem;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      align-content: center;
      bottom: 0;
      left: 0.8rem;
      right: 0.8rem;
      .colorBar {
        position: absolute;
        right: 0;
        top: 0.6rem;
        box-sizing: border-box;
        background-color: #0d73ff;
        border-radius: 0.8rem 0 0 0.8rem;
        padding: 0.06rem 0.1rem;
        color: #fff;
        font-size: 0.26rem;
      }
      .colorBarOld {
        font-size: 0.5rem;
        font-weight: 500;
      }
      .infoCon {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        align-content: center;
        .name {
          font-size: 0.3rem;
          font-weight: 500;
          margin-left: 0.3rem;
        }
        .nameOld {
          font-size: 0.5rem;
        }
        img {
          margin-left: 0.6rem;
          width: 1rem;
          height: 1rem;
        }
      }
      .address {
        font-size: 0.24rem;
        margin-top: 0.2rem;
      }
    }
  }
}
</style>
