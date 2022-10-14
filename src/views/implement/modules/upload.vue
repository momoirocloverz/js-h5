<template>
  <div class="uplaod">
    <van-uploader
      v-model="fileList"
      :max-count="limit"
      :before-delete="onDelete"
      :after-read="onUpload"
      :show-upload="showUpload"
      :deletable="deletable"
    />
    <!--      <div class="add_pic">-->
    <!--        <img src="https://img.hzanchu.com/acimg/31ff418ff3a15dd0a4cc4b7e597965ab.png" alt="" />-->
    <!--        <p>点击上传</p>-->
    <!--      </div>-->
    <!--    </van-uploader>-->
  </div>
</template>

<script>
import { ref, defineComponent, watch, reactive, onMounted } from 'vue'
import { Toast } from 'vant'
import Request from '@/service/request'
import { OSSLINK } from '@/util/const'
import Compressor from 'compressorjs'
import { isZLB } from '@/util/index'
import OSS from 'ali-oss'
export default defineComponent({
  props: {
    limit: {
      type: Number,
      default: 1,
    },
    showUpload: {
      // 是否展示上传区域
      type: Boolean,
      default: true,
    },
    deletable: {
      // 是否展示删除按钮
      type: Boolean,
      default: true,
    },
    imageList: {
      type: Array,
      default: () => {
        return []
      },
    },
    imageId: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const fileList = ref([])
    const state = reactive({
      ZLBFLAG: isZLB(),
      ZLBFitForOld:
        localStorage.getItem('fitForOld') &&
        localStorage.getItem('fitForOld') == 1
          ? true
          : false,
      client: {},
    })
    const percentage = ref(0)
    const onUpload = (file) => {
      fileList.value = fileList.value.filter((item) => item.url)
      setTimeout(() => {
        uploadFile(file.file)
      }, 400)
      // new Compressor(file.file, { // 图片压缩
      //   quality: 0.4,
      //   success(result) {
      //     uploadFile(result)
      // },
      // error(fail) {
      //   Toast('图片压缩失败，请重试')
      // }
      // })
    }
    onMounted(() => {
      if (state.ZLBFLAG) {
        fetchOssinfo()
      }
    })
    const fetchOssinfo = () => {
      Request.fetchOssInfo().then((res) => {
        let shazam = res.data
        if (shazam && shazam.code === 0) {
          let after = shazam.data.info
          state.client = new OSS({
            // region: after.endpoint_upload,
            region: 'oss-cn-hangzhou',
            accessKeyId: after.access_key,
            accessKeySecret: after.secret_key,
            bucket: after.bucket,
          })
          state.client.path = after.path_class
        }
      })
    }
    const uploadFile = (file) => {
      if (state.ZLBFLAG) {
        let fileObj = file
        let url = `${state.client.path}/${fileObj.name.split('.')[0]}-${
          Date.parse(new Date()) / 1000
        }.${fileObj.type.split('/')[1]}`
        let reader = new FileReader()
        reader.readAsDataURL(fileObj)
        reader.onloadend = () => {
          console.log(state.client)
          state.client.multipartUpload(url, fileObj).then(async (data) => {
            Toast.loading({
              message: '上传中...',
              forbidClick: true,
              duration: 0,
            })
            fileList.value.push({
              url: OSSLINK + data.name,
              isImage: true,
            })
            Toast('上传成功')
            handleChange()
          })
        }
      } else {
        const data = new FormData()
        data.append('file', file)
        Toast.loading({
          message: '上传中...',
          forbidClick: true,
          duration: 0,
        })
        Request.uploadImages(data)
          .then((res) => {
            if (res.code === 0) {
              Toast('上传成功')
              fileList.value.push({
                url: OSSLINK + res.data.img_url,
                isImage: true,
              })
              handleChange()
            } else {
              Toast('上传失败，请重试')
            }
          })
          .catch((err) => {
            Toast('服务器错误')
          })
      }
    }
    const onDelete = (e) => {
      const index = fileList.value.findIndex((item) => item === e)
      fileList.value.splice(index, 1)
      handleChange()
    }
    const handleChange = () => {
      // emit('uploadList', getFileList())
      emit('update:imageList', getFileList())
    }
    const getFileList = () => {
      const ids = []
      fileList.value.map((item) => {
        ids.push({ url: item.url, isImage: true })
      })
      return ids
    }
    watch(
      () => props.imageList,
      (val) => {
        fileList.value = val
      },
      { immediate: true, deep: true }
    )
    return {
      fileList,
      percentage,
      onUpload,
      onDelete,
      state,
    }
  },
})
</script>

<style scoped lang="less">
.uplaod {
  :deep(.van-progress) {
    width: 100vw;
    position: fixed;
    left: 0;
    top: 0;
  }
  .add_pic {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #f5f7fa;
    width: 1.6rem;
    height: 1.6rem;
    img {
      width: 0.78rem;
      height: 0.56rem;
      padding-bottom: 0.15rem;
    }
    p {
      color: #999;
      font-size: 0.2rem;
    }
  }
}
</style>
