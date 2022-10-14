<template>
  <Transition name="fade">
    <div class="shade" v-show="props.show" @click.stop.prevent="closeShade">
      <div class="content">
        <slot />
      </div>
    </div>
  </Transition>
</template>

<script setup>
  import { ref, defineProps, defineEmits, watch } from 'vue';
  
  const props = defineProps({
    show: Boolean
  })
  const emit = defineEmits([
    'handleClose'
  ])

  const closeShade = () => {
    emit('handleClose', false)
  }
</script>

<style scoped lang="less">
  .shade {
    width: 100vw;
    height: 100vh;
    position: fixed;
    background: rgba(0,0,0,0.6);
    top: 0;
    left: 0;
    z-index: 1001;
    .content {
      position: relative;
    }
  }
</style>