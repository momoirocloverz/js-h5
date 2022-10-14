<template>
  <div class="projectReserveDetailCon">
    <div class="topCon marBottom30">
      <van-cell title="项目名称：" :class="state.ZLBFitForOld ? 'cellOld' : ''">
        <template #value>
          <span class="custom-title">{{ state.detail.project_name }}</span>
        </template>
      </van-cell>
      <van-cell title="项目类型：" :class="state.ZLBFitForOld ? 'cellOld' : ''">
        <template #value>
          <span class="custom-title">{{ state.typeMap[state.detail.project_type] }}</span>
        </template>
      </van-cell>
      <van-cell title="项目地点：" :class="state.ZLBFitForOld ? 'cellOld' : ''">
        <template #value>
          <span class="custom-title">{{ state.area_idsAddress }}</span>
        </template>
      </van-cell>
      <van-cell title="详细地址" :class="state.ZLBFitForOld ? 'cellOld' : ''" v-if="state.detail.area_detail">
        <template #value>
          <span class="custom-title">{{ state.detail.area_detail && state.detail.area_detail.replace(state.detail.area_detail.substr(2, 4), '****') }}</span>
        </template>
      </van-cell>
      <van-cell title="项目建设地点" :class="state.ZLBFitForOld ? 'cellOld' : ''" v-if="state.detail.project_build_area">
        <template #value>
          <span class="custom-title">{{ (state.detail.project_build_area && state.detail.project_build_area.replace(state.detail.project_build_area.substr(2, 8), '******')) || '-' }}</span>
        </template>
      </van-cell>

      <van-cell title="建设期限：" :class="state.ZLBFitForOld ? 'cellOld' : ''">
        <template #value>
          <span class="custom-title">{{ dayjs(state.detail.build_start_at).format('YYYY/MM/DD') }}-{{ dayjs(state.detail.build_end_at).format('YYYY/MM/DD') }}</span>
        </template>
      </van-cell>

      <van-cell title="申报单位：" :class="state.ZLBFitForOld ? 'cellOld' : ''">
        <template #value>
          <span class="custom-title">{{ state.detail.declare_unit }}</span>
        </template>
      </van-cell>

      <van-cell title="项目实施单位：" :class="state.ZLBFitForOld ? 'cellOld' : ''">
        <template #value>
          <span class="custom-title">{{ state.detail.project_ss_unit || '-' }}</span>
        </template>
      </van-cell>

      <van-cell title="负责人：" :class="state.ZLBFitForOld ? 'cellOld' : ''">
        <template #value>
          <span class="custom-title">{{ state.detail.unit_charge_name && state.detail.unit_charge_name.replace(state.detail.unit_charge_name.substr(0, 1), '*') }}</span>
        </template>
      </van-cell>

      <van-cell title="联系电话：" :class="state.ZLBFitForOld ? 'cellOld' : ''">
        <template #value>
          <span class="custom-title">{{ state.detail.unit_charge_mobile && state.detail.unit_charge_mobile.replace(state.detail.unit_charge_mobile.substr(3, 4), '****') }}</span>
        </template>
      </van-cell>

      <van-cell title="申报日期：" :class="state.ZLBFitForOld ? 'cellOld' : ''">
        <template #value>
          <span class="custom-title">{{ dayjs(state.detail.declare_at).format('YYYY-MM-DD') }}</span>
        </template>
      </van-cell>
    </div>
    <div class="listCon marBottom30">
      <template v-for="(item, index) in state.detail.build_contents" :key="index">
        <div class="marBottom30 itemCon">
          <div class="itemTitle marBottom30" :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">项目建设内容{{ index + 1 }}:</div>
          <div class="itemContent marBottom30" :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">
            {{ item.content }}
          </div>
          <!-- <div class="itemMoneyCon">
            <div class="itemTitle" :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">投资额{{ index + 1 }}：</div>
            <div>
              <span class="itemMoney" :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">{{ item.invest_money }}</span
              ><span class="commonUnit" :class="state.ZLBFitForOld ? 'commonUnitOld' : ''"> 万元</span>
            </div>
          </div> -->
        </div>
      </template>
    </div>

    <!-- <div class="">
      <van-cell title="合计:" :class="state.ZLBFitForOld ? 'cellOld' : ''">
        <template #value>
          <span class="summary" :class="state.ZLBFitForOld ? 'summaryOld' : ''">{{
            state.detail.all_invest_money
          }}</span
          ><span class="commonUnit" :class="state.ZLBFitForOld ? 'commonUnitOld' : ''"> 万元</span>
        </template>
      </van-cell>
    </div> -->

    <div class="marBottom30 itemCon">
      <div class="itemTitle marBottom30" :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">新生产能力和效益分析:</div>
      <div class="itemContent marBottom30" :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">
        {{ state.detail.product_benefit }}
      </div>
    </div>

    <div class="marBottom30 itemCon">
      <div class="itemTitle marBottom30" :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">土地性质或来源:</div>
      <div class="itemContent marBottom30" :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">
        {{ state.detail.land_nature_source }}
      </div>
    </div>
    <div class="listCon marBottom30">
      <template v-for="(item, index) in state.formData.firstTable" :key="index">
        <div class="marBottom30 itemCon">
          <div class="itemTitle marBottom30" :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">
            <div class="homeTag">
              <div class="tagLine"></div>
              <div class="tagText">基础设施建设{{ index + 1 }}:</div>
            </div>
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">分项名称</div>
            <input v-model.trim="state.formData.firstTable[index].name" maxlength="100" disabled placeholder="请输入分项名称" />
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">规格（型号）</div>
            <input v-model.trim="state.formData.firstTable[index].spec" disabled placeholder="请输入建设地点" />
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">规模（数量）</div>
            <input v-model.trim="state.formData.firstTable[index].scale" maxlength="10" disabled placeholder="10字以内" />
          </div>

          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">投资金额（万元）</div>
            <input v-model.trim="state.formData.firstTable[index].invest_money" disabled placeholder="请输入投资金额" />
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">其中财政补助（万元）</div>
            <input v-model.trim="state.formData.firstTable[index].subsidy_money" disabled placeholder="请输入其中财政补助" />
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">进度安排</div>
            <div class="date-range-wrapper">
              <div class="fakeInput">
                {{ state.formData.firstTable[index].schedule_start_at ? state.formData.firstTable[index].schedule_start_at : '-' }}
              </div>
              <span>至</span>
              <div class="fakeInput">
                {{ state.formData.firstTable[index].schedule_end_at ? state.formData.firstTable[index].schedule_end_at : '-' }}
              </div>
            </div>
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">资金来源</div>
            <input v-model.trim="state.formData.firstTable[index].fund_source" disabled placeholder="资金来源" />
          </div>
        </div>
      </template>
    </div>

    <div class="listCon marBottom30">
      <template v-for="(item, index) in state.formData.secondTable" :key="index">
        <div class="marBottom30 itemCon">
          <div class="itemTitle marBottom30" :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">
            <div class="homeTag">
              <div class="tagLine"></div>
              <div class="tagText">机械设备{{ index + 1 }}:</div>
            </div>
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">分项名称</div>
            <input v-model.trim="state.formData.secondTable[index].name" maxlength="100" disabled placeholder="请输入分项名称" />
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">规格（型号）</div>
            <input v-model.trim="state.formData.secondTable[index].spec" disabled placeholder="请输入建设地点" />
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">规模（数量）</div>
            <input v-model.trim="state.formData.secondTable[index].scale" maxlength="10" disabled placeholder="10字以内" />
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">投资金额（万元）</div>
            <input v-model.trim="state.formData.secondTable[index].invest_money" disabled placeholder="请输入投资金额" />
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">其中财政补助（万元）</div>
            <input v-model.trim="state.formData.secondTable[index].subsidy_money" disabled placeholder="请输入其中财政补助" />
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">进度安排</div>
            <div class="date-range-wrapper">
              <div class="fakeInput">
                {{ state.formData.secondTable[index].schedule_start_at ? state.formData.secondTable[index].schedule_start_at : '-' }}
              </div>
              <span>至</span>
              <div class="fakeInput">
                {{ state.formData.secondTable[index].schedule_end_at ? state.formData.secondTable[index].schedule_end_at : '-' }}
              </div>
            </div>
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">资金来源</div>
            <input v-model.trim="state.formData.secondTable[index].fund_source" disabled placeholder="资金来源" />
          </div>
        </div>
      </template>
    </div>

    <div class="listCon marBottom30">
      <template v-for="(item, index) in state.formData.thirdTable" :key="index">
        <div class="marBottom30 itemCon">
          <div class="itemTitle marBottom30" :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">
            <div class="homeTag">
              <div class="tagLine"></div>
              <div class="tagText">技术引进推广{{ index + 1 }}:</div>
            </div>
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">分项名称</div>
            <input v-model.trim="state.formData.thirdTable[index].name" maxlength="100" disabled placeholder="请输入分项名称" />
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">规格（型号）</div>
            <input v-model.trim="state.formData.thirdTable[index].spec" disabled placeholder="请输入建设地点" />
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">规模（数量）</div>
            <input v-model.trim="state.formData.thirdTable[index].scale" maxlength="10" disabled placeholder="10字以内" />
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">投资金额（万元）</div>
            <input v-model.trim="state.formData.thirdTable[index].invest_money" disabled placeholder="请输入投资金额" />
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">其中财政补助（万元）</div>
            <input v-model.trim="state.formData.thirdTable[index].subsidy_money" disabled placeholder="请输入其中财政补助" />
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">进度安排</div>
            <div class="date-range-wrapper">
              <div class="fakeInput">
                {{ state.formData.thirdTable[index].schedule_start_at ? state.formData.thirdTable[index].schedule_start_at : '-' }}
              </div>
              <span>至</span>
              <div class="fakeInput">
                {{ state.formData.thirdTable[index].schedule_end_at ? state.formData.thirdTable[index].schedule_end_at : '-' }}
              </div>
            </div>
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">资金来源</div>
            <input v-model.trim="state.formData.thirdTable[index].fund_source" disabled placeholder="资金来源" />
          </div>
        </div>
      </template>
    </div>

    <div class="listCon marBottom30">
      <template v-for="(item, index) in state.formData.fourthTable" :key="index">
        <div class="marBottom30 itemCon">
          <div class="itemTitle marBottom30" :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">
            <div class="homeTag">
              <div class="tagLine"></div>
              <div class="tagText">其他{{ index + 1 }}:</div>
            </div>
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">分项名称</div>
            <input v-model.trim="state.formData.fourthTable[index].name" maxlength="100" disabled placeholder="请输入分项名称" />
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">规格（型号）</div>
            <input v-model.trim="state.formData.fourthTable[index].spec" disabled placeholder="请输入建设地点" />
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">规模（数量）</div>
            <input v-model.trim="state.formData.fourthTable[index].scale" maxlength="10" disabled placeholder="10字以内" />
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">投资金额（万元）</div>
            <input v-model.trim="state.formData.fourthTable[index].invest_money" disabled placeholder="请输入投资金额" />
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">其中财政补助（万元）</div>
            <input v-model.trim="state.formData.fourthTable[index].subsidy_money" disabled placeholder="请输入其中财政补助" />
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">进度安排</div>
            <div class="date-range-wrapper">
              <div class="fakeInput">
                {{ state.formData.fourthTable[index].schedule_start_at ? state.formData.fourthTable[index].schedule_start_at : '-' }}
              </div>
              <span>至</span>
              <div class="fakeInput">
                {{ state.formData.fourthTable[index].schedule_end_at ? state.formData.fourthTable[index].schedule_end_at : '-' }}
              </div>
            </div>
          </div>
          <div class="itemContent marBottom30">
            <div class="inputMatchTitle marBottom20">资金来源</div>
            <input v-model.trim="state.formData.fourthTable[index].fund_source" disabled placeholder="资金来源" />
          </div>
        </div>
      </template>
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

    <van-cell title="省级补助资金" :class="state.ZLBFitForOld ? 'cellOld' : ''" v-if="state.detail.province_amount">
      <template #value>
        <span class="custom-title">{{ state.detail.province_amount }}万元</span>
      </template>
    </van-cell>

    <van-cell title="地方财政资金整合" :class="state.ZLBFitForOld ? 'cellOld' : ''" v-if="state.detail.place_amount">
      <template #value>
        <span class="custom-title">{{ state.detail.place_amount }}万元</span>
      </template>
    </van-cell>

    <van-cell title="自筹资金" :class="state.ZLBFitForOld ? 'cellOld' : ''" v-if="state.detail.self_amount">
      <template #value>
        <span class="custom-title">{{ state.detail.self_amount }}万元</span>
      </template>
    </van-cell>

    <div class="itemCon approval-result">
      <div class="title">审核结果</div>
      <div class="result-content">
        <div class="item">
          <div class="item-title">状态：</div>
          <div class="value">
            {{ state.detail.status == 1 ? '审核中' : state.detail.status == 2 ? '已通过' : '未通过' }}
          </div>
        </div>
        <div class="item" v-if="state.detail.status != 1">
          <div class="item-title">意见：</div>
          <div class="value">{{ state.detail.audit_reason || '-' }}</div>
        </div>
        <div class="item" v-if="state.detail.status != 1">
          <div class="item-title">联系方式：</div>
          <div class="value">{{ state.detail.link_mobile || '-' }}</div>
        </div>
        <div class="item" v-if="state.detail.status != 1">
          <div class="item-title">附件：</div>
          <div class="value" style="color: #1b82ec" @click="showImages">查看附件</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ImagePreview, Toast } from 'vant'
