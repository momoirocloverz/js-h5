<template>
  <div class="BaseInfoCon">
    <div class="titleCon">
      <div class="title">项目基础信息</div>
    </div>
    <div class="listCon">
      <div class="before">修改前信息</div>
      <div class="listItem">
        <div class="leftTitle">项目名称：</div>
        <div class="rightCommonItem">{{ state.showNew ? state.globalDetail.project_baseinfo_backup_info.project_name : state.globalDetail.project_name }}</div>
      </div>
      <div class="listItem">
        <div class="leftTitle">建设单位：</div>
        <div class="rightCommonItem">{{ state.showNew ? state.globalDetail.project_baseinfo_backup_info.declare_unit : state.globalDetail.declare_unit }}</div>
      </div>
      <div class="listItem">
        <div class="leftTitle">负责人：</div>
        <div class="rightCommonItem">{{ state.showNew ? state.globalDetail.project_baseinfo_backup_info.unit_charge_name : state.globalDetail.unit_charge_name }}</div>
      </div>
      <div class="listItem">
        <div class="leftTitle">联系电话：</div>
        <div class="rightCommonItem">{{ state.showNew ? state.globalDetail.project_baseinfo_backup_info.unit_charge_mobile : state.globalDetail.unit_charge_mobile }}</div>
      </div>
      <div class="listItem">
        <div class="leftTitle">建设地点：</div>
        <div class="rightCommonItem">{{ state.globalDetail.area_ids && state.globalDetail.area_ids.join('') }}</div>
      </div>
      <div class="listItem">
        <div class="leftTitle">详细地址：</div>
        <div class="rightCommonItem">{{ state.showNew ? state.globalDetail.project_baseinfo_backup_info.area_detail : state.globalDetail.area_detail }}</div>
      </div>
      <div class="listItem">
        <div class="leftTitle">建设期限：</div>
        <div class="rightCommonItem">
          {{ state.showNew ? dayjs(state.globalDetail.project_baseinfo_backup_info.build_start_at).format('YYYY-MM') : dayjs(state.globalDetail.build_start_at).format('YYYY-MM') }}至
          {{ state.showNew ? dayjs(state.globalDetail.project_baseinfo_backup_info.build_end_at).format('YYYY-MM') : dayjs(state.globalDetail.build_end_at).format('YYYY-MM') }}
        </div>
      </div>
      <div class="listItem">
        <div class="leftTitle">主要建设内容：</div>
        <div class="rightCommonItem">{{ state.showNew ? state.globalDetail.project_baseinfo_backup_info.build_main_content : state.specialData && state.specialData.build_main_content }}</div>
      </div>
      <div class="greyLine tempMargin" v-if="state.realArray && state.realArray.length"></div>
      <div class="tableItem" v-if="state.realArray && state.realArray.length">
        <div class="tableLeft">分项一：</div>
        <div class="tableRight">基础设施建设</div>
      </div>
      <template v-for="(item, index) in state.realArray" :key="index">
        <div class="tableItem">
          <div class="tableLeft">分项名称：</div>
          <div class="tableRight">{{ item.name }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">建设地点：</div>
          <div class="tableRight">{{ item.location }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">建设单位：</div>
          <div class="tableRight">{{ item.declare_unit }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">规模(数量)：</div>
          <div class="tableRight">{{ item.scale }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">投资金额(万元)：</div>
          <div class="tableRight">{{ item.invest_money }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">其中财政补助(万元)：</div>
          <div class="tableRight">{{ item.subsidy_money }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">进度安排：</div>
          <div class="tableRight">{{ dayjs(item.schedule_start_at).format('YYYY-MM') }}至{{ dayjs(item.schedule_end_at).format('YYYY-MM') }}</div>
        </div>
      </template>
      <div class="greyLine tempMargin" v-if="state.real2Array && state.real2Array.length"></div>
      <div class="tableItem" v-if="state.real2Array && state.real2Array.length">
        <div class="tableLeft">{{ state.realArray && state.realArray.length ? '分项二：' : '分项一：' }}</div>
        <div class="tableRight">设施设备</div>
      </div>
      <template v-for="(item, index) in state.real2Array" :key="index">
        <div class="tableItem">
          <div class="tableLeft">分项名称：</div>
          <div class="tableRight">{{ item.name }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">建设地点：</div>
          <div class="tableRight">{{ item.location }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">建设单位：</div>
          <div class="tableRight">{{ item.declare_unit }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">规模(数量)：</div>
          <div class="tableRight">{{ item.scale }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">投资金额(万元)：</div>
          <div class="tableRight">{{ item.invest_money }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">其中财政补助(万元)：</div>
          <div class="tableRight">{{ item.subsidy_money }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">进度安排：</div>
          <div class="tableRight">{{ dayjs(item.schedule_start_at).format('YYYY-MM') }}至{{ dayjs(item.schedule_end_at).format('YYYY-MM') }}</div>
        </div>
      </template>
      <div class="greyLine tempMargin" v-if="state.real3Array && state.real3Array.length"></div>
      <div class="tableItem" v-if="state.real3Array && state.real3Array.length">
        <!-- state.realArray && state.realArray.length ? '分项二：' : '分项一：'  -->
        <div class="tableLeft">
          {{ state.real2Array && state.real2Array.length ? (state.realArray && state.realArray.length ? '分项三' : '分项二') : state.realArray && state.realArray.length ? '分项二' : '分项一' }}
        </div>
        <div class="tableRight">其他</div>
      </div>
      <template v-for="(item, index) in state.real3Array" :key="index">
        <div class="tableItem">
          <div class="tableLeft">分项名称：</div>
          <div class="tableRight">{{ item.name }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">建设地点：</div>
          <div class="tableRight">{{ item.location }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">建设单位：</div>
          <div class="tableRight">{{ item.declare_unit }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">规模(数量)：</div>
          <div class="tableRight">{{ item.scale }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">投资金额(万元)：</div>
          <div class="tableRight">{{ item.invest_money }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">其中财政补助(万元)：</div>
          <div class="tableRight">{{ item.subsidy_money }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">进度安排：</div>
          <div class="tableRight">{{ dayjs(item.schedule_start_at).format('YYYY-MM') }}至{{ dayjs(item.schedule_end_at).format('YYYY-MM') }}</div>
        </div>
      </template>

      <div class="greyLine tempMargin" v-if="(state.real2Array && state.real2Array.length) || (state.realArray && state.realArray.length) || (state.real3Array && state.real3Array.length)"></div>
      <div class="tableItem" v-if="(state.real2Array && state.real2Array.length) || (state.realArray && state.realArray.length) || (state.real3Array && state.real3Array.length)">
        <div class="tableSpLeft">计划总投资金额(万元)：</div>
        <div class="tableRight">{{ moneyFormat(state.originTotal1) }}</div>
      </div>
      <div class="tableItem" v-if="(state.real2Array && state.real2Array.length) || (state.realArray && state.realArray.length) || (state.real3Array && state.real3Array.length)">
        <div class="tableSpLeft">计划财政补助总金额(万元)：</div>
        <div class="tableRight">{{ moneyFormat(state.originTotal2) }}</div>
      </div>
      <div class="after">修改后信息</div>
      <div class="listItem" v-if="state.showNew">
        <div class="leftTitle">新项目名称：</div>
        <div class="rightCommonItem">{{ state.globalDetail.project_name }}</div>
      </div>
      <div class="listItem" v-if="state.showNew">
        <div class="leftTitle">新建设单位：</div>
        <div class="rightCommonItem">{{ state.globalDetail.declare_unit }}</div>
      </div>
      <div class="listItem" v-if="state.showNew">
        <div class="leftTitle">新负责人：</div>
        <div class="rightCommonItem">{{ state.globalDetail.unit_charge_name }}</div>
      </div>
      <div class="listItem" v-if="state.showNew">
        <div class="leftTitle">新联系电话：</div>
        <div class="rightCommonItem">{{ state.globalDetail.unit_charge_mobile }}</div>
      </div>
      <div class="listItem" v-if="state.showNew">
        <div class="leftTitle">新建设地点：</div>
        <div class="rightCommonItem">{{ state.globalDetail.area_ids && state.globalDetail.area_ids.join('') }}</div>
      </div>
      <div class="listItem" v-if="state.showNew">
        <div class="leftTitle">新详细地址：</div>
        <div class="rightCommonItem">{{ state.globalDetail.area_detail }}</div>
      </div>
      <div class="listItem" v-if="state.showNew">
        <div class="leftTitle">新建设期限：</div>
        <div class="rightCommonItem">{{ dayjs(state.globalDetail.build_start_at).format('YYYY-MM') }}至{{ dayjs(state.globalDetail.build_end_at).format('YYYY-MM') }}</div>
      </div>
      <div class="listItem">
        <div class="leftTitle">新主要建设内容：</div>
        <div class="rightCommonItem">{{ state.specialData && state.specialData.build_main_content }}</div>
      </div>
      <div class="greyLine tempMargin" v-if="state.real1ReadOnlyArray && state.real1ReadOnlyArray.length"></div>
      <div class="tableItem" v-if="state.real1ReadOnlyArray && state.real1ReadOnlyArray.length">
        <div class="tableLeft">分项一：</div>
        <div class="tableRight">基础设施建设</div>
      </div>
      <template v-for="(item, index) in state.real1ReadOnlyArray" :key="index">
        <div class="tableItem">
          <div class="tableLeft">分项名称：</div>
          <div class="tableRight">{{ item.name }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">建设地点：</div>
          <div class="tableRight">{{ item.location }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">建设单位：</div>
          <div class="tableRight">{{ item.declare_unit }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">规模(数量)：</div>
          <div class="tableRight">{{ item.scale }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">投资金额(万元)：</div>
          <div class="tableRight">{{ item.invest_money }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">其中财政补助(万元)：</div>
          <div class="tableRight">{{ item.subsidy_money }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">进度安排：</div>
          <div class="tableRight">{{ dayjs(item.schedule_start_at).format('YYYY-MM') }}至{{ dayjs(item.schedule_end_at).format('YYYY-MM') }}</div>
        </div>
      </template>
      <div class="greyLine tempMargin" v-if="state.real2ReadOnlyArray && state.real2ReadOnlyArray.length"></div>
      <div class="tableItem" v-if="state.real2ReadOnlyArray && state.real2ReadOnlyArray.length">
        <div class="tableLeft">{{ state.real1ReadOnlyArray && state.real1ReadOnlyArray.length ? '分项二：' : '分项一：' }}</div>
        <div class="tableRight">设施设备</div>
      </div>
      <template v-for="(item, index) in state.real2ReadOnlyArray" :key="index">
        <div class="tableItem">
          <div class="tableLeft">分项名称：</div>
          <div class="tableRight">{{ item.name }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">建设地点：</div>
          <div class="tableRight">{{ item.location }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">建设单位：</div>
          <div class="tableRight">{{ item.declare_unit }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">规模(数量)：</div>
          <div class="tableRight">{{ item.scale }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">投资金额(万元)：</div>
          <div class="tableRight">{{ item.invest_money }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">其中财政补助(万元)：</div>
          <div class="tableRight">{{ item.subsidy_money }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">进度安排：</div>
          <div class="tableRight">{{ dayjs(item.schedule_start_at).format('YYYY-MM') }}至{{ dayjs(item.schedule_end_at).format('YYYY-MM') }}</div>
        </div>
      </template>

      <div class="greyLine tempMargin" v-if="state.real3ReadOnlyArray && state.real3ReadOnlyArray.length"></div>
      <div class="tableItem" v-if="state.real3ReadOnlyArray && state.real3ReadOnlyArray.length">
        <div class="tableLeft">
          {{
            state.real2ReadOnlyArray && state.real2ReadOnlyArray.length
              ? state.real1ReadOnlyArray && state.real1ReadOnlyArray.length
                ? '分项三'
                : '分项二'
              : state.real1ReadOnlyArray && state.real1ReadOnlyArray.length
              ? '分项二'
              : '分项一'
          }}
        </div>
        <div class="tableRight">其他</div>
      </div>
      <template v-for="(item, index) in state.real3ReadOnlyArray" :key="index">
        <div class="tableItem">
          <div class="tableLeft">分项名称：</div>
          <div class="tableRight">{{ item.name }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">建设地点：</div>
          <div class="tableRight">{{ item.location }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">建设单位：</div>
          <div class="tableRight">{{ item.declare_unit }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">规模(数量)：</div>
          <div class="tableRight">{{ item.scale }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">投资金额(万元)：</div>
          <div class="tableRight">{{ item.invest_money }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">其中财政补助(万元)：</div>
          <div class="tableRight">{{ item.subsidy_money }}</div>
        </div>
        <div class="tableItem">
          <div class="tableLeft">进度安排：</div>
          <div class="tableRight">{{ dayjs(item.schedule_start_at).format('YYYY-MM') }}至{{ dayjs(item.schedule_end_at).format('YYYY-MM') }}</div>
        </div>
      </template>

      <div
        class="greyLine tempMargin"
        v-if="
          (state.real2ReadOnlyArray && state.real2ReadOnlyArray.length) ||
          (state.real1ReadOnlyArray && state.real1ReadOnlyArray.length) ||
          (state.real3ReadOnlyArray && state.real3ReadOnlyArray.length)
        "
      ></div>
      <div
        class="tableItem"
        v-if="
          (state.real2ReadOnlyArray && state.real2ReadOnlyArray.length) ||
          (state.real1ReadOnlyArray && state.real1ReadOnlyArray.length) ||
          (state.real3ReadOnlyArray && state.real3ReadOnlyArray.length)
        "
      >
        <div class="tableSpLeft">计划总投资金额(万元)：</div>
        <div class="tableRight">{{ moneyFormat(state.newTotal1) }}</div>
      </div>
      <div
        class="tableItem"
        v-if="
          (state.real2ReadOnlyArray && state.real2ReadOnlyArray.length) ||
          (state.real1ReadOnlyArray && state.real1ReadOnlyArray.length) ||
          (state.real3ReadOnlyArray && state.real3ReadOnlyArray.length)
        "
      >
        <div class="tableSpLeft">计划财政补助总金额(万元)：</div>
        <div class="tableRight">{{ moneyFormat(state.newTotal2) }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs, watch, ref, onMounted } from 'vue'
import { Toast } from 'vant'
import { useRoute, useRouter } from 'vue-router'
import Request from '@/service/request'
import { util } from '@/util/index'
import dayjs from 'dayjs'
export default defineComponent({
  name: 'BaseInfo',
  setup(props) {
    const state = reactive({
      statusTag: ref(0),
      statusTail: ref(0),
      active: ref(0),
      originArray: [],
      secondArray: [],
      showNew: false,
      originAmount: 0,
      newAmount: 0,
      globalDetail: {},
      realArray: [],
      real2Array: [],
      real3Array: [],
      real1ReadOnlyArray: [],
      real2ReadOnlyArray: [],
      real3ReadOnlyArray: [],
      originTotal1: 0,
      originTotal2: 0,
      newTotal1: 0,
      newTotal2: 0,
      specialData: {}
    })
    const Route = useRoute()
    const Router = useRouter()
    onMounted(() => {
      let parse = JSON.parse(sessionStorage.getItem('projectPerformLocal'))
      state.globalDetail = parse
      fetchDetail(parse)
      if (parse && parse.project_baseinfo_backup_info && parse.project_baseinfo_backup_info.project_id) {
        state.showNew = true
        let array3 = parse.project_baseinfo_backup_info.part_options.find((ele) => {
          return ele.option_name == '基础设施建设'
        })
        if (array3 && array3.list && array3.list.length) {
          state.realArray = array3.list
        }
        let array4 = parse.project_baseinfo_backup_info.part_options.find((ele) => {
          return ele.option_name == '设施设备'
        })
        if (array4 && array4.list && array4.list.length) {
          state.real2Array = array4.list
        }
        let array5 = parse.project_baseinfo_backup_info.part_options.find((ele) => {
          return ele.option_name == '其他'
        })
        if (array5 && array5.list && array5.list.length) {
          state.real3Array = array5.list
        }
        calcFunction()
      }
    })
    const fetchDetail = (parse) => {
      Request.fetchProjectImplementPlanDetail({
        project_id: parse.project_id
      })
        .then((res) => {
          if (res && res.code == 0) {
            state.specialData = res.data.info
            let array1 = state.specialData.part_options.find((ele) => {
              return ele.option_name == '基础设施建设'
            })
            if (array1 && array1.list && array1.list.length) {
              state.real1ReadOnlyArray = array1.list
            }
            let array2 = state.specialData.part_options.find((ele) => {
              return ele.option_name == '设施设备'
            })
            if (array2 && array2.list && array2.list.length) {
              state.real2ReadOnlyArray = array2.list
            }
            let array3 = state.specialData.part_options.find((ele) => {
              return ele.option_name == '其他'
            })
            if (array3 && array3.list && array3.list.length) {
              state.real3ReadOnlyArray = array3.list
            }
            calcFunction()
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    const calcFunction = () => {
      let count1 = 0
      let temp1 = state.realArray.map((ele) => {
        if (!ele.invest_money) {
          return {
            ...ele,
            invest_money: ele.invest_money ? ele.invest_money : 0
          }
        } else {
          return {
            ...ele
          }
        }
      })
      if (temp1) {
        let res1 = temp1.reduce((acc, current) => {
          return acc + current.invest_money
        }, 0)
        count1 = res1
      }
      let count2 = 0
      let temp2 = state.real2Array.map((ele) => {
        if (!ele.invest_money) {
          return {
            ...ele,
            invest_money: ele.invest_money ? ele.invest_money : 0
          }
        } else {
          return {
            ...ele
          }
        }
      })
      if (temp2) {
        let res1 = temp2.reduce((acc, current) => {
          return acc + current.invest_money
        }, 0)
        count2 = res1
      }
      let count9 = 0
      let temp9 = state.real3Array.map((ele) => {
        if (!ele.invest_money) {
          return {
            ...ele,
            invest_money: ele.invest_money ? ele.invest_money : 0
          }
        } else {
          return {
            ...ele
          }
        }
      })
      if (temp9) {
        let res1 = temp9.reduce((acc, current) => {
          return acc + current.invest_money
        }, 0)
        count9 = res1
      }
      state.originTotal1 = count2 + count1 + count9
      let count3 = 0
      let temp3 = state.realArray.map((ele) => {
        if (!ele.subsidy_money) {
          return {
            ...ele,
            subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0
          }
        } else {
          return {
            ...ele
          }
        }
      })
      if (temp3) {
        let res1 = temp3.reduce((acc, current) => {
          return acc + current.subsidy_money
        }, 0)
        count3 = res1
      }
      let count4 = 0
      let temp4 = state.real2Array.map((ele) => {
        if (!ele.subsidy_money) {
          return {
            ...ele,
            subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0
          }
        } else {
          return {
            ...ele
          }
        }
      })
      if (temp4) {
        let res1 = temp4.reduce((acc, current) => {
          return acc + current.subsidy_money
        }, 0)
        count4 = res1
      }

      let count11 = 0
      let temp11 = state.real3Array.map((ele) => {
        if (!ele.subsidy_money) {
          return {
            ...ele,
            subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0
          }
        } else {
          return {
            ...ele
          }
        }
      })
      if (temp11) {
        let res1 = temp11.reduce((acc, current) => {
          return acc + current.subsidy_money
        }, 0)
        count11 = res1
      }

      state.originTotal2 = count3 + count4 + count11
      let count5 = 0
      let temp5 = state.real1ReadOnlyArray.map((ele) => {
        if (!ele.invest_money) {
          return {
            ...ele,
            invest_money: ele.invest_money ? ele.invest_money : 0
          }
        } else {
          return {
            ...ele
          }
        }
      })
      if (temp5) {
        let res1 = temp5.reduce((acc, current) => {
          return acc + current.invest_money
        }, 0)
        count5 = res1
      }
      let count6 = 0
      let temp6 = state.real2ReadOnlyArray.map((ele) => {
        if (!ele.invest_money) {
          return {
            ...ele,
            invest_money: ele.invest_money ? ele.invest_money : 0
          }
        } else {
          return {
            ...ele
          }
        }
      })
      if (temp6) {
        let res1 = temp6.reduce((acc, current) => {
          return acc + current.invest_money
        }, 0)
        count6 = res1
      }

      let count12 = 0
      let temp12 = state.real3ReadOnlyArray.map((ele) => {
        if (!ele.invest_money) {
          return {
            ...ele,
            invest_money: ele.invest_money ? ele.invest_money : 0
          }
        } else {
          return {
            ...ele
          }
        }
      })
      if (temp12) {
        let res1 = temp12.reduce((acc, current) => {
          return acc + current.invest_money
        }, 0)
        count12 = res1
      }

      state.newTotal1 = count5 + count6 + count12
      let count7 = 0
      let temp7 = state.real1ReadOnlyArray.map((ele) => {
        if (!ele.subsidy_money) {
          return {
            ...ele,
            subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0
          }
        } else {
          return {
            ...ele
          }
        }
      })
      if (temp7) {
        let res1 = temp7.reduce((acc, current) => {
          return acc + current.subsidy_money
        }, 0)
        count7 = res1
      }
      let count8 = 0
      let temp8 = state.real2ReadOnlyArray.map((ele) => {
        if (!ele.subsidy_money) {
          return {
            ...ele,
            subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0
          }
        } else {
          return {
            ...ele
          }
        }
      })
      if (temp8) {
        let res1 = temp8.reduce((acc, current) => {
          return acc + current.subsidy_money
        }, 0)
        count8 = res1
      }

      let count10 = 0
      let temp10 = state.real3ReadOnlyArray.map((ele) => {
        if (!ele.subsidy_money) {
          return {
            ...ele,
            subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0
          }
        } else {
          return {
            ...ele
          }
        }
      })
      if (temp10) {
        let res1 = temp10.reduce((acc, current) => {
          return acc + current.subsidy_money
        }, 0)
        count10 = res1
      }
      state.newTotal2 = count7 + count8 + count10
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

    return {
      state,
      Route,
      util,
      dayjs,
      props,
      moneyFormat,
      calcFunction
    }
  }
})
</script>
<style scoped lang="less">
.editTrigger {
  width: 4.58rem;
  height: 0.88rem;
  background-color: #1b82ec;
  border-radius: 0.44rem;
  line-height: 0.88rem;
  text-align: center;
  margin: 0 auto;
  color: #fff;
  font-size: 0.32rem;
  margin-top: 0.6rem;
}
.BaseInfoCon {
  background-color: #fff;
  padding: 0.3rem;
  box-sizing: border-box;
  border-radius: 0.16rem;
  margin-bottom: 0.32rem;
  .titleCon {
    // padding-left: 0.3rem;
    box-sizing: border-box;
    margin-bottom: 0.32rem;
  }
  .listCon {
  }
  .listItem {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    font-size: 0.32rem;
    margin-bottom: 0.16rem;
    color: #333;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .leftNewTitle {
    width: 2.8rem;
    position: relative;
    font-weight: 500;
    padding-left: 0.15rem;
    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 30%;
      width: 0.08rem;
      height: 0.08rem;
      background: #1b82ec;
      border-radius: 50%;
    }
  }
  .leftSumPointTitle {
    width: 2.8rem;
    position: relative;
    font-weight: 500;
  }
  .leftEditTitle {
    width: 2.8rem;
    position: relative;
    font-weight: 500;
    padding-left: 0.15rem;
  }
  .leftEditShortTitle {
    width: 1.7rem;
    position: relative;
    font-weight: 500;
  }
  .leftSumTitle {
    width: 2.8rem;
    position: relative;
    font-weight: 500;
  }

  .leftNewContent {
    width: 3.1rem;
  }
  .leftTitle {
    width: 3rem;
    position: relative;
    // font-weight: 500;
  }
  .rightCommonItem {
    width: calc(100% - 2rem);
    word-wrap: break-word;
  }
  .before {
    font-size: 0.33rem;
    margin-bottom: 0.16rem;
    font-weight: 500;
    color: #333;
  }
  .after {
    font-size: 0.33rem;
    margin-bottom: 0.16rem;
    margin-top: 0.4rem;
    color: #333;
    font-weight: 500;
  }
  .title {
    position: relative;
    font-size: 0.34rem;
    // font-weight: bold;
    color: #333333;
    padding-left: 0.15rem;
    box-sizing: border-box;
    &::before {
      content: '';
      background: #1b82ec;
      width: 0.05rem;
      height: 0.28rem;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
.greyLine {
  border: 0.01rem solid #e8e9ec;
}
.tempMargin {
  margin-top: 0.28rem;
  margin-bottom: 0.28rem;
}
.tableItem {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  font-size: 0.32rem;
  color: #666;
  margin-bottom: 0.16rem;
}
.tableLeft {
  width: 3.2rem;
}
.tableSpLeft {
  width: 4.2rem;
}
.tableRight {
  color: #333;
}
</style>
