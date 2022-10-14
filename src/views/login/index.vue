<template>
  <div class="masterCon">
    <div class="whiteIconCon">
      <van-icon name="arrow-left" class="whiteIcon" @click="goBack" />
    </div>

    <div class="accountCon">
      <div class="title">用户名</div>
      <input
        class="commonInput"
        type="text"
        v-model.trim="state.userName"
        placeholder="请输入用户名"
        @blur="validate1"
      />
      <hr />
    </div>
    <div class="errmsgCon">
      <div class="errmsgBody" v-if="state.showError1">请输入用户名</div>
    </div>
    <div class="passwordCon">
      <div class="title">密码</div>
      <input
        class="commonInput"
        type="password"
        placeholder="请输入密码"
        v-model.trim="state.password"
        @blur="validate2"
      />
      <hr />
    </div>
    <div class="errmsgCon">
      <div class="errmsgBody" v-if="state.showError2">请输入密码</div>
    </div>
    <div class="btnCon">
      <van-button class="submitBtn" round block type="primary" @click="validate"
        >登录</van-button
      >
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'
import { Toast } from 'vant'
import dayjs from 'dayjs'
export default defineComponent({
  setup(props, { emit }) {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      userName: '',
      password: '',
      showError1: false,
      showError2: false,
    })

    onMounted(() => {})

    const validate = () => {
      validate1()
      validate2()
      validatePromise().then((res) => {
        if (res) {

        } else {
          let query = {
            username: state.userName,
            password: state.password,
          }
          Request.userLogin(query)
            .then((res) => {
              if (res && res.code == 0) {
                localStorage.setItem('token', res.data.token)
                Request.getUserInfo(query)
                  .then((res) => {
                    if (res && res.code == 0) {
                      localStorage.setItem(
                        'ourUserInfo',
                        JSON.stringify(res.data.userinfo)
                      )
                      // Router.replace('/newHome')
                      Router.go(-1);
                    } else {
                      Toast(res.msg)
                    }
                  })
                  .catch((err) => {
                    console.log('er', err)
                  })
              } else {
                Toast(res.msg)
              }
            })
            .catch((err) => {
              console.log('er', err)
            })
        }
      })
    }
    const validatePromise = () => {
      return new Promise((resolve, reject) => {
        resolve(state.showError1 && state.showError2)
      })
    }
    const validate1 = () => {
      if (state.userName) {
        state.showError1 = false
      } else {
        state.showError1 = true
      }
    }
    const validate2 = () => {
      if (state.password) {
        state.showError2 = false
      } else {
        state.showError2 = true
      }
    }
    const toAgreement = () => {}
    const toPolicy = () => {}
    const goBack = () => {
      Router.replace({
        name: 'newHome',
      })
    }
    return {
      goBack,
      state,
      dayjs,
      toAgreement,
      toPolicy,
      validate,
      validate1,
      validate2,
    }
  },
})
</script>
<style scoped lang="less">
.masterCon {
  box-sizing: border-box;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: url('https://img.hzanchu.com/acimg/d4bf0c81469b2d8e7847385adcd69d4a.png?x-oss-process=image/resize,l_300');
  width: 100%;
  min-height: 100vh;
  //   padding-top: 0.8rem;

  input::-webkit-input-placeholder {
    color: #fff;
  }
  input:-webkit-autofill {
    box-shadow: 0 0 0 1000px #fff inset !important;
  }
  .accountCon {
    padding-left: 0.3rem;
    padding-right: 0.3rem;
    box-sizing: border-box;
  }
  .passwordCon {
    padding-left: 0.3rem;
    padding-right: 0.3rem;
    box-sizing: border-box;
  }
  .btnCon {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    box-sizing: border-box;
    margin-bottom: 0.2rem;
  }
  .submitBtn {
    font-size: 0.32rem;
    font-weight: 500;
    color: #1b82ec;
    background-color: #fff !important;
    width: 84%;
  }
  .title {
    font-size: 0.32rem;
    font-weight: 500;
    line-height: 0.46rem;
    color: #fff;
  }
  .commonInput {
    width: 100%;
    height: 0.5rem;
    margin-top: 0.2rem;
    margin-bottom: 0.2rem;
    box-sizing: border-box;
    background-color: transparent !important;
    font-size: 0.32rem;
    font-weight: 500;
    line-height: 0.46rem;
    color: #fff;
  }
  .describe {
    padding-left: 0.6rem;
    padding-right: 0.6rem;
    box-sizing: border-box;
    color: #bbdaf9;
    font-size: 0.26rem;
    line-height: 0.4rem;
    span {
      color: #fff;
      font-size: 0.28rem;
    }
  }
}
hr {
  background-color: #fff;
}
.errmsgCon {
  height: 1rem;
  padding-left: 0.3rem;
  .errmsgBody {
    font-size: 0.24rem;
    font-weight: 500;
    line-height: 0.46rem;
    color: #ff2222;
  }
}
.whiteIconCon {
  height: 0.8rem;
  padding-top: 0.2rem;
  padding-left: 0.2rem;
  box-sizing: border-box;
}
.whiteIcon {
  color: #fff;
  font-size: 0.4rem;
}
</style>
