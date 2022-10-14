<template>
  <div class="projectReservePublishCon">
    <div class="topPart">
      <div class="item marBottom20">
        <p class="fakeRequired">1. 项目建设条件</p>
        <div class="inputBox">
          <textarea
            :rules="[{ required: true, message: '请填写用户名' }]"
            :disabled="Route.query.justForShow == 1"
            rows="7"
            maxlength="1000"
            @input="fieldChange"
            v-model.trim="state.formData.build_condition"
            placeholder="1000字以内"
          />
        </div>
      </div>
      <div class="item marBottom20">
        <p class="fakeRequired">2. 项目资金筹措</p>
        <div class="inputBox">
          <textarea :disabled="Route.query.justForShow == 1" rows="7" @input="fieldChange" maxlength="300" placeholder="300字以内" v-model.trim="state.formData.fund_raise" />
        </div>
      </div>
    </div>
    <div class="listCon marBottom30">
      <template v-for="(item, index) in state.formData.build_contents" :key="index">
        <div class="marBottom30 itemCon">
          <div class="itemTitle marBottom30" :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">
            <div class="fakeRequired">3.项目建设内容{{ index + 1 }}:</div>
            <div class="endBtn">
              <van-button v-if="Route.query.justForShow != 1 && index != 0" class="littleBtn" :class="state.ZLBFitForOld ? 'littleBtnOld' : ''" round block type="primary" @click="deleteCurrent(index)"
                >删除</van-button
              >
            </div>
          </div>
          <div class="itemContent marBottom30">
            <textarea
              rows="7"
              :disabled="Route.query.justForShow == 1"
              v-model="state.formData.build_contents[index].content"
              maxlength="100"
              @input="fieldChange"
              placeholder="名称、规模数量、建设标准、设备设施规格型号等，要求内容详实"
            />
          </div>
          <div class="itemMoney">
            <div class="fakeRequired">投资额：</div>
            <input
              :disabled="Route.query.justForShow == 1"
              placeholder="请输入金额（万元）"
              @input="fieldChange"
              v-model="state.formData.build_contents[index].invest_money"
              @change="(e) => moneyChange(e, index)"
            />
            <div>万元</div>
          </div>
        </div>
      </template>
    </div>
    <div class="addbtnCon" v-if="Route.query.justForShow != 1">
      <div class="addbtnCenter" @click="addMore">
        <img src="https://img.hzanchu.com/acimg/0ef025121076713f8ae14f333b521f70.png" />
        <div class="describe" :class="state.ZLBFitForOld ? 'describeOld' : ''">新增项目建设内容</div>
      </div>
    </div>

    <div class="listCon marBottom30">
      <template v-for="(item, index) in state.formData.schedule_contents" :key="index">
        <div class="marBottom30 itemCon">
          <div class="itemTitle marBottom30" :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">
            <div class="fakeRequired">4. 建设进度安排{{ index + 1 }}:</div>
            <div class="endBtn">
              <van-button
                v-if="Route.query.justForShow != 1 && index != 0"
                class="littleBtn"
                :class="state.ZLBFitForOld ? 'littleBtnOld' : ''"
                round
                block
                type="primary"
                @click="deleteTwoCurrent(index)"
                >删除</van-button
              >
            </div>
          </div>
          <div class="itemContent marBottom30">
            <textarea
              rows="7"
              @input="fieldChange"
              :disabled="Route.query.justForShow == 1"
              v-model="state.formData.schedule_contents[index].content"
              maxlength="300"
              placeholder="进度描述（300字以内）"
            />
          </div>
        </div>
      </template>
    </div>
    <div class="addbtnCon" v-if="Route.query.justForShow != 1">
      <div class="addbtnCenter" @click="addTwoMore">
        <img src="https://img.hzanchu.com/acimg/0ef025121076713f8ae14f333b521f70.png" />
        <div class="describe" :class="state.ZLBFitForOld ? 'describeOld' : ''">新增建设进度安排表单</div>
      </div>
    </div>
    <div class="item marBottom20">
      <p class="fakeRequired">5. 项目效益分析</p>
      <div class="inputBox">
        <textarea rows="7" @input="fieldChange" :disabled="Route.query.justForShow == 1" maxlength="1000" placeholder="1000字以内" v-model.trim="state.formData.efficiency_analysis" />
      </div>
    </div>
    <div class="fixPaddingBottom">
      <van-button v-if="Route.query.justForShow == 1" class="submitBtn" block @click="goBack" type="primary" :class="state.ZLBFitForOld ? 'btnTextOld' : ''">上一步</van-button>
      <div v-else>
        <div class="fixBottom fixPaddingBottom" v-if="Route.query.status == 2">
          <van-button class="submitBtn" block @click="goBack" type="primary" :class="state.ZLBFitForOld ? 'btnTextOld' : ''">上一步</van-button>
          <van-button class="saveBtn" block @click="saveAction" :class="state.ZLBFitForOld ? 'btnTextOld' : ''">保存</van-button>
          <van-button class="submitBtn" block @click="finish" type="primary" native-type="submit" :class="state.ZLBFitForOld ? 'btnTextOld' : ''">完成</van-button>
        </div>
        <div v-else class="fixBottom fixPaddingBottom">
          <van-button class="divideBtn" block @click="goBack" type="primary" :class="state.ZLBFitForOld ? 'btnTextOld' : ''">上一步</van-button>
          <van-button class="divideBtn" block @click="finish" type="primary" native-type="submit" :class="state.ZLBFitForOld ? 'btnTextOld' : ''">完成</van-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import { Toast } from 'vant'
import Request from '@/service/request'
import dayjs from 'dayjs'
import { isZLB } from '@/util/index'
import { mgop } from '@aligov/jssdk-mgop'
export default defineComponent({
  setup(props, { emit }) {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      ZLBFLAG: isZLB(),
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
      detail: {},
      contentChanged: false,
      validator: {
        content: [{ required: true, trigger: 'onBlur', message: '请输入' }],
        invest_money: [{ required: true, trigger: 'onBlur', message: '请输入' }]
      },
      formData: {
        build_condition: '',
        fund_raise: '',
        efficiency_analysis: '',
        build_contents: [],
        schedule_contents: []
      }
    })
    const normalSet = (res) => {
      let shorter = res.data.info
      state.formData = shorter
      state.formData.build_contents =
        shorter.build_contents && shorter.build_contents.length
          ? shorter.build_contents
          : [
              {
                content: '',
                invest_money: ''
              }
            ]
      state.formData.schedule_contents =
        shorter.schedule_contents && shorter.schedule_contents.length
          ? shorter.schedule_contents
          : [
              {
                content: ''
              }
            ]
      state.formData.build_condition = shorter.build_condition || ''
      state.formData.fund_raise = shorter.fund_raise || ''
      state.formData.efficiency_analysis = shorter.efficiency_analysis || ''
    }
    const layer1 = (res) => {
      state.detail = res.data.info
      if (Route.query.is_declaration_reserve_change == 1) {
        normalSet(res)
      } else {
        fetchPreserveData(res)
      }
    }
    const fetchPreserveData = (res) => {
      if (+Route.query.project_reserve_id) {
        Request.projectReserveDetail({
          id: Route.query.project_reserve_id
        })
          .then((res2) => {
            if (res2 && res2.code == 0) {
              let shorter = res2.data.info
              state.formData = shorter
              state.formData.build_contents =
                shorter.build_contents && shorter.build_contents.length
                  ? shorter.build_contents
                  : [
                      {
                        content: '',
                        invest_money: ''
                      }
                    ]
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      } else {
        normalSet(res)
      }
    }
    const fetchList = () => {
      if (Route.query.project_id) {
        Request.fetchProjectDeclarationDetail({
          project_id: Route.query.project_id
        })
          .then((res) => {
            if (res && res.code == 0) {
              layer1(res)
            } else {
              Toast(res.msg)
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      }
    }
    onMounted(() => {
      fetchList()
    })
    onBeforeRouteLeave((to, from) => {
      if (state.contentChanged) {
        const answer = window.confirm('您的项目信息未进行保存，是否确定离开？')
        if (answer) {
        } else {
          return false
        }
      }
    })
    const checkDetail = (item) => {
      Router.push({
        name: item.name
      })
    }
    const saveAction = () => {
      finalParams()
    }
    const finalParams = (flag) => {
      let requestData = {
        area_detail: state.formData.area_detail,
        build_start_at: state.formData.build_start_at,
        build_end_at: state.formData.build_end_at,
        declare_unit: state.formData.declare_unit,
        unit_charge_name: state.formData.unit_charge_name,
        unit_charge_mobile: state.formData.unit_charge_mobile,
        village_start_audit_at: state.formData.village_start_audit_at,

        project_name: state.formData.project_name,
        build_condition: state.formData.build_condition,
        fund_raise: state.formData.fund_raise,
        efficiency_analysis: state.formData.efficiency_analysis,
        build_contents: state.formData.build_contents && state.formData.build_contents.length ? JSON.stringify(state.formData.build_contents) : '',
        schedule_contents: state.formData.schedule_contents && state.formData.schedule_contents.length ? JSON.stringify(state.formData.schedule_contents) : '',
        policy_document_id: Route.query.policy_document_id,
        project_id: Route.query.project_id,
        save_type: flag ? 'submit' : 'save'
      }
      if (+Route.query.project_reserve_id) {
        requestData.project_reserve_id = Route.query.project_reserve_id
      }

      Request.actionProjectDeclaration(requestData)
        .then((res) => {
          if (res && res.code == 0) {
            state.contentChanged = false
            Toast('保存成功')
            if (flag) {
              Router.go(-2)
            }
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    const addMore = () => {
      state.formData.build_contents.push({
        content: '',
        invest_money: ''
      })
      fieldChange()
    }
    const addTwoMore = () => {
      state.formData.schedule_contents.push({
        content: ''
      })
      fieldChange()
    }
    const moneyChange = (e, index) => {
      let after = e.target.value.toString().match(/^\d*(\.?\d{0,2})/g)[0] || null
      state.formData.build_contents[index].invest_money = +after
    }
    const deleteCurrent = (index) => {
      state.formData.build_contents.splice(index, 1)
      fieldChange()
    }
    const deleteTwoCurrent = (index) => {
      state.formData.schedule_contents.splice(index, 1)
      fieldChange()
    }
    const goBack = () => {
      Router.go(-1)
    }
    const finish = () => {
      if (!state.formData.build_condition || !state.formData.fund_raise || !state.formData.efficiency_analysis) {
        return Toast('请填写完整数据')
      }
      if (state.formData.build_contents&&!state.formData.build_contents.length || state.formData.schedule_contents&&!state.formData.schedule_contents.length) {
        return Toast('请填写完整数据')
      }

      let track1 = state.formData.build_contents
      let empty1 = []
      if (track1) {
        track1.forEach((ele) => {
          Object.keys(ele).forEach((sub) => {
            empty1.push(ele[sub])
          })
        })
      }
      let track2 = state.formData.schedule_contents
      if (track2) {
        track2.forEach((ele) => {
          Object.keys(ele).forEach((sub) => {
            empty1.push(ele[sub])
          })
        })
      }
      setTimeout(() => {
        let validateRes = empty1.every((ele) => {
          return ele
        })
        console.log('validateRes', validateRes)
        if (validateRes) {
          finalParams('finish')
        } else {
          return Toast('请填写完整数据')
        }
      }, 300)
    }
    const fieldChange = () => {
      state.contentChanged = true
    }
    return {
      fieldChange,
      Route,
      state,
      checkDetail,
      goBack,
      finish,
      dayjs,
      addMore,
      addTwoMore,
      moneyChange,
      deleteCurrent,
      saveAction,
      deleteTwoCurrent
    }
  }
})
</script>
<style scoped lang="less">
.publishCircle {
  position: fixed;
  right: 0;
  bottom: 210px;
  width: 1.44rem;
  height: 1.44rem;
  background-color: #fff;
  border-radius: 0.72rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  img {
    width: 100%;
    height: 100%;
  }
}
.ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  overflow: hidden;
}
.fixPaddingBottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: border-box;
}

.marBottom20 {
  margin-bottom: 0.2rem;
}
.projectReservePublishCon {
  box-sizing: border-box;
  padding: 0.3rem;
  padding-bottom: 1rem;
}
.addbtnCon {
  margin-bottom: 0.3rem;
  display: flex;
  justify-content: flex-start;
  .describe {
    font-size: 0.28rem;
    font-weight: 500;
    color: #333;
    line-height: 0.36rem;
    height: 0.36rem;
  }
  .describeOld {
    font-size: 0.35rem;
  }
  img {
    width: 0.36rem;
    height: 0.36rem;
    margin-right: 0.1rem;
  }
  .addbtnCenter {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
  }
}
.marBottom30 {
  margin-bottom: 0.3rem;
}
.itemCon {
  padding: 0.3rem;
  box-sizing: border-box;
  background-color: #fff;
  .itemTitle {
    font-size: 0.28rem;
    font-weight: 500;
    color: #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
  }
  .itemTitleOld {
    font-size: 0.35rem;
  }
  .itemContent {
    font-size: 0.28rem;
    color: #666;
    line-height: 0.4rem;
  }
}
.fakeRequired {
  &:before {
    margin-right: 2px;
    color: rgb(238, 10, 36);
    content: '*';
  }
}
.littleBtn {
  width: 1.5rem;
  font-size: 0.3rem;
  height: 0.5rem;
}
.littleBtnOld {
  font-size: 0.35rem;
}
.endBtn {
}
.fixBottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  .saveBtn {
    width: 33.33%;
    color: rgb(25, 137, 250);
    border: 1px solid rgb(25, 137, 250);
  }
  .submitBtn {
    width: 33.33%;
  }
  .btnTextOld {
    font-size: 0.35rem;
  }
  .divideBtn {
    width: 50%;
  }
}

.item {
  width: 100%;
  padding: 0.3rem;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 0.16rem;

  p {
    font-size: 0.28rem;
    color: rgba(0, 0, 0, 1);
    margin-bottom: 0.3rem;
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
  }
  .inputBox {
    width: 100%;
    padding: 0.2rem 0.3rem;
    box-sizing: border-box;
    background-color: rgba(249, 249, 249, 1);
    border: 0.01rem solid #ccc;
    input,
    textarea {
      border: none;
      outline: none;
      background: none;
      width: 100%;
      display: block;
      height: auto;
      font-size: 0.28rem;
      resize: none;
    }
  }
}
.itemContent {
  input,
  textarea {
    border: none;
    outline: none;
    background: none;
    width: 100%;
    padding: 0.2rem 0.3rem;
    box-sizing: border-box;
    background-color: rgba(249, 249, 249, 1);
    border: 0.01rem solid #ccc;
    width: 100%;
    display: block;
    height: auto;
    font-size: 0.28rem;
    resize: none;
  }
}
.itemMoney {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  font-size: 0.28rem;
  color: #000;
  input {
    outline: none;
    padding: 0.2rem 0.3rem;
    box-sizing: border-box;
    background-color: rgba(249, 249, 249, 1);
    border: 0.01rem solid #ccc;
    width: 45%;
    display: block;
    height: auto;
    font-size: 0.28rem;
    margin-right: 0.2rem;
  }
}
</style>
<style lang="less">
.projectReservePublishCon {
  .removeDisabled {
    .van-field__label {
      color: #646566 !important;
    }
    .van-field__control:disabled {
      color: rgb(50, 50, 51) !important;
      -webkit-text-fill-color: rgb(50, 50, 51) !important;
    }
    .van-cell__value {
      color: rgb(50, 50, 51) !important;
    }
  }
  .fieldOld {
    .van-cell__title {
      font-size: 0.35rem;
    }
    .van-cell__value {
      font-size: 0.35rem;
    }
  }
  .cellOld {
    .van-cell__title {
      font-size: 0.35rem;
    }
    .van-cell__value {
      font-size: 0.35rem;
    }
  }
}
</style>
