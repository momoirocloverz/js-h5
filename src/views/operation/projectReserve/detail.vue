<template>
  <div class="operationProjectReserveCon">
    <div class="formArea" v-if="Route.query.able != 0">
      <van-form @failed="onFailed" @submit="onSubmit">
        <div class="topCon">
          <van-field
            v-model="state.formData.audit_reason"
            rows="4"
            name="audit_reason"
            autosize
            label="审核意见"
            type="textarea"
            maxlength="200"
            :rules="state.validator.audit_reason"
            placeholder="请输入审核意见"
            show-word-limit
          />
          <div class="pic">
            <div class="pic-list">
              <div
                v-for="(item, index) in state.fileList"
                :key="item.id"
                class="image-box"
              >
                <van-icon
                  class="delete"
                  name="clear"
                  v-if="Route.query.able != 0"
                  @click="toDelete1(index)"
                />
                <img :src="item.url" alt />
              </div>
              <div
                class="upload-btn"
                v-show="state.fileList.length < 5 && Route.query.able != 0"
                @click="choiceImg1"
              >
                <van-icon name="plus" />
                <span>点击上传</span>
              </div>
            </div>
            <div class="picDescribe">上传附件（最多5张）</div>
          </div>
          <van-field
            input-align="right"
            v-model="state.formData.link_mobile"
            name="link_mobile"
            label="联系电话"
            maxlength="11"
            :rules="state.validator.link_mobile"
            placeholder="请输入联系电话"
          />
          <div class="itemRight" v-if="Route.query.able != 0">
            <div @click="passAction" class="positiveRight">通过</div>
            <div @click="rejectAction" class="negativeRight">驳回</div>
          </div>
        </div>
      </van-form>
    </div>
    <div class="detailCon">
      <div class="highLightCon">
        <div class="highLightLine"></div>
        <div class="highLightTitle">进度汇报</div>
      </div>
      <div class="commonItemCopyCon">
        <div>项目名称</div>
        <div>
          {{ (state.detailForm && state.detailForm.project_name) || '-' }}
        </div>
      </div>
      <div class="commonItemCopyCon">
        <div>项目类型</div>
        <div>
          {{
            (state.detailForm &&
              state.projectTypeObj[state.detailForm.project_type]) ||
            '-'
          }}
        </div>
      </div>
      <div class="commonItemCopyCon">
        <div>项目地点</div>
        <div>
          {{ (state.detailForm && state.detailForm.full_area) || '-' }}
        </div>
      </div>
      <div class="commonItemCopyCon">
        <div>建设期限</div>
        <div>
          {{
            (state.detailForm &&
              state.detailForm.build_start_at &&
              dayjs(state.detailForm.build_start_at).format('YYYY-MM-DD') +
                '-' +
                dayjs(state.detailForm.build_end_at).format('YYYY-MM-DD')) ||
            '-'
          }}
        </div>
      </div>
      <div class="commonItemCopyCon">
        <div>申报单位</div>
        <div>
          {{ (state.detailForm && state.detailForm.declare_unit) || '-' }}
        </div>
      </div>
      <div class="commonItemCopyCon">
        <div>负责人</div>
        <div>
          {{ (state.detailForm && state.detailForm.unit_charge_name) || '-' }}
        </div>
      </div>
      <div class="commonItemCopyCon">
        <div>联系电话</div>
        <div>
          {{ (state.detailForm && state.detailForm.unit_charge_mobile) || '-' }}
        </div>
      </div>
      <div class="commonItemCopyCon removeBorder">
        <div>申报日期</div>
        <div>
          {{ (state.detailForm && state.detailForm.declare_at) || '-' }}
        </div>
      </div>
    </div>

    <div class="contentCon" v-if="state.staticForm && state.staticForm.length">
      <template v-for="(item, index) in state.staticForm" :key="index">
        <div class="commonItemCon">
          <div>项目建设内容</div>
          <div>{{ item.content }}</div>
        </div>
        <div class="commonItemCon">
          <div>投资额{{ index + 1 }}</div>
          <div>{{ item.invest_money }}万元</div>
        </div>
      </template>
      <div class="commonItemCon removeBorder">
        <div>合计</div>
        <div class="highLightBlue">{{ moneyFormat(state.totalMoney) }}万元</div>
      </div>
    </div>
    <div class="resultCon">
      <div class="highLightCon">
        <div class="highLightLine"></div>
        <div class="highLightTitle">审核结果</div>
      </div>
      <div class="commonItemCopyCon">
        <div>审核状态</div>
        <div class="highLightBlue">
          {{ state.statusObj[state.detailForm.status] }}
        </div>
      </div>
      <div v-if="Route.query.able == 0">
        <div class="commonItemCopyCon">
          <div>审核意见</div>
          <div>
            {{ state.formData.audit_reason || '-' }}
          </div>
        </div>
        <div class="commonItemCopyCon">
          <div>联系电话</div>
          <div>
            {{ state.formData.link_mobile || '-' }}
          </div>
        </div>
        <div class="commonItemCopyCon removeBorder">
          <div>附件</div>
        </div>
        <div class="">
          <div>
            <div class="pic">
              <div class="pic-list">
                <div
                  v-for="(item, index) in state.fileList"
                  :key="item.id"
                  class="image-box"
                  @click="popPreview(state.fileList, index)"
                >
                  <img :src="item.url" alt />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/operation'
