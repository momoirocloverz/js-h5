<template>
  <div class="record-container" :class="{ 'fit-old': ZLBFitForOld }">
    <div class="top">
      <div class="title">状态展示：</div>
      <div class="status-declare" :class="{ unique: true }">
        <div class="item" v-for="(item, i) in statusList" :key="i">
          <img :src="item.icon" alt="icon" class="icon" />
          <div class="text" :style="{ color: item.color }">
            {{ item.title }}
          </div>
        </div>
      </div>
    </div>

    <div class="record-content">
      <van-collapse v-model="activeName" accordion>
        <van-collapse-item v-for="(item, index) in list" :key="index" :name="index + 1">
          <template #title>
            <div class="item-title">
              <img :src="typeMap[item.action_type] && typeMap[item.action_type].icon" class="icon" />
              <div class="text">{{ typeMap[item.action_type] && typeMap[item.action_type].title }}</div>
            </div>
          </template>
          <div class="block">
            <div class="title">操作时间</div>
            <div class="text">
              {{ dayjs(item.created_at).format('YYYY-MM-DD') }}
            </div>
          </div>
          <div class="block" v-if="item.action_content">
            <div class="title">意见</div>
            <div class="text">
              {{ item.action_content }}
            </div>
          </div>
          <div class="block" v-if="item.imgs && item.imgs.length">
            <div class="title">图片附件</div>
            <div class="btn" @click="showImages(item.imgs)">查看附件</div>
          </div>
          <div class="block" v-if="item.files && item.files.length">
            <div class="title">文件附件</div>
            <div class="file-list ac-flex">
              <div class="file-item" v-for="(file, i) in item.files" :key="i" @click="showFile(file)">
                {{ `附件${i + 1}` }}
              </div>
            </div>
            <!-- <div class="btn" @click="showFiles(item.imgs)">查看附件</div> -->
          </div>
          <div class="block">
            <div class="title">操作人</div>
            <div class="text">
              {{ item.action_username || '-' }}
            </div>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
    <Loading :visiable="loading"></Loading>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref, toRefs, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'
import dayjs from 'dayjs'
import { ImagePreview, Toast } from 'vant'
import { isZLB, getExtension } from '@/util/index'
import Loading from '@/components/loading'
import generateTypeMap from './type_map'

export default defineComponent({
  components: { Loading },
  setup(props, { emit }) {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      ZLBFLAG: isZLB(),
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
      loading: false,
      activeName: ref('1'),
      typeMap: reactive({}),
      list: reactive([]),
      statusList: reactive([
        {
          icon: 'https://img.hzanchu.com/acimg/0af59cff0b5c183267143702261ae1a9.png?x-oss-process=image/resize,l_300',
          title: '已通过/完成',
          color: '#00CC66'
        },
        {
          icon: 'https://img.hzanchu.com/acimg/629dd22da121895eef970acc091c1147.png?x-oss-process=image/resize,l_300',
          title: '已驳回',
          color: '#FF3B30'
        }
      ])
    })
    // 获取数据
    const getData = () => {
      const params = Route.query
      state.loading = true
      Request.getApprovalRecord(params)
        .then((res) => {
          if (res.code == 0) {
            let list = res.data.list
            list.length &&
              list.forEach((v) => {
                if (v.attachment instanceof Array && !v.attachment.length) {
                  v.attachment = null
                } else if (JSON.stringify(v.attachment) == '{}') {
                  v.attachment = null
                } else if (!v.attachment) {
                  v.attachment = null
                }
                let fileList = v.attachment || []
                if (typeof v.attachment == 'string') {
                  fileList = JSON.parse(v.attachment)
                }
                // 竞争性返回的附件结构是[{url: xxx, src: xxx}]
                if (fileList[0] && typeof fileList[0] == 'object') {
                  fileList = fileList.map((v) => v.url)
                }
                v.files = []
                v.imgs = []
                fileList.length &&
                  fileList.forEach((file) => {
                    if (['pdf', 'doc', 'docx'].includes(getExtension(file))) {
                      // 非图片
                      v.files.push(file)
                    } else {
                      // 图片
                      v.imgs.push(file)
                    }
                  })
              })
            state.list = list
          } else {
            Toast(res.msg)
          }
        })
        // .catch(err => {
        //   console.log('err', err)
        // })
        .finally(() => {
          state.loading = false
        })
    }

    // 展示附件图片
    const showImages = (data) => {
      try {
        let imgs = data
        if (imgs) {
          if (!imgs.length) {
            return Toast('审核人尚未添加附件')
          }
          ImagePreview({ images: imgs, closeable: true })
        } else {
          return Toast('审核人尚未添加附件')
        }
      } catch (error) {
        console.log(error)
        Toast('附件文件异常')
      }
    }

    // 下载文件附件
    const showFile = (file) => {
      window.open(file, '_blank')
    }

    onMounted(() => {
      // if (Route.query.record_type == 1) {
      //   state.statusList.unshift({
      //     icon: 'https://img.hzanchu.com/acimg/883cb3cc1fa612db7c4f0cfc8db2363c.png?x-oss-process=image/resize,l_300',
      //     title: '材料待修改',
      //     color: '#FF9500',
      //   })
      // }
      getData()
      state.typeMap = generateTypeMap(Route.query.record_type)
    })

    return {
      ...toRefs(state),
      Route,
      dayjs,
      showImages,
      showFile
    }
  }
})
</script>