import dayjs from 'dayjs'
import { isZLB } from '@/util/index'
import Request from '@/service/request'
export default defineComponent({
  setup(props, { emit }) {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      ZLBFLAG: isZLB(),
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
      detail: {},
      area_ids: [],
      area_idsAddress: '',
      areaList: [],
      typeMap: {
        1: '种植业',
        2: '养殖业',
        3: '加工业',
        4: '乡村建设',
        9: '其他'
      },
      formData: {
        firstTable: [],
        secondTable: [],
        thirdTable: [],
        fourthTable: []
      },
      invest_moneyTotal: 0,
      subsidy_moneyTotal: 0
    })

    const fetchList = () => {
      if (Route.query.id) {
        if (state.ZLBFLAG) {
          Request.projectReserveDetailMGOP({ id: Route.query.id }).then((res) => {
            if (res && res.data && res.data.code == 0) {
              state.detail = res.data.data.info
              let shorter = res.data.data.info
              console.log('asdj', shorter)
              mixAnalyse(shorter)
              Request.getAreaListMGOP({})
                .then((res) => {
                  if (res && res.data && res.data.code == 0) {
                    state.areaList = res.data.data.list
                    let track1 = state.areaList[0].children.find((ele) => {
                      return ele.id == shorter.town_id
                    })
                    if (track1) {
                      let track2 = track1.children.find((ele) => {
                        return ele.id == shorter.village_id
                      })
                      state.area_ids = [state.areaList[0].name, track1.name, track2.name]
                      const tempAddress = state.area_ids.join('')
                      state.area_idsAddress = tempAddress.replace(tempAddress.substr(2, 4), '****')
                    }
                  }
                })
                .catch((err) => {
                  console.log('err', err)
                })
            } else {
              Toast(res.msg)
            }
          })
        } else {
          Request.projectReserveDetail({ id: Route.query.id }).then((res) => {
            if (res && res.code == 0) {
              state.detail = res.data.info
              let shorter = res.data.info
              console.log('asdj', shorter)
              mixAnalyse(shorter)
              Request.getAreaList({})
                .then((res) => {
                  if (res && res.code == 0) {
                    state.areaList = res.data.list
                    let track1 = state.areaList[0].children.find((ele) => {
                      return ele.id == shorter.town_id
                    })
                    if (track1) {
                      let track2 = track1.children.find((ele) => {
                        return ele.id == shorter.village_id
                      })
                      state.area_ids = [state.areaList[0].name, track1.name, track2.name]
                      const tempAddress = state.area_ids.join('')
                      state.area_idsAddress = tempAddress.replace(tempAddress.substr(2, 4), '****')
                    }
                  }
                })
                .catch((err) => {
                  console.log('err', err)
                })
            } else {
              Toast(res.msg)
            }
          })
        }
      }
    }
    const mixAnalyse = (shorter) => {
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
    const calcFunction = (array) => {
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
    // 展示附件图片
    const showImages = () => {
      let data = state.detail.audit_attachment
      try {
        let imgs = data
        if (typeof data == 'string') {
          imgs = JSON.parse(data)
        }

        if (imgs) {
          if (!imgs.length) {
            return Toast('审核人尚未添加附件')
          }
          ImagePreview({ images: imgs, closeable: true })
        } else {
          return Toast('审核人尚未添加附件')
        }
      } catch (error) {
        console.log(error)
        Toast('附件文件异常')
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
    onMounted(() => {
      fetchList()
    })
    return {
      state,
      dayjs,
      calcFunction,
      showImages,
      moneyFormat
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
.marBottom30 {
  margin-bottom: 0.3rem;
}
.summary {
  font-size: 0.32rem;
  font-weight: bold;
  color: #1b82ec;
}
.summaryOld {
  font-size: 0.35rem;
}
.itemCon {
  padding: 0.3rem;
  box-sizing: border-box;
  background-color: #fff;
  .itemMoney {
    font-size: 0.28rem;
    font-weight: 500;
    color: #666666;
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
  }
  .itemContent {
    font-size: 0.28rem;
    color: #666;
    line-height: 0.4rem;
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
  .itemTitleOld {
    font-size: 0.35rem;
  }
}
.topCon {
}
.commonUnit {
  font-size: 0.28rem;
  font-weight: 500;
  color: #666;
}
.commonUnitOld {
  font-size: 0.35rem;
}
.projectReserveDetailCon {
  box-sizing: border-box;
  padding: 0.3rem;
}

.approval-result {
  margin-top: 0.3rem;
  .title {
    font-size: 0.3rem;
    font-weight: bold;
  }

  .result-content {
    padding: 0.3rem 0 0;
    .item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 0.3rem;
      &:last-child {
        margin-bottom: 0;
      }
      .item-title {
        color: var(--van-text-color);
        font-size: 0.28rem;
        min-width: 1.5rem;
      }
      .value {
        flex: 1;
        color: var(--van-text-color);
        font-size: 0.28rem;
      }
    }
  }
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
.marBottom20 {
  margin-bottom: 20px;
}
</style>
<style lang="less">
.projectReserveDetailCon {
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
