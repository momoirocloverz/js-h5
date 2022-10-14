<template>
  <div class="sketch">
    <div class="title">竣工验收示意图</div>
    <div class="input_box">
      <div class="item_box" v-for="(item, index) in formData" :key="index">
        <div class="red" v-if="index && !isYs" @click="deleteCurrent(index)">删除此表单</div>
        <div class="input_item" v-for="(input, idx) in item" :key="idx">
          <p class="name">{{ input.name }}</p>
          <div class="tips" v-if="input.type === 2 || input.type === 4">{{ input.placeholder }}</div>
          <van-field :readonly="!isYs" v-if="input.type === 1" v-model="input.value" :disabled="input.disabled" :placeholder="input.placeholder" />
          <van-field v-if="input.type === 3" v-model="input.value" readonly :disabled="input.disabled" :placeholder="input.placeholder" @click="chooseDate(index, input.value)" />
          <!-- <upload v-if="input.type === 2" v-model:image-list="input.value" :limit="9" :deletable="!isYs" :show-upload="!isYs" /> -->
          <AcUploaderCopy4
            v-if="input.type == 2"
            :fileList="input.value"
            :readonly="isYs"
            @afterRead="cgpjAfterRead"
            @deleteCb="(e) => deleteAction(e, '1')"
            @choiceImg="choiceImg(index, '1')"
            :outerIndex="index"
          ></AcUploaderCopy4>
          <AcUploaderCopy2
            v-if="input.type == 4"
            :fileList="input.value"
            :readonly="isYs"
            @afterRead="cgpjAfterRead"
            @deleteCb="(e) => deleteAction(e, '2')"
            @choiceImg="choiceImg(index, '2')"
            :outerIndex="index"
          ></AcUploaderCopy2>
        </div>
      </div>
      <div class="add" @click="pushForm">
        <van-icon name="add" />
        新增竣工验收示意图表单
      </div>
    </div>
    <div class="btns fixPaddingBottom" v-if="!isYs">
      <p @click="submitForm('save')">保存</p>
      <p @click="submitForm('submit')">完成</p>
    </div>
  </div>
  <van-popup v-model:show="state.visible" round position="bottom">
    <van-datetime-picker v-model="state.date" type="date" title="选择年月日" :min-date="state.minDate" @confirm="onConfirm" />
  </van-popup>
  <!-- accept=".doc,.docx,.jpg,.jpeg,.png,.pdf" -->
  <input ref="inputTarget" id="takepicture" type="file" style="display: none" @change="upload" />
</template>

