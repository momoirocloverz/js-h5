<template>
  <div class="projectReserve1PublishCon">
    <van-form @failed="onFailed" @submit="onSubmit">
      <div class="topCon">
        <div class="listCon marBottom30">
          <template v-for="(item, index) in state.formData.facility_list" :key="index">
            <div class="marBottom30 itemCon">
              <div class="itemTitle marBottom30" :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">
                <div class="homeTag">
                  <div class="tagLine"></div>
                  <div class="tagText">项目购置设备设施清单{{ index + 1 }}:</div>
                </div>
                <div class="endBtn">
                  <van-button class="littleBtn" v-if="Route.query.justForShow != 1" :class="state.ZLBFitForOld ? 'littleBtnOld' : ''" round block type="primary" @click="deleteCurrent(index)"
                    >删除</van-button
                  >
                </div>
              </div>
              <van-field
                required
                @input="fieldChange"
                input-align="right"
                :disabled="Route.query.justForShow == 1"
                v-model="state.formData.facility_list[index].name"
                name="name"
                placeholder="请输入设备名称"
                class="removeDisabled"
                :class="state.ZLBFitForOld ? 'fieldOld' : ''"
                :rules="state.validator.name"
                label="设备名称"
              />
              <van-field
                required
                @input="fieldChange"
                input-align="right"
                :disabled="Route.query.justForShow == 1"
                v-model="state.formData.facility_list[index].number"
                @change="(e) => NumberChange(e, index)"
                type="number"
                name="number"
                placeholder="请输入设备数量"
                class="removeDisabled"
                :class="state.ZLBFitForOld ? 'fieldOld' : ''"
                :rules="state.validator.number"
                label="数量"
              />
              <van-field
                required
                @input="fieldChange"
                input-align="right"
                v-model="state.formData.facility_list[index].money"
                name="money"
                :disabled="Route.query.justForShow == 1"
                @change="(e) => moneyChange(e, index)"
                placeholder="请输入设备单价"
                class="removeDisabled"
                :rules="state.validator.money"
                :class="state.ZLBFitForOld ? 'fieldOld' : ''"
                label="单价（万元）"
              />
            </div>
          </template>
        </div>

        <div class="addbtnCon" v-if="Route.query.justForShow != 1">
          <div class="addbtnCenter" @click="addMore">
            <img src="https://img.hzanchu.com/acimg/0ef025121076713f8ae14f333b521f70.png" />
            <div class="describe" :class="state.ZLBFitForOld ? 'describeOld' : ''">新增项目购置设备设施清单表单</div>
          </div>
        </div>
      </div>
      <div class="fixBottom fixPaddingBottom" v-if="Route.query.justForShow != 1">
        <van-button class="saveBtn" block @click="saveAction" :class="state.ZLBFitForOld ? 'btnTextOld' : ''">保存</van-button>
        <van-button class="submitBtn" block type="primary" native-type="submit" :class="state.ZLBFitForOld ? 'btnTextOld' : ''">完成</van-button>
      </div>
    </van-form>

    <div class="totalCon">
      <div class="homeTag">
        <div class="tagLine"></div>
        <div class="tagText">合计</div>
      </div>
      <div class="totalNumber">{{ calcFunction(state.formData.facility_list) }}万元</div>
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
        name: [{ required: true, trigger: 'onBlur', message: '请输入' }],
        money: [{ required: true, trigger: 'onBlur', message: '请输入' }],
        number: [
          {
            required: true,
            trigger: 'onBlur',
            pattern: /^[1-9]\d*$/,
            message: '请输入正整数'
          }
        ]
      },
      formData: {
        facility_list: []
      }
    })
    const layer1 = (res) => {
      state.detail = res.data
      let shorter = res.data
      if (shorter && shorter.list && shorter.list.facility_list) {
        state.formData.facility_list = shorter.list.facility_list
      }
    }
    const fetchList = () => {
      if (Route.query.project_id) {
        Request.fetchProjectFacilityDetail({
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
    const checkDetail = (item) => {
      Router.push({
        name: item.name
      })
    }
    const onFailed = (err) => {
      console.log(err)
    }
    onBeforeRouteLeave((to, from) => {
      if (state.contentChanged) {
        const answer = window.confirm('您的项目信息未进行保存，是否确定离开？')
        if (answer) {
        } else {
          return false
        }
      }
    })
    const finalParams = (flag) => {
      let requestData = {
        facility_list: state.formData.facility_list && state.formData.facility_list.length ? JSON.stringify(state.formData.facility_list) : '',
        policy_document_id: Route.query.policy_document_id,
        project_id: Route.query.project_id,
        save_type: flag ? 'submit' : 'save'
      }

      Request.actionProjectFacilityList(requestData)
        .then((res) => {
          if (res && res.code == 0) {
            state.contentChanged = false
            Toast('提交成功')
            if (flag) {
              Router.go(-1)
            }
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    const onSubmit = (params) => {
      if (state.formData.facility_list && state.formData.facility_list.length) {
        let moneyValidate = state.formData.facility_list.every((ele) => {
          return +ele.money
        })
        if (moneyValidate) {
          finalParams('flag')
          console.log('ok')
        } else {
          Toast('金额不能为0')
        }
      }
    }
    const saveAction = () => {
      finalParams()
    }
    const onChange = () => {}
    const addMore = () => {
      state.formData.facility_list.push({
        money: ''
      })
      fieldChange()
    }
    const deleteCurrent = (index) => {
      state.formData.facility_list.splice(index, 1)
      fieldChange()
    }
    const moneyChange = (e, index) => {
      //   let after = e.target.value.toString().match(/^\d*(\.?\d{0,2})/g)[0] || null
      let bridge = e.target.value
      if (isNaN(+bridge)) {
        state.formData.facility_list[index].money = 0
      } else {
        let after = (+bridge).toFixed(2)
        state.formData.facility_list[index].money = +after
      }
    }
    const NumberChange = (e, index) => {
      let bridge = e.target.value
      if (isNaN(+bridge)) {
        state.formData.facility_list[index].number = 0
      } else {
        let after = (+bridge).toFixed(0)
        state.formData.facility_list[index].number = +after
      }
    }
    const moneyFormat = (value) => {
      if (value || value == 0) {
        if (value === 0) {
          return 0
        } else {
          let fix = (Math.round(+value + 'e' + 2) / Math.pow(10, 2)).toFixed(2)
          return fix
        }
      }
    }
    const calcFunction = (array) => {
      let temp = array.map((ele) => {
        if (!ele.money || !ele.number) {
          return {
            ...ele,
            money: ele.money ? ele.money : 0,
            number: ele.number ? ele.number : 0
          }
        } else {
          return {
            ...ele
          }
        }
      })
      let res = temp.reduce((acc, current) => {
        return acc + current.money * current.number
      }, 0)
      return moneyFormat(res)
    }
    const fieldChange = () => {
      state.contentChanged = true
    }
    return {
      fieldChange,
      Route,
      state,
      addMore,
      deleteCurrent,
      checkDetail,
      moneyChange,
      onFailed,
      onSubmit,
      onChange,
      dayjs,
      saveAction,
      NumberChange,
      calcFunction
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
  font-size: 0.3rem;
  line-height: 0.45rem;
  height: 0.4rem;
  color: #333;
}
.homeTag {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  box-sizing: border-box;
}
.timeCon {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  box-sizing: border-box;
  font-size: 0.24rem;
  color: #666;
}
.contentCon {
  margin-top: 0.4rem;
  font-size: 0.28rem;
  font-weight: 500;
  line-height: 0.36rem;
  color: #333;
}
.marBottom20 {
  margin-bottom: 0.2rem;
}
.projectReserve1PublishCon {
  box-sizing: border-box;
  padding: 0.3rem;
  padding-bottom: 1rem;

  .headTitle {
    font-size: 0.34rem;
    font-weight: bold;
    color: #000;
    margin-bottom: 0.3rem;
  }

  .topCon {
    margin-bottom: 0.3rem;
  }
  .masterInner {
    box-sizing: border-box;
    padding: 0.3rem;
    border-radius: 0.15rem;
    background-color: #fff;
  }
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
.summary {
  font-size: 0.32rem;
  font-weight: bold;
  color: #1b82ec;
}
.summaryOld {
  font-size: 0.35rem;
}
.marBottom30 {
  margin-bottom: 0.3rem;
}
.itemCon {
  padding: 0.3rem;
  box-sizing: border-box;
  background-color: #fff;
  .itemMoney {
    font-size: 0.28rem;
    font-weight: 500;
    color: #666;
    text-align: right;
  }
  .moneyCon {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    align-content: center;
  }
  .itemMoneyCon {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
  }
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
.commonUnit {
  font-size: 0.28rem;
  font-weight: 500;
  color: #666;
}
.commonUnitOld {
  font-size: 0.35rem;
}
.fakeRequired {
  &:before {
    margin-right: 2px;
    color: rgb(238, 10, 36);
    content: '*';
  }
}

.endBtn {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  align-content: center;
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
    width: 33%;
    color: rgb(25, 137, 250);
    border: 1px solid rgb(25, 137, 250);
  }
  .submitBtn {
    width: 67%;
  }
  .btnTextOld {
    font-size: 0.35rem;
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
.totalCon {
  border-radius: 0.16rem;
  background-color: #fff;
  padding: 0.3rem;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
}
.totalNumber {
  font-size: 0.34rem;
  font-weight: bold;
  color: #000;
  margin-left: 0.2rem;
}
.tagLine {
  width: 0.05rem;
  height: 0.3rem;
  margin-top: 0.07rem;
  background: #1b82ec;
  opacity: 1;
  border-radius: 0.03rem;
  margin-right: 0.06rem;
}
.tagText {
  font-size: 0.3rem;
  line-height: 0.45rem;
  color: #333;
}
.homeTag {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: center;
  box-sizing: border-box;
}
</style>
<style lang="less">
.projectReserve1PublishCon {
  .removeDisabled {
    .van-field__label {
      width: 2rem;
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
  .itemMoney {
    .van-field__control {
      text-align: right;
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
