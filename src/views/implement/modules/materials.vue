<template>
  <div class="materials">
    <div class="name" :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">
      {{ detail.index + '. ' + detail.name }}
    </div>
    <!-- <div class="tips" :class="state.ZLBFitForOld ? 'picDescribeOld' : ''">支持上传文件格式：jpg、jpeg、png（单个文件大小在10M以内）</div> -->
    <!-- <van-uploader
      v-model="detail.list"
      :before-delete="onDelete"
      :after-read="onUpload"
      :show-upload="!projectInfo.isYs"
      :deletable="!projectInfo.isYs"
    /> -->
    <AcUploaderCopy3 :fileList="detail.list" :readonly="projectInfo.isYs" @afterRead="cgpjAfterRead" @deleteCb="deleteAction" @choiceImg="choiceImg"></AcUploaderCopy3>
  </div>
  <!-- accept=".doc,.docx,.jpg,.jpeg,.png,.pdf" -->
  <!-- accept="*" -->
  <input ref="inputTarget" id="takepicture" type="file" style="display: none" @change="upload" />
</template>

<script>
import { defineComponent, ref, watch, reactive, onMounted } from 'vue'
import AcUploaderCopy3 from '@/components/AcUploaderCopy3'
import Compressor from 'compressorjs'
import { useRoute } from 'vue-router'
import { Toast } from 'vant'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
import { OSSLINK } from '@/util/const'
import OSS from 'ali-oss'
export default defineComponent({
  props: {
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    },
    projectInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {
    AcUploaderCopy3
  },
  setup(props) {
    const Route = useRoute()
    const state = reactive({
      ZLBFLAG: isZLB(),
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
      client: {}
    })
    let inputTarget = ref(null)
    const onUpload = (file) => {
      props.detail.list = props.detail.list.filter((item) => item.url)
      uploadFile(file.file)
      // new Compressor(file.file, { // 图片压缩
      //   quality: 0.4,
      //   success(result) {
      //     uploadFile(result)
      //   },
      //   error(fail) {
      //     Toast('图片压缩失败，请重试')
      //   }
      // })
    }
    onMounted(() => {
      fetchOssinfo()
    })
    const fetchOssinfo = () => {
      Request.fetchNewOssInfo().then((res) => {
        if (res && res.code === 0) {
          let after = res.data.info
          state.client = new OSS({
            // region: after.endpoint_upload,
            region: 'oss-cn-hangzhou',
            accessKeyId: after.access_key,
            accessKeySecret: after.secret_key,
            bucket: after.bucket
          })
          state.client.path = after.path_class
        }
      })
    }
    const upload = (e) => {
      let fileObj = e.target.files[0]
      let isValid =
        fileObj.type === 'image/jpeg' ||
        fileObj.type === 'image/png' ||
        fileObj.type === 'image/jpg' ||
        fileObj.type === 'application/pdf' ||
        fileObj.type === 'application/msword' ||
        fileObj.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

      const fileSizelimit = 10 * 1024 * 1024
      if (fileObj.size > fileSizelimit) {
        return Toast('文件大小不能超过10MB')
      }

      if (isValid) {
        if (state.ZLBFLAG) {
          // let fileObj = file
          let url = `${state.client.path}/${fileObj.name.split('.')[0]}-${Date.parse(new Date()) / 1000}.${fileObj.name.split('.')[fileObj.name.split('.').length - 1]}`
          // let url = `${state.client.path}/${fileObj.name.split('.')[0]}-${Date.parse(new Date()) / 1000}.${fileObj.type.split('/')[1]}`
          let reader = new FileReader()
          reader.readAsDataURL(fileObj)
          reader.onloadend = () => {
            state.client.multipartUpload(url, fileObj).then(async (data) => {
              let newParams = {
                which_type: props.detail.which_type,
                project_id: +Route.query.projectId,
                fileUrl: OSSLINK + data.name,
                fileOriginName: fileObj.name.split('.')[0]
              }
              Toast.loading({
                message: '上传中...',
                forbidClick: true,
                duration: 0
              })
              Request.editProjectYsMaterials(newParams)
                .then((res) => {
                  if (res.code === 0) {
                    Toast('上传成功')
                    e.target.value = ''
                    getMaterialsList()
                  } else {
                    Toast('上传失败，请重试')
                  }
                })
                .catch((err) => {
                  Toast('服务器错误')
                })
            })
          }
        } else {
          const data = new FormData()
          data.append('file', fileObj)
          data.append('which_type', props.detail.which_type)
          data.append('project_id', +Route.query.projectId)
          Toast.loading({
            message: '上传中...',
            forbidClick: true,
            duration: 0
          })
          Request.editProjectYsMaterials(data)
            .then((res) => {
              if (res.code === 0) {
                Toast('上传成功')
                e.target.value = ''
                getMaterialsList()
              } else {
                Toast('上传失败，请重试')
              }
            })
            .catch((err) => {
              Toast('服务器错误')
            })
        }
      } else {
        Toast('支持上传文件格式：jpg、jpeg、png、doc、docx、pdf')
      }
    }

    const uploadFile = (file) => {
      if (state.ZLBFLAG) {
        let fileObj = file
        let url = `${state.client.path}/${fileObj.name.split('.')[0]}-${Date.parse(new Date()) / 1000}.${fileObj.type.split('/')[1]}`
        let reader = new FileReader()
        reader.readAsDataURL(fileObj)
        reader.onloadend = () => {
          state.client.multipartUpload(url, fileObj).then(async (data) => {
            let newParams = {
              which_type: props.detail.which_type,
              project_id: +Route.query.projectId,
              fileUrl: OSSLINK + data.name,
              fileOriginName: fileObj.name.split('.')[0]
            }
            Toast.loading({
              message: '上传中...',
              forbidClick: true,
              duration: 0
            })
            Request.editProjectYsMaterials(newParams)
              .then((res) => {
                if (res.code === 0) {
                  Toast('上传成功')
                  getMaterialsList()
                } else {
                  Toast('上传失败，请重试')
                }
              })
              .catch((err) => {
                Toast('服务器错误')
              })
          })
        }
      } else {
        const data = new FormData()
        data.append('file', file)
        data.append('which_type', props.detail.which_type)
        data.append('project_id', +Route.query.projectId)
        Toast.loading({
          message: '上传中...',
          forbidClick: true,
          duration: 0
        })
        Request.editProjectYsMaterials(data)
          .then((res) => {
            if (res.code === 0) {
              Toast('上传成功')
              getMaterialsList()
            } else {
              Toast('上传失败，请重试')
            }
          })
          .catch((err) => {
            Toast('服务器错误')
          })
      }
    }

    const onDelete = async (e) => {
      try {
        const result = await Request.deleteProjectYsMaterials({
          materials_id: e.id
        })
        if (result.code === 0) {
          const index = props.detail.list.findIndex((item) => item.id === e.id)
          props.detail.list.splice(index, 1)
          Toast('删除成功')
        } else {
          Toast(result.msg)
        }
      } catch (err) {
        Toast('服务器错误')
      }
    }

    const getMaterialsList = async () => {
      let params = {
        which_type: props.detail.which_type,
        project_id: +Route.query.projectId
      }
      const result = await Request.getProjectYsMaterials(params)
      props.detail.list = result.data.list.map((item) => {
        return { url: item.src, id: item.id, isImage: true, suffix: item.suffix, name: item.origin_name }
      })
    }
    const cgpjAfterRead = () => {
      //
    }
    const getData = () => {
      //
    }
    const choiceImg = () => {
      inputTarget.value.click()
    }
    const deleteAction = async (value) => {
      try {
        const result = await Request.deleteProjectYsMaterials({
          materials_id: value.id
        })
        if (result.code === 0) {
          const index = props.detail.list.findIndex((item) => item.id === value.id)
          props.detail.list.splice(index, 1)
          Toast('删除成功')
        } else {
          Toast(result.msg)
        }
      } catch (err) {
        Toast('服务器错误')
      }
    }
    watch(
      () => props.detail.id,
      (val) => {
        if (val) getMaterialsList()
      },
      { immediate: true }
    )
    return {
      onUpload,
      onDelete,
      state,
      cgpjAfterRead,
      getData,
      choiceImg,
      inputTarget,
      deleteAction,
      upload
    }
  }
})
</script>

<style scoped lang="less">
.materials {
  margin: 0.25rem 0;
  .name {
    line-height: 0.4rem;
  }
  .itemTitleOld {
    font-size: 0.35rem;
  }
  .tips {
    color: #999;
    font-size: 0.24rem;
    line-height: 0.3rem;
    margin: 0.2rem 0;
  }
  .picDescribeOld {
    font-size: 0.3rem;
  }
}
</style>
