<template>
  <div class="consult">
    <div class="content">
      <div style="border-bottom: 1px solid rgba(112, 112, 112, 0.2);">
        <div class="title">请输入标题</div>
        <div class="input-area">
          <textarea placeholder="请输入标题，字数不超过50字" rows="3" v-model.trim="titleText" maxlength="50"></textarea>
          <p>{{titleText.length}}/50</p>
        </div>
      </div>
      <div>
        <div class="title">请输入内容</div>
        <div class="input-area">
          <textarea placeholder="请输入内容，字数不超过200字" rows="6" v-model.trim="contentText" maxlength="200"></textarea>
          <p>{{contentText.length}}/200</p>
        </div>
      </div>
    </div>

    <div class="bottom-bar">
      <div class="cancel" @click="cancel">取消</div>
      <div class="confirm" @click="confirm">提交</div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import Request from '@/service/request';
import { Toast } from 'vant';
export default {
  setup() {
    const Router = useRouter();
    const titleText = ref('');
    const contentText = ref('');

    const confirm = async () => {
      const result = await Request.submitQuestion({
        title: titleText.value,
        desc: contentText.value
      })
      if(result.code === 0) {
        Toast('提交成功');
        cancel();
      } else {
        titleText.value = '';
        contentText.value = '';
        Toast(result.msg);
      }
    }

    const cancel = () => {
      Router.go(-1);
    }

    return {
      titleText,
      contentText,
      cancel,
      confirm
    }
  }
}
</script>

<style scoped lang="less">
  .consult {
    min-height: 100vh;
    position: relative;
    overflow: hidden;
  }
  .content {
    width: 6.22rem;
    overflow: hidden;
    background: #fff;
    border-radius: 0.16rem;
    overflow: hidden;
    padding: 0 0.32rem;
    margin: 0.32rem auto 1.3rem;
    div {
      overflow: hidden;
    }
    .title {
      font-size: 0.32rem;
      color: #333333;
      font-weight: bold;
      margin: 0.32rem 0 0;
    }
    .input-area {
      border-radius: 0.1rem;
      background: #F4F4F4;
      padding: 0 0.3rem;
      margin: 0.32rem 0;
      textarea {
        font-size: 0.28rem;
        line-height: 0.4rem;
        width: 100%;
        background: transparent;
        padding-top: 0.3rem;
      }
      p {
        line-height: 0.8rem;
        color: #999;
        text-align: right;
        font-size: 0.28rem;
      }
    }
  }

  .bottom-bar {
    position: fixed;
    width: 100%; 
    height: 1.28rem;
    display: flex;
    align-items: center;
    box-shadow: 0px -1px 0.16rem rgba(0, 0, 0, 0.08);
    background: #fff;
    bottom: 0;
    justify-content: center;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    div {
      width: 3.35rem;
      height: 0.96rem;
      box-sizing: border-box;
      text-align: center;
      line-height: 0.96rem;
      border: 0.02rem solid #1B82EC;
      font-size: 0.36rem;
      color: #1B82EC;
      border-radius: 0.48rem;
    }
    .confirm {
      background: #1B82EC;
      color: #fff;
      margin-left: 0.32rem;
    }
  }
</style>