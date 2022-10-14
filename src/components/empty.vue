<template>
  <div class="empty">
    <img :src="src" alt="" />
    <p>{{ text }}</p>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'empty',
  props: {
    text: {
      type: String,
      default: '暂无数据'
    },
    src: {
      type: String,
      default: require('@/assets/working.png')
    }
  },
  setup(props) {

    return {
      text: props.text
    }
  }
})
</script>

<style scoped lang="less">
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 1rem;
    img {
      width: 4rem;
    }
    p {
      color: #999;
      font-size: .28rem;
      margin-top: 0.1rem;
    }
  }
</style>
