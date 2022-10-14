<!-- 签名页 -->
<template>
  <div class="signature-container">
    <div class="sign-wrapper">
      <vue-esign ref="esign" :height="400" :isCrop="signConfigs.isCrop" :lineWidth="signConfigs.lineWidth" :lineColor="signConfigs.lineColor" v-model:bgColor="signConfigs.bgColor" />
    </div>
    <div class="options">
      <van-button type="primary" plain round @click="redo">重写</van-button>
      <van-button type="primary" round @click="save">完成</van-button>
    </div>
    <div class="tip">温馨提示：请在空白处手动签名；请按照从左向右方向签字</div>
    <Loading :visiable="loading" text="上传中..."></Loading>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onMounted, defineComponent } from 'vue'
import vueEsign from 'vue-esign'
import { Dialog, Toast } from 'vant'
import OSS from 'ali-oss'
import { OSSLINK, PROMISE_DOC_URL } from '@/util/const'
import { util, isZLB } from '@/util/index'
import { base64url_encode } from '@/util/base64'
import Request from '@/service/request'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import Loading from '@/components/loading'

export default defineComponent({
  name: 'signature',
  components: { vueEsign, Loading },
  setup() {
    const state = reactive({
      signConfigs: reactive({
        lineWidth: 6,
        lineColor: '#333333',
        bgColor: '#fff',
        isClearBgColor: false,
        resultImg: '',
        isCrop: true
      }),
      client: {},
      fileList: [],
      loading: ref(false),
      ZLBFLAG: isZLB()
    })
    const esign = ref(null)
    const route = useRoute()
    const router = useRouter()

    onMounted(() => {
      fetchOssinfo()
    })

    const fetchOssinfo = () => {
      if (state.isZLB) {
        Request.fetchOssInfo()
          .then((res) => {
            // console.log('res', res)
            let shazam = res.data
            if (shazam && shazam.code === 0) {
              let after = shazam.data.info
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
          .catch((e) => {
            console.log(e)
          })
      } else {
        Request.getOssConfig({})
          .then((res) => {
            // console.log('res', res)
            let shazam = res.data
            if (shazam && res.code === 0) {
              let after = shazam.info
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
          .catch((e) => {
            console.log(e)
          })
      }
    }

    const upload = async () => {
      try {
        const fileObj = util.base64ToPng(state.signConfigs.resultImg, '签名')
        // return console.log('fileObj', fileObj)
        let url = `${state.client.path}/${fileObj.name.split('.')[0]}-${Date.parse(new Date()) / 1000}.${fileObj.type.split('/')[1]}`
        let reader = new FileReader()
        reader.readAsDataURL(fileObj)
        reader.onloadend = () => {
          state.client.multipartUpload(url, fileObj).then(async (data) => {
            // console.log(data)
            // console.log('生成水印图片地址 == ', genWatermarkImage(data.name))
            const watermarkUrl = genWatermarkImage(data.name)
            // 转base64
            const watermark_base64 = await util.getBase64(watermarkUrl)
            // 转file对象
            const watermarlk_file = util.base64ToPng(watermark_base64, `承诺书${route.query.project_id || ''}-${dayjs().valueOf()}`)
            // console.log('生成水印图片File对象 == ', watermarlk_file)

            // 生成的水印图片上传
            const result = await uploadWatermarkImage(watermarlk_file)
            // console.log('result', result);
            let newParams = {
              fileOriginName: watermarlk_file.name.split('.')[0],
              fileUrl: `${OSSLINK}${decodeURIComponent(result.name)}`,
              cl_type: 1,
              which_type: 71,
              policy_document_id: route.query.policy_document_id,
              project_id: route.query.project_id
            }
            // return console.log(newParams)
            let config = {}
            if (route.query.tk) {
              config = {
                headers: {
                  Authorization: route.query.tk
                }
              }
            }
            Request.uploadSignatureMaterials(newParams, config)
              .then((res) => {
                if (res.code === 0) {
                  const { id, from } = route.query || {}
                  if (from && from == 'web') {
                    // 从pc扫码打开 给予提示
                    Dialog.alert({
                      title: '提示',
                      message: '签名成功，请返回电脑端查看'
                    }).then(() => {
                      // on close
                      state.loading = false
                      document.body.innerHTML = '<h3 style="text-align: center;margin-top: 30%;">签名成功<br /><br />请返回电脑端查看</h3>'
                    })
                  } else {
                    // 移动端跳转 返回上一页
                    state.loading = false
                    Toast('签名成功')
                    router.go(-1)
                  }
                }
              })
              .catch((e) => {
                console.log(e)
              })
              .finally(() => {
                state.loading = false
              })
          })
        }
      } catch (e) {
        state.loading = false
      }
    }

    // 水印图片上传
    const uploadWatermarkImage = (file) => {
      return new Promise((resolve, reject) => {
        try {
          let url = `${state.client.path}/${file.name.split('.')[0]}-${Date.parse(new Date()) / 1000}.${file.type.split('/')[1]}`
          let reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onloadend = () => {
            state.client.multipartUpload(url, file).then(async (data) => {
              // console.log('水印图片直传oss返回', data)
              resolve(data)
            })
          }
        } catch (e) {
          console.log(e)
          Toast('图片上传失败')
          reject()
        }
      })
    }

    /**
     * 拼接水印图片url
     * @params signatureName 签名图片oss直传回调中的name  eg：dev/jiangshan_tzyjs/签名-1651892476.png
     */
    const genWatermarkImage = (signatureName) => {
      const name = base64url_encode(`${signatureName}?x-oss-process=image/resize,w_120`)
      const date = dayjs(new Date()).format('YYYY-M-D')
      const year = base64url_encode(date.split('-')[0])
      const month = base64url_encode(date.split('-')[1])
      const day = base64url_encode(date.split('-')[2])
      return `${PROMISE_DOC_URL}?x-oss-process=image/quality,q_100/watermark,image_${name},g_se,x_140,y_70/watermark,text_${year},g_se,x_260,y_30,size_16/watermark,text_${month},g_se,x_215,y_30,size_16/watermark,text_${day},g_se,x_165,y_30,size_16`
    }

    const redo = () => {
      Dialog.confirm({
        title: '提示',
        message: `确定清除已写内容?`
      })
        .then(() => {
          // on confirm
          esign.value.reset()
        })
        .catch(() => {
          // on cancel
        })
    }

    const save = () => {
      state.loading = true
      esign.value
        .generate()
        .then((res) => {
          state.signConfigs.resultImg = res
          upload()
        })
        .catch((err) => {
          Toast('未绘制内容')
          state.loading = false
          console.log(err) // 画布没有签字时会执行这里 'Not Signned'
        })
    }
    return {
      ...toRefs(state),
      redo,
      save,
      esign
    }
  }
})
</script>
<style lang="less" scoped>
.signature-container {
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  padding: 0.2rem;

  .sign-wrapper {
    background: #fff;
    border-radius: 0.16rem;
    overflow: hidden;
  }

  .options {
    padding: 0.4rem 0;
    bottom: 0.3rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;

    .van-button {
      height: 0.96rem;
      width: 2rem;
    }
  }

  .tip {
    color: var(--van-field-required-mark-color);
    font-size: 0.24rem;
    padding: 0.1rem;
  }
}
</style>
