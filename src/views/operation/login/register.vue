<!-- 治理端登录页 -->
<template>
  <div class="page-register">
    <van-form @submit="onSubmit" @failed="onFailed" ref="form">
      <van-cell-group inset>
        <van-field
          v-model="formData.nick_name"
          label="用户名"
          name="nick_name"
          placeholder="请输入用户名"
          required
          :rules="[{ required: true, message: '请输入用户名' }]"
        />

        <van-field
          v-model="formData.name"
          label="姓名"
          name="name"
          placeholder="请输入姓名"
          required
          :rules="[{ required: true, message: '请输入姓名' }]"
        />

        <van-field
          v-model="formData.mobile"
          label="手机号"
          name="mobile"
          placeholder="请输入手机号"
          required
          :rules="[{ required: true, message: '请输入手机号' }]"
        />

        <van-field
          v-model="formData.verify_code"
          label="验证码"
          name="verify_code"
          placeholder="请输入验证码"
          class="field-withbtn"
          required
          :rules="[{ required: true, message: '请输入验证码' }]"
        >
          <template #button>
            <van-button
              text
              id="noo"
              size="small"
              class="text-btn"
              @click="throttleSendCode"
              >发送验证码</van-button
            >
          </template>
        </van-field>

        <van-field
          v-model="formData.password1"
          label="密码"
          name="password1"
          placeholder="请输入8-16位密码,至少包含数字、字母"
          type="password"
          required
          :rules="[{ required: true, message: '请输入密码' }]"
        />

        <van-field
          v-model="formData.password2"
          label="确认密码"
          name="password2"
          placeholder="请确认密码"
          type="password"
          required
          :rules="[{ required: true, message: '请确认密码' }]"
        />
      </van-cell-group>
    </van-form>

    <div class="register">
      <span class="text">已有账号？</span>
      <span class="link" @click="jump2Login">立即登录</span>
    </div>

    <div class="btn-wrapper">
      <van-button
        type="primary"
        color="#1B82EC"
        class="login-btn"
        round
        @click="throttleSubmit"
        >注 册</van-button
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
import { useCountDown } from "@vant/use";
export default {
  name: "operationRegister",
  components: { Loading },
  setup() {
    const Router = useRouter();
    const state = reactive({
      formData: reactive({}),
      loading: ref(false),
    });
    let form = ref(null);

    const countDown = useCountDown({
      // 倒计时60s
      time: 60 * 1000,
    });

    onMounted(() => {});

    const throttleSubmit = util.throttling(
      (e) => {
        form.value.submit();
      },
      800,
      true
    );

    const throttleSendCode = util.throttling(
      () => {
        sendCode();
      },
      800,
      true
    );

    // 发送验证码
    const sendCode = () => {
      console.log(countDown.current.seconds)
      if (countDown.current.seconds < 60) return
      countDown.start();
    };

    // 注册
    const onSubmit = (e) => {
      state.loading = true;
      console.log("登录", e);
      setTimeout(() => {
        state.loading = false;
      }, 1000);
    };

    const onFailed = () => {
      state.isPwd = !state.isPwd;
    };

    const jump2Login = () => {
      Router.go(-1);
    };

    return {
      ...toRefs(state),
      throttleSubmit,
      onFailed,
      sendCode,
      throttleSendCode,
      jump2Login,
      onSubmit,
      form,
      current: countDown.current,
    };
  },
};
</script>

<style lang='less' scoped>
.page-register {
  padding: 0.3rem 0;
  div {
    box-sizing: border-box;
  }

  .register {
    padding: 0 0.3rem;
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

  .btn-wrapper {
    padding: 0 0.3rem;
    .login-btn {
      width: 100%;
      margin-top: 0.78rem;

      :global(.van-button__text) {
        font-size: 0.32rem;
      }
    }
  }
}
</style>

<style lang="less">
.page-register {
  .field-withbtn {
    .van-field__button {
      line-height: 0;
      .text-btn {
        width: auto;
        height: auto;
        background: transparent;
        border: none;
        color: #1b82ec;
        padding: 0;

        .van-button__text {
          font-size: 0.28rem;
        }

        &::before {
          display: none;
        }

        &:active {
          background: transparent;
          opacity: 0.5;
        }
      }
    }
  }
}
</style>