<template>
  <van-pull-refresh
    v-model="refreshLoading"
    success-text="更新成功"
    @refresh="onRefresh"
  >
    <div class="QA-section">
      <div class="list">
        <div class="content">
          <div class="item" v-for="item in list" :key="item.id">
            <QACard :data="item" @setLike="setLikeState" />
          </div>
        </div>
        <div v-show="!isLoading"> 
          <End v-show="list.length"/>
          <Empty v-show="!list.length"/>
        </div>
      </div>
      <ConsultingBtn />
    </div>
  </van-pull-refresh>
</template>

<script>
import QACard from '@/components/QACard';
import { onMounted, ref } from 'vue'
import ConsultingBtn from '../QASection/modules/ConsultingBtn.vue'
import Request from '@/service/request';
import { Toast } from 'vant';
import End from '@/components/End';
import Empty from '@/components/empty';
export default {
  components: {
    QACard,
    ConsultingBtn,
    End,
    Empty
  },
  setup() {
    const list = ref([]);
    const isLoading = ref(true);
    const refreshLoading = ref(false);
  
    const setLikeState = (e) => {
      let arr = list.value;
      arr.map(item => {
        if(item.id === e) {
          if(item.is_like) {
            item.is_like = 0;
            item.like_count --
          } else {
            item.is_like = 1;
            item.like_count ++
          }
        }
      })
      list.value = arr;
    }

    const getList = async () => {
      isLoading.value = true;
      const result = await Request.questionList({
        page: 1,
        pagesize: 10,
      })
      if(result.code === 0) {
        list.value = result.data.data;
      } else {

      }
      isLoading.value = false;
    }

    const onRefresh = () => {
      setTimeout(async () => {
        await getList();
        refreshLoading.value = false;
      }, 1000)
    }

    onMounted(() => {
      getList();
    })

    return {
      setLikeState,
      refreshLoading,
      list,
      isLoading,
      onRefresh
    }
  }
}
</script>

<style scoped lang="less">
  .QA-section {
    overflow: hidden;
    position: relative;
    min-height: 100vh;
  }
  .list {
    width: 6.86rem;
    border-radius: 0.16rem;
    overflow: hidden;
    margin: 0.3rem auto 1rem;
    .content {
      overflow: hidden;
      background: #fff;
      padding: 0 0.32rem;
      .item {
        border-bottom: 1px solid rgba(112, 112, 112, 0.2);
        &:nth-last-of-type(1) {
          border: 0;
        }
      }
    }
    
  }
</style>
