<template>
  <div class="QA-card" @click="toDetail">
    <div class="question">
      <img src="../../views/understandPolicy/img/question.png" alt="">
      <p :class="props.scene === 'detail' ? '' : 'ellipsis-line-1'">{{ data.title }}</p>
    </div>
    <div :class="props.scene === 'detail' ? 'desc' : 'desc ellipsis-line-1'">{{ data.desc }}</div>
    <div class="answer" v-if="props.scene === 'list' && data.answer_list.length">
      <img src="../../views/understandPolicy/img/answer.png" alt="">
      <p>{{ data.answer_list[0].answer }}</p>
    </div>
    <div class="opration">
      <div class="like" @click.stop.prevent="handleLike">
        <img v-show="!data.is_like" src="../../views/understandPolicy/img/like.png" alt="">
        <img v-show="data.is_like" src="../../views/understandPolicy/img/is-like.png" alt="">
        <span>赞 {{ data.like_count }}</span>
      </div>
      <div class="comments" @click.stop.prevent="showInput = true">
        <img src="../../views/understandPolicy/img/comments.png" alt="">
        <span>回答 {{ data.answer_count }}</span>
      </div>
      <div class="release-time">
        <span>{{ data.created_at }}</span>
      </div>
    </div>
  </div>
  
  <Shade :show="showInput" @handleClose="showInput = false; textValue = ''">
    <div class="input-comments" @click.stop>
      <div class="input-area">
        <form action="javascript:;">
          <input
            type="search"
            autofocus
            v-model.trim="textValue"
            placeholder="请输入回复内容，不超过500字"
            maxlength="500"
            enterkeyhint="send"
            @keyup="sendText"
          />
        </form>
        <!-- <textarea rows="2" placeholder="请输入回复内容，不超过500字" maxlength="500"></textarea> -->
        <van-icon name="clear" v-show="textValue" @click="textValue = ''"/>
      </div>
      <Transition name="fade">
        <span v-show="textValue" @click="submit">发送</span>
      </Transition>
    </div>
  </Shade>
</template>

<script setup>
  import { ref, defineProps, defineEmits } from 'vue'
  import { Toast } from 'vant'
  import Shade from '../Shade/index.vue'
  import Request from '@/service/request'
  import { useRouter } from 'vue-router';
  const Router = useRouter();
  const textValue = ref('');
  const showInput = ref(false);
  const props = defineProps({
    data: Object,
    isLike: Number,
    scene: {
      type: String,
      default: 'list'
    }
  })
  const emits = defineEmits([
    'setLike',
    'sendComment'
  ])

  const handleLike = async () => {  
    const result = await Request.execLike({
      id: props.data.id,
    })
    if(result.code === 0) {
      emits('setLike', props.data.id);
    } else {
      Toast(result.msg)
    }
  }

  const submit = async () => {
    const result = await Request.submitAnswer({
      question_id: props.data.id,
      answer: textValue.value
    })
    if(result.code === 0) {
      Toast('发送成功');
      textValue.value = '';
      showInput.value = false;
      emits('sendComment');
    } else {
      Toast(result.msg);
    }
  }

  const sendText = (e) => {
    if(e.key === 'Enter') {
      submit();
    }
  }

  const toDetail = () => {
    Router.push({ name: 'QADetail', params: {id: props.data.id}})
  }
</script>

<style scoped lang="less">
  .QA-card {
    padding: 0.32rem 0;
    background: #fff;
    .question {
      display: flex;
      align-items: flex-start;
      img {
        width: 0.44rem;
      }
      p {
        font-size: 0.32rem;
        color: #333;
        font-weight: bold;
        margin: 0.04rem 0 0 0.24rem;
        line-height: 0.4rem;
        flex: 1;
      }
    }
    .desc {
      font-size: 0.26rem;
      color: #666;
      margin-left: 0.68rem;
      line-height: 0.33rem;
      margin-top: 0.09rem;
    }
    .answer {
      display: flex;
      align-items: center;
      margin-top: 0.24rem;
      img {
        width: 0.44rem;
      }
      p {
        font-size: 0.28rem;
        color: #333;
        font-weight: 500;
        margin-left: 0.24rem;
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .opration {
      display: flex;
      align-items: flex-end;
      margin-top: 0.29rem;
      img {
        width: 0.4rem;
      }
      span {
        font-size: 0.24rem;
        color: #808080;
        margin: 0 0 0.04rem 0.04rem;
      }
      .like {
        margin-left: 0.68rem;
        display: flex;
        align-items: flex-end;
      }
      .comments {
        display: flex;
        align-items: flex-end;
        margin-left: 0.32rem;
      }
      .release-time {
        margin: 0 0 0.04rem auto;
      }
    }
  }
  .input-comments {
    min-height: 0.88rem;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #F6F7F8;
    box-shadow: 0px -1px 0.16rem rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: center;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    .input-area {
      margin: 0 0.3rem;
      height: 0.64rem;
      border-radius: 0.32rem;
      background: #fff;
      flex: 1;
      display: flex;
      align-items: center;
      padding: 0 0.26rem;
      form {
        height: 100%;
        flex: 1;
      }
      input {
        height: 100%;
        width: 100%;
        font-size: 0.3rem;
        line-height: normal;
        background: transparent;
      }
      .van-icon {
        font-size: 0.28rem;
        color: #666;
        margin-left: 0.1rem
      }
    }
    span {
      margin-right: 0.3rem;
      font-size: 0.32rem;
      font-weight: bold;
      color: #333;
    }
  }
</style>