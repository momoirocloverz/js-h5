<template>
  <div class="adviceCon">
    <van-form @failed="onFailed" @submit="onSubmit">
      <van-field
        v-model="state.name"
        :class="state.ZLBFitForOld ? 'fieldOld' : ''"
        required
        name="name"
        label="姓名"
        maxlength="10"
        :rules="state.validator.name"
        placeholder="请输入姓名"
      />
      <van-field
        v-model="state.mobile"
        required
        :class="state.ZLBFitForOld ? 'fieldOld' : ''"
        name="mobile"
        label="联系电话"
        maxlength="11"
        :rules="state.validator.mobile"
        placeholder="请输入联系电话"
      />
      <van-field
        v-model="state.title"
        required
        :class="state.ZLBFitForOld ? 'fieldOld' : ''"
        name="title"
        label="标题"
        maxlength="20"
        :rules="state.validator.title"
        placeholder="请输入标题"
      />
      <van-field
        v-model="state.content"
        rows="3"
        :class="state.ZLBFitForOld ? 'fieldOld' : ''"
        required
        name="content"
        autosize
        maxlength="100"
        label="内容"
        type="textarea"
        :rules="state.validator.content"
        placeholder="请填写投诉/建议/咨询内容，我们将在1个工作日内与您联系。"
      />
      <div class="pic">
        <div class="pic-list">
          <div
            v-for="(item, index) in state.fileList"
            :key="item.id"
            class="image-box"
          >
            <van-icon class="delete" name="clear" @click="toDelete1(index)" />
            <img :src="item.url" alt />
          </div>
          <div
            class="upload-btn"
            v-show="state.fileList.length < 3"
            @click="choiceImg1"
          >
            <van-icon name="plus" />
            <span>点击上传</span>
          </div>
        </div>
        <div
          class="picDescribe"
          :class="state.ZLBFitForOld ? 'picDescribeOld' : ''"
        >
          上传图片（最多3张）
        </div>
      </div>
      <van-button
        class="submitBtn"
        :class="state.ZLBFitForOld ? 'submitBtnOld' : ''"
        round
        block
        type="primary"
        native-type="submit"
        >确认提交</van-button
      >
    </van-form>
    <input
      ref="inputTarget"
      id="takepicture"
      type="file"
      style="display: none"
      accept="image/*"
      @change="upload"
    />
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Toast } from 'vant'
import Request from '@/service/request'
import { OSSLINK } from '@/util/const'
import OSS from 'ali-oss'
import lrz from 'lrz'
import { isZLB } from '@/util/index'

export default {
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const inputTarget = ref(null)
    const state = reactive({
      ZLBFLAG: isZLB(),
      ZLBFitForOld:
        localStorage.getItem('fitForOld') &&
        localStorage.getItem('fitForOld') == 1
          ? true
          : false,
      validator: {
        name: [{ required: true, trigger: 'onBlur', message: '请输入' }],
        title: [{ required: true, trigger: 'onBlur', message: '请输入' }],
        content: [{ required: true, trigger: 'onBlur', message: '请输入' }],
        mobile: [
          {
            required: true,
            trigger: 'onBlur',
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确手机号',
          },
        ],
      },
      fileList: [],
      client: {},
    })
    const onFailed = (err) => {
      console.log(err)
    }
    const onSubmit = (params) => {
      if (state.fileList.length) {
        params.img = state.fileList
          .map((ele) => {
            return ele.url
          })
          .join(',')
        submitAction(params)
      } else {
        Toast('请上传图片')
      }
    }
    const submitAction = (params) => {
      Request.addFeedback(params)
        .then((res) => {
          if (res.code === 0) {
            Toast('提交成功')
            state.name = ''
            state.mobile = ''
            state.title = ''
            state.content = ''
            state.fileList = []
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    const toDelete1 = (index) => {
      state.fileList.splice(index, 1)
    }
    const choiceImg1 = () => {
      inputTarget.value.click()
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
          // console.log(state.client, 'state.client')
          state.client.path = after.path_class
        }
      })
    }
    const upload = (e) => {
      let fileObj = e.target.files[0]
      lrz(fileObj, { width: 600 }).then(async (result) => {
        if (state.ZLBFLAG) {
          let shorter = result.file
          let url = `${state.client.path}/${fileObj.name.split('.')[0]}-${
            Date.parse(new Date()) / 1000
          }.${fileObj.type.split('/')[1]}`
          let reader = new FileReader()
          reader.readAsDataURL(fileObj)
          reader.onloadend = () => {
            state.client.multipartUpload(url, fileObj).then(async (data) => {
              state.fileList.push({
                url: OSSLINK + data.name,
              })
              e.target.value = ''
            })
          }
        } else {
          let params = new FormData()
          params.append('file', result.file, fileObj.name)
          Request.uploadImages(params).then((res) => {
            if (res.code === 0) {
              state.fileList.push({
                url: OSSLINK + res.data.img_url,
              })
              e.target.value = ''
            }
          })
        }
      })
    }

    return {
      state,
      onFailed,
      onSubmit,
      toDelete1,
      choiceImg1,
      inputTarget,
      upload,
      submitAction,
    }
  },
}
</script>
<style lang="less" scoped>
.adviceCon {
  padding: 0.3rem;
  box-sizing: border-box;
}
.submitBtn {
  position: fixed;
  width: 73.33%;
  left: 13.33%;
  right: 0;
  bottom: 1.2rem;
  font-size: 0.32rem;
  font-weight: 500;
  color: #fff;
}
.submitBtnOld {
  font-size: 0.4rem;
}
.pic {
  background-color: #fff;
  padding: 0.2rem;
  box-sizing: border-box;
  .picDescribe {
    font-size: 0.22rem;
    color: #999;
  }
  .picDescribeOld {
    font-size: 0.35rem;
  }
  p {
    font-size: 0.28rem;
    color: #666;
    margin-left: 0.1rem;
  }
  .pic-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding-bottom: 0.3rem;
    .image-box {
      height: 1.8rem;
      width: 30%;
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
    }
    .upload-btn {
      width: 30%;
      height: 2rem;
      box-sizing: border-box;
      border: 2px dashed #ccc;
      text-align: center;
      overflow: hidden;
      border-radius: 10px;
      margin: 0.3rem 0.2rem 0 0;
      .van-icon {
        font-size: 0.8rem;
        color: #ccc;
        margin-top: 0.45rem;
      }
      span {
        font-size: 0.32rem;
        color: #ccc;
        margin-top: 0.12rem;
        display: block;
      }
    }
  }
}
.pic:nth-last-child(1) {
  border: 0;
}
</style>
<style lang="less">
.adviceCon {
  .fieldOld {
    .van-cell__title {
      font-size: 0.35rem;
    }
    .van-cell__value {
      font-size: 0.35rem;
    }
  }
}
</style>
