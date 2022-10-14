<!-- 治理端登录页 -->
<template>
  <div class="page-login">
    <div class="login-form">
      <div class="form-item">
        <div class="left-icon">
          <img
            src="https://img.hzanchu.com/acimg/40da16fae33dae5818fdd968de1d4cb9.png"
            alt="用户名"
            class="icon"
          />
        </div>
        <div class="right-input">
          <input
            type="text"
            v-model="username"
            class="ipt"
            placeholder="请输入您的用户名"
          />
        </div>
      </div>

      <div class="form-item">
        <div class="left-icon">
          <img
            src="https://img.hzanchu.com/acimg/a44c1602097dfccd2b3be1a9bf6ed525.png"
            alt="密码"
            class="icon"
          />
        </div>
        <div class="right-input">
          <input
            :type="isPwd ? 'password' : 'text'"
            v-model="password"
            class="ipt"
            placeholder="请输入您的密码"
          />
        </div>
        <img
          :src="`https://img.hzanchu.com/acimg/${
            isPwd
              ? '2a8fdae1bd13bd73b5e75babb4802111'
              : '2c582d1359a80142a1d4c941843cf93e'
          }.png`"
          alt="eye"
          class="eye"
          @click="togglePwd"
        />
      </div>

      <!-- <div class="register">
        <span class="text">没有账号？</span>
        <span class="link" @click="jump2Register">立即注册</span>
      </div> -->

      <van-button
        type="primary"
        color="#1B82EC"
        class="login-btn"
        round
        @click="throttleLogin"
        >登 录</van-button
      >
    </div>

    <Loading :visiable="loading"></Loading>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, ref } from "vue";
import { Toast } from "vant";
import { useRouter } from "vue-router";
import { isZLB, util } from "@/util/index";
import Loading from "@/components/loading";
import Request from "@/service/operation";
export default {
  name: "operationLogin",
  components: { Loading },
  setup() {
    const Router = useRouter();
    const state = reactive({
      username: ref(""),
      password: ref(""),
      isPwd: ref(true),
      loading: ref(false),
    });

    onMounted(() => {});

    const togglePwd = () => {
      state.isPwd = !state.isPwd;
    };

    const throttleLogin = util.throttling(
      (e) => {
        login();
      },
      800,
      true
    );

    // 登录
    const login = () => {
      state.loading = true;
      const { username, password } = state;
      if (!username.trim()) {
        state.loading = false;
        return Toast("请输入用户名");
      }
      if (!password.trim()) {
        state.loading = false;
        return Toast("请输入密码");
      }
      Request.adminLogin({ username, password })
        .then(async (res) => {
          localStorage.setItem("operation_token", res.data.token);
          const response = await Request.getAdminInfo();
          sessionStorage.setItem(
            "adminInfo",
            JSON.stringify(response.data.admin_info)
          );
          Router.replace({ name: "operationHome" });
        })
        .catch((err) => {
          console.log("err", err);
        })
        .finally(() => {
          state.loading = false;
        });
    };

    const jump2Register = () => {
      Router.push({
        name: "operationRegister",
      });
    };

    return {
      ...toRefs(state),
      togglePwd,
      throttleLogin,
      jump2Register,
    };
  },
};
</script>

<style lang='less' scoped>
.page-login {
  height: 100vh;
  background: url("https://img.hzanchu.com/acimg/51e908a06f7f2cccbedd1c5b65757367.png")
    no-repeat;
  background-size: contain;

  div {
    box-sizing: border-box;
  }

  .login-form {
    width: 100%;
    position: absolute;
    top: 3.5rem;
    left: 50%;
    transform: translateX(-50%);
    padding: 0 0.4rem;

    .form-item {
      display: flex;
      align-items: center;
      height: 0.6rem;
      margin-top: 0.64rem;
      position: relative;

      &:first-child {
        margin-top: 0;
      }

      .ipt {
        font-size: 0.28rem;
        font-weight: 500;
        line-height: 0.36rem;
        color: #333333;
        height: 100%;
        width: 92%;
        background-color: transparent;

        &::placeholder {
          font-size: 0.28rem;
          color: #999999;
        }
      }

      .left-icon {
        .icon {
          width: 0.38rem;
          height: 0.38rem;
          margin-right: 0.3rem;
        }
      }

      .right-input {
        height: 100%;
        flex: 1;
        border-bottom: 1px solid #d6d6d6;
      }

      .eye {
        width: 0.3rem;
        height: 0.3rem;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }

  .register {
    margin-top: 0.36rem;
    text-align: right;
    .text {
      font-size: 0.24rem;
      font-weight: 500;
      color: #999999;
    }

    .link {
      font-size: 0.24rem;
      font-weight: 500;
      color: #1b82ec;
    }
  }

  .login-btn {
    width: 100%;
    margin-top: 1.8rem;

    :global(.van-button__text) {
      font-size: 0.32rem;
    }
  }
}
</style>