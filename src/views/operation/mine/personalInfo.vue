<!-- 个人信息 -->
<template>
  <div class="page-personal-info">
    <van-cell-group>
      <van-cell
        title="用户名"
        :value="
          adminInfo.username
            ? adminInfo.username.replace(adminInfo.username.substr(0, 1), '*')
            : ''
        "
        title-class="title"
        value-class="value"
      />
      <van-cell
        title="联系方式"
        :value="
          adminInfo.mobile
            ? adminInfo.mobile.replace(adminInfo.mobile.substr(3, 4), '****')
            : ''
        "
        title-class="title"
        value-class="value"
      />
      <van-cell
        title="上次登录时间"
        :value="adminInfo.last_login_at"
        title-class="title"
        value-class="value"
      />
    </van-cell-group>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import { Cell, CellGroup } from "vant";
export default {
  name: "personalInfo",
  setup() {
    const state = reactive({ adminInfo: reactive({}) });

    onMounted(() => {
      state.adminInfo = JSON.parse(sessionStorage.getItem("adminInfo"));
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>
<style lang='less' scoped>
.page-personal-info {
  padding: 0.3rem;

  :global(.van-cell-group) {
    border-radius: 0.16rem;
    overflow: hidden;
  }

  :global(.title) {
    width: 2rem;
    flex: none;
  }

  :global(.value) {
    text-align: left;
  }
}
</style>