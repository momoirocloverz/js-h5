<template>
  <div class="main projectImplementRecordCon">
    <van-form validate-trigger="onSubmit" readonly>
      <div class="box">
        <div class="head">
          <span :class="state.ZLBFitForOld ? 'titleOld' : ''">进度记录</span>
        </div>
        <template v-for="(item, index) in state.dataList" :key="index">
          <div class="item">
            <b>进度{{ index + 1 }}</b>
          </div>
          <div class="item">
            <p :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">1. 工程形象进度</p>
            <div class="inputBox">
              <van-field
                v-model="item.progress_of_works"
                :class="state.ZLBFitForOld ? 'fieldOld' : ''"
                class="inputs"
                type="textarea"
                placeholder="1000字以内"
                :rules="[{ required: true, message: '请填写工程形象进度' }]"
              />
            </div>
          </div>
          <div class="item">
            <p :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">2. 当月投资金额（万元）</p>
            <div class="inputBox">
              <van-field
                v-model="item.this_month_amount"
                class="inputs"
                :class="state.ZLBFitForOld ? 'fieldOld' : ''"
                type="number"
                placeholder="请输入金额（万元）"
                :rules="[{ required: true, message: '请输入金额（万元）' }]"
              />
            </div>
          </div>
          <div class="item">
            <p :class="[state.ZLBFitForOld ? 'itemTitleOld' : '']">3. 本年计划投资（万元）</p>
            <div class="inputBox">
              <van-field
                v-model="item.this_year_amount"
                class="inputs"
                :class="state.ZLBFitForOld ? 'fieldOld' : ''"
                type="number"
                placeholder="请输入金额（万元）"
                :rules="[{ required: true, message: '请输入金额（万元）' }]"
              />
            </div>
          </div>

          <div class="item">
            <p :class="[state.ZLBFitForOld ? 'itemTitleOld' : '']">4.本年形象进度计划</p>
            <div class="inputBox">
              <van-field v-model="item.this_year_progress_of_works" class="inputs" type="textarea" :class="state.ZLBFitForOld ? 'fieldOld' : ''" :disabled="state.haveList" placeholder="2000字以内" />
            </div>
          </div>

          <div class="item">
            <p :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">5. 累计完成投资金额（万元）</p>
            <div class="inputBox">
              <van-field
                v-model="item.total_amount"
                class="inputs"
                type="number"
                :class="state.ZLBFitForOld ? 'fieldOld' : ''"
                placeholder="请输入金额（万元）"
                :rules="[{ required: true, message: '请输入金额（万元）' }]"
              />
            </div>
          </div>
          <div class="item">
            <p :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">6. 是否存在问题</p>
            <div class="selectBox">
              <div :class="[item.is_problem == '1' ? 'ac' : null, state.ZLBFitForOld ? 'selectBoxItemOld' : '']" @click="changeIsPro('1')">是</div>
              <div :class="[item.is_problem == '0' ? 'ac' : null, state.ZLBFitForOld ? 'selectBoxItemOld' : '']" @click="changeIsPro('0')">否</div>
            </div>
          </div>
          <div class="item" v-if="item.is_problem == '1'">
            <p :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">问题描述</p>
            <div class="inputBox">
              <van-field v-model="item.content" class="inputs" type="textarea" :class="state.ZLBFitForOld ? 'fieldOld' : ''" placeholder="1000字以内" />
            </div>
          </div>
          <div class="item">
            <p :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">7. 上传照片</p>
            <div class="item2">
              <template v-for="(sub, subIndex) in item.fileList" :key="subIndex">
                <img @click="popPreview(item.fileList, subIndex)" :src="sub.url" />
              </template>
            </div>
          </div>
          <div class="item">
            <p :class="[state.ZLBFitForOld ? 'itemTitleOld' : '']">8. 是否滞后</p>
            <div class="selectBox">
              <div :class="[item.is_lag == '1' ? 'ac' : null, state.ZLBFitForOld ? 'selectBoxItemOld' : '']">是</div>     
              <div :class="[item.is_lag == '0' ? 'ac' : null, state.ZLBFitForOld ? 'selectBoxItemOld' : '']">否</div>
            </div>
          </div>
          <div class="item" v-if="item.is_lag == '1'">
            <p :class="[state.ZLBFitForOld ? 'itemTitleOld' : '']">滞后原因</p>
            <div class="inputBox">
              <van-field
                v-model="item.lag_reason"
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
            <p :class="[state.ZLBFitForOld ? 'itemTitleOld' : '']">9.协调情况</p>
            <div class="inputBox">
              <van-field
                v-model="item.coordination_condition"
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
              <van-field v-model="item.work_suggest" class="inputs" type="textarea" maxlength="1000" :class="state.ZLBFitForOld ? 'fieldOld' : ''" placeholder="1000字以内" />
            </div>
          </div>
          <div class="item">
            <p :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">11.备注</p>
            <div class="inputBox">
              <van-field v-model="item.remark" class="inputs" type="textarea" maxlength="1000" :class="state.ZLBFitForOld ? 'fieldOld' : ''" placeholder="1000字以内" />
            </div>
          </div>
        </template>
        <div class="emptyHolder" v-if="state.dataList && !state.dataList.length">
          <img src="https://img.hzanchu.com/acimg/698206a6fba0842528424a9f6f7e0cd4.png" />
          <div class="nothing">暂无进度记录</div>
        </div>
      </div>
    </van-form>
  </div>
</template>
<script>
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Toast, ImagePreview } from 'vant'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
export default defineComponent({
  setup(props, { emit }) {
    const Route = useRoute()
    const inputTarget = ref(null)
    const state = reactive({
      ZLBFLAG: isZLB(),
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
      fileList: reactive([]),
      client: {},
      dataList: []
    })
    const formData = ref({
      project_id: Route.query.projectId,
      progress_of_works: '', // 工程进度内容
      this_month_amount: '', // 当月投资金额
      total_amount: '', // 累计投资金额
      content: '', // 问题描述
      image: '',
      is_problem: '1', // 1是 2否
      this_year_amount: '',
      is_lag: '1',
      lag_reason: '',
      coordination_condition: '',
      work_suggest: '',
      remark: ''
    })
    const Router = useRouter()
    // const fileList = ref([])
    const step = ref(1)
    const isFirst = ref(false)
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
    const changeIsPro = (val) => {
      if (isFirst.value) {
        formData.value.is_problem = val
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
        is_problem: '1', // 1是 2否
        this_year_amount: '',
        is_lag: '1',
        lag_reason: '',
        coordination_condition: '',
        work_suggest: '',
        remark: ''
      }
      state.fileList = []
    }
    // 校验图片方法
    const checkfileList = (value, rule) => {
      return !!state.fileList.length
    }
    const popPreview = (array, index) => {
      let bridge = array.map((ele) => {
        return ele.url
      })
      ImagePreview({
        images: bridge,
        startPosition: index,
        closeable: true
      })
    }
    onMounted(() => {
      Request.procressReportInfo({
        project_id: Route.query.projectId
      })
        .then((res) => {
          if (res.code === 0) {
            let after = res.data.map((ele) => {
              return {
                ...ele,
                // is_problem: ele.content ? '1' : '0',
                fileList: ele.image
                  ? ele.image.split(',').map((sub) => {
                      return {
                        url: sub
                      }
                    })
                  : []
              }
            })
            state.dataList = after.reverse()
          }
        })
        .finally(() => {})
    })
    return {
      popPreview,
      state,
      change,
      step,
      formData,
      formatData,
      isFirst,
      changeIsPro,
      checkfileList,
      inputTarget
    }
  }
})
</script>
<style scoped lang="less">
.emptyHolder {
  margin-top: 0.6rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  img {
    width: 4rem;
    margin: 0 auto;
  }
  .nothing {
    text-align: center;
    font-size: 14px;
    color: #999;
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
  }
}
.main {
  width: 100%;
  font-size: 0.28rem;
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
        img {
          width: 1.8rem;
          height: 1.8rem;
          margin-right: 0.3rem;
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
</style>
<style lang="less">
.projectImplementRecordCon {
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
  p {
    font-size: 0.28rem;
    color: #666;
    margin-left: 0.1rem;
  }
}
.pic:nth-last-child(1) {
  border: 0;
}
</style>
