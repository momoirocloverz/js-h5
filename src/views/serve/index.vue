<template>
  <div class="serve-box">
    <!-- <div class="serve-box-header">
        服务
    </div> -->
    <div class="serve-box-center">
      <div class="fourPartCon">
        <div class="folding-bar">
          <div class="title" :class="state.ZLBFitForOld ? 'tagTextOld' : ''">其他</div>
        </div>
        <div class="centent-box">
          <template v-for="(item, index) in state.fourPartArray" :key="index">
            <!-- :style="'background:' + item.color +';margin-right:'+(index%2?'0rem':'0.15rem')+';'" -->
            <div
              class="fourItem"
              @click="jumpAction(item)"
              :style="{
                backgroundImage: 'url(' + item.backImage + ')',
                marginRight: index % 2 ? '0rem' : '0.15rem'
              }"
            >
              <div class="fourItemText" :class="state.ZLBFitForOld ? 'fourItemTextOld' : ''">
                {{ item.text }}
              </div>
              <img :src="item.image" alt="" />
            </div>
          </template>
        </div>
      </div>
    </div>

    <Loading :visiable="state.visible"></Loading>
  </div>
</template>
<script>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import Loading from '@/components/loading'
export default {
  components: { Loading },
  setup() {
    const Router = useRouter()
    const state = reactive({
      visible: false,
      fourPartArray: [
        {
          image: 'https://img.hzanchu.com/acimg/2fcb81fe972dd3ebd30891ab386ce4a8.png',
          backImage: 'https://img.hzanchu.com/acimg/60702103f839872cf53a23c35d3cdd09.png',
          text: '项目储备',
          link: 'projectReserve',
          color: '#F0FFFA',
          source: ''
        },
        {
          image: 'https://img.hzanchu.com/acimg/d379ab6259046ace2db41066fa1cfb9e.png',
          text: '项目备案',
          color: '#EFF9FF',
          link: '',
          source: 'https://tzxm.zjzwfw.gov.cn/myProjectDeclareAction.do?method=goApprtProject&AUDIT_TYPE=03&IS_FOREIGN=0&IS_CAR=0&isBigJw=0&porject_apply_type=0',
          backImage: 'https://img.hzanchu.com/acimg/f0f789dcffb3606ec3557bed2331cc4c.png'
        },
        {
          image: 'https://img.hzanchu.com/acimg/03e0e696195f774eeaec6494928a6a8d.png',
          text: '用地审批',
          backImage: 'https://img.hzanchu.com/acimg/bb7fec1ec82b29bd65b94d5e4b27bc81.png',
          color: '#EEF5FF',
          link: '',
          source: 'https://www.zjzwfw.gov.cn/zjservice/item/detail/index.do?localInnerCode=ff03b7a3-7baa-4432-9454-19fbcc37dc8b'
        },
        {
          image: 'https://img.hzanchu.com/acimg/3d59e4d9d69b4226b210890d60289642.png',
          text: '我要报固投',
          backImage: 'https://img.hzanchu.com/acimg/373b1b5ddc30e148a7cff2aba69d49a8.png',
          color: '#FCF4E5',
          link: '',
          source: 'http://lwzbdr.tjj.zj.gov.cn/dr/queryLoginInfo.do'
        }
      ]
    })
    const jumpAction = (item) => {
      //跳转
      if (item.link) {
        Router.push({
          name: item.link
        })
      } else if (item.source) {
        if (state.ZLBFLAG) {
          ZWJSBridge.openLink({
            url: item.source
          })
        } else {
          window.open(item.source, '_blank')
        }
      } else {
        return false
      }
    }
    return {
      state,
      jumpAction
    }
  }
}
</script>
<style scoped lang="less">
.serve-box {
  // .serve-box-header{
  //     height: 0.9rem;
  //     background: #fff;
  //     text-align: center;
  //     line-height: 0.9rem;
  //     border-bottom: 0.01rem solid rgba(112, 112, 112, 0.2);
  //     font-size: 0.3rem;
  // }
  .serve-box-center {
    // min-height: 84.6vh;
    padding: 0.3rem;
    overflow: auto;
    min-height: auto;
    .fourPartCon {
      display: flex;
      border-radius: 0.3rem;
      justify-content: space-between;
      flex-wrap: wrap;
      align-items: center;
      align-content: center;
      margin-bottom: 0.3rem;
      background: #fff;
      .centent-box {
        padding: 0 0.3rem 0.3rem 0.3rem;
        width: 100%;
      }
      .folding-bar {
        height: 0.98rem;
        display: flex;
        align-items: center;
        position: relative;
        width: 100%;
        &::before {
          content: '';
          display: block;
          width: 0.08rem;
          height: 0.4rem;
          background: url('https://img.hzanchu.com/acimg/dd3a9c0c3ca479fe948fd8e1c6f6ad20.png') no-repeat;
          background-size: 100%;
          position: absolute;
          left: 0;
        }
        .title {
          font-size: 0.36rem;
          color: #2b333f;
          display: flex;
          align-items: center;
          margin-left: 0.3rem;
          font-weight: bold;
          .van-icon {
            margin-left: 0.16rem;
            transition: all 0.3s;
          }
        }
      }
      .homeTag {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        align-content: center;
        box-sizing: border-box;
      }
      .marBottom20 {
        margin-bottom: 0.2rem;
      }
      .tagLine {
        width: 0.08rem;
        height: 0.4rem;
        background: #1b82ec;
        opacity: 1;
        border-radius: 0.03rem;
        margin-right: 0.2rem;
      }
      .tagText {
        font-size: 0.35rem;
        line-height: 0.6rem;
        height: 0.4rem;
        margin-bottom: 0.25rem;
        font-weight: 600;
        color: #2b333f;
      }
      .tagTextOld {
        font-size: 0.4rem;
      }
      .fourItem {
        width: 48%;
        height: 1.16rem;
        display: inline-flex;
        justify-content: flex-start;
        align-content: center;
        align-items: center;
        padding-left: 0.3rem;
        box-sizing: border-box;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        margin-bottom: 0.2rem;
        img {
          width: 0.8rem;
          height: 0.8rem;
          margin-left: auto;
          margin-right: 0.3rem;
        }
        .fourItemText {
          font-size: 0.28rem;
          color: #2b333f;
          font-family: PingFang SC;
        }
        .fourItemTextOld {
          font-size: 0.4rem;
        }
      }
    }
  }
}
</style>
