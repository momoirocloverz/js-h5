<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" v-if="$route.meta.keepAlive" />
    </keep-alive>
    <component :is="Component" v-if="!$route.meta.keepAlive" />
  </router-view>
</template>

<style lang="less">
* {
  -webkit-overflow-scrolling: touch;
}
#app {
  font-family: PingFang SC;
  -webkit-font-smoothing: antialiased;
  img{
    -webkit-user-drag: none;//禁止用户拖拽
  }
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  overflow: hidden;
}
</style>
