<template>
  <van-popup
    class="say-box"
    :close-on-click-overlay="false"
    v-model:show="state.show"
    round
    :position="state.popupPosistion"
    :style="{ height: '2rem', width: '100%', top: state.popupPosistion == 'top' ? 'calc(85vh)' : 'calc(95vh)' }"
  >
    <!-- <span>松开 发送</span> -->
    <div class="show-centent-box">
      <img src="https://img.hzanchu.com/acimg/b046297e73f53791f56de423ea042a87.png" alt="" />
      <b>请说出要搜索的内容</b>
    </div>
    <div
      class="close-btn"
      @click="
        () => {
          end('out')
        }
      "
    >
      取消
    </div>
    <div class="transform-script-btn" @click="sendMessage">说完了</div>
    <img src="https://img.hzanchu.com/acimg/b2422ad1ba4a73a9e7e4a733a3b77847.png" alt="" />
  </van-popup>
</template>
<script>
import { onMounted, reactive, watch, ref } from 'vue'
import JsAudioRecorder from 'js-audio-recorder'
import OSS from 'ali-oss'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
import { Toast } from 'vant'
// import WaveSurfer from "wavesurfer.js";
let JsAudioRecorderObj = new JsAudioRecorder({
  sampleBits: 16, // 采样位数，支持 8 或 16，默认是16
  sampleRate: 16000, // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
  numChannels: 1 // 声道，支持 1 或 2， 默认是1
  // compiling: false,(0.x版本中生效,1.x增加中)  // 是否边录边转换，默认是false
})

