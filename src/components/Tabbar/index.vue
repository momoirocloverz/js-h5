<template>
  <div class="tab-bar">
    <div class="content">
      <ul>
        <li v-for="item in props.list" :key="item.id">
          <div
            :style="{
              color: curIndex === item.id ? '#1B82EC' : '#999999',
              background: curIndex === item.id ? 'rgba(27, 130, 236, 0.12)' : '#F6F7F8'
            }"
            @click="selectTab(item)"
          >
            {{item.category_name}}({{item.category_sum}})
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup> 
  import { defineProps, ref } from 'vue'

  const curIndex = ref(0);
  
  const props = defineProps({
    list: Array,
  })

  const emit = defineEmits([ "getSelectTab" ]);//调用父组件方法
  const selectTab = (item) => {
    curIndex.value = item.id;
    emit("getSelectTab",item);
  }
</script>

<style scoped lang="less">
  .tab-bar {
    width: 100%;
    height: 0.88rem;
    overflow: hidden;
    .content {
      width: 100%;
      height: 100%;
      overflow-x: scroll;
      padding-bottom: 0.6rem;
      ul {
        width: max-content;
        overflow: hidden;
        height: 100%;
        display: flex;
        align-items: center;
        padding: 0 0.22rem;
        li {
          width: 1.86rem;
          height: 0.56rem;
          float: left;
          padding: 0.08rem;
          div {
            height: 0.56rem;
            font-size: 0.28rem;
            text-align: center;
            line-height: 0.56rem;
          }
        }
      }
    }
    
  }
</style>