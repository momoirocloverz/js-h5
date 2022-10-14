<template>
  <div class="understand-policy">
    <div class="main">
      <div class="name">登录名：{{ showReal ? info.realname : info.name }} <img src="./img/show-name.png" @click="showReal = !showReal" /></div>
      <div class="time">生成报告时间：{{ time }}</div>
      <div class="key">
        <div v-for="(item, index) in key" :key="index">{{ item }}</div>
      </div>
      <div class="total">共推荐您{{ list.length }}条政策明白纸</div>

      <div class="rank">
        <div v-for="(item, index) in rank" :key="index" class="item">
          <img :src="index == 0 ? require('./img/first.png') : index == 1 ? require('./img/second.png') : require('./img/third.png')" />
          <div class="center">
            <div>{{ item.area_type == 1 ? '中央' : item.area_type == 2 ? '省级' : '县级' }}（推荐数：{{ item.count }}条）</div>
            <div class="rank-rank">
              <div :style="'width: ' + item.match_num + '%;'"></div>
            </div>
          </div>
          <div class="match">匹配度：{{ item.match_num }}%</div>
        </div>
      </div>
    </div>

    <template v-if="list.length > 0">
      <div class="list" v-for="(item, index) in list" :key="index" @click="gotoDetail(item.id)">
        <div class="item" :style="index < list.length - 1 ? ' ' : 'border: none'">
          <div>{{ item.title }}</div>
          <div>匹配度：{{ item.sz_understand_paper_rel_user_info.match_num }}%</div>
        </div>
      </div>
    </template>

    <Empty v-else :src="require('@/views/znxUnderstandPolicy/img/empty-list.png')" title="暂无相关推荐政策"> </Empty>
    <img src="./img/top.png" class="back" @click="gotoTop" />
    <div class="safe-area"></div>
  </div>
</template>

<script>
import { onMounted } from '@vue/runtime-core'
import List from './list.vue'
import { ref, reactive } from 'vue'
import { isZLB } from '@/util/index'
import Empty from '@/components/empty.vue'
import { mgop } from '@aligov/jssdk-mgop'
import Request from '@/service/request'
import { useRouter, useRoute } from 'vue-router'
import { Dialog, Toast } from 'vant'

export default {
  components: { List, Empty },
  setup() {
    const Route = useRoute()
    const Router = useRouter()
    const showReal = ref(false) // 是否展示真实姓名
    const state = reactive({
      ZLBFLAG: isZLB(),
      ZLBLOGINSTATUS: false,
      ticket: '',
      token: ''
    })
    const info = ref({
      // name: '*户',
      // realname: '用户',
      // address: '江山',
      // cityId: '330881999'
      name: '',
      realname: '',
      address: '',
      cityId: ''
    })
    const key = ref([])
    const time = ref('2022-9-02 20:56')
    const rank = ref([]) // 当前省级、中央、县级 匹配度排序
    const list = ref([])
    const gotoDetail = (id) => {
      Router.push({
        name: 'znx/unstarndDetail',
        query: {
          id
        }
      })
    }

    const gotoTop = () => {
      window.scrollTo(0, 0)
    }

    const getList = () => {
      Toast.loading('报告生成中...')
      if (state.ZLBFLAG) {
        ZWJSBridge.getCurrentLocationCity({})
          .then((res) => {
            key.value.push(res.cityName)
            Request.szUnderstandPaperGetMatchList({
              area_city_id: res.cityId
            })
              .then((res) => {
                if (res && res.code == 0) {
                  list.value = res.data.list
                  rank.value = res.data.recom_list
                  Toast.clear()
                } else {
                  Toast(res.msg)
                }
              })
              .catch((err) => {
                console.log('err', err)
                Toast.clear()
              })
          })
          .catch((err) => {
            console.log(err)
            Toast.clear()
          })
      } else {
        // dev环境test
        Request.szUnderstandPaperGetMatchList({
          area_city_id: '330881999'
        })
          .then((res) => {
            if (res && res.code == 0) {
              list.value = res.data.list
              rank.value = res.data.recom_list
              Toast.clear()
            } else {
              Toast(res.msg)
            }
          })
          .catch((err) => {
            console.log('err', err)
            Toast.clear()
          })
      }
    }

    // 法人登录
    const legalLogin = () => {
      Toast.loading('登录中...')
      localStorage.setItem('token', Route.query.token)
      Request.getUserInfo({})
        .then((res) => {
          if (res && res.code == 0) {
            localStorage.setItem('zlbUserInfo', JSON.stringify(res.data.zhelb_user_info))
            localStorage.setItem('ourUserInfo', JSON.stringify(res.data.userinfo))
            info.value.name = '*' + res.data.zhelb_user_info.attnName.substring(1, res.data.zhelb_user_info.attnName.length)
            info.value.realname = res.data.zhelb_user_info.attnName
            let scope = res.data.zhelb_user_info.CompanyScope // 经营范围
            if (res.data.zhelb_user_info.CompanyScope != '') {
              key.value.push(res.data.zhelb_user_info.CompanyScope)
            }
            key.value.push(res.data.zhelb_user_info.CompanyName) // 企业法人
            key.value.push(res.data.zhelb_user_info.CompanyType) // 机关法人、法人类型
          } else {
            Toast(res.msg)
          }
          getList()
        })
        .catch((err) => {
          console.log('err', err)
          Toast.clear()
        })
    }

    // 普通用户登录
    const login = () => {
      Toast.loading('登录中...')
      mgop({
        api: 'mgop.zjanchu.jnt.zhelbZhelbTicketValidation', // 必须
        host: 'https://mapi.zjzwfw.gov.cn/',
        dataType: 'JSON',
        type: 'POST',
        data: {
          st: Route.query.ticket
        },
        header: {
          Authorization: ''
          // isTestUrl: '1'
        },
        appKey: '9qz1aeub+2001923948+qsmsjd', // 必须
        onSuccess: (data) => {
          let shazam = data.data
          if (shazam && shazam.code === 0) {
            if (shazam.data.token) {
              console.log(shazam.data.user_info)
              console.log(shazam.data.user_info.real_name)
              localStorage.setItem('token', shazam.data.token)
              localStorage.setItem('zlbUserInfo', JSON.stringify(shazam.data.zhelb_user_info))
              localStorage.setItem('ourUserInfo', JSON.stringify(shazam.data.user_info))
              info.value.name = '*' + shazam.data.user_info.real_name.substring(1, shazam.data.user_info.real_name.length)
              info.value.realname = shazam.data.user_info.real_name
            }
            getList()
          } else {
            Toast(shazam.msg)
          }
          console.log('请求成功回调', data)
        },
        onFail: (err) => {
          console.log('请求失败回调', JSON.stringify(err))
          getList()
          Toast.clear()
        }
      })
    }

    onMounted(() => {
      let myDate = new Date()
      time.value = myDate.toLocaleString()
      let tokenFlag = localStorage.getItem('token') ? localStorage.getItem('token') : ''
      if (tokenFlag) {
        let zlbInfo = JSON.parse(localStorage.getItem('ourUserInfo'))
        state.userInfo = zlbInfo
        getList()
      } else {
        if (state.ZLBFLAG) {
          ZWJSBridge.getUserType({})
            .then((res) => {
              // Toast(res.userType)
              state.visible = true
              if (res.userType == 2) {
                legalLogin()
              } else {
                login()
              }
            })
            .catch((err) => {
              console.log('err', err)
            })
        } else {
          getList()
        }
      }
    })
    return {
      time,
      info,
      key,
      rank,
      list,
      gotoTop,
      gotoDetail,
      showReal
    }
  }
}
</script>

