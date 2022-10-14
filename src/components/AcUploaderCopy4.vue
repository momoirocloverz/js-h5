<template>
  <div class="uploader-container2">
    <div class="uploader-content">
      <div class="pic1">
        <div class="pic-list11">
          <div v-for="item in tempFileList" :key="item.id" class="image-box">
            <van-icon class="delete" name="clear" @click="deleteImg(item)" v-if="!readonly" />
            <template v-if="item.suffix && ['JPEG', 'JPG', 'PNG'].includes(item.suffix.toUpperCase())">
              <img @click="popView(item)" :src="imgIconFilter(item)" alt />
            </template>
            <template v-else>
              <div class="file-preview" @click="openFile(item)">
                <div class="preview-content">
                  <van-icon name="description" size="2em" />
                  <div class="file-title">{{ item.name }}</div>
                </div>
              </div>
            </template>
          </div>
          <div class="upload-btn1" @click="choiceImg()" v-if="showAdd && !readonly">
            <van-icon name="plus" />
            <span>{{ addText }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted, reactive, ref, watch, toRefs, computed } from 'vue'
import { Toast, ImagePreview } from 'vant'
import { isZLB } from '@/util/index'
import Request from '@/service/request'
export default defineComponent({
  name: 'AcUploader',
  props: {
    fileList: {
      type: Array,
      default: []
    },
    status: {
      type: Number,
      default: 0
    },
    readonly: {
      type: Boolean,
      default: false
    },
    tipText: {
      type: String,
      default: '支持上传文件格式：jpg、jpeg、png、word、pdf，且大小在10M以内。'
    },
    addText: {
      type: String,
      default: '上传文件'
    },
    outerIndex: {
      type: Number,
      default: 0
    }
  },
  setup(props, context) {
    const state = reactive({
      ZLBFLAG: isZLB(),
      tempFileList: [],
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
      showAdd: true
    })

    const choiceImg = () => {
      //   if (props.status != 0) {
      //     return Toast('材料已提交，不可上传')
      //   }
      context.emit('choiceImg', '2')
    }

    const deleteImg = (e) => {
      //   if (props.status != 0) {
      //     return Toast('材料已提交，不可删除')
      //   }
      let trackIndex = state.tempFileList.findIndex((ele) => {
        return ele.url == e.url
      })
      context.emit('deleteCb', {
        outerIndex: props.outerIndex,
        trackIndex
      })
    }

    const imgIconFilter = (ele) => {
      let part =
        ele.suffix.toUpperCase() == 'PNG' || ele.suffix.toUpperCase() == 'JPG' || ele.suffix.toUpperCase() == 'JPEG'
          ? ele.url
          : ele.suffix.toUpperCase() == 'ZIP'
          ? state.zipIcon
          : ele.suffix.toUpperCase() == 'RAR'
          ? state.rarIcon
          : ele.suffix.toUpperCase() == 'PDF'
          ? state.pdfIcon
          : ele.suffix.toUpperCase() == 'DOC'
          ? state.docIcon
          : ele.suffix.toUpperCase() == 'DOCX'
          ? state.docxIcon
          : ''
      let obj = part
      return obj
    }

    const popView = (item) => {
      let part =
        item.suffix.toUpperCase() == 'PNG' || item.suffix.toUpperCase() == 'JPG' || item.suffix.toUpperCase() == 'JPEG'
          ? item.url
          : item.suffix.toUpperCase() == 'ZIP'
          ? state.zipIcon
          : item.suffix.toUpperCase() == 'RAR'
          ? state.rarIcon
          : item.suffix.toUpperCase() == 'PDF'
          ? state.pdfIcon
          : item.suffix.toUpperCase() == 'DOC'
          ? state.docIcon
          : item.suffix.toUpperCase() == 'DOCX'
          ? state.docxIcon
          : ''
      ImagePreview({
        images: [part],
        closeable: true
      })
    }
    const openFile = ({ url }) => {
      if (state.ZLBFLAG) {
        ZWJSBridge.openLink({
          url: url
        })
      } else {
        window.open(url, '_blank')
      }
    }

    watch(
      () => props.fileList,
      (newVal) => {
        state.tempFileList = newVal
        if (newVal && newVal.length >= 9) {
          state.showAdd = false
        } else {
          state.showAdd = true
        }
      },
      { immediate: true, deep: true }
    )

    onMounted(() => {})
    return {
      ...toRefs(state),
      deleteImg,
      popView,
      imgIconFilter,
      choiceImg,
      openFile
    }
  }
})
</script>
<style scoped lang="less">
.uploader-container2 {
  .title {
    font-size: 0.28rem;
    color: var(--van-field-label-color);
    margin-bottom: 0.3rem;

    &::before {
      content: '*';
      margin-right: 2px;
      color: var(--van-field-required-mark-color);
    }
  }
  .condition {
    font-size: 0.24rem;
    margin-bottom: 0.1rem;
    color: #999999;
  }
  .uploader-content {
    .add-block {
      width: 1.6rem;
      height: 1.6rem;
      background: #f9f9f9;
      border: 0.01rem dashed #cccccc;
      border-radius: 0.06rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-size: 0.28rem;
      color: #999999;

      .van-icon {
        font-size: 0.6rem;
        margin-bottom: 0.3rem;
      }
    }
  }
}
.pic1 {
  //   background-color: #fff;
  box-sizing: border-box;
  .pic-list11 {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .image-box {
      height: 1.6rem;
      width: 25%;
      position: relative;
      margin: 0.3rem 0.2rem 0 0;
      .delete {
        position: absolute;
        font-size: 0.36rem;
        top: -0.18rem;
        right: -0.18rem;
        color: #ccc;
      }
      img {
        width: 100%;
        height: 100%;
      }

      .file-preview {
        width: 100%;
        height: 100%;
        word-break: break-all;
        padding: 0 0.3rem;
        display: flex;
        box-sizing: border-box;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #f7f8fa;

        .preview-content {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .file-title {
          margin-top: 0.2rem;
          width: 100%;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
    }
    .upload-btn1 {
      width: 1.6rem;
      box-sizing: border-box;
      border: 2px dashed #ccc;
      text-align: center;
      overflow: hidden;
      border-radius: 10px;
      margin: 0.1rem 0.2rem 0 0;
      .van-icon {
        font-size: 0.8rem;
        color: #ccc;
        margin-top: 0.2rem;
      }
      span {
        font-size: 0.26rem;
        color: #ccc;
        margin-top: 0.2rem;
        display: block;
        margin-bottom: 0.2rem;
      }
    }
  }
}
.pic1:nth-last-child(1) {
  border: 0;
}

.fit-old {
  .uploader-container2 {
    .title {
      font-size: 0.34rem;
      color: var(--van-field-label-color);
      margin-bottom: 0.3rem;

      &::before {
        content: '*';
        margin-right: 2px;
        color: var(--van-field-required-mark-color);
      }
    }
    .condition {
      font-size: 0.3rem;
      color: #999999;
    }
  }

  .pic1 {
    .pic-list11 {
      .image-box {
        .delete {
          font-size: 0.44rem;
        }
      }
      .upload-btn1 {
        span {
          font-size: 0.34rem;
        }
      }
    }
  }
}
</style>
<style lang="less">
.uploader-container2 {
  margin-top: -0.2rem;
  .van-uploader__preview {
    width: 1.6rem;
    height: 1.6rem;
    .van-image {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
