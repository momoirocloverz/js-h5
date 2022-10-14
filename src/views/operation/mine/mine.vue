<!-- 治理端-我的 -->
<template>
  <div class="page-mine">
    <div class="top-panel">
      <div class="profile">
        <img
          :src="`${
            adminInfo.avatar ||
            'https://img.hzanchu.com/acimg/5a5804feb1636a299192001fdda9525d.png'
          }`"
          alt="avatar"
          class="avatar"
        />
      </div>
      <div class="name">
        {{
          adminInfo.username
            ? adminInfo.username.replace(adminInfo.username.substr(0, 1), "*")
            : ""
        }}
      </div>
    </div>

    <div class="menu-list">
      <div
        class="list-item"
        v-for="(item, index) in menuList"
        :key="index"
        @click="jumpPage(item)"
      >
        <div
          class="item-content"
          :class="{ 'van-hairline--bottom': index < menuList.length - 1 }"
        >
          <div class="left">
            <img :src="item.icon" alt="icon" class="icon" />
            <div class="title">{{ item.title }}</div>
          </div>
          <div class="right">
            <div class="icon"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import { useRouter } from "vue-router";
export default {
  name: "mine",
  setup() {
    const Router = useRouter();
    const state = reactive({
      menuList: [
        {
          title: "个人信息",
          icon: "https://img.hzanchu.com/acimg/dc37bb6a47f94af34af5eddefe90b279.png",
          name: "personalInfo",
        },
        {
          title: "设置",
          icon: "https://img.hzanchu.com/acimg/f8936cfe3478fd5c42bd194e2f86eaf8.png",
          name: "operationConfig",
        },
      ],
      adminInfo: reactive({}),
    });

    onMounted(() => {
      state.adminInfo = JSON.parse(sessionStorage.getItem("adminInfo"));
    });

    const jumpPage = (item) => {
      if (item.name) {
        Router.push({
          name: item.name,
          query: {
            id: item.id,
          },
        });
      }
    };
    return {
      ...toRefs(state),
      jumpPage,
    };
  },
};
</script>
<style lang='less' scoped>
.page-mine {
  padding: 0.3rem;

  .top-panel {
    height: 2.6rem;
    background: linear-gradient(
      270deg,
      rgba(27, 130, 236, 0.36) 0%,
      rgba(27, 130, 236, 0.1) 100%
    );
    border-radius: 0.16rem;
    display: flex;
    align-items: center;
    margin-bottom: 0.32rem;
    padding-left: 0.32rem;

    .profile {
      border-radius: 51%;
      overflow: hidden;
      margin-right: 0.32rem;
      width: 1.6rem;
      height: 1.6rem;
      .avatar {
        height: 100%;
        width: 100%;
      }
    }

    .name {
      font-size: 0.36rem;
      font-weight: bold;
    }
  }

  .menu-list {
    min-height: 2.7rem;
    background: #ffffff;
    border-radius: 0.16rem;

    .list-item {
      height: 1.37rem;
      padding: 0 0.32rem;
      &:active {
        background-color: var(--van-active-color);
      }
      .item-content {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .left {
          display: flex;
          align-items: center;
          .icon {
            width: 0.48rem;
            height: 0.48rem;
            margin-right: 0.16rem;
          }
          .title {
            font-size: 0.32rem;
            font-weight: 500;
            color: #333333;
          }
        }
        .right {
          .icon {
            width: 0.28rem;
            height: 0.28rem;
            background: url("https://img.hzanchu.com/acimg/c78ba76e4e1efc3ea6065ed587ad0849.png")
              no-repeat;
            background-size: 100% 100%;
          }
        }
      }
    }
  }
}
</style>