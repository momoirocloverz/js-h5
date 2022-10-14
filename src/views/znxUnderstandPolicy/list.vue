<template>
  <div class="info-list">
    <slot />
    <van-skeleton class="van-skeleton" title :row="6" :loading="isload">
      <van-list
        class="van-list fs-14"
        :finished="finished"
        :finished-text="list.length > 0 ? '已经到底了~' : '暂无数据'"
        @load="load"
      >
        <div v-if="list.length > 0">
          <div v-for="(item, index) of list" :key="index" class="item">
            <policy-item :item="item"></policy-item>
          </div>
        </div>
        <img
          v-else-if="list.length == 0 && finished"
          class="empty-list"
          src="@/views/znxUnderstandPolicy/img/empty.png"
        />
      </van-list>
    </van-skeleton>
  </div>
</template>

<script>
import PolicyItem from "./item.vue";
// import { specialGroup } from "@/serve/api";
export default {
  components: { PolicyItem },
  props: {
    type: {
      type: Number,
    }, // 必传，0表示农房转让、1表示农房出租
    area: {
      type: Object,
    }, // 当前城镇、乡村的id
  },
  data() {
    return {
      list: [],
      isload: true, // 当前骨架屏控制展示控制，默认为true表示需要展示骨架屏

      page: 1, //
      pageSize: 10, // 一页10个
      finished: false, // 是否页面到底了
      loading: false, // 是否加载中，防止多次请求
    };
  },
  methods: {
    reload: function () {
      this.page = 1;
      this.finished = false;
      this.loading = false;
      this.isload = true;
      this.load();
    },
    load: function () {
      this.getList();
    },
    getList: function () {
      if (this.loading || this.finished) return;
      this.loading = true;
      // 这里请求数据
    //   this.$toast("加载中...");
    //   specialGroup({
    //     search_town_id: this.area.town_id,
    //     search_village_id: this.area.village_id,
    //     page: this.page,
    //     page_size: this.pageSize,
    //   }).then((e) => {
    //     if (e.code === 0) {
    //       let list = e.data.data;
    //       this.list = this.page == 1 ? list : this.list.concat(list);
    //       this.page = this.page++;
    //       this.isload = false;
    //       this.finished = e.data.current_page >= e.data.last_page;
    //     //   this.$toast.clear();
    //     }
    //   });
    },
  },
};
</script>

<style lang="less" scoped> 
.info-list {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 15px;
}
</style>