<style scoped lang="less">
.record-container {
  box-sizing: border-box;
  padding: 0.3rem;
  div {
    box-sizing: border-box;
  }

  .top {
    width: 100%;
    padding: 0.3rem;
    background: #ffffff;
    border-radius: 0.16rem;
    margin-bottom: 0.3rem;

    .title {
      font-size: 0.3rem;
      font-weight: bold;
      color: #333333;
      margin-bottom: 0.3rem;
    }

    .status-declare {
      display: flex;
      align-items: center;
      justify-content: space-between;

      &.unique {
        justify-content: space-around;
      }

      .item {
        width: 1.9rem;
        height: 1.6rem;
        background: #f1f8fe;
        border-radius: 0.1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        .icon {
          width: 0.66rem;
          height: 0.66rem;
          margin-bottom: 0.16rem;
        }

        .text {
          color: #3399ff;
          font-size: 0.28rem;
        }
      }
    }
  }

  .record-content {
    width: 100%;
    background: #ffffff;
    border-radius: 0.16rem;
    padding: 0 0.3rem;
    overflow: hidden;

    :deep(.van-collapse) {
      .van-collapse-item {
        &::after {
          left: 0;
          right: 0;
        }
        &:last-child {
          .van-collapse-item__wrapper {
            margin-bottom: 0.3rem;
          }
        }
        .van-cell {
          padding: 0;
          height: 1rem;
          align-items: center;

          &.van-collapse-item__title--expanded {
            &::after {
              display: none;
            }
          }

          .van-cell__title {
            .item-title {
              display: flex;
              align-items: center;
              .icon {
                width: 0.36rem;
                height: 0.36rem;
                margin-right: 0.2rem;
              }
              .text {
                color: #000;
                font-size: 0.28rem;
              }
            }
          }
        }

        .van-collapse-item__content {
          background: #e7f2fd;
          border-radius: 0.1rem;
          color: #333333;
          padding: 0 0.3rem;

          .block {
            padding: 0.3rem 0;
            position: relative;
            .title {
              font-size: 0.3rem;
              font-weight: bold;
              color: #1b82ec;
              margin-bottom: 0.1rem;
            }

            .text {
              font-size: 0.26rem;
            }

            .btn {
              width: 1.6rem;
              height: 0.5rem;
              background: #1b82ec;
              border-radius: 0.25rem;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #fff;
              font-size: 0.26rem;
              font-weight: 500;
            }

            &::after {
              position: absolute;
              content: ' ';
              pointer-events: none;
              top: 0;
              right: 0;
              left: 0;
              border-top: 1px solid #d2e7fb;
              transform: scaleY(0.5);
            }

            &:first-child {
              &::after {
                content: none;
              }
            }
          }
        }

        .file-list {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          .file-item {
            color: #1b82ec;
            margin-left: 0.2rem;
            text-decoration: underline;
            &:first-child {
              margin-left: 0;
            }
          }
        }
      }
    }
  }

  &.fit-old {
    .top {
      .item {
        width: 2.01rem;
        .text {
          font-size: 0.34rem;
        }
      }
    }
    .record-content {
      :deep(.van-collapse) {
        .van-collapse-item {
          .van-cell {
            .van-cell__title {
              .item-title {
                .icon {
                  width: 0.42rem;
                  height: 0.42rem;
                }
                .text {
                  font-size: 0.34rem;
                }
              }
            }
          }
        }
        .van-collapse-item__wrapper {
          .block {
            .title {
              font-size: 0.38rem;
            }
            .text {
              font-size: 0.34rem;
            }
            .btn {
              height: 0.7rem;
              border-radius: 0.4rem;
              font-size: 0.34rem;
            }
          }
        }
      }
    }
  }
}
</style>
