<template>
  <div class="summarize">
    <p class="title">项目实施工作总结</p>
    <div class="input_box">
      <div class="item" v-for="(item, index) in list" :key="index">
        <div>
          <p>{{ item.name }}</p>
          <van-field :readonly="isYs" v-model="item.value" rows="4" autosize type="textarea" :maxlength="item.maxLength" :placeholder="item.placeholder" show-word-limit />
        </div>
      </div>
      <div class="item">
        <div>
          <p>7.相关附件</p>
          <AcUploaderCopy :fileList="state.fileList" :readonly="isYs" @afterRead="cgpjAfterRead" @deleteCb="deleteAction" @choiceImg="choiceImg"></AcUploaderCopy>
        </div>
      </div>
    </div>
    <div class="btns fixPaddingBottom" v-if="!isYs">
      <p @click="submitForm('save')">保存</p>
      <p @click="submitForm('submit')">完成</p>
    </div>
    <!-- accept=".doc,.docx,.jpg,.jpeg,.png,.pdf"  -->
    <input ref="inputTarget" id="takepicture" type="file" style="display: none" @change="upload" />
  </div>
</template>

<script>
import AcUploaderCopy from '@/components/AcUploaderCopy'
import { defineComponent, reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Toast } from 'vant'
import lrz from 'lrz'
import OSS from 'ali-oss'
import { isZLB } from '@/util/index'
import { OSSLINK } from '@/util/const'
import Request from '@/service/request'
export default defineComponent({
  components: { AcUploaderCopy },
  setup() {
    let inputTarget = ref(null)
    const Router = useRouter()
    const Route = useRoute()
    const isYs = ref(false)
    const formData = reactive({
      save_type: '',
      project_id: '',
      foreword: '',
      build_plan_content: '',
      expected_goal_content: '',
      build_plan_complete_content: '',
      build_achievement_content: '',
      problem_intend_content: ''
    })
    const state = reactive({
      client: {},
      fileList: [],
      ZLBFLAG: isZLB(),
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false
    })
    const list = ref([
      {
        name: '1.前言',
        value: '',
        maxLength: 1000,
        key: 'foreword',
        placeholder: '建设主体基本情况、项目来源、项目建设期限、项目建设地点等'
      },
      {
        name: '2. 项目建设计划',
        value: '',
        maxLength: 1000,
        key: 'build_plan_content',
        placeholder: '包括建设内容、投资计划'
      },
      {
        name: '3. 项目预期目标',
        value: '',
        maxLength: 1000,
        key: 'expected_goal_content',
        placeholder: '项目预期目标'
      },
      {
        name: '4. 项目建设计划完成情况',
        value: '',
        maxLength: 1000,
        key: 'build_plan_complete_content',
        placeholder: '填写实际数据，与验收申请表数据一致'
      },
      {
        name: '5. 项目建设取得的成效',
        value: '',
        maxLength: 1000,
        key: 'build_achievement_content',
        placeholder: '项目建设取得的成效'
      },
      {
        name: '6. 项目存在的问题及以下打算',
        value: '',
        maxLength: 1000,
        key: 'problem_intend_content',
        placeholder: '项目存在的问题及以下打算'
      }
    ])
    const submitForm = (type) => {
      formData.save_type = type
      list.value.map((item) => {
        Object.keys(formData).forEach((key) => {
          if (item.key === key) formData[key] = item.value
        })
      })
      onSubmit()
    }
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
    const onSubmit = async () => {
      try {
        let data = {
          ...formData,
          attachment: JSON.stringify(
            state.fileList.map((ele) => {
              return {
                name: ele.name,
                url: ele.url
              }
            })
          )
        }
        const result = await Request.editProjectYsSummarize(data)
        if (result.code === 0) {
          Toast('保存成功')
          setTimeout(() => {
            Router.back()
          }, 1000)
        } else {
          Toast(result.msg)
        }
      } catch (err) {
        Toast('服务器错误，请稍后重试。')
      }
    }
    const getDetail = async (id) => {
      const result = await Request.getProjectYsSummarize({ project_id: id })
      if (result.code === 0) {
        list.value.map((item) => {
          Object.keys(result.data.info).forEach((key) => {
            if (item.key === key) item.value = result.data.info[key]
          })
        })
        if (result.data.info && result.data.info.attachment) {
          let bridge = JSON.parse(result.data.info.attachment)
          bridge.forEach((ele) => {
            ele.suffix = ele.name.split('.')[ele.name.split('.').length - 1]
          })
          state.fileList = bridge
        }
      }
    }
    onMounted(() => {
      fetchOssinfo()
      if (Route.query.projectId) getDetail(+Route.query.projectId)
      formData.project_id = +Route.query.projectId
      isYs.value = Route.query.isYs === 'true'
    })
    const cgpjAfterRead = () => {
      //
    }
    const getData = () => {
      //
    }
    const choiceImg = () => {
      inputTarget.value.click()
    }
    const deleteAction = (value) => {
      state.fileList.splice(value, 1)
    }
    const upload = (e) => {
      let fileObj = e.target.files[0]
      const fileSizelimit = 50 * 1024 * 1024
      if (fileObj.size > fileSizelimit) {
        return Toast('文件大小不能超过50MB')
      }
      let isImage = fileObj.type === 'image/jpeg' || fileObj.type === 'image/png' || fileObj.type === 'image/jpg'

      let isValid =
        fileObj.type === 'image/jpeg' ||
        fileObj.type === 'image/png' ||
        fileObj.type === 'image/jpg' ||
        fileObj.type === 'application/pdf' ||
        fileObj.type === 'application/msword' ||
        fileObj.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

      if (isValid) {
        if (isImage) {
          lrz(fileObj, { width: 600 })
            .then(async (result) => {
              let url = `${state.client.path}/${fileObj.name.split('.')[0]}-${Date.parse(new Date()) / 1000}.${fileObj.name.split('.')[fileObj.name.split('.').length - 1]}`
              let reader = new FileReader()
              reader.readAsDataURL(fileObj)
              reader.onloadend = () => {
                state.client.multipartUpload(url, fileObj).then(async (data) => {
                  state.fileList.push({
                    url: OSSLINK + data.name,
                    name: fileObj.name,
                    suffix: fileObj.name.split('.')[fileObj.name.split('.').length - 1]
                  })
                  e.target.value = ''
                })
              }
            })
            .catch((err) => {
              console.log('err', err)
            })
        } else {
          let url = `${state.client.path}/${fileObj.name.split('.')[0]}-${Date.parse(new Date()) / 1000}.${fileObj.name.split('.')[fileObj.name.split('.').length - 1]}`
          state.client.multipartUpload(url, fileObj).then(async (data) => {
            state.fileList.push({
              url: OSSLINK + data.name,
              name: fileObj.name,
              suffix: fileObj.name.split('.')[fileObj.name.split('.').length - 1]
            })
            e.target.value = ''
          })
        }
      } else {
        Toast('支持上传文件格式：jpg、jpeg、png、doc、docx、pdf')
      }
    }
    return {
      deleteAction,
      upload,
      inputTarget,
      choiceImg,
      cgpjAfterRead,
      getData,
      submitForm,
      list,
      isYs,
      state
    }
  }
})
</script>

<style scoped lang="less">
.summarize {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .title {
    font-size: 0.3rem;
    padding: 0.3rem;
    font-weight: 600;
  }
  .input_box {
    flex: 1;
    box-sizing: border-box;
    overflow: scroll;
    padding: 0.3rem;
    .item {
      padding: 0.2rem;
      border-radius: 0.16rem;
      background: #fff;
      margin-bottom: 0.3rem;
      overflow: hidden;
      p {
        margin: 0 0 0.2rem;
        font-size: 0.28rem;
      }
      :deep(.van-cell) {
        background: #f9f9f9;
        border: 0.02rem solid #ccc;
        font-size: 0.26rem;
        .van-field__control {
          max-height: 100px;
          overflow: scroll;
        }
      }
    }
  }
  .btns {
    display: flex;
    height: 0.88rem;
    line-height: 0.88rem;
    p {
      flex: 1;
      text-align: center;
      font-size: 0.28rem;
      box-sizing: border-box;
      border-top: 0.02rem solid #1b82ec;
      border-bottom: 0.02rem solid #1b82ec;
      &:nth-of-type(1) {
        color: #1b82ec;
      }
      &:nth-of-type(2) {
        background: #1b82ec;
        color: #fff;
      }
    }
  }
}
</style>
