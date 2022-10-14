<template>
  <div class="main projectImplementCon">
    <van-form @submit="submit" validate-trigger="onSubmit" :readonly="!isFirst">
      <div class="box">
        <div class="head">
          <span :class="state.ZLBFitForOld ? 'titleOld' : ''">进度汇报</span>
          <div class="change" @click="change" :class="state.ZLBFitForOld ? 'changeOld' : ''">项目变更申请</div>
        </div>
        <div class="item">
          <p :class="[state.ZLBFitForOld ? 'itemTitleOld' : '', 'fakeRequired']">1. 工程形象进度</p>
          <div class="inputBox">
            <van-field
              v-model="formData.progress_of_works"
              :class="state.ZLBFitForOld ? 'fieldOld' : ''"
              class="inputs"
              type="textarea"
              placeholder="1000字以内"
              :rules="[{ required: true, message: '请填写工程形象进度' }]"
            />
          </div>
        </div>
        <div class="item">
          <p :class="[state.ZLBFitForOld ? 'itemTitleOld' : '', 'fakeRequired']">2. 当月投资金额（万元）</p>
          <div class="inputBox">
            <van-field
              v-model="formData.this_month_amount"
              class="inputs"
              @change="moneyChange(formData.this_month_amount, 'this_month_amount')"
              :class="state.ZLBFitForOld ? 'fieldOld' : ''"
              type="number"
              placeholder="请输入金额（万元）"
              :rules="[{ required: true, message: '请输入金额（万元）' }]"
            />
          </div>
        </div>
        <div class="item">
          <p :class="[state.ZLBFitForOld ? 'itemTitleOld' : '', 'fakeRequired']">3. 本年计划投资（万元）</p>
          <div class="inputBox">
            <van-field
              v-model="formData.this_year_amount"
              class="inputs"
              :class="state.ZLBFitForOld ? 'fieldOld' : ''"
              @change="moneyChange(formData.this_year_amount, 'this_year_amount')"
              type="number"
              placeholder="请输入金额（万元）"
              :rules="[{ required: true, message: '请输入金额（万元）' }]"
            />
          </div>
        </div>
        <div class="item">
          <p :class="[state.ZLBFitForOld ? 'itemTitleOld' : '', 'fakeRequired']">4.本年形象进度计划</p>
          <!-- :rules="[{ required: true, message: '请输入本年形象进度计划' }]" -->
          <div class="inputBox">
            <van-field
              v-model="formData.this_year_progress_of_works"
              maxlength="2000"
              class="inputs"
              type="textarea"
              :class="state.ZLBFitForOld ? 'fieldOld' : ''"
              :disabled="state.haveList"
              placeholder="2000字以内"
            />
          </div>
        </div>
        <div class="item">
          <p :class="[state.ZLBFitForOld ? 'itemTitleOld' : '', 'fakeRequired']">5. 累计完成投资金额（万元）</p>
          <div class="inputBox">
            <van-field
              v-model="formData.total_amount"
              class="inputs"
              type="number"
              :class="state.ZLBFitForOld ? 'fieldOld' : ''"
              placeholder="请输入金额（万元）"
              readonly
              :rules="[{ required: true, message: '请输入金额（万元）' }]"
            />
          </div>
        </div>
        <div class="item">
          <p :class="[state.ZLBFitForOld ? 'itemTitleOld' : '', 'fakeRequired']">6. 是否存在问题</p>
          <div class="selectBox">
            <div :class="[formData.is_problem == '1' ? 'ac' : null, state.ZLBFitForOld ? 'selectBoxItemOld' : '']" @click="changeIsPro('1')">是</div>
            <div :class="[formData.is_problem == '0' ? 'ac' : null, state.ZLBFitForOld ? 'selectBoxItemOld' : '']" @click="changeIsPro('0')">否</div>
          </div>
        </div>
        <div class="item" v-if="formData.is_problem == '1'">
          <p :class="[state.ZLBFitForOld ? 'itemTitleOld' : '', 'fakeRequired']">问题描述</p>
          <div class="inputBox">
            <van-field
              v-model="formData.content"
              class="inputs"
              type="textarea"
              :class="state.ZLBFitForOld ? 'fieldOld' : ''"
              placeholder="1000字以内"
              :rules="[{ required: true, message: '请输入问题描述' }]"
            />
          </div>
        </div>
        <div class="item">
          <p :class="[state.ZLBFitForOld ? 'itemTitleOld' : '', 'fakeRequired']">7. 上传照片</p>
          <div class="item2" v-if="isFirst">
            <div class="tips" :class="state.ZLBFitForOld ? 'picDescribeOld' : ''">支持上传文件格式：jpg、jpeg、png（单个文件大小在10M以内）</div>
            <van-field
              name="checkfileList"
              label=""
              class="inputs"
              :rules="[
                {
                  message: '请上传照片',
                  validator: checkfileList
                }
              ]"
              style="padding: 0"
            >
              <template #input>
                <div class="pic">
                  <div class="pic-list">
                    <div v-for="(item, index) in state.fileList" :key="item.id" class="image-box">
                      <van-icon class="delete" name="clear" @click="toDelete1(index)" />
                      <img :src="item.url" alt />
                    </div>
                    <div class="upload-btn" v-show="state.fileList.length < 5" @click="choiceImg1">
                      <van-icon name="plus" />
                      <span>点击上传</span>
                    </div>
                  </div>
                  <div class="picDescribe" :class="state.ZLBFitForOld ? 'picDescribeOld' : ''">上传图片（最多5张）</div>
                </div>
              </template>
            </van-field>
          </div>
          <div class="item2" v-else>
            <img :src="state.fileList[0] && state.fileList[0].url" alt="" />
          </div>
        </div>
        <div class="item">
          <p :class="[state.ZLBFitForOld ? 'itemTitleOld' : '', 'fakeRequired']">8. 是否滞后</p>
          <div class="selectBox">
            <div :class="[formData.is_lag == '1' ? 'ac' : null, state.ZLBFitForOld ? 'selectBoxItemOld' : '']" @click="changeIs2Pro('1')">是</div>
            <div :class="[formData.is_lag == '0' ? 'ac' : null, state.ZLBFitForOld ? 'selectBoxItemOld' : '']" @click="changeIs2Pro('0')">否</div>
          </div>
        </div>
        <div class="item" v-if="formData.is_lag == '1'">
          <p :class="[state.ZLBFitForOld ? 'itemTitleOld' : '', 'fakeRequired']">滞后原因</p>
          <div class="inputBox">
            <van-field
              v-model="formData.lag_reason"
              class="inputs"
              type="textarea"
              maxlength="2000"
              :class="state.ZLBFitForOld ? 'fieldOld' : ''"
              placeholder="2000字以内"
              :rules="[{ required: true, message: '请输入滞后原因' }]"
            />
          </div>
        </div>
        <div class="item">
          <p :class="[state.ZLBFitForOld ? 'itemTitleOld' : '', 'fakeRequired']">9.协调情况</p>
          <div class="inputBox">
            <van-field
              v-model="formData.coordination_condition"
              class="inputs"
              type="textarea"
              maxlength="2000"
              :class="state.ZLBFitForOld ? 'fieldOld' : ''"
              placeholder="2000字以内"
              :rules="[{ required: true, message: '请输入协调情况' }]"
            />
          </div>
        </div>
        <div class="item">
          <p :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">10.工作建议</p>
          <div class="inputBox">
            <van-field v-model="formData.work_suggest" class="inputs" type="textarea" maxlength="1000" :class="state.ZLBFitForOld ? 'fieldOld' : ''" placeholder="1000字以内" />
          </div>
        </div>
        <div class="item">
          <p :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">11.备注</p>
          <div class="inputBox">
            <van-field v-model="formData.remark" class="inputs" type="textarea" maxlength="1000" :class="state.ZLBFitForOld ? 'fieldOld' : ''" placeholder="1000字以内" />
          </div>
        </div>
      </div>
      <div class="subBox" v-if="isFirst">
        <van-button class="borderBtn" round @click="checkRecord" block type="info" :class="state.ZLBFitForOld ? 'borderBtnOld' : ''">进度记录</van-button>
        <van-button class="submit" round block type="info" native-type="submit" :class="state.ZLBFitForOld ? 'submitBtnOld' : ''">提交</van-button>
      </div>
    </van-form>
    <div class="box" v-if="0">
      <div class="head">
        <span>审核流程</span>
      </div>
      <Procresss :procressData="procressData" :step="step"></Procresss>
    </div>
    <input ref="inputTarget" id="takepicture" type="file" style="display: none" accept="image/*" @change="upload" />
  </div>
