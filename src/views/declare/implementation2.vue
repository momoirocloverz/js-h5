<template>
  <div class="projectReservePublishCon">
    <div class="topPart">
      <div class="item marBottom20">
        <p class="fakeRequired">土地性质或来源</p>
        <div class="inputBox">
          <textarea rows="7" @input="fieldChange" :disabled="Route.query.justForShow == 1" maxlength="30" placeholder="30字以内" v-model.trim="state.formData.land_info" />
        </div>
      </div>
      <div class="item marBottom20">
        <p class="fakeRequired">主要建设内容</p>
        <div class="inputBox">
          <textarea rows="7" @input="fieldChange" :disabled="Route.query.justForShow == 1" maxlength="200" placeholder="200字以内" v-model.trim="state.formData.build_main_content" />
        </div>
      </div>
    </div>

    <div class="fixPaddingBottom">
      <div v-if="Route.query.justForShow == 1" class="fixBottom fixPaddingBottom">
        <van-button class="divideBtn" block @click="goBack" type="primary" :class="state.ZLBFitForOld ? 'btnTextOld' : ''">上一步</van-button>

        <van-button class="divideBtn" block type="primary" @click="toNext" :class="state.ZLBFitForOld ? 'btnTextOld' : ''">下一步</van-button>
      </div>
      <div v-else>
        <div class="fixBottom fixPaddingBottom" v-if="Route.query.status == 2">
          <van-button class="submitBtn" block @click="goBack" type="primary" :class="state.ZLBFitForOld ? 'btnTextOld' : ''">上一步</van-button>
          <van-button class="saveBtn" block @click="saveAction" :class="state.ZLBFitForOld ? 'btnTextOld' : ''">保存</van-button>
          <van-button class="submitBtn" block type="primary" @click="toActionAndNext" :class="state.ZLBFitForOld ? 'btnTextOld' : ''">下一步</van-button>
        </div>
        <div class="fixBottom fixPaddingBottom" v-else>
          <van-button class="divideBtn" block @click="goBack" type="primary" :class="state.ZLBFitForOld ? 'btnTextOld' : ''">上一步</van-button>
          <van-button class="divideBtn" block type="primary" @click="toActionAndNext" :class="state.ZLBFitForOld ? 'btnTextOld' : ''">下一步</van-button>
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
      show: false,
      contentChanged: false,
      detail: {},
      formData: {
        land_info: '',
        build_main_content: ''
      }
    })
    const layer1 = (res) => {
      state.detail = res.data.info
      let shorter = res.data.info
      state.formData = shorter
    }
    const fetchList = () => {
      if (Route.query.project_id) {
        Request.fetchProjectImplementPlanDetail({
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
    const toActionAndNext = () => {
      if (!state.formData.land_info || !state.formData.build_main_content) {
        return Toast('请填写完整数据')
      } else {
        finalParams('flag')
      }
    }
    const finalParams = (flag) => {
      let requestData = {
        project_name: state.formData.project_name,
        area_detail: state.formData.area_detail,
        build_start_at: state.formData.build_start_at,
        build_end_at: state.formData.build_end_at,
        declare_unit: state.formData.declare_unit,
        unit_charge_name: state.formData.unit_charge_name ? state.formData.unit_charge_name : '',
        unit_charge_mobile: state.formData.unit_charge_mobile,
        part_options: state.formData.part_options,

        land_info: state.formData.land_info,
        build_main_content: state.formData.build_main_content,
        policy_document_id: Route.query.policy_document_id,
        project_id: Route.query.project_id,
        save_type: 'save'
      }

      if (+Route.query.project_reserve_id) {
        requestData.project_reserve_id = Route.query.project_reserve_id
      }

      Request.actionProjectImplementPlan(requestData)
        .then((res) => {
          if (res && res.code == 0) {
            Toast('保存成功')
            state.contentChanged = false
            if (flag) {
              toNext()
            }
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    const saveAction = () => {
      finalParams()
    }
    const goBack = () => {
      Router.go(-1)
    }
    const toNext = () => {
      Router.push({
        name: 'declareImplementationPlantThree',
        query: {
          project_id: Route.query.project_id,
          policy_document_id: Route.query.policy_document_id,
          justForShow: Route.query.justForShow,
          status: Route.query.status,
          mobile: Route.query.mobile,
          project_reserve_id: Route.query.project_reserve_id,
          is_declaration_reserve_change: Route.query.is_declaration_reserve_change
        }
      })
    }
    const fieldChange = () => {
      state.contentChanged = true
    }
    return {
      toActionAndNext,
      fieldChange,
      Route,
      state,
      checkDetail,
      goBack,
      toNext,
      dayjs,
      saveAction
    }
  }
})
</script>
<style scoped lang="less">
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
  .divideBtn {
    width: 50%;
  }
  .btnTextOld {
    font-size: 0.35rem;
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