<style scoped lang="less">
.understand-policy {
  width: 100%;

  .main {
    width: 100%;
    margin-bottom: 16px;
    padding: 16px;
    box-sizing: border-box;
    background-color: #fff;
    .name {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      display: flex;
      align-items: center;

      img {
        width: 16px;
        height: 16px;
        margin-left: 16px;
        cursor: pointer;
      }
    }
    .key {
      width: 100%;
      margin-top: 16px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      div {
        height: 20px;
        line-height: 20px;
        padding: 0 8px;
        box-sizing: border-box;
        margin-right: 16px;
        border-radius: 20px;
        background-color: rgba(88, 147, 255, 0.16);
        text-align: center;
        font-size: 12px;
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
        color: #5893ff;
        display: inline-block;
      }
    }
    .time {
      margin-top: 16px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
    }
    .total {
      margin-top: 30px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
    }
    .rank {
      width: 100%;
      margin-top: 30px;
      border-top: 1px solid #e8e9ec;
      .item {
        width: 100%;
        padding: 16px 0px;
        box-sizing: border-box;
        border-bottom: 1px solid #e8e9ec;
        display: flex;
        flex-direction: row;

        img {
          width: 24px;
          height: 24px;
        }
        .center {
          width: 0;
          flex: 1;
          margin-right: 30px;
          margin-left: 30px;
          div:nth-of-type(1) {
            width: 100%;
            height: 24px;
            line-height: 24px;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            white-space: nowrap;
            text-overflow: ellipsis;
            -o-text-overflow: ellipsis;
            overflow: hidden;
          }
          .rank-rank {
            width: 100%;
            height: 8px;
            margin-top: 7px;
            border-radius: 8px;
            background-color: #eeeeee;
            overflow: hidden;
            div {
              height: 8px;
              background-color: #5893ff;
              border-radius: 8px;
            }
          }
        }
        .match {
          max-width: 100px;
          height: 24px;
          line-height: 24px;
          text-align: right;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
        }
      }
    }
  }

  .list {
    width: 100%;
    padding: 0 16px;
    box-sizing: border-box;

    background-color: #fff;
    .item {
      width: 100%;
      padding: 16px 0;
      border-bottom: 1px solid #e8e9ec;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      align-items: center;
      div:nth-of-type(1) {
        width: 0;
        flex: 1;
        font-size: 16px;
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
        color: #333333;
        white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        overflow: hidden;
      }
      div:nth-of-type(2) {
        max-width: 100px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
      }
    }
  }

  .back {
    position: fixed;
    z-index: 99;
    right: 16px;
    bottom: 40px;
    bottom: calc(40px + constant(safe-area-inset-bottom));
    bottom: calc(40px + env(safe-area-inset-bottom));
    width: 32px;
    height: 32px;
  }

  .safe-area {
    width: 100%;
    height: 50px;
    height: calc(50px + constant(safe-area-inset-bottom));
    height: calc(50px + env(safe-area-inset-bottom));
  }
}
</style>
