<template>
  <div class="projectReservePublishCon">
    <div class="headTitle">项目建设分项</div>
    <div class="listCon marBottom30">
      <template v-for="(item, index) in state.formData.firstTable" :key="index">
        <div class="marBottom30 itemCon">
          <div class="itemTitle marBottom30" :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">
            <div class="homeTag">
              <div class="tagLine"></div>
              <div class="tagText">基础设施建设{{ index + 1 }}:</div>
            </div>
            <div class="endBtn">
              <van-button v-if="Route.query.justForShow != 1" class="littleBtn" :class="state.ZLBFitForOld ? 'littleBtnOld' : ''" round block type="primary" @click="deleteCurrent(index)"
                >删除</van-button
              >
            </div>
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">分项名称</div>
            <input @input="fieldChange" v-model.trim="state.formData.firstTable[index].name" maxlength="100" :disabled="Route.query.justForShow == 1" placeholder="请输入分项名称" />
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">规格（型号）</div>
            <input v-model.trim="state.formData.firstTable[index].spec" maxlength="100" @input="fieldChange" :disabled="Route.query.justForShow == 1" placeholder="请输入规格（型号）" />
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">规模（数量）</div>
            <input v-model.trim="state.formData.firstTable[index].scale" maxlength="10" @input="fieldChange" :disabled="Route.query.justForShow == 1" placeholder="10字以内" />
          </div>

          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">投资金额（万元）</div>
            <input
              v-model.trim="state.formData.firstTable[index].invest_money"
              maxlength="10"
              @input="fieldChange"
              :disabled="Route.query.justForShow == 1"
              placeholder="请输入投资金额"
              @change="(e) => moneyChange(e, 'firstTable', 'invest_money', index)"
            />
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">其中财政补助（万元）</div>
            <input
              v-model.trim="state.formData.firstTable[index].subsidy_money"
              maxlength="10"
              @input="fieldChange"
              :disabled="Route.query.justForShow == 1"
              placeholder="请输入其中财政补助"
              @change="(e) => moneyChange(e, 'firstTable', 'subsidy_money', index)"
            />
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">进度安排</div>
            <div class="date-range-wrapper">
              <div class="fakeInput" @click="openStartDatePicker('firstTable', index)">
                {{ state.formData.firstTable[index].schedule_start_at ? state.formData.firstTable[index].schedule_start_at : '请选择进度安排起始日期' }}
              </div>
              <span>至</span>
              <div class="fakeInput" @click="openEndDatePicker('firstTable', index)">
                {{ state.formData.firstTable[index].schedule_end_at ? state.formData.firstTable[index].schedule_end_at : '请选择进度安排结束日期' }}
              </div>
            </div>
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">资金来源</div>
            <input v-model.trim="state.formData.firstTable[index].fund_source" maxlength="100" @input="fieldChange" :disabled="Route.query.justForShow == 1" placeholder="请输入资金来源" />
          </div>
        </div>
      </template>
    </div>
    <div class="addbtnCon" v-if="Route.query.justForShow != 1">
      <div class="addbtnCenter" @click="addMore">
        <img src="https://img.hzanchu.com/acimg/0ef025121076713f8ae14f333b521f70.png" />
        <div class="describe" :class="state.ZLBFitForOld ? 'describeOld' : ''">新增基础设施建设表单</div>
      </div>
    </div>

    <div class="listCon marBottom30">
      <template v-for="(item, index) in state.formData.secondTable" :key="index">
        <div class="marBottom30 itemCon">
          <div class="itemTitle marBottom30" :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">
            <div class="homeTag">
              <div class="tagLine"></div>
              <div class="tagText">机械设备{{ index + 1 }}:</div>
            </div>
            <div class="endBtn">
              <van-button class="littleBtn" v-if="Route.query.justForShow != 1" :class="state.ZLBFitForOld ? 'littleBtnOld' : ''" round block type="primary" @click="deleteTwoCurrent(index)"
                >删除</van-button
              >
            </div>
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">分项名称</div>
            <input v-model.trim="state.formData.secondTable[index].name" maxlength="50" @input="fieldChange" :disabled="Route.query.justForShow == 1" placeholder="请输入分项名称" />
          </div>

          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">规格（型号）</div>
            <input v-model.trim="state.formData.secondTable[index].spec" maxlength="100" @input="fieldChange" :disabled="Route.query.justForShow == 1" placeholder="请输入规格（型号）" />
          </div>

          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">规模（数量）</div>
            <input v-model.trim="state.formData.secondTable[index].scale" maxlength="10" @input="fieldChange" :disabled="Route.query.justForShow == 1" placeholder="10字以内" />
          </div>

          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">投资金额（万元）</div>
            <input
              v-model.trim="state.formData.secondTable[index].invest_money"
              :disabled="Route.query.justForShow == 1"
              @change="(e) => moneyChange(e, 'secondTable', 'invest_money', index)"
              @input="fieldChange"
              maxlength="10"
              placeholder="请输入投资金额"
            />
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">其中财政补助（万元）</div>
            <input
              v-model.trim="state.formData.secondTable[index].subsidy_money"
              maxlength="10"
              @input="fieldChange"
              :disabled="Route.query.justForShow == 1"
              placeholder="请输入其中财政补助"
              @change="(e) => moneyChange(e, 'secondTable', 'subsidy_money', index)"
            />
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">进度安排</div>
            <div class="date-range-wrapper">
              <div class="fakeInput" @click="openStartDatePicker('secondTable', index)">
                {{ state.formData.secondTable[index].schedule_start_at ? state.formData.secondTable[index].schedule_start_at : '请选择进度安排起始日期' }}
              </div>
              <span>至</span>
              <div class="fakeInput" @click="openEndDatePicker('secondTable', index)">
                {{ state.formData.secondTable[index].schedule_end_at ? state.formData.secondTable[index].schedule_end_at : '请选择进度安排结束日期' }}
              </div>
            </div>
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">资金来源</div>
            <input v-model.trim="state.formData.secondTable[index].fund_source" maxlength="100" @input="fieldChange" :disabled="Route.query.justForShow == 1" placeholder="请输入资金来源" />
          </div>
        </div>
      </template>
    </div>

    <div class="addbtnCon" v-if="Route.query.justForShow != 1">
      <div class="addbtnCenter" @click="addTwoMore">
        <img src="https://img.hzanchu.com/acimg/0ef025121076713f8ae14f333b521f70.png" />
        <div class="describe" :class="state.ZLBFitForOld ? 'describeOld' : ''">新增机械设备表单</div>
      </div>
    </div>

    <div class="listCon marBottom30">
      <template v-for="(item, index) in state.formData.thirdTable" :key="index">
        <div class="marBottom30 itemCon">
          <div class="itemTitle marBottom30" :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">
            <div class="homeTag">
              <div class="tagLine"></div>
              <div class="tagText">技术引进推广{{ index + 1 }}:</div>
            </div>
            <div class="endBtn">
              <van-button class="littleBtn" v-if="Route.query.justForShow != 1" :class="state.ZLBFitForOld ? 'littleBtnOld' : ''" round block type="primary" @click="deleteThreeCurrent(index)"
                >删除</van-button
              >
            </div>
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">分项名称</div>
            <input v-model.trim="state.formData.thirdTable[index].name" maxlength="50" @input="fieldChange" placeholder="请输入分项名称" :disabled="Route.query.justForShow == 1" />
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">规格（型号）</div>
            <input v-model.trim="state.formData.thirdTable[index].spec" maxlength="100" @input="fieldChange" placeholder="请输入规模（数量）" :disabled="Route.query.justForShow == 1" />
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">规模（数量）</div>
            <input v-model.trim="state.formData.thirdTable[index].scale" maxlength="10" @input="fieldChange" placeholder="10字以内" :disabled="Route.query.justForShow == 1" />
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">投资金额（万元）</div>
            <input
              v-model.trim="state.formData.thirdTable[index].invest_money"
              maxlength="10"
              @input="fieldChange"
              placeholder="请输入投资金额"
              :disabled="Route.query.justForShow == 1"
              @change="(e) => moneyChange(e, 'thirdTable', 'invest_money', index)"
            />
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">其中财政补助（万元）</div>
            <input
              v-model.trim="state.formData.thirdTable[index].subsidy_money"
              maxlength="10"
              @input="fieldChange"
              placeholder="请输入其中财政补助"
              :disabled="Route.query.justForShow == 1"
              @change="(e) => moneyChange(e, 'thirdTable', 'subsidy_money', index)"
            />
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">进度安排</div>
            <div class="date-range-wrapper">
              <div class="fakeInput" @click="openStartDatePicker('thirdTable', index)">
                {{ state.formData.thirdTable[index].schedule_start_at ? state.formData.thirdTable[index].schedule_start_at : '请选择进度安排起始日期' }}
              </div>
              <span>至</span>
              <div class="fakeInput" @click="openEndDatePicker('thirdTable', index)">
                {{ state.formData.thirdTable[index].schedule_end_at ? state.formData.thirdTable[index].schedule_end_at : '请选择进度安排结束日期' }}
              </div>
            </div>
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">资金来源</div>
            <input v-model.trim="state.formData.thirdTable[index].fund_source" maxlength="100" @input="fieldChange" placeholder="请输入资金来源" :disabled="Route.query.justForShow == 1" />
          </div>
        </div>
      </template>
    </div>

    <div class="addbtnCon" v-if="Route.query.justForShow != 1">
      <div class="addbtnCenter" @click="addThreeMore">
        <img src="https://img.hzanchu.com/acimg/0ef025121076713f8ae14f333b521f70.png" />
        <div class="describe" :class="state.ZLBFitForOld ? 'describeOld' : ''">新增技术引进推广</div>
      </div>
    </div>

    <div class="listCon marBottom30">
      <template v-for="(item, index) in state.formData.fourthTable" :key="index">
        <div class="marBottom30 itemCon">
          <div class="itemTitle marBottom30" :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">
            <div class="homeTag">
              <div class="tagLine"></div>
              <div class="tagText">其他{{ index + 1 }}:</div>
            </div>
            <div class="endBtn">
              <van-button class="littleBtn" v-if="Route.query.justForShow != 1" :class="state.ZLBFitForOld ? 'littleBtnOld' : ''" round block type="primary" @click="deleteFourthCurrent(index)"
                >删除</van-button
              >
            </div>
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">分项名称</div>
            <input v-model.trim="state.formData.fourthTable[index].name" maxlength="50" @input="fieldChange" placeholder="请输入分项名称" :disabled="Route.query.justForShow == 1" />
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">规格（型号）</div>
            <input v-model.trim="state.formData.fourthTable[index].spec" maxlength="100" @input="fieldChange" placeholder="请输入规模（数量）" :disabled="Route.query.justForShow == 1" />
          </div>

          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">规模（数量）</div>
            <input v-model.trim="state.formData.fourthTable[index].scale" maxlength="10" @input="fieldChange" placeholder="10字以内" :disabled="Route.query.justForShow == 1" />
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">投资金额（万元）</div>
            <input
              v-model.trim="state.formData.fourthTable[index].invest_money"
              maxlength="10"
              @input="fieldChange"
              placeholder="请输入投资金额"
              :disabled="Route.query.justForShow == 1"
              @change="(e) => moneyChange(e, 'fourthTable', 'invest_money', index)"
            />
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">其中财政补助（万元）</div>
            <input
              v-model.trim="state.formData.fourthTable[index].subsidy_money"
              maxlength="10"
              @input="fieldChange"
              placeholder="请输入其中财政补助"
              :disabled="Route.query.justForShow == 1"
              @change="(e) => moneyChange(e, 'fourthTable', 'subsidy_money', index)"
            />
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">进度安排</div>
            <div class="date-range-wrapper">
              <div class="fakeInput" @click="openStartDatePicker('fourthTable', index)">
                {{ state.formData.fourthTable[index].schedule_start_at ? state.formData.fourthTable[index].schedule_start_at : '请选择进度安排起始日期' }}
              </div>
              <span>至</span>
              <div class="fakeInput" @click="openEndDatePicker('fourthTable', index)">
                {{ state.formData.fourthTable[index].schedule_end_at ? state.formData.fourthTable[index].schedule_end_at : '请选择进度安排结束日期' }}
              </div>
            </div>
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">资金来源</div>
            <input v-model.trim="state.formData.fourthTable[index].fund_source" maxlength="100" @input="fieldChange" placeholder="请输入建设单位" :disabled="Route.query.justForShow == 1" />
          </div>
        </div>
      </template>
    </div>
    <div class="addbtnCon" v-if="Route.query.justForShow != 1">
      <div class="addbtnCenter" @click="addFourthMore">
        <img src="https://img.hzanchu.com/acimg/0ef025121076713f8ae14f333b521f70.png" />
        <div class="describe" :class="state.ZLBFitForOld ? 'describeOld' : ''">新增其他项目表单</div>
      </div>
    </div>
    <div class="totalCon">
      <div class="homeTag totalConSumtitle marBottom30">
        <div class="tagLine"></div>
        <div class="tagText">合计：</div>
      </div>
      <div class="totalConItemCon marBottom20">
        <div class="totalContitle">投资金额：</div>
        <div class="totalConMoney">{{ moneyFormat(state.invest_moneyTotal) }}万元</div>
      </div>
      <div class="totalConItemCon">
        <div class="totalContitle">其中财政补助：</div>
        <div class="totalConMoney">{{ moneyFormat(state.subsidy_moneyTotal) }}万元</div>
      </div>
    </div>
    <div class="moneyArea">
      <div class="moneyATitle">资金来源说明</div>
      <div class="moneyArItem itemContent marBottom30">
        <div class="moneyTitle fakeRequired marBottom20">省级补助资金（万元）</div>
        <input
          maxlength="10"
          @input="fieldChange"
          @change="(e) => moneyThreeChange(e, 'province_amount')"
          v-model.trim="state.formData.province_amount"
          placeholder="请输入省级补助资金"
          :disabled="Route.query.justForShow == 1"
        />
      </div>
      <div class="moneyArItem itemContent marBottom30">
        <div class="moneyTitle marBottom20 fakeRequired">地方财政资金整合（万元）</div>
        <input
          maxlength="10"
          @input="fieldChange"
          @change="(e) => moneyThreeChange(e, 'place_amount')"
          v-model.trim="state.formData.place_amount"
          placeholder="请输入地方财政资金整合"
          :disabled="Route.query.justForShow == 1"
        />
      </div>
      <div class="moneyArItem itemContent marBottom30">
        <div class="moneyTitle marBottom20 fakeRequired">自筹资金（万元）</div>
        <input
          maxlength="10"
          @input="fieldChange"
          @change="(e) => moneyThreeChange(e, 'self_amount')"
          v-model.trim="state.formData.self_amount"
          placeholder="请输入自筹资金"
          :disabled="Route.query.justForShow == 1"
        />
      </div>
    </div>
    <div class="fixPaddingBottom">
      <van-button v-if="Route.query.justForShow == 1" class="submitBtn" block @click="goBack" type="primary" :class="state.ZLBFitForOld ? 'btnTextOld' : ''">上一步</van-button>
      <div v-else>
        <!-- v-if="Route.query.status == 2" -->
        <div class="fixBottom fixPaddingBottom">
          <van-button class="submitBtn" block @click="goBack" type="primary" :class="state.ZLBFitForOld ? 'btnTextOld' : ''">上一步</van-button>
          <van-button class="saveBtn" block @click="saveAction" :class="state.ZLBFitForOld ? 'btnTextOld' : ''">保存</van-button>
          <van-button class="submitBtn" block type="primary" @click="finish" :class="state.ZLBFitForOld ? 'btnTextOld' : ''">提交</van-button>
        </div>
        <!-- <div class="fixBottom fixPaddingBottom" v-else>
          <van-button class="divideBtn" block @click="goBack" type="primary" :class="state.ZLBFitForOld ? 'btnTextOld' : ''">上一步</van-button>
          <van-button class="divideBtn" block type="primary" @click="finish" :class="state.ZLBFitForOld ? 'btnTextOld' : ''">完成</van-button>
        </div> -->
      </div>
    </div>

    <van-popup v-model:show="state.showStartDatePicker" round position="bottom"
      >.
      <van-datetime-picker
        v-model="state.select_start_date"
        type="date"
        title="选择进度起始日期"
        @cancel="state.showStartDatePicker = false"
        @confirm="confirmStartDate"
        :min-date="state.minDate"
        :max-date="state.maxDate"
      />
    </van-popup>

    <van-popup v-model:show="state.showEndDatePicker" round position="bottom"
      >.
      <van-datetime-picker
        v-model="state.select_end_date"
        type="date"
        title="选择进度结束日期"
        @cancel="state.showEndDatePicker = false"
        @confirm="confirmEndDate"
        :min-date="state.minDate"
        :max-date="state.maxDate"
      />
    </van-popup>

    <van-calendar :lazy-render="false" :min-date="state.minDate" :max-date="state.maxDate" v-model:show="state.calenderShow" type="range" @confirm="onCalenderConfirm" />
  </div>