export default {
  props: ['isShow', 'isGetJurisdiction', 'getVoiceVale', 'end', 'showPosistion'], //1、是否展示遮罩层、2、是否停止语音录制、3、传递语音解析后的文字发给父组件
  setup(props, context) {
    const state = reactive({
      show: false,
      wavesurfer: null,
      isHaveJurisdiction: false,
      isZLB: isZLB(), //是否是浙里办
      voiceValue: '', //语音识别后的文字内容
      client: {}, //存储oss信息
      toast: null,
      popupPosistion: 'bottom'
    })
    let waveFormRef = ref(null)
    onMounted(() => {
      fetchOssinfo() //获取oss信息
      if (props.isGetJurisdiction != 'isIcon' && !state.isZLB) getAudioJurisdiction() //获取录音权限  isGetJurisdiction icon获取声音交互不同 这个代表点击获取录音权限
      state.popupPosistion = props.showPosistion
    })
    const getAudioJurisdiction = async () => {
      JsAudioRecorder.getPermission().then(
        () => {
          //获取录音权限
          state.isHaveJurisdiction = true
        },
        (error) => {
          context.emit('end', '') //关闭遮罩层
          state.isHaveJurisdiction = false
          Toast('获取录音权限失败，请检查设备是否具备录音功能！')
          console.log(`${error.name} : ${error.message}`)
        }
      )
    }
    const fetchOssinfo = () => {
      //获取oss信息
      if (state.isZLB) {
        Request.fetchOssInfo()
          .then((res) => {
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
    const start = () => {
      JsAudioRecorderObj.start().then(
        () => {
          // 开始录音
          console.log('....开始了....')
        },
        (error) => {
          // 出错了
          Toast('录音出错了,请重试')
          context.emit('end', '') //关闭遮罩层
          console.log('....录音出错了....', error)
        }
      )
    }
    const outSymbolFn = (voiceValue) => {
      //去除语音转文字后的标点符号 便于搜索服务列表
      const str = voiceValue.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?/\，/\。/\；/\：/\“/\”/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g, '')
      return str
    }
    const end = (type) => {
      JsAudioRecorderObj.stop()
      const data = JsAudioRecorderObj.getPCMBlob()
      state.wavesurfer = null
      if (type == 'out') {
        //取消本次录音
        context.emit('end', '') //关闭遮罩层
      } else {
        if (!data.size) {
          //录音数据没值
          context.emit('end', '') //关闭遮罩层
          Toast('说话时间太短')
        } else {
          Toast.loading({
            message: '识别中...',
            forbidClick: true,
            duration: 0
          })
          const pcmBlob = JsAudioRecorderObj.getPCMBlob() // 获取录音数据
          const renamePcmFile = new File([pcmBlob], '录音文件.pcm', { type: 'audio/pcm' })
          upload(renamePcmFile)
        }
      }
    }
    const upload = (fileObj) => {
      //时间轴拼接文件路径避免重复覆盖
      let url = `${state.client.path}/${fileObj.name.split('.')[0]}-${Date.parse(new Date()) / 1000}.${fileObj.type.split('/')[1]}`
      let reader = new FileReader()
      reader.readAsDataURL(fileObj)
      reader.onloadend = () => {
        state.client
          .multipartUpload(url, fileObj)
          .then(async (data) => {
            // if(data?.res?.status==200){
            //     getVoiceVales(data?.res?.requestUrls[0])
            // }
            if (data && data.res && data.res.status == 200) {
              if (data && data.res && data.res.requestUrls && data.res.requestUrls.length) {
                getVoiceVales(data.res.requestUrls[0])
              }
            }
          })
          .catch((err) => {
            console.log('oss上传err:', err)
          })
      }
    }
    //调用接口获取声音信息
    const getVoiceVales = (file_url) => {
      Request.getVoicesValue({
        file_url
      })
        .then((res) => {
          if (res && res.code == 0) {
            if (res.data && res.data.result) {
              context.emit('getVoiceVale', outSymbolFn(res.data.result)) //把声音转换后的文本传给父组件
              context.emit('end', '') //关闭遮罩层
              Toast('识别成功')
            } else {
              context.emit('end', '') //关闭遮罩层
              Toast('您没有要发送的语言文字')
            }
          } else {
            context.emit('end', '') //关闭遮罩层
            Toast('很抱歉!未识别出结果，请重试')
          }
        })
        .catch((err) => {
          console.log(err, 'err')
        })
    }
    const sendMessage = () => {
      //发送消息给父组件 并且关闭遮罩层
      end() //停止录音
    }
    //增加监听
    watch(
      () => props.isShow,
      (nval, oval) => {
        if (nval) {
          state.voiceValue = '' //文本清空
          if (state.isHaveJurisdiction) {
            start() //开始录音
            state.show = nval //控制遮罩层展示或隐藏
          } else {
            getAudioJurisdiction() //获取录音权限
            end('out')
          }
        } else {
          state.show = nval //控制遮罩层展示或隐藏
          end('out')
        }
      }
    )

    return {
      state,
      waveFormRef,
      sendMessage,
      end
    }
  }
}
</script>
<style lang="less">
.say-box {
  display: flex;
  justify-content: center;
  position: absolute;
  overflow: inherit;
  align-items: center;
  background: linear-gradient(to bottom, #a3a3a3, #f5f5f5);
  border-radius: 100% 100% 0 0 !important;
  img {
    width: 1rem;
  }
  span {
    width: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: -0.65rem;
    left: 3rem;
    font-size: 0.3rem;
    color: rgba(238, 240, 245, 1);
  }
  .close-btn {
    width: 1.2rem;
    height: 1.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    background: rgba(0, 0, 0, 0.25);
    top: -1.3rem;
    left: 0.5rem;
    border-radius: 1rem;
    color: #eef0f5;
    font-size: 0.3rem;
    transform: rotate(-20deg);
  }
  .show-centent-box {
    width: 4rem;
    min-height: 2rem;
    flex-wrap: wrap;
    border-radius: 0.3rem;
    font-size: 0.25rem;
    top: -300%;
    background: #67b4ff;
    left: 21%;
    display: flex;
    justify-content: center;
    line-height: 0.35rem;
    align-items: center;
    padding: 0.3rem;
    position: absolute;
    white-space: pre-wrap;
    color: #fff;
    img {
      width: 2.5rem;
    }
    b {
      margin-top: -0.4rem;
    }
  }
  .show-centent-box:before {
    content: '';
    border: 0.5rem solid transparent;
    border-top-color: #67b4ff;
    position: absolute;
    left: 38%;
    bottom: -0.95rem;
    // margin-top:-20px;
  }
  .transform-script-btn {
    width: 1.2rem;
    height: 1.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    background: rgba(0, 0, 0, 0.25);
    top: -1.3rem;
    right: 0.5rem;
    border-radius: 1rem;
    color: #eef0f5;
    font-size: 0.3rem;
    transform: rotate(20deg);
  }
}
</style>