import dayjs from 'dayjs'
import { OSSLINK } from '@/util/const'
import lrz from 'lrz'
import { Toast, ImagePreview } from 'vant'
const phoneReg = /^1[3-9]\d{9}$/
export default defineComponent({
  setup(props, { emit }) {
    const Router = useRouter()
    const Route = useRoute()
    const inputTarget = ref(null)
    const state = reactive({
      typeObj: {
        1: '种植业',
        2: '养殖业',
        3: '加工业',
        4: '乡村建设',
        9: '其他',
      },
      validator: {
        link_mobile: [
          //   {
          //     trigger: 'onBlur',
          //     pattern: /^1[3-9]\d{9}$/,
          //     message: '请输入正确手机号',
          //   },
        ],
      },
      fileList: [],
      formData: {
        audit_reason: '',
      },
      staticForm: {},
      detailForm: {},
      totalMoney: 0,
      statusObj: {
        1: '待审核',
        2: '已通过',
        9: '已驳回',
      },
      projectTypeObj: {
        1: '种植业',
        2: '养殖业',
        3: '加工业',
        4: '乡村建设',
        9: '其他',
      },
      actionType: 2,
    })
    const onLoad = () => {
      fetchList()
    }
    onMounted(() => {
      onLoad()
    })
    const popPreview = (array, index) => {
      ImagePreview({
        images: state.detailForm.audit_attachment,
        startPosition: index,
        closeable: true,
      })
    }
    const fetchList = () => {
      if (Route.query.id) {
        Request.projectReserveDetail({
          id: Route.query.id,
        })
          .then((res) => {
            if (res && res.code == 0) {
              state.staticForm = res.data.info.build_contents
              let shorter = res.data.info
              let final = calcFunction(res.data.info.build_contents)
              state.totalMoney = final
              state.detailForm = shorter
              if (shorter.audit_attachment && shorter.audit_attachment.length) {
                state.fileList = shorter.audit_attachment.map((ele) => {
                  return {
                    url: ele,
                  }
                })
              }
              state.formData.link_mobile = shorter.link_mobile
              state.formData.audit_reason = shorter.audit_reason
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      }
    }
    const toDelete1 = (index) => {
      state.fileList.splice(index, 1)
    }
    const choiceImg1 = () => {
      inputTarget.value.click()
    }
    const onFailed = (err) => {
      console.log(err)
    }
    const onSubmit = () => {
      if (state.formData.link_mobile) {
        let phoneRes = phoneReg.test(state.formData.link_mobile)
        if (phoneRes) {
          requestAction()
        } else {
          Toast('请输入正确手机号')
        }
      } else {
        requestAction()
      }
    }
    const requestAction = () => {
      let data = {
        status: state.actionType,
        id: Route.query.id,
        link_mobile: state.formData.link_mobile || '',
        audit_reason: state.formData.audit_reason || '',
        audit_attachment:
          state.fileList && state.fileList.length
            ? state.fileList.map((ele) => {
                return ele.url
              })
            : [],
      }
      Request.projectReserveAudit(data)
        .then((res) => {
          if (res && res.code == 0) {
            Toast('操作成功 ')
            onLoad()
            Router.replace({
              name: 'operationProjectReserveDetail',
              query: {
                id: Route.query.id,
                able: '0',
              },
            })
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    const upload = (e) => {
      let fileObj = e.target.files[0]
      lrz(fileObj, { width: 600 }).then(async (result) => {
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
      })
    }
    const calcFunction = (array) => {
      let temp = array.map((ele) => {
        if (!ele.invest_money) {
          return {
            ...ele,
            invest_money: ele.invest_money ? ele.invest_money : 0,
          }
        } else {
          return {
            ...ele,
          }
        }
      })
      let res = temp.reduce((acc, current) => {
        return Number(acc) + Number(current.invest_money)
      }, 0)
      return res
    }
    const moneyFormat = (value) => {
      if (value || value == 0) {
        let fix = (Math.round(+value + 'e' + 2) / Math.pow(10, 2)).toFixed(2)
        return fix
      }
    }
    const passAction = () => {
      state.actionType = 2
      onSubmit()
    }
    const rejectAction = () => {
      state.actionType = 9
      onSubmit()
    }
    return {
      state,
      dayjs,
      passAction,
      rejectAction,
      onFailed,
      onSubmit,
      onLoad,
      toDelete1,
      choiceImg1,
      upload,
      inputTarget,
      moneyFormat,
      calcFunction,
      Route,
      popPreview,
    }
  },
})
</script>

<style scoped lang="less">
.ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  overflow: hidden;
}
.operationProjectReserveCon {
  box-sizing: border-box;
  padding: 0.3rem;
}
.formArea {
  background-color: #fff;
  border-radius: 0.16rem;
  overflow: hidden;
  margin-bottom: 0.3rem;
}
.detailCon {
  background-color: #fff;
  border-radius: 0.16rem;
  overflow: hidden;
  margin-bottom: 0.3rem;
  padding-left: 0.3rem;
  padding-right: 0.3rem;
  box-sizing: border-box;
}
.contentCon {
  background-color: #fff;
  border-radius: 0.16rem;
  overflow: hidden;
  margin-top: 0.3rem;
  margin-bottom: 0.3rem;
  padding-left: 0.3rem;
  padding-right: 0.3rem;
  box-sizing: border-box;
}
.commonItemCopyCon {
  border-bottom: 1px solid #f2f3f5;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  div {
    &:nth-child(1) {
      width: 1.5rem;
      font-size: 0.32rem;
      font-weight: 500;
      color: #333;
    }
    &:nth-child(2) {
      font-size: 0.32rem;
      font-weight: 500;
      color: #666;
      width: 4.3rem;
    }
  }
}
.commonItemCon {
  border-bottom: 1px solid #f2f3f5;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  div {
    &:nth-child(1) {
      width: 2.3rem;
      font-size: 0.32rem;
      font-weight: 500;
      color: #333;
    }
    &:nth-child(2) {
      font-size: 0.32rem;
      font-weight: 500;
      color: #666;
      width: 4rem;
    }
  }
}
.highLightBlue {
  color: #1b82ec !important;
}
.removeBorder {
  border-bottom: 0;
}
.resultCon {
  background-color: #fff;
  border-radius: 0.16rem;
  overflow: hidden;
  margin-top: 0.3rem;
  margin-bottom: 0.3rem;
  padding-left: 0.3rem;
  padding-right: 0.3rem;
  box-sizing: border-box;
}
.itemRight {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  margin-top: 0.4rem;
  margin-bottom: 0.4rem;
  padding-left: 0.3rem;
  padding-right: 0.3rem;
  box-sizing: border-box;
}
.positiveRight {
  width: 3rem;
  height: 0.88rem;
  box-sizing: border-box;
  line-height: 0.88rem;
  text-align: center;
  color: #fff;
  font-size: 0.3rem;
  background-color: #1b82ec;
  border-radius: 0.44rem;
}
.negativeRight {
  width: 3rem;
  height: 0.88rem;
  box-sizing: border-box;
  line-height: 0.88rem;
  text-align: center;
  color: #1b82ec;
  font-size: 0.3rem;
  background-color: #fff;
  border: 2px solid #1b82ec;
  border-radius: 0.44rem;
}
.pic {
  background-color: #fff;
  padding: 0.2rem;
  box-sizing: border-box;
  .picDescribe {
    font-size: 0.3rem;
    color: #999;
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
      width: 29%;
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
.highLightCon {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  box-sizing: border-box;
  margin-top: 0.3rem;
  margin-bottom: 0.2rem;
  .highLightLine {
    width: 0.05rem;
    height: 0.3rem;
    background: #1b82ec;
    border-radius: 0.03rem;
    margin-right: 0.06rem;
  }
  .highLightTitle {
    font-size: 0.34rem;
    line-height: 0.45rem;
    font-weight: bold;
    color: #333;
    margin-top: 0.02rem;
  }
}
</style>
<style lang="less">
.operationProjectReserveCon {
  .topCon {
    .van-field__label {
      font-size: 0.3rem;
    }
    .van-field__value {
      font-size: 0.3rem;
    }
  }
}
</style>
