<template>
  <div class="masterCon"></div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'
import dayjs from 'dayjs'
export default defineComponent({
  setup(props, { emit }) {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      listData: [],
    })
    const fetchList = () => {}
    onMounted(() => {
      fetchList()
    })

    const checkDetail = (item) => {
      Router.push({
        name: 'noticeDetail',
        query: {
          id: item.id,
        },
      })
    }
    return {
      state,
      dayjs,
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
  background-image: url('https://img.hzanchu.com/acimg/d4bf0c81469b2d8e7847385adcd69d4a.png');
  width: 100%;
  min-height: 100vh;
}
</style>
