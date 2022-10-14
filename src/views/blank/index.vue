<template>
  <div class="outer submitHome">.</div>
</template>
<script>
import { ref, onMounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { Dialog, Toast } from 'vant'
import { isZLB, ZLBJump } from '@/util/index'
export default {
  name: 'home',
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      ZLBFLAG: isZLB(),
      ZLBLOGINSTATUS: false,
      ticket: '',
      token: ''
    })
    onMounted(() => {
      // console.log(window.location.href)
      let herf = window.location.href
      let token = ''
      // console.error('onMounted')

      if (herf.indexOf('token') != -1 && !getQuery('sp')) {
        if (herf.indexOf('#')) {
          token = herf.substring(herf.indexOf('token') + 6, herf.lastIndexOf('#'))
        } else {
          token = herf.substring(herf.indexOf('token') + 6, herf.length)
        }
        Router.replace({
          name: 'newHome',
          query: {
            token_zxstmc: token
          }
        })
      } else {
        fetchUserType()
      }
    })
    const fetchUserType = () => {
      // console.error('fetchUserType')
      const sUserAgent = window.navigator.userAgent.toLowerCase()
      const bIsDtDreamApp = sUserAgent.indexOf('dtdreamweb') > -1 // 浙里办APP
      const bIsAlipayMini = sUserAgent.indexOf('miniprogram') > -1 && sUserAgent.indexOf('alipay') > -1
      if (bIsDtDreamApp) {
        ZWJSBridge.getUserType({})
          .then((res) => {
            if (res.userType == 2) {
              legalAction()
              // console.error('legalAction')
            } else {
              commonMainAction()
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      } else {
        commonMainAction()
      }
    }
    const legalAction = () => {
      // console.error(getQuery('token'))
      if (getQuery('token') == null && state.token == '') {
        commonJump('legalAction')
      } else {
        let token = getQuery('token')
        state.token = getQuery('token')
        let sp = getQuery('sp')
        localStorage.removeItem('token')
        // Dialog.confirm({
        //   title: 'sp' + JSON.stringify(sp),
        //   message: token
        // })
        if (sp == 'znx_zcmbz') {
          Router.replace({
            name: 'znx/unstarnd',
            query: {
              token
            }
          })
        } else {
          Router.replace({
            name: 'newHome',
            query: {
              token
            }
          })
        }
      }
    }
    const commonMainAction = () => {
      const sUserAgent = window.navigator.userAgent.toLowerCase()
      const bIsDtDreamApp = sUserAgent.indexOf('dtdreamweb') > -1 // 浙里办APP
      const bIsAlipayMini = sUserAgent.indexOf('miniprogram') > -1 && sUserAgent.indexOf('alipay') > -1
      if (getQuery('ticket') == null && state.ticket == '') {
        if (bIsDtDreamApp) {
          commonJump('')
        } else if (bIsAlipayMini) {
          //   Toast('执行支付宝请求ticket为空')
          commonJump('')
        }
        // if (bIsAlipayMini) {
        //   try {
        //     location.replace(
        //       'https://puser.zjzwfw.gov.cn/sso/alipay.do?action=ssoLogin&servicecode=jnt'
        //     )
        //   } catch (err) {
        //     Toast('错误了' + JSON.stringify(err))
        //   }
        // } else {
        //   ZWJSBridge.openLink({
        //     url: 'https://puser.zjzwfw.gov.cn/sso/mobile.do?action=oauth&scope=1&servicecode=jnt',
        //   })
        //   ZWJSBridge.close()
        // }
      } else {
        let ticket = getQuery('ticket')
        let sp = getQuery('sp')
        state.ticket = getQuery('ticket')
        // if (bIsAlipayMini) {
        //   Toast('支付宝抓到ticket')
        // }
        localStorage.removeItem('token')
        // Dialog.confirm({
        //   title: 'sp' + JSON.stringify(sp)
        // })
        if (sp == 'znx_zcmbz') {
          Router.replace({
            name: 'znx/unstarnd',
            query: {
              ticket
            }
          })
        } else {
          Router.replace({
            name: 'newHome',
            query: {
              ticket
            }
          })
        }
      }
    }

    // 统一 跳转登录
    const commonJump = (sp) => {
      let jump = getQuery('jump')
      // Dialog.confirm({
      //   title: 'jump' + JSON.stringify(jump)
      // })
      if (jump && jump == 'znx_zcmbz') {
        ZLBJump(jump)
      } else {
        ZLBJump(sp)
      }
    }
    const getQuery = (name) => {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      var r = window.location.search.substr(1).match(reg)
      if (r != null) return unescape(r[2])
      return null
    }
    return {
      Router,
      Route,
      state
    }
  }
}
</script>