</template>
<script>
import { defineComponent, onMounted, reactive, ref, watch } from 'vue'
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
      contentChanged: false,
      minDate: new Date('2018-01-01'),
      maxDate: new Date('2028-01-01'),
      select_start_date: new Date(),
      select_end_date: new Date(),
      showStartDatePicker: ref(false),
      showEndDatePicker: ref(false),
      calenderShow: false,
      calenderTag: '',
      calenderIndex: 0,
      show: false,
      detail: {},
      invest_moneyTotal: 0,
      subsidy_moneyTotal: 0,
      formData: {
        firstTable: [],
        secondTable: [],
        thirdTable: [],
        fourthTable: []
      }
    })
    const calcFunction = () => {
      let temp1 = state.formData.firstTable.map((ele) => {
        if (!ele.invest_money || !ele.subsidy_money) {
          return {
            ...ele,
            invest_money: ele.invest_money ? ele.invest_money : 0,
            subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0
          }
        } else {
          return {
            ...ele
          }
        }
      })
      let temp2 = state.formData.secondTable.map((ele) => {
        if (!ele.invest_money || !ele.subsidy_money) {
          return {
            ...ele,
            invest_money: ele.invest_money ? ele.invest_money : 0,
            subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0
          }
        } else {
          return {
            ...ele
          }
        }
      })
      let temp3 = state.formData.thirdTable.map((ele) => {
        if (!ele.invest_money || !ele.subsidy_money) {
          return {
            ...ele,
            invest_money: ele.invest_money ? ele.invest_money : 0,
            subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0
          }
        } else {
          return {
            ...ele
          }
        }
      })

      let temp4 = state.formData.fourthTable.map((ele) => {
        if (!ele.invest_money || !ele.subsidy_money) {
          return {
            ...ele,
            invest_money: ele.invest_money ? ele.invest_money : 0,
            subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0
          }
        } else {
          return {
            ...ele
          }
        }
      })

      let tempMaster = [...temp1, ...temp2, ...temp3, ...temp4]
      let res1 = tempMaster.reduce((acc, current) => {
        return +acc + +current.invest_money
      }, 0)
      let res2 = tempMaster.reduce((acc, current) => {
        return +acc + +current.subsidy_money
      }, 0)
      state.invest_moneyTotal = res1
      state.subsidy_moneyTotal = res2
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

    const layer1 = (res) => {
      state.detail = res.data.info
      let shorter = res.data.info
      state.formData = shorter
      if (shorter.part_options && shorter.part_options.length) {
        let after = shorter.part_options
        if (after) {
          console.log(after)
          let track1 = after.find((ele) => {
            return ele.option_name == '基础设施建设'
          }).list
          track1.forEach((ele) => {
            ele.schedule_start_at = dayjs(ele.schedule_start_at).format('YYYY/MM/DD')
            ele.schedule_end_at = dayjs(ele.schedule_end_at).format('YYYY/MM/DD')
            ele.schedule_at = `${dayjs(ele.schedule_start_at).format('YYYY-MM')}-${dayjs(ele.schedule_end_at).format('YYYY-MM')}`
          })
          let track2 = after.find((ele) => {
            return ele.option_name == '设施设备'
          }).list
          track2.forEach((ele) => {
            ele.schedule_start_at = dayjs(ele.schedule_start_at).format('YYYY/MM/DD')
            ele.schedule_end_at = dayjs(ele.schedule_end_at).format('YYYY/MM/DD')
            ele.schedule_at = `${dayjs(ele.schedule_start_at).format('YYYY-MM')}-${dayjs(ele.schedule_end_at).format('YYYY-MM')}`
          })
          let track3 = after.find((ele) => {
            return ele.option_name == '技术引进推广'
          }).list
          track3.forEach((ele) => {
            ele.schedule_start_at = dayjs(ele.schedule_start_at).format('YYYY/MM/DD')
            ele.schedule_end_at = dayjs(ele.schedule_end_at).format('YYYY/MM/DD')
            ele.schedule_at = `${dayjs(ele.schedule_start_at).format('YYYY-MM')}-${dayjs(ele.schedule_end_at).format('YYYY-MM')}`
          })

          let track4 = after.find((ele) => {
            return ele.option_name == '其他'
          }).list
          track4.forEach((ele) => {
            ele.schedule_start_at = dayjs(ele.schedule_start_at).format('YYYY/MM/DD')
            ele.schedule_end_at = dayjs(ele.schedule_end_at).format('YYYY/MM/DD')
            ele.schedule_at = `${dayjs(ele.schedule_start_at).format('YYYY-MM')}-${dayjs(ele.schedule_end_at).format('YYYY-MM')}`
          })
          state.formData.firstTable = track1
          state.formData.secondTable = track2
          state.formData.thirdTable = track3
          state.formData.fourthTable = track4
          calcFunction()
        }
      } else {
        state.formData.firstTable = []
        state.formData.secondTable = []
        state.formData.thirdTable = []
        state.formData.fourthTable = []
      }
    }
    const fetchList = () => {
      if (Route.query.id) {
        Request.projectReserveNewDetail({
          id: Route.query.id
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

    const finalParams = (flag) => {
      let array = state.formData.firstTable
      let array2 = state.formData.secondTable
      let array3 = state.formData.thirdTable
      let array4 = state.formData.fourthTable
      let clone1 = JSON.parse(JSON.stringify(array))
      let clone2 = JSON.parse(JSON.stringify(array2))
      let clone3 = JSON.parse(JSON.stringify(array3))
      let clone4 = JSON.parse(JSON.stringify(array4))
      clone1.forEach((ele) => {
        ele.schedule_start_at = dayjs(ele.schedule_start_at).format('YYYY-MM-DD ' + '00:00:00')
        ele.schedule_end_at = dayjs(ele.schedule_end_at).format('YYYY-MM-DD ' + '23:59:59')
        delete ele.schedule_at
      })
      clone2.forEach((ele) => {
        ele.schedule_start_at = dayjs(ele.schedule_start_at).format('YYYY-MM-DD ' + '00:00:00')
        ele.schedule_end_at = dayjs(ele.schedule_end_at).format('YYYY-MM-DD ' + '23:59:59')
        delete ele.schedule_at
      })
      clone3.forEach((ele) => {
        ele.schedule_start_at = dayjs(ele.schedule_start_at).format('YYYY-MM-DD ' + '00:00:00')
        ele.schedule_end_at = dayjs(ele.schedule_end_at).format('YYYY-MM-DD ' + '23:59:59')
        delete ele.schedule_at
      })
      clone4.forEach((ele) => {
        ele.schedule_start_at = dayjs(ele.schedule_start_at).format('YYYY-MM-DD ' + '00:00:00')
        ele.schedule_end_at = dayjs(ele.schedule_end_at).format('YYYY-MM-DD ' + '23:59:59')
        delete ele.schedule_at
      })
      console.log(clone1)
      console.log(clone2)
      console.log(clone3)
      console.log(clone4)
      let requestData = {
        project_name: state.formData.project_name,
        project_type: state.formData.project_type,
        city_id: state.formData.city_id,
        town_id: state.formData.town_id,
        village_id: state.formData.village_id,
        area_detail: state.formData.area_detail,
        unit_charge_name: state.formData.unit_charge_name,
        unit_charge_mobile: state.formData.unit_charge_mobile,
        build_contents: JSON.stringify(state.formData.build_contents),
        declare_unit: state.formData.declare_unit,
        project_build_area: state.formData.project_build_area,
        project_ss_unit: state.formData.project_ss_unit,
        product_benefit: state.formData.product_benefit,
        land_nature_source: state.formData.land_nature_source,
        province_amount: state.formData.province_amount,
        place_amount: state.formData.place_amount,
        self_amount: state.formData.self_amount,
        build_end_at: state.formData.build_end_at,
        build_start_at: state.formData.build_start_at,
        save_type: flag ? 'submit' : 'save',
        part_options: JSON.stringify([
          {
            option_name: '基础设施建设',
            option_mark: 'infrastructure_construction',
            list: clone1
          },
          {
            option_name: '设施设备',
            option_mark: 'mechanical_equipment',
            list: clone2
          },
          {
            option_name: '技术引进推广',
            option_mark: 'other',
            list: clone3
          },
          {
            option_name: '其他',
            option_mark: 'other',
            list: clone4
          }
        ])
      }
      if (+Route.query.id) {
        requestData.id = Route.query.id
      }
      Request.projectReserveAction(requestData)
        .then((res) => {
          if (res && res.code == 0) {
            Toast('保存成功')
            state.contentChanged = false
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

    const saveAction = () => {
      finalParams()
    }
    const addMore = () => {
      state.formData.firstTable.push({
        invest_money: ''
      })
      fieldChange()
    }
    const addTwoMore = () => {
      state.formData.secondTable.push({
        invest_money: ''
      })
      fieldChange()
    }
    const addThreeMore = () => {
      state.formData.thirdTable.push({
        invest_money: ''
      })
      fieldChange()
    }
    const addFourthMore = () => {
      state.formData.fourthTable.push({
        invest_money: ''
      })
      fieldChange()
    }
    const moneyChange = (e, table, item, index) => {
      let after = e.target.value.toString().match(/^\d*(\.?\d{0,2})/g)[0] || null
      state.formData[table][index][item] = +after
      calcFunction()
    }
    const moneyThreeChange = (e, item) => {
      let after = e.target.value.toString().match(/^\d*(\.?\d{0,2})/g)[0] || null
      state.formData[item] = +after
    }
    const deleteCurrent = (index) => {
      state.formData.firstTable.splice(index, 1)
      calcFunction()
      fieldChange()
    }
    const deleteTwoCurrent = (index) => {
      state.formData.secondTable.splice(index, 1)
      calcFunction()
      fieldChange()
    }
    const deleteThreeCurrent = (index) => {
      state.formData.thirdTable.splice(index, 1)
      calcFunction()
      fieldChange()
    }
    const deleteFourthCurrent = (index) => {
      state.formData.fourthTable.splice(index, 1)
      calcFunction()
      fieldChange()
    }

    const goBack = () => {
      Router.go(-1)
    }
    const finish = () => {
      finalParams('finish')
      //   let array = state.formData.firstTable
      //   let array2 = state.formData.secondTable
      //   let array3 = state.formData.thirdTable

      //   if (!array.length || !array2.length || !array3.length) {
      //     return Toast('请填写完整数据')
      //   }

      //   let empty1 = []
      //   if (array) {
      //     array.forEach((ele) => {
      //       Object.keys(ele).forEach((sub) => {
      //         empty1.push(ele[sub])
      //       })
      //     })
      //   }

      //   if (array2) {
      //     array2.forEach((ele) => {
      //       Object.keys(ele).forEach((sub) => {
      //         empty1.push(ele[sub])
      //       })
      //     })
      //   }
      //   if (array3) {
      //     array3.forEach((ele) => {
      //       Object.keys(ele).forEach((sub) => {
      //         empty1.push(ele[sub])
      //       })
      //     })
      //   }
      //   setTimeout(() => {
      //     let validateRes = empty1.every((ele) => {
      //       return ele
      //     })
      //     console.log('validateRes', validateRes)
      //     if (validateRes) {
      //       finalParams('finish')
      //     } else {
      //       return Toast('请填写完整数据')
      //     }
      //   }, 300)
    }
    const popCalender = (tag, index) => {
      if (Route.query.justForShow == 1) {
      } else {
        state.calenderTag = tag
        state.calenderIndex = index
        state.calenderShow = true
      }
    }
    const onCalenderConfirm = (values) => {
      const [start, end] = values
      state.calenderShow = false
      state.formData[state.calenderTag][state.calenderIndex].schedule_at = `${dayjs(start).format('YYYY-MM')}-${dayjs(end).format('YYYY-MM')}`
      state.formData[state.calenderTag][state.calenderIndex].schedule_start_at = dayjs(start).format('YYYY-MM-DD HH:mm:ss')
      state.formData[state.calenderTag][state.calenderIndex].schedule_end_at = dayjs(end).format('YYYY-MM-DD HH:mm:ss')
      fieldChange()
    }
    const fieldChange = () => {
      state.contentChanged = true
    }

    const openStartDatePicker = (tag, index) => {
      if (Route.query.justForShow == 1) {
      } else {
        state.calenderTag = tag
        state.calenderIndex = index
        const { formData } = state
        if (formData[tag][index].schedule_start_at) {
          state.select_start_date = dayjs(formData[tag][index].schedule_start_at).toDate()
        }
        state.showStartDatePicker = true
      }
    }
    const openEndDatePicker = (tag, index) => {
      if (Route.query.justForShow == 1) {
      } else {
        state.calenderTag = tag
        state.calenderIndex = index
        const { formData } = state
        if (formData[tag][index].schedule_end_at) {
          state.select_end_date = dayjs(formData[tag][index].schedule_end_at).toDate()
        }
        state.showEndDatePicker = true
      }
    }
    const confirmStartDate = (e) => {
      const { calenderTag, calenderIndex } = state
      state.formData[calenderTag][calenderIndex].schedule_start_at = dayjs(e).format('YYYY/MM/DD')
      state.showStartDatePicker = false
      fieldChange()
    }
    const confirmEndDate = (e) => {
      const { calenderTag, calenderIndex } = state
      state.formData[calenderTag][calenderIndex].schedule_end_at = dayjs(e).format('YYYY/MM/DD')
      state.showEndDatePicker = false
      fieldChange()
    }
    return {
      fieldChange,
      Route,
      calcFunction,
      onCalenderConfirm,
      popCalender,
      state,
      goBack,
      finish,
      dayjs,
      addMore,
      addTwoMore,
      moneyChange,
      deleteCurrent,
      saveAction,
      addThreeMore,
      deleteThreeCurrent,
      deleteTwoCurrent,
      openStartDatePicker,
      openEndDatePicker,
      confirmStartDate,
      confirmEndDate,
      moneyFormat,
      addFourthMore,
      deleteFourthCurrent,
      moneyThreeChange
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

.marBottom20 {
  margin-bottom: 0.2rem;
}
.projectReservePublishCon {
  box-sizing: border-box;
  padding: 0.3rem;
  padding-bottom: 1.3rem;
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
  .inputMatchTitle {
    font-size: 0.28rem;
    color: #000;
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
  .date-range-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .fakeInput {
      width: 45%;
      padding: 0.2rem 0.3rem;
      box-sizing: border-box;
      background-color: rgba(249, 249, 249, 1);
      border: 0.01rem solid #ccc;
      display: block;
      height: auto;
      font-size: 0.28rem;
    }
  }
}
.headTitle {
  font-size: 0.34rem;
  font-weight: bold;
  color: #000;
  margin-bottom: 0.3rem;
}

.totalCon {
  border-radius: 0.16rem;
  background-color: #fff;
  padding: 0.3rem;
  box-sizing: border-box;
  margin-bottom: 0.2rem;
}
.totalConItemCon {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
}
.totalConSumtitle {
  font-size: 0.3rem;
  color: #000;
}
.totalContitle {
  font-size: 0.28rem;
  color: #333;
}
.totalConMoney {
  font-size: 0.34rem;
  font-weight: bold;
  color: #333;
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
.moneyArea {
  background-color: #fff;
  padding: 0.3rem;
  border-radius: 0.16rem;
}
.moneyATitle {
  font-size: 0.34rem;
}
.moneyArItem {
  // .itemContent
}
.moneyTitle {
  font-size: 0.28rem;
  color: #666;
  line-height: 0.4rem;
  margin-top: 20px;
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
