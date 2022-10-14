<template>
  <div class="QA-detail">
    <div class="list">
      <QACard 
        scene="detail"
        :data="info" 
        @setLike="setLikeState"
        @sendComment="commentSucccess"
      />
    </div>
    <div class="answer-list">
      <div v-for="item in answerList" :key="item" class="item">
        <div class="content">
          <img src="../../views/understandPolicy/img/answer.png" alt="">
          <p>{{ item.answer }}</p>
        </div>
        <div class="time">{{ item.created_at }}</div>
      </div>
    </div>
    <End v-show="answerList.length"/>
    <Empty v-show="!answerList.length" text="暂无回答" />
  </div>
</template>

<script>
import QACard from '@/components/QACard';
import { ref, onMounted } from 'vue'
import ConsultingBtn from '../QASection/modules/ConsultingBtn.vue'
import End from '@/components/End'
import Request from '@/service/request';
import { useRoute } from 'vue-router';
import { Toast } from 'vant';
import Empty from '@/components/empty';
export default {
  components: {
    QACard,
    ConsultingBtn,
    End,
    Empty
  },
  setup() {
    const route = useRoute();
    const info = ref({});
    const answerList = ref([])

    const setLikeState = () => {
      let obj = info.value;
      if(obj.is_like) {
        obj.is_like = 0;
        obj.like_count --
      } else {
        obj.is_like = 1;
        obj.like_count ++
      }
      info.value = obj;
    }

    const getInfo = async () => {
      const result = await Request.questionInfo({
        id: route.params.id
      })
      if(result.code === 0) {
        info.value = result.data.info;
        answerList.value = result.data.info.answer_list;
      } else {
        Toast(result.msg)
      }
    }

    const commentSucccess = () => {
      getInfo();
    }

    onMounted(() => {
      getInfo();
    })

    return {
      setLikeState,
      answerList,
      info,
      commentSucccess
    }
  }
}
</script>

<style scoped lang="less">
  .QA-detail {
    overflow: hidden;
    padding: 0 0 1rem;
  }
  .list {
    width: 6.22rem;
    border-radius: 0.16rem;
    overflow: hidden;
    margin: 0.3rem auto 0;
    padding: 0 0.32rem;
    background: #fff;
  }
  .answer-list {
    width: 6.22rem;
    background: #fff;
    border-radius: 0.16rem;
    overflow: hidden;
    padding: 0 0.32rem;
    margin: 0.16rem auto 0;
    .item {
      overflow: hidden;
      padding-bottom: 0.32rem;
      border-bottom: 1px solid rgba(112, 112, 112, 0.2);
      &:nth-last-of-type(1) {
        border: 0;
      }
      .content {
        display: flex;
        align-items: flex-start;
        margin-top: 0.32rem;
        img {
          width: 0.44rem;
        }
        p {
          font-size: 0.28rem;
          color: #333;
          line-height: 0.4rem;
          font-weight: 500;
          margin-left: 0.24rem;
          flex: 1;
          margin-top: 0.02rem;
        }
      }
      .time {
        text-align: right;
        line-height: 0.33rem;
        font-size: 0.24rem;
        color: #808080;
        margin-top: 0.24rem;
      }
    }
  }
</style>