<template>
  <div class="compare_chart">
    <div class="title">实施前后对照图片</div>
    <div class="input_box">
      <div class="item_box">
        <div class="input" v-for="(input, index) in formData.item1" :key="index">
          <div class="delete" @click="deleteForm(1, index)">删除</div>
          <p class="setWidth">1. 建设前图片上传(如需上传多张，请下方新增表单)</p>
          <p>支持上传文件格式：jpg、jpeg、png、doc、docx、pdf，且大小在10M以内。</p>
          <!-- <upload v-model:imageList="input.before_pic" :deletable="!isYs" /> -->
          <AcUploaderCopy5
            :fileList="input.before_pic"
            :readonly="isYs"
            @choiceImg="choiceImg(index, '1')"
            @deleteCb="(e) => deleteAction(e, '1')"
            @afterRead="cgpjAfterRead"
            :outerIndex="index"
          ></AcUploaderCopy5>
          <p class="nextUpload">备注：</p>
          <van-field :readonly="isYs" v-model="input.before_desc" rows="4" autosize type="textarea" placeholder="请输入备注" />
          <p>2. 建设后图片上传(如需上传多张，请下方新增表单)</p>
          <p>支持上传文件格式：jpg、jpeg、png、doc、docx、pdf，且大小在10M以内。</p>
          <AcUploaderCopy5
            :fileList="input.after_pic"
            :readonly="isYs"
            @choiceImg="choiceImg(index, '2')"
            @deleteCb="(e) => deleteAction(e, '2')"
            @afterRead="cgpjAfterRead"
            :outerIndex="index"
          ></AcUploaderCopy5>
          <!-- <upload v-model:imageList="input.after_pic" :deletable="!isYs" /> -->
          <p class="nextUpload">备注：</p>
          <van-field :readonly="isYs" v-model="input.after_desc" rows="4" autosize type="textarea" placeholder="请输入备注" />
        </div>
        <div class="add" @click="pushForm(1)">
          <van-icon name="add" />
          新增建设前后图片上传表单
        </div>
      </div>

      <div class="item_box">
        <div class="input" v-for="(input, index) in formData.item2" :key="index">
          <div class="delete" @click="deleteForm(2, index)">删除</div>
          <p class="setWidth">1. 设备图片上传(如需上传多张，请下方新增表单)</p>
          <p>支持上传文件格式：jpg、jpeg、png、doc、docx、pdf，且大小在10M以内。</p>
          <AcUploaderCopy5
            :fileList="input.gz_pic"
            :readonly="isYs"
            @choiceImg="choiceImg(index, '3')"
            @deleteCb="(e) => deleteAction(e, '3')"
            @afterRead="cgpjAfterRead"
            :outerIndex="index"
          ></AcUploaderCopy5>
          <!-- <upload v-model:imageList="input.gz_pic" :deletable="!isYs" /> -->
          <p class="nextUpload">备注：</p>
          <van-field :readonly="isYs" v-model="input.gz_desc" rows="4" autosize type="textarea" placeholder="请输入备注" />
          <p>2. 设备名牌上传(如需上传多张，请下方新增表单)</p>
          <p>支持上传文件格式：jpg、jpeg、png、doc、docx、pdf，且大小在10M以内。</p>
          <!-- <upload v-model:imageList="input.nameplate_pic" :deletable="!isYs" /> -->
          <AcUploaderCopy5
            :fileList="input.nameplate_pic"
            :readonly="isYs"
            @choiceImg="choiceImg(index, '4')"
            @deleteCb="(e) => deleteAction(e, '4')"
            @afterRead="cgpjAfterRead"
            :outerIndex="index"
          ></AcUploaderCopy5>
          <p class="nextUpload">备注：</p>
          <van-field v-model="input.nameplate_desc" rows="4" autosize type="textarea" placeholder="请输入备注" />
        </div>
        <div class="add" @click="pushForm(2)">
          <van-icon name="add" />
          新增购置设备图片上传表单
        </div>
      </div>
    </div>
    <div class="btns fixPaddingBottom" v-if="!isYs">
      <p @click="submitForm('save')">保存</p>
      <p @click="submitForm('submit')">完成</p>
    </div>
    <input ref="inputTarget" id="takepicture" type="file" style="display: none" @change="upload" />
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { Toast } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import lodash from 'lodash'
import OSS from 'ali-oss'
import lrz from 'lrz'
import { OSSLINK } from '@/util/const'
import Request from '@/service/request'
import upload from './modules/upload'
import AcUploaderCopy5 from '@/components/AcUploaderCopy5'
export default defineComponent({
  components: {
    upload,
    AcUploaderCopy5
  },
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const isYs = ref(false)
    let inputTarget = ref(null)
    const formData = reactive({
      item1: [],
      item2: []
    })
    const state = reactive({
      client: {},
      addIndex: 0,
      visible: false,
      source: '1',
      fileList: []
    })
    const formItem1 = ref({
      before_pic: [],
      before_desc: '',
      after_pic: [],
      after_desc: ''
    })
    const formItem2 = ref({
      gz_pic: [],
      gz_desc: '',
      nameplate_pic: [],
      nameplate_desc: ''
    })
    const submitForm = (type) => {
      let form = {
        save_type: type,
        project_id: +Route.query.projectId,
        ss_content_list: [],
        gz_content_list: []
      }
      form.ss_content_list = lodash.cloneDeep(formData.item1)
      form.gz_content_list = lodash.cloneDeep(formData.item2)
      form.ss_content_list.map((item) => {
        item.before_pic = item.before_pic.length ? item.before_pic[0].url : ''
        item.after_pic = item.after_pic.length ? item.after_pic[0].url : ''
      })
      form.gz_content_list.map((item) => {
        item.gz_pic = item.gz_pic.length ? item.gz_pic[0].url : ''
        item.nameplate_pic = item.nameplate_pic.length ? item.nameplate_pic[0].url : ''
      })
      onSubmit(form)
    }
    const onSubmit = async (form) => {
      try {
        const result = await Request.editProjectYsComparePic(form)
        if (result.code === 0) {
          Toast('保存成功')
          setTimeout(() => {
            Router.back()
          }, 1500)
        } else {
          Toast(result.msg)
        }
      } catch (err) {
        Toast('服务器错误，请稍后再试。')
      }
    }
    const pushForm = (type) => {
      if (type === 1) {
        formData.item1.push(lodash.cloneDeep(formItem1.value))
      } else {
        formData.item2.push(lodash.cloneDeep(formItem2.value))
      }
    }
    const deleteForm = (type, index) => {
      if (type === 1) {
        formData.item1.splice(index, 1)
      } else {
        formData.item2.splice(index, 1)
      }
    }
    const getDetail = async () => {
      const result = await Request.getProjectYsComparePic({ project_id: +Route.query.projectId })
      if (result.code === 0) {
        result.data.info &&
          result.data.info.ss_content_list &&
          result.data.info.ss_content_list.map((item) => {
            if (item && item.before_pic) {
              if (typeof item.before_pic === 'string') {
                item.before_pic = item.before_pic.split(',')
                item.before_pic = item.before_pic.map((img) => {
                  let shorter = img.split('.')[img.split('.').length - 2].split('/')
                  return { url: img, isImage: true, suffix: img.split('.')[img.split('.').length - 1], name: shorter[shorter.length - 1] }
                })
              } else {
                item.before_pic = item.before_pic.map((img) => {
                  let shorter = img.split('.')[img.split('.').length - 2].split('/')
                  return { url: img, isImage: true, suffix: img.split('.')[img.split('.').length - 1], name: shorter[shorter.length - 1] }
                })
              }
            }
            if (item && item.after_pic) {
              if (typeof item.after_pic === 'string') {
                item.after_pic = item.after_pic.split(',')
                item.after_pic = item.after_pic.map((img) => {
                  let shorter = img.split('.')[img.split('.').length - 2].split('/')
                  return { url: img, isImage: true, suffix: img.split('.')[img.split('.').length - 1], name: shorter[shorter.length - 1] }
                })
              } else {
                item.after_pic = item.after_pic.map((img) => {
                  let shorter = img.split('.')[img.split('.').length - 2].split('/')
                  return { url: img, isImage: true, suffix: img.split('.')[img.split('.').length - 1], name: shorter[shorter.length - 1] }
                })
              }
            }
            // item.before_pic = [{ url: item.before_pic, isImage: true }]
            // item.after_pic = [{ url: item.after_pic, isImage: true }]
          })
        result.data.info &&
          result.data.info.gz_content_list &&
          result.data.info.gz_content_list.map((item) => {
            // item.gz_pic = [{ url: item.gz_pic, isImage: true }]
            // item.nameplate_pic = [{ url: item.nameplate_pic, isImage: true }]
            if (item && item.gz_pic) {
              if (typeof item.gz_pic === 'string') {
                item.gz_pic = item.gz_pic.split(',')
                item.gz_pic = item.gz_pic.map((img) => {
                  let shorter = img.split('.')[img.split('.').length - 2].split('/')
                  return { url: img, isImage: true, suffix: img.split('.')[img.split('.').length - 1], name: shorter[shorter.length - 1] }
                })
              } else {
                item.gz_pic = item.gz_pic.map((img) => {
                  let shorter = img.split('.')[img.split('.').length - 2].split('/')
                  return { url: img, isImage: true, suffix: img.split('.')[img.split('.').length - 1], name: shorter[shorter.length - 1] }
                })
              }
            }
            if (item && item.nameplate_pic) {
              if (typeof item.nameplate_pic === 'string') {
                item.nameplate_pic = item.nameplate_pic.split(',')
                item.nameplate_pic = item.nameplate_pic.map((img) => {
                  let shorter = img.split('.')[img.split('.').length - 2].split('/')
                  return { url: img, isImage: true, suffix: img.split('.')[img.split('.').length - 1], name: shorter[shorter.length - 1] }
                })
              } else {
                item.nameplate_pic = item.nameplate_pic.map((img) => {
                  let shorter = img.split('.')[img.split('.').length - 2].split('/')
                  return { url: img, isImage: true, suffix: img.split('.')[img.split('.').length - 1], name: shorter[shorter.length - 1] }
                })
              }
            }
          })
        formData.item1 = result.data.info.ss_content_list ? result.data.info.ss_content_list : []
        formData.item2 = result.data.info.gz_content_list ? result.data.info.gz_content_list : []
      }
    }
    const upload = (e) => {
      let fileObj = e.target.files[0]
      const fileSizelimit = 10 * 1024 * 1024
      if (fileObj.size > fileSizelimit) {
        return Toast('文件大小不能超过10MB')
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
                  if (state.source == '1') {
                    formData.item1[state.addIndex].before_pic = [
                      {
                        url: OSSLINK + data.name,
                        name: fileObj.name,
                        suffix: fileObj.name.split('.')[fileObj.name.split('.').length - 1]
                      }
                    ]
                  } else if (state.source == '2') {
                    formData.item1[state.addIndex].after_pic = [
                      {
                        url: OSSLINK + data.name,
                        name: fileObj.name,
                        suffix: fileObj.name.split('.')[fileObj.name.split('.').length - 1]
                      }
                    ]
                  } else if (state.source == '3') {
                    formData.item2[state.addIndex].gz_pic = [
                      {
                        url: OSSLINK + data.name,
                        name: fileObj.name,
                        suffix: fileObj.name.split('.')[fileObj.name.split('.').length - 1]
                      }
                    ]
                  } else if (state.source == '4') {
                    formData.item2[state.addIndex].nameplate_pic = [
                      {
                        url: OSSLINK + data.name,
                        name: fileObj.name,
                        suffix: fileObj.name.split('.')[fileObj.name.split('.').length - 1]
                      }
                    ]
                  }
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
            if (state.source == '1') {
              formData.item1[state.addIndex].before_pic = [
                {
                  url: OSSLINK + data.name,
                  name: fileObj.name,
                  suffix: fileObj.name.split('.')[fileObj.name.split('.').length - 1]
                }
              ]
            } else if (state.source == '2') {
              formData.item1[state.addIndex].after_pic = [
                {
                  url: OSSLINK + data.name,
                  name: fileObj.name,
                  suffix: fileObj.name.split('.')[fileObj.name.split('.').length - 1]
                }
              ]
            } else if (state.source == '3') {
              formData.item2[state.addIndex].gz_pic = [
                {
                  url: OSSLINK + data.name,
                  name: fileObj.name,
                  suffix: fileObj.name.split('.')[fileObj.name.split('.').length - 1]
                }
              ]
            } else if (state.source == '4') {
              formData.item2[state.addIndex].nameplate_pic = [
                {
                  url: OSSLINK + data.name,
                  name: fileObj.name,
                  suffix: fileObj.name.split('.')[fileObj.name.split('.').length - 1]
                }
              ]
            }
            e.target.value = ''
          })
        }
      } else {
        Toast('支持上传文件格式：jpg、jpeg、png、doc、docx、pdf')
      }
    }
    const cgpjAfterRead = () => {
      //
    }
    const deleteAction = (value, source) => {
      if (source == '1') {
        formData.item1[value.outerIndex].before_pic = ''
      } else if (source == '2') {
        formData.item1[value.outerIndex].after_pic = ''
      } else if (source == '3') {
        formData.item2[value.outerIndex].gz_pic = ''
      } else if (source == '4') {
        formData.item2[value.outerIndex].nameplate_pic = ''
      }
    }
    const choiceImg = (index, source) => {
      state.addIndex = index
      state.source = source
      inputTarget.value.click()
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
    onMounted(() => {
      isYs.value = Route.query.isYs === 'true'
      getDetail()
      fetchOssinfo()
    })
    return {
      submitForm,
      formData,
      pushForm,
      deleteForm,
      isYs,
      inputTarget,
      state,
      choiceImg,
      deleteAction,
      cgpjAfterRead,
      upload
    }
  }
})
</script>

<style scoped lang="less">
.compare_chart {
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
    .item_box {
      margin-bottom: 0.2rem;
      .add {
        display: flex;
        color: #1b82ec;
        font-size: 0.24rem;
        padding: 0.2rem 0;
        i {
          margin-right: 0.1rem;
        }
      }
      .input {
        position: relative;
        background: #fff;
        border-radius: 0.16rem;
        padding: 0.2rem;
        margin-bottom: 0.2rem;
        .delete {
          position: absolute;
          right: 0.2rem;
          top: 0.2rem;
          background: #1b82ec;
          font-size: 0.28rem;
          color: #fff;
          width: 1.4rem;
          height: 0.5rem;
          line-height: 0.5rem;
          text-align: center;
          border-radius: 0.25rem;
        }
        p {
          &:nth-of-type(1),
          &:nth-of-type(3),
          &:nth-of-type(4),
          &:nth-of-type(6) {
            margin: 0 0 0.3rem;
            font-size: 0.28rem;
          }
          &:nth-of-type(2),
          &:nth-of-type(5) {
            color: #999;
            line-height: 0.3rem;
            margin-bottom: 0.2rem;
          }
        }
        .nextUpload {
          margin-top: 0.3rem !important;
        }
        .setWidth {
          width: 5rem;
        }
        :deep(.van-cell) {
          background: #f9f9f9;
          border: 0.02rem solid #ccc;
          font-size: 0.26rem;
          margin-bottom: 0.2rem;
          .van-field__control {
            max-height: 100px;
            overflow: scroll;
          }
        }
      }
    }
  }
  .btns {
    display: flex;
    height: 0.88rem;
    line-height: 0.88rem;
    background-color: #fff;
    p {
      text-align: center;
      font-size: 0.28rem;
      box-sizing: border-box;
      border-top: 0.02rem solid #1b82ec;
      border-bottom: 0.02rem solid #1b82ec;
      &:nth-of-type(1) {
        width: 33.3%;
        color: #1b82ec;
        border: 0.02rem solid #1b82ec;
      }
      &:nth-of-type(2) {
        flex: 1;
        background: #1b82ec;
        color: #fff;
      }
    }
  }
}
</style>