<script>
import AcUploaderCopy4 from '@/components/AcUploaderCopy4'
import AcUploaderCopy2 from '@/components/AcUploaderCopy2'
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { Toast } from 'vant'
import lrz from 'lrz'
import OSS from 'ali-oss'
import { OSSLINK } from '@/util/const'
import { isZLB } from '@/util/index'
import Request from '@/service/request'
import { useRouter, useRoute } from 'vue-router'
import lodash from 'lodash'
import upload from './modules/upload'
import dayjs from 'dayjs'
export default defineComponent({
  components: {
    upload,
    AcUploaderCopy2,
    AcUploaderCopy4
  },
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const isYs = ref(false)
    let inputTarget = ref(null)
    const formData = ref([])
    const formItem = ref([
      { type: 1, name: '1. 实施单位', value: '', key: 'declare_unit', placeholder: '实施单位' },
      { type: 1, name: '2. 实施地址', value: '', disabled: true, placeholder: '实施地址' },
      { type: 1, name: '3. 地址详情', value: '', key: 'area_detail', placeholder: '地址详情' },
      { type: 3, name: '4. 验收时间', value: '', key: 'check_complete_at', placeholder: '请选择日期' },
      { type: 2, name: '5. 示意图', value: [], key: 'pic_list', placeholder: '支持上传文件格式：jpg、jpeg、png、doc、docx、pdf（单个文件大小在10M以内）' },
      //   { type: 2, name: '6. 设备清单', value: [], key: 'facility_list', placeholder: '支持上传文件格式：jpg、jpeg、png（单个文件大小在10M以内）' },
      { type: 4, name: '6. 设备清单', value: [], key: 'facility_list', placeholder: '支持上传文件格式：jpg、jpeg、png、doc、docx、pdf（单个文件大小在10M以内）' }
    ])
    const state = reactive({
      client: {},
      addIndex: 0,
      visible: false,
      index: 0,
      date: new Date(new Date().getTime() + 86400000),
      minDate: new Date(),
      dateVal: '',
      fileList: [],
      ZLBFLAG: isZLB(),
      source: '1'
    })
    const submitForm = (type) => {
      let form = {
        save_type: type,
        project_id: +Route.query.projectId,
        content_list: []
      }
      formData.value.map((item) => {
        let obj = {}
        item.map((list) => {
          obj[list.key] = list.value
        })
        obj.pic_list = obj.pic_list.map((item) => {
          return item.url
        })
        obj.facility_list = obj.facility_list.map((item) => {
          return item.url
        })
        delete obj[undefined]
        form.content_list.push(obj)
      })
      onSubmit(form)
    }
    const onSubmit = async (form) => {
      try {
        const result = await Request.editProjectYsSketch(form)
        if (result.code === 0) {
          Toast('保存成功')
          setTimeout(() => {
            Router.back()
          }, 1500)
        } else {
          Toast(result.msg)
        }
      } catch (err) {
        Toast('服务器错误，请稍后重试。')
      }
    }
    const chooseDate = (index, value) => {
      if (isYs.value) return
      state.index = index
      state.visible = true
      if (value) {
        let u = navigator.userAgent
        let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
        if (isIOS) value = value.replaceAll(/-/g, '/')
        state.date = new Date(value)
      } else {
        state.date = new Date(new Date().getTime() + 86400000)
      }
    }
    const onConfirm = (date) => {
      formData.value[state.index][3].value = dayjs(date).format('YYYY-MM-DD')
      state.visible = false
    }
    const pushForm = () => {
      formData.value.push(lodash.cloneDeep(formItem.value))
    }
    const deleteCurrent = (index) => {
      formData.value.splice(index, 1)
    }
    const getDetail = async (id) => {
      const result = await Request.getProjectYsSketch({ project_id: id })
      if (result.code === 0) {
        if (result.data && result.data.info && result.data.info.content_list && result.data.info.content_list.length) {
          formData.value = []
          result.data.info.content_list.map((item) => {
            let items = lodash.cloneDeep(formItem.value)
            items.map((list) => {
              Object.keys(item).forEach((key) => {
                if (list.key === key) {
                  list.value = item[key]
                }
              })
              if (list.type === 2) {
                /*     if (typeof list.value === 'string') {
                  list.value = list.value.split(',')
                  // list.value = { url: list.value, isImage: true }
                  list.value = list.value.map((img) => {
                    return { url: img, isImage: true }
                  })
                } else {
                  list.value = list.value.map((img) => {
                    return { url: img, isImage: true }
                  })
                } */
                 if (typeof list.value === 'string') {
                  list.value = list.value.split(',')
                  list.value = list.value.map((img) => {
                    console.log('img.split', img.split('.')[img.split('.').length - 1])
                    let shorter = img.split('.')[img.split('.').length - 2].split('/')
                    return { url: img, isImage: true, suffix: img.split('.')[img.split('.').length - 1], name: shorter[shorter.length - 1] }
                  })
                } else {
                  list.value = list.value.map((img) => {
                    let shorter = img.split('.')[img.split('.').length - 2].split('/')
                    return { url: img, isImage: true, suffix: img.split('.')[img.split('.').length - 1], name: shorter[shorter.length - 1] }
                  })
                }
              }
              if (list.type == 4) {
                if (typeof list.value === 'string') {
                  list.value = list.value.split(',')
                  list.value = list.value.map((img) => {
                    console.log('img.split', img.split('.')[img.split('.').length - 1])
                    let shorter = img.split('.')[img.split('.').length - 2].split('/')
                    return { url: img, isImage: true, suffix: img.split('.')[img.split('.').length - 1], name: shorter[shorter.length - 1] }
                  })
                } else {
                  list.value = list.value.map((img) => {
                    let shorter = img.split('.')[img.split('.').length - 2].split('/')
                    return { url: img, isImage: true, suffix: img.split('.')[img.split('.').length - 1], name: shorter[shorter.length - 1] }
                  })
                }
              }
            })
            formData.value.push(items)
          })
        }
      }
      //   if (result?.code === 0 && result?.data?.info && result.data.info?.content_list?.length) {
      //   }
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
      formItem.value[0].value = decodeURIComponent(Route.query.declareUnit)
      formItem.value[1].value = decodeURIComponent(Route.query.city)
      formItem.value[2].value = decodeURIComponent(Route.query.address)
      isYs.value = Route.query.isYs === 'true'
      pushForm()
      fetchOssinfo()
      getDetail(+Route.query.projectId)
    })
    const cgpjAfterRead = () => {
      //
    }
    const getData = () => {
      //
    }
    const choiceImg = (index, source) => {
      state.addIndex = index
      state.source = source
      console.log('choiceImg', index)
      inputTarget.value.click()
    }
    const deleteAction = (value, source) => {
      //   state.fileList.splice(value, 1)
      //   console.log(value)
      //   console.log('formData.value', formData.value)
      //   console.log(formData.value[value.outerIndex])
      let trackInner = null
      if (source == '1') {
        trackInner = formData.value[value.outerIndex].find((ele) => {
          return ele.key == 'pic_list'
        })
        if (trackInner) {
          trackInner.value.splice(value.trackIndex, 1)
        }
      } else if (source == '2') {
        trackInner = formData.value[value.outerIndex].find((ele) => {
          return ele.key == 'facility_list'
        })
        if (trackInner) {
          trackInner.value.splice(value.trackIndex, 1)
        }
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
                  //   let trackInner = formData.value[state.addIndex].find((ele) => {
                  //     return ele.key == 'facility_list'
                  //   })
                  //   if (trackInner) {
                  //     trackInner.value.push({
                  //       url: OSSLINK + data.name,
                  //       name: fileObj.name,
                  //       suffix: fileObj.name.split('.')[fileObj.name.split('.').length - 1]
                  //     })
                  //   }
                  let trackInner = null
                  if (state.source == '1') {
                    let trackInner = formData.value[state.addIndex].find((ele) => {
                      return ele.key == 'pic_list'
                    })
                    if (trackInner) {
                      trackInner.value.push({
                        url: OSSLINK + data.name,
                        name: fileObj.name,
                        suffix: fileObj.name.split('.')[fileObj.name.split('.').length - 1]
                      })
                    }
                  } else if (state.source == '2') {
                    trackInner = formData.value[state.addIndex].find((ele) => {
                      return ele.key == 'facility_list'
                    })
                    if (trackInner) {
                      trackInner.value.push({
                        url: OSSLINK + data.name,
                        name: fileObj.name,
                        suffix: fileObj.name.split('.')[fileObj.name.split('.').length - 1]
                      })
                    }
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
            //   state.fileList.push({
            //     url: OSSLINK + data.name,
            //     name: fileObj.name,
            //     suffix: fileObj.name.split('.')[fileObj.name.split('.').length - 1]
            //   })
            let trackInner = null
            if (state.source == '1') {
              let trackInner = formData.value[state.addIndex].find((ele) => {
                return ele.key == 'pic_list'
              })
              if (trackInner) {
                trackInner.value.push({
                  url: OSSLINK + data.name,
                  name: fileObj.name,
                  suffix: fileObj.name.split('.')[fileObj.name.split('.').length - 1]
                })
              }
            } else if (state.source == '2') {
              trackInner = formData.value[state.addIndex].find((ele) => {
                return ele.key == 'facility_list'
              })
              if (trackInner) {
                trackInner.value.push({
                  url: OSSLINK + data.name,
                  name: fileObj.name,
                  suffix: fileObj.name.split('.')[fileObj.name.split('.').length - 1]
                })
              }
            }
            console.log(formData.value)
            e.target.value = ''
          })
        }
      } else {
        Toast('支持上传文件格式：jpg、jpeg、png、doc、docx、pdf')
      }
    }
    return {
      inputTarget,
      submitForm,
      formData,
      pushForm,
      state,
      chooseDate,
      onConfirm,
      isYs,
      cgpjAfterRead,
      getData,
      choiceImg,
      deleteAction,
      upload,
      deleteCurrent
    }
  }
})
</script>

<style scoped lang="less">
.red {
  color: rgba(245, 24, 24, 0.8);
  cursor: pointer;
  font-size: 0.18rem;
  margin-bottom: 0.2rem;
}
.sketch {
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
    .add {
      display: flex;
      color: #1b82ec;
      font-size: 0.24rem;
      padding: 0.2rem 0;
      i {
        margin-right: 0.1rem;
      }
    }
    .item_box {
      background: #fff;
      padding: 0.2rem;
      border-radius: 0.16rem;
      margin: 0.3rem 0 0.1rem;
      &:nth-of-type(1) {
        margin-top: 0;
      }
    }
    .input_item {
      margin: 0.3rem 0;
      .name {
        margin: 0 0 0.3rem;
        font-size: 0.28rem;
      }
      .tips {
        color: #999;
        line-height: 0.3rem;
        margin-bottom: 0.2rem;
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
