<!-- 资金拨付-审核进度 -->
<template>
  <div class="main">
    <div class="item" v-for="(item, index) in list.value" :key="index">
      <div class="left">
        <div :class="num <= index - 1 ? 'circle  opacity3' : 'circle'"></div>
        <div :class="num < index + 1 ? 'dashed  opacity3' : 'dashed'"></div>
      </div>
      <div class="right" :class="state.ZLBFitForOld ? 'resetStepOld' : ''">
        <p class="title">
          {{ item.label }}
        </p>
        <p class="opnion" v-if="(index && index < 2 && num == 1)&&!item.opinion ">
          {{ '审核中' }}
        </p>
        <p class="opnion" v-if="item.opinion">意见：{{ item.opinion }}</p>
        <p class="attachment" v-if="item.attachment && item.attachment.length" @click="showImages(item.attachment)">查看图片</p>
        <p class="attachment attachment_doc" v-if="item.attachment && item.attachment.length">
          <span class="link doc" v-for="(doc, i) in item.attachment_doc" :key="i" @click="showDocs(doc.url)">{{ `${doc.name}` }}</span>
        </p>
        <p v-if="item.real_fund_amount">{{ item.real_fund_amount }}万元</p>
        <p>{{ item.time }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { isZLB } from '@/util/index'
import { ImagePreview } from 'vant'
export default defineComponent({
  props: {
    procressData: {
      // 流程
      type: Array
    },
    step: {
      // 步骤
      type: Number,
      default: 1
    }
  },
  setup(props, { emit }) {
    const list = reactive([])
    const state = reactive({
      ZLBFLAG: isZLB(),
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false
    })
    const num = ref(1)
    onMounted(() => {
      list.value = props.procressData
      num.value = props.step || 1
    })
    watch(
      () => props.step,
      (newValue, oldValue) => {
        // console.log(newValue, oldValue)
        num.value = newValue || 1
      }
    )

    // 展示附件图片
    const showImages = (data) => {
      try {
        let imgs = data
        if (typeof data == 'string') {
          imgs = JSON.parse(data)
        }

        if (imgs) {
          if (!imgs.length) {
            return Toast('审核人尚未添加附件')
          }
          ImagePreview({ images: imgs.map((v) => v.url), closeable: true })
        } else {
          return Toast('审核人尚未添加附件')
        }
      } catch (error) {
        console.log(error)
        Toast('附件文件异常')
      }
    }

    const showDocs = (src) => {
      window.open(src, '_blank')
    }
    return {
      list,
      num,
      state,
      showImages,
      showDocs
    }
  }
})
</script>
<style scoped lang="less">
.opacity3 {
  opacity: 0.3;
}

.main {
  width: 100%;
  font-size: 0.28rem;

  .item:last-child {
    .left {
      .dashed {
        border: none;
      }
    }
  }

  .main .item:last-child .right {
    min-height: 0;
  }

  .item {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: space-between;
    position: relative;

    .left {
      width: 0.3rem;
      height: auto;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      overflow: hidden;

      .circle {
        width: 0.3rem;
        height: 0.3rem;
        border-radius: 50%;
        background-color: rgba(13, 115, 255, 1);
      }

      .dashed {
        position: absolute;
        width: 0;
        border-right: 0.04rem dashed rgba(13, 115, 255, 1);
        height: 100%;
        left: 0;
        right: 0;
        margin-right: auto;
        margin-left: auto;
        top: 0.3rem;
      }
    }

    .right {
      width: 100%;
      padding-left: 0.5rem;
      min-height: 1.5rem;

      p {
        color: rgba(51, 51, 51, 1);
        font-weight: normal;
        font-size: 0.24rem;
        margin-bottom: 0.2rem;

        &.title {
          font-size: 0.28rem;
          color: rgba(51, 51, 51, 1);
          font-weight: bold;
        }

        &.attachment {
          color: #0d73ff;

          &.attachment_doc {
            .link {
              display: inline-block;
              margin-right: 0.2rem;
              line-height: 0.3rem;
              max-width: 1.6rem;
              white-space: nowrap;
              text-overflow: ellipsis;
              -o-text-overflow: ellipsis;
              overflow: hidden;
            }
          }
        }
      }

      p:last-child {
        color: rgba(153, 153, 153, 1);
        font-weight: normal;
        margin-top: 0.2rem;
        font-size: 0.24rem;
      }
    }
    .resetStepOld {
      p,
      br {
        font-size: 0.35rem;
      }
    }
  }
}
</style>
