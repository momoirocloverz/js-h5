<template>
  <div class="adviceCon">
    <van-form @failed="onFailed" @submit="onSubmit">
      <van-field
        v-model="state.phone"
        required
        name="phone"
        label="联系电话"
        maxlength="11"
        :rules="state.validator.phone"
        placeholder="请输入联系电话"
      />
      <van-button
        class="submitBtn"
        round
        block
        type="primary"
        native-type="submit"
        >确认提交</van-button
      >
    </van-form>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'
import { Toast } from 'vant'
import { isZLB } from '@/util/index'
export default {
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      validator: {
        phone: [
          {
            required: true,
            trigger: 'onBlur',
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确手机号',
          },
        ],
      },
      ZLBFLAG: isZLB(),
      fileList: [],
      ZLBFitForOld:
        localStorage.getItem('fitForOld') &&
        localStorage.getItem('fitForOld') == 1
          ? true
          : false,
    })
    const onFailed = (err) => {
      console.log(err)
    }
    const onSubmit = (params) => {
      // console.log('params', params)
      Router.go(-1)
    }

    return {
      state,
      onFailed,
      onSubmit,
    }
  },
}
</script>
<style lang="less" scoped>
.adviceCon {
  padding: 0.3rem;
  box-sizing: border-box;
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
</style>