</template>
<script>
import { defineComponent, onMounted, reactive, ref } from 'vue'
import Procresss from '@/components/procress'
import { useRoute, useRouter } from 'vue-router'
import lrz from 'lrz'
import { Toast } from 'vant'
import Request from '@/service/request'
import { OSSLINK } from '@/util/const'
import { isZLB } from '@/util/index'
import OSS from 'ali-oss'
export default defineComponent({
  components: { Procresss },
  setup(props, { emit }) {
    const Route = useRoute()
    const inputTarget = ref(null)
    const state = reactive({
      ZLBFLAG: isZLB(),
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
      fileList: reactive([]),
      client: {},
      haveList: false
    })
    const formData = ref({
      project_id: Route.query.projectId,
      progress_of_works: '', // 工程进度内容
      this_month_amount: '', // 当月投资金额
      total_amount: 0, // 累计投资金额
      content: '', // 问题描述
      image: '',
      is_problem: '1', // 1是 2否,
      this_year_amount: '',
      is_lag: '1',
      lag_reason: '',
      coordination_condition: '',
      work_suggest: '',
      remark: '',
      this_year_progress_of_works: ''
    })
    const Router = useRouter()
    // const fileList = ref([])
    const step = ref(1)
    const isFirst = ref(true)
    // 是否存在问题
    const procressData = reactive([
      { label: '验收审核', time: '2021-10-18' },
      { label: '材料递交', time: '2021-10-18' },
      { label: '项目结款', time: '2021-10-18' }
    ])
    const change = () => {
      Router.push({
        name: 'projectChange',
        query: {
          active: Route.query.active,
          policyId: Route.query.policyId,
          projectId: Route.query.projectId
        }
      })
    }
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
            bucket: after.bucket
          })
          state.client.path = after.path_class
        }
      })
    }
    const upload = (e) => {
      let fileObj = e.target.files[0]
      lrz(fileObj, { width: 600 }).then(async (result) => {
        if (state.ZLBFLAG) {
          let shorter = result.file
          let url = `${state.client.path}/${fileObj.name.split('.')[0]}-${Date.parse(new Date()) / 1000}.${fileObj.type.split('/')[1]}`
          let reader = new FileReader()
          reader.readAsDataURL(fileObj)
          reader.onloadend = () => {
            state.client.multipartUpload(url, fileObj).then(async (data) => {
              state.fileList.push({
                url: OSSLINK + data.name
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
                url: OSSLINK + res.data.img_url
              })
              e.target.value = ''
            }
          })
        }
      })
    }
    const choiceImg1 = () => {
      inputTarget.value.click()
    }
    const toDelete1 = (index) => {
      state.fileList.splice(index, 1)
    }
    const changeIsPro = (val) => {
      if (isFirst.value) {
        formData.value.is_problem = val
      }
    }
    const changeIs2Pro = (val) => {
      if (isFirst.value) {
        formData.value.is_lag = val
      }
    }
    const formatData = () => {
      formData.value = {
        project_id: Route.query.projectId,
        progress_of_works: '', // 工程进度内容
        this_month_amount: '', // 当月投资金额
        total_amount: '', // 累计投资金额
        content: '', // 问题描述
        image: '',
        is_problem: '1', // 1是
        this_year_amount: '',
        coordination_condition: '',
        work_suggest: '',
        remark: '',
        is_lag: '1',
        lag_reason: '',
        this_year_progress_of_works: ''
      }
      state.fileList = []
    }
    const submit = () => {
      // 处理多张图片 用逗号分割
      let arr = []
      state.fileList.length > 0 &&
        state.fileList.map((item) => {
          arr.push(item.url)
        })
      formData.value.image = arr.join(',')
      Request.procressReport(formData.value)
        .then((res) => {
          if (res.code === 0) {
            Toast(res.msg)
            getReports()
          } else {
            Toast(res.msg)
          }
        })
        .finally(() => {
          formatData()
        })
    }

    // 校验图片方法
    const checkfileList = (value, rule) => {
      return !!state.fileList.length
    }
    const checkRecord = () => {
      Router.push({
        name: 'projectImplementRecord',
        query: {
          active: Route.query.active,
          policyId: Route.query.policyId,
          projectId: Route.query.projectId
        }
      })
    }
    onMounted(() => {
      if (state.ZLBFLAG) {
        fetchOssinfo()
      }
      getReports()
    })

    // 获取汇报记录
    const getReports = () => {
      Request.procressReportInfo({
        project_id: Route.query.projectId
      })
        .then((res) => {
          if (res.code === 0) {
            if (res.data.length >= 1) {
              // 获取累计投资金额 赋值
              formData.value = Object.assign({}, { ...formData.value, total_amount: res.data[0].total_amount, this_year_progress_of_works: res.data[0].this_year_progress_of_works })
              state.haveList = true
            } else {
              state.haveList = false
            }
          }
        })
        .finally(() => {})
    }
    const moneyFormat = (value) => {
      if (value || value == 0) {
        let fix = (Math.round(+value + 'e' + 2) / Math.pow(10, 2)).toFixed(2)
        return fix
      }
    }
    const moneyChange = (value, from) => {
      let hi = moneyFormat(value)
      formData.value[from] = hi
    }
    return {
      moneyChange,
      moneyFormat,
      state,
      change,
      procressData,
      step,
      submit,
      formData,
      formatData,
      isFirst,
      changeIsPro,
      upload,
      toDelete1,
      choiceImg1,
      checkfileList,
      inputTarget,
      checkRecord,
      changeIs2Pro
    }
  }
})
</script>
<style scoped lang="less">
.fakeRequired {
  &:before {
    margin-right: 2px;
    color: rgb(238, 10, 36);
    content: '*';
  }
}
.main {
  width: 100%;
  font-size: 0.28rem;
  .subBox {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    padding-top: 0.4rem;
    padding-bottom: 0.9rem;
    box-sizing: border-box;
    .submit {
      width: 38.4%;
      color: #fff;
      font-size: 0.32rem;
      background-color: rgba(27, 130, 236, 1);
      text-align: center;
      border-radius: 0.4rem;
      margin-left: 0.4rem;
    }
    .submitBtnOld {
      font-size: 0.45rem;
    }
    .borderBtn {
      width: 38.4%;
      color: #fff;
      font-size: 0.32rem;
      background-color: #fff;
      color: rgba(27, 130, 236, 1);
      border: rgba(27, 130, 236, 1) 1px solid;
      text-align: center;
      border-radius: 0.4rem;
    }
    .borderBtnOld {
      font-size: 0.45rem;
    }
  }
  .box {
    padding: 0.2rem;
    margin: 0.2rem 0.3rem;
    background: #fff;
    border-radius: 0.16rem;

    .item:last-of-type {
      padding-bottom: 0;
    }

    .item {
      width: 100%;
      padding-bottom: 0.3rem;

      .error {
        color: red;
        font-size: 0.22rem;
        margin-top: 0.1rem;
      }

      p {
        font-weight: normal;
        font-size: 0.28rem;
        color: rgba(0, 0, 0, 1);
        margin-bottom: 0.3rem;
      }
      .itemTitleOld {
        font-size: 0.35rem;
      }
      .item2 {
        margin: 0.25rem 0;

        .name {
          line-height: 0.4rem;
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
        img {
          width: 100%;
        }
      }

      .selectBox {
        width: 100%;
        padding: 0.2rem 0.3rem;
        box-sizing: border-box;
        background-color: rgba(249, 249, 249, 1);
        border: 0.01rem solid rgba(204, 204, 204, 1);
        display: flex;
        justify-content: space-between;

        div {
          width: 48%;
          text-align: center;
          line-height: 0.6rem;
          height: 0.6rem;
          border: 0.01rem solid rgba(27, 130, 236, 1);
          color: rgba(27, 130, 236, 1);
        }
        .selectBoxItemOld {
          font-size: 0.4rem;
        }
        .ac {
          background: rgba(27, 130, 236, 0.14);
        }
      }

      .inputBox {
        width: 100%;
        padding: 0.2rem 0.3rem;
        box-sizing: border-box;
        background-color: rgba(249, 249, 249, 1);
        border: 0.01rem solid rgba(204, 204, 204, 1);

        .inputs {
          padding: 0;
          background-color: #f9f9f9;
        }

        input,
        textarea {
          border: none;
          outline: none;
          background: none;
          width: 100%;
          display: block;
          height: auto;
          resize: none;
        }
      }
    }

    .head {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      position: relative;

      .change {
        border: 0.02rem solid rgba(27, 130, 236, 1);
        color: rgba(27, 130, 236, 1);
        height: 0.3rem;
        line-height: 0.3rem;
        padding: 0.1rem;
        border-radius: 0.3rem;
        position: absolute;
        right: 0;
        top: 0.1rem;
      }
      .changeOld {
        font-size: 0.3rem;
      }

      span {
        font-weight: 600;
        font-size: 0.3rem;
        height: 0.3rem;
        line-height: 0.3rem;
        border-left: 0.05rem solid #1b82ec;
        text-indent: 0.1rem;
        margin: 0.2rem 0 0.4rem;
      }
      .titleOld {
        font-size: 0.42rem;
      }
    }
  }
}
.recordEntry {
  margin-bottom: 20px;
}
</style>
<style lang="less">
.projectImplementCon {
  .fieldOld {
    .van-cell__title {
      font-size: 0.35rem;
    }
    .van-cell__value {
      font-size: 0.35rem;
    }
  }
}
.pic {
  background-color: #fff;
  padding: 0.2rem;
  box-sizing: border-box;
  width: 100%;
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
    width: 100%;
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
