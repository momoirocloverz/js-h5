<template>
  <div :class="[rollingState.isRolling ? 'consulting is-rolling' : 'consulting']" @click="toQA">在线咨询</div>
</template>

<script setup>
  import { ref, reactive, watch, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  const Router = useRouter();
  const rollingState = reactive({
    rollingDistance: 0,
    oldRollingDistance: 0,
    isRolling: false
  })
  const toQA = () => {
    Router.push('/QASection/consult');
  }

  const scrollTop = () => {
    rollingState.rollingDistance = window.scrollY;
  }

  onMounted(() => {
    window.addEventListener('scroll', scrollTop);
  })

  watch(
    () => rollingState.rollingDistance,
    (newVal, oldVal) => {
      setTimeout(() => {
        if(newVal == window.scrollY) { 
          rollingState.oldRollingDistance = newVal;
          rollingState.isRolling = false;
        };
      }, 1000)
      if(rollingState.oldRollingDistance == oldVal) {
        rollingState.isRolling = true;
      }
    },
    { immediate: true }
  )

  onUnmounted(() => {
    window.removeEventListener('scroll', scrollTop)
  })
</script>

<style scoped lang="less">
  .consulting {
    width: 1.66rem;
    height: 1.26rem;
    background: url('../img/zaixianzixun.png') no-repeat;
    background-size: 100%;
    font-size: 0.3rem;
    font-weight: bold;
    color: #fff;
    line-height: 1.26rem;
    padding-left: 1.1rem;
    position: fixed;
    bottom: 2rem;
    right: -0.26rem;
    transition: all .3s;
  }
  .is-rolling {
    right: -1.7rem!important;
  }
</style>