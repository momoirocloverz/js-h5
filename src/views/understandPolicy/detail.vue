<template>
  <div class="masterCon">
    <div class="masterInner">
      <div class="title">
        <div class="homeTag marBottom20">
          <div class="tagText">{{ state.detail.title }}</div>
        </div>
      </div>
      <div class="timeCon">
        <div class="timeContent">{{ state.detail.created_at }}</div>
        <div class="page-view">
          <img src="../../assets/icon/page-view.png" alt="" />
          <span>{{ state.detail.pv }}</span>
        </div>
        <div class="voice" @click="broadcast">
          <img src="../../assets/icon/voice.png" alt="" />
          <span>语音播报</span>
        </div>
      </div>
      <div class="contentCon">
        <div v-html="state.detail.content" class="con"></div>
      </div>
    </div>
    <div class="masterInner" v-if="state.detail.policy_document_id && state.policyDocument.title">
      <div class="title">
        <div class="homeTag marBottom20">
          <div class="tagLine"></div>
          <div class="tagTextS">政策文件</div>
        </div>
        <div class="homeTag marBottom20">
          <div class="tagText">{{ state.policyDocument.title }}</div>
        </div>
      </div>
      <div class="timeCon">
        <div>发布时间：</div>
        <div class="timeContent">{{ state.policyDocument.created_at }}</div>
      </div>
      <div class="contentCon">
        <div v-html="state.policyDocument.content" class="con"></div>
      </div>
    </div>
    <!--    loading -->
    <Loading :visiable="visiable"></Loading>
    <audio v-if="state.renderAudio" controls ref="AUDIO" @canplay="audioReady" :src="state.audioSrc"></audio>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, inject, ref, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Toast } from 'vant'
import { isZLB } from '@/util/index'
import Request from '@/service/request'
import Loading from '@/components/loading'
import { genHtmlTableWraper } from '@/util/index'

export default defineComponent({
  name: 'understandPolicyDetail',
  components: { Loading },
  // emits: {
  //   showSYCM: val => {
  //     console.log("-----------------------------");
  //     console.log(val);
  //     return true;
  //   }
  // },
  setup(props, context) {
    const Router = useRouter()
    const Route = useRoute()
    const visiable = ref(true)
    const AUDIO = ref(null)
    const state = reactive({
      ZLBFLAG: isZLB(),
      detail: {},
      policyDocument: {},
      renderAudio: false,
      audioSrc: '',
      readerText: '',
      globalSpeech: null,
      isNativeAPI: false,
      splitLength: 0,
      recordArray: [],
      dynamicArray: [],
      currentCount: 1,
      playing: false
    })
    setTimeout(() => {
      context.emit('showSYCM', 'allen')
    }, 1200)
    const audioReady = () => {
      console.log('ready')
    }
    const removespeech = () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
    const speechDetect = () => {
      let originStr = state.detail.content
      var oDiv = document.createElement('div')
      oDiv.innerHTML = originStr
      var text = oDiv.innerText
      let after = text
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/gi, '')
        .replace(/\s/gi, '')
        .replace(/#/gi, '')
      state.readerText = after
      let synth = window.speechSynthesis
      state.globalSpeech = synth
      if (synth) {
        // 原生
        state.isNativeAPI = true
      } else {
        //   调用baidu
        let params = {
          tex: state.readerText,
          cuid: 'baike',
          lan: 'ZH',
          ie: 'utf-8',
          ctp: '1',
          pdt: '301',
          vol: '9',
          rate: '32',
          per: '10'
        }
        state.isNativeAPI = false
      }
      if (!state.isNativeAPI) {
        let divide = 1000
        const count = Math.ceil(state.readerText.length / divide)
        state.splitLength = count
        let empty = []
        for (let i = 0; i < count; i++) {
          empty.push('https://tts.baidu.com/text2audio?tex=' + encodeURI(state.readerText.slice(i * divide, (i + 1) * divide)) + '&cuid=baike&lan=ZH&ie=utf-8&ctp=1&pdt=301&vol=9&rate=32&per=0')
        }
        state.recordArray = empty
        state.dynamicArray = empty
        state.renderAudio = true
        setTimeout(() => {
          function playTest(i, arr) {
            state.audioSrc = arr[i]
          }
          playTest(0, empty)
        }, 100)
      }
    }
    const fetchList = () => {
      if (Route.query.id) {
        if (state.ZLBFLAG) {
          Request.getPolicyDetailMGOP({ id: Route.query.id })
            .then((res) => {
              unite1(res.data)
            })
            .finally(() => {
              visiable.value = false
            })
        } else {
          Request.getPolicyDetail({ id: Route.query.id })
            .then((res) => {
              unite1(res)
            })
            .finally(() => {
              visiable.value = false
            })
        }
      }
    }
    const unite1 = (res) => {
      if (res && res.code == 0) {
        res.data.content = genHtmlTableWraper(res.data.content)
        state.detail = res.data
        speechDetect()
        if (res.data.policy_document_id) {
          getPolicyInfo(res.data.policy_document_id)
        }
      } else {
        Toast(res.msg)
      }
    }
    // 查看关联政策文件
    const getPolicyInfo = (id) => {
      if (state.ZLBFLAG) {
        Request.getPolicyInfoMGOP({ id }).then((res) => {
          res.data.data.content = genHtmlTableWraper(res.data.data.content)
          state.policyDocument = res.data.data
        })
      } else {
        Request.getPolicyInfo({ id }).then((res) => {
          res.data.content = genHtmlTableWraper(res.data.content)
          state.policyDocument = res.data
        })
      }
    }
    onUnmounted(() => {
      removespeech()
    })
    onMounted(() => {
      removespeech()
      fetchList()
      const fitForOld = localStorage.getItem('fitForOld') || 0
      fitForOld == 1 ? (document.getElementById('app').className = 'scale2') : (document.getElementById('app').className = 'scale1')
    })
    const onSearch = () => {
      let keyWards = state.inputVal
      if (keyWards) {
        state.listData = state.listData.filter((item) => item.title.includes(keyWards))
      } else {
        fetchList()
      }
    }
    const checkDetail = (item) => {
      Router.push({
        name: item.name
      })
    }
    const broadcast = () => {
      if (state.isNativeAPI) {
        var msg = new SpeechSynthesisUtterance(state.readerText)
        msg.volume = 2 //音量
        msg.rate = 0.9 //语速
        if (state.globalSpeech.speaking) {
          if (state.playing) {
            state.globalSpeech.pause()
            state.playing = false
          } else {
            state.globalSpeech.resume()
            state.playing = true
          }
        } else {
          state.playing = true
          state.globalSpeech.speak(msg)
        }
        msg.onend = function (event) {
          console.log('SpeechSynthesisUtterance.onend')
        }
      } else {
        let tt = AUDIO.value
        let endHandler = () => {
          let current = state.dynamicArray[state.currentCount]
          state.audioSrc = current
          if (state.currentCount < state.splitLength) {
            setTimeout(() => {
              tt.play()
              state.currentCount++
            }, 200)
          } else {
            state.currentCount = 0
            state.playing = false
            let current = state.dynamicArray[0]
            state.audioSrc = current
            state.currentCount = 1
          }
        }
        tt.addEventListener('ended', endHandler, false)
        if (state.playing) {
          tt.pause()
          state.playing = false
        } else {
          tt.play()
          state.playing = true
        }
      }
    }
    return {
      state,
      onSearch,
      checkDetail,
      visiable,
      broadcast,
      audioReady,
      removespeech,
      speechDetect,
      AUDIO
    }
  }
})
</script>

<style scoped lang="less">
audio {
  width: 0;
  height: 0;
  opacity: 0;
  display: none;
}
.ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  overflow: hidden;
}

.tagLine {
  width: 0.05rem;
  height: 0.3rem;
  background: #1b82ec;
  opacity: 1;
  border-radius: 0.03rem;
  margin-right: 0.06rem;
}

.tagText {
  font-size: 0.34rem;
  line-height: 0.45rem;
  height: auto;
  color: #333;
}

.con {
  font-size: 0.28rem;
  line-height: 0.4rem;
}

.homeTag {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  box-sizing: border-box;
  font-size: 0.17rem;
  font-weight: bold;
}

.tagTextS {
  font-size: 0.3rem;
  font-weight: normal;
}

.timeCon {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  font-size: 0.28rem;
  color: #666;
  border-bottom: 0.01rem solid rgba(112, 112, 112, 0.2);
  padding-bottom: 0.3rem;
  div {
    display: flex;
    align-items: center;
    img {
      width: 0.4rem;
    }
    span {
      color: #808080;
      margin-left: 0.04rem;
    }
  }
  .page-view {
    margin-left: 0.52rem;
  }
  .voice {
    margin-left: auto;
  }
}

.contentCon {
  margin-top: 0.3rem;
  font-size: 0.28rem;
  font-weight: 500;
  line-height: 0.36rem;
  color: #333;
}

.marBottom20 {
  margin-bottom: 0.24rem;
}

.masterCon {
  box-sizing: border-box;
  background: #f5f7fa;
  min-height: 100vh;

  .masterInner {
    box-sizing: border-box;
    padding: 0.3rem;
    border-radius: 0.15rem;
    margin-bottom: 0.16rem;
    background-color: #fff;
  }

  .masterInner:last-child {
    margin-bottom: 0;
  }
}

// 富文本h5表格样式重置
:deep(.tableWrapper) {
  width: 100% !important;
  overflow-x: auto;
}
:deep(table) {
  border: 1px solid #333;
  border-collapse: collapse;
  table-layout: fixed;
  word-break: break-all;
  word-wrap: break-word;
  margin: 0;
  padding: 0;
  width: 100% !important;
  td,
  th {
    border: 1px solid #333;
    border-collapse: collapse;
  }
  td {
    width: 100px !important;

    span {
      // display: inline-block;
      font-size: 0.28rem;
      font-family: 'PingFang SC Medium, PingFang SC Medium-Medium' !important;
      white-space: pre-line;
      word-wrap: break-word;
      word-break: break-all;
    }

    .MsoNormal {
      text-indent: 0 !important;
    }
  }
}

:deep(.contentCon) {
  p {
    img[src*='http'] {
      max-width: 100%;
      height: auto;
    }
  }
}
</style>
