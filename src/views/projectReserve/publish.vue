<template>
  <div class="projectReservePublishCon">
    <van-form @failed="onFailed" @submit="onSubmit" error-message-align="right">
      <div class="topCon">
        <van-field
          input-align="right"
          v-model="state.formData.project_name"
          required
          type="textarea"
          name="project_name"
          label="项目名称"
          rows="1"
          autosize
          maxlength="50"
          class="area-field"
          :class="state.ZLBFitForOld ? 'fieldOld' : ''"
          :rules="state.validator.project_name"
          placeholder="请输入项目名称"
        />
        <van-field
          input-align="right"
          v-model="state.formData.project_typeText"
          required
          name="project_type"
          disabled
          class="removeDisabled"
          @click="popType"
          :class="state.ZLBFitForOld ? 'fieldOld' : ''"
          label="项目类型"
          :rules="state.validator.project_type"
          placeholder="请选择项目类型"
        />
        <van-field
          input-align="right"
          v-model="state.area_idsString"
          required
          disabled
          name="area_idsString"
          :rules="state.validator.area_idsString"
          placeholder="请选择项目地点"
          class="removeDisabled"
          :class="state.ZLBFitForOld ? 'fieldOld' : ''"
          label="项目地点"
          @click="popAddress"
        />
        <van-field
          input-align="right"
          v-model="state.formData.area_detail"
          name="area_detail"
          label="详细地址"
          maxlength="20"
          @change="areaDetailChange"
          :rules="state.validator.area_detail"
          class="required-holder"
          :class="state.ZLBFitForOld ? 'fieldOld' : ''"
          placeholder="请输入详细地址"
        />
        <van-field
          input-align="right"
          v-model="state.formData.project_build_area"
          name="area_detail"
          label="项目建设地点"
          maxlength="50"
          class="required-holder"
          :class="state.ZLBFitForOld ? 'fieldOld' : ''"
          placeholder="请输入项目建设地点"
        />
        <van-field
          input-align="right"
          v-model="state.formData.build_start_at"
          required
          disabled
          class="removeDisabled"
          name="build_start_at"
          label="起始日期"
          :class="state.ZLBFitForOld ? 'fieldOld' : ''"
          @click="openStartDatePicker"
          :rules="state.validator.build_start_at"
          placeholder="请选择建设期限起始日期"
        />
        <van-field
          input-align="right"
          v-model="state.formData.build_end_at"
          required
          disabled
          class="removeDisabled"
          name="build_end_at"
          label="结束日期"
          :class="state.ZLBFitForOld ? 'fieldOld' : ''"
          @click="openEndDatePicker"
          :rules="state.validator.build_end_at"
          placeholder="请选择建设期限结束日期"
        />
        <!-- <van-field
          input-align="right"
          v-model="state.build_at"
          required
          disabled
          class="removeDisabled"
          name="build_at"
          label="建设期限"
          :class="state.ZLBFitForOld ? 'fieldOld' : ''"
          @click="popCalender"
          :rules="state.validator.build_at"
          placeholder="请选择建设期限"
        /> -->
        <van-field
          input-align="right"
          v-model="state.formData.declare_unit"
          required
          name="declare_unit"
          label="申报单位"
          maxlength="20"
          @change="declareUnitChange"
          :class="state.ZLBFitForOld ? 'fieldOld' : ''"
          :rules="state.validator.declare_unit"
          placeholder="请输入申报单位"
        />

        <van-field
          input-align="right"
          v-model="state.formData.project_ss_unit"
          name="project_ss_unit"
          label="项目实施单位"
          maxlength="50"
          :class="state.ZLBFitForOld ? 'fieldOld' : ''"
          placeholder="请输入项目实施单位"
        />

        <van-field
          input-align="right"
          v-model="state.formData.unit_charge_name"
          required
          name="unit_charge_name"
          label="负责人"
          maxlength="10"
          :class="state.ZLBFitForOld ? 'fieldOld' : ''"
          :rules="state.validator.unit_charge_name"
          placeholder="请输入负责人"
        />
        <van-field
          input-align="right"
          v-model="state.formData.unit_charge_mobile"
          required
          name="unit_charge_mobile"
          label="联系电话"
          maxlength="11"
          :class="state.ZLBFitForOld ? 'fieldOld' : ''"
          :rules="state.validator.unit_charge_mobile"
          placeholder="请输入联系电话"
        />
        <van-field
          input-align="right"
          v-model="state.formData.declare_at"
          required
          disabled
          name="declare_at"
          label="申报日期"
          :class="state.ZLBFitForOld ? 'fieldOld' : ''"
          :rules="state.validator.declare_at"
          placeholder="请选择申报日期"
        />
      </div>
      <div class="listCon marBottom30">
        <template v-for="(item, index) in state.formData.build_contents" :key="index">
          <div class="marBottom30 itemCon">
            <div class="itemTitle marBottom30 fakeRequired" :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">项目建设内容:</div>
            <div class="itemContent marBottom30">
              <van-field
                v-model="state.formData.build_contents[index].content"
                rows="3"
                required
                name="content"
                autosize
                maxlength="100"
                :class="state.ZLBFitForOld ? 'fieldOld' : ''"
                type="textarea"
                :rules="state.validator.content"
                placeholder="名称、规模数量、建设标准、设备设施规格型号等，要求内容详实"
              />
            </div>
            <!-- <div class="itemContent field-with-extra">
              <van-field
                v-model="state.formData.build_contents[index].invest_money"
                required
                @change="(e) => moneyChange(e, index)"
                :label="'投资额'"
                type="number"
                :class="state.ZLBFitForOld ? 'fieldOld' : ''"
                name="project_name"
                maxlength="10"
                :rules="state.validator.invest_money"
                placeholder="请输入金额"
              >
                <template #extra>
                  <span class="field-extra">万元</span>
                </template>
              </van-field>
            </div> -->

            <div class="endBtn">
              <van-button class="littleBtn" :class="state.ZLBFitForOld ? 'littleBtnOld' : ''" round block type="primary" @click="deleteCurrent(index)">删除</van-button>
            </div>
          </div>
        </template>
      </div>
      <div class="addbtnCon" @click="addMore" hidden>
        <div class="addbtnCenter">
          <img src="https://img.hzanchu.com/acimg/0ef025121076713f8ae14f333b521f70.png" />
          <div class="describe" :class="state.ZLBFitForOld ? 'describeOld' : ''">添加项目建设内容</div>
        </div>
      </div>
      <div class="marBottom30 itemCon">
        <div class="itemTitle marBottom30 fakeRequired" :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">新生产能力和效益分析:</div>
        <div class="itemContent marBottom30">
          <van-field
            v-model="state.formData.product_benefit"
            rows="8"
            required
            name="product_benefit"
            autosize
            maxlength="1000"
            :class="state.ZLBFitForOld ? 'fieldOld' : ''"
            type="textarea"
            :rules="state.validator.product_benefit"
            placeholder="请输入新生产能力和效益分析"
          />
        </div>
      </div>

      <div class="marBottom30 itemCon">
        <div class="itemTitle marBottom30 fakeRequired" :class="state.ZLBFitForOld ? 'itemTitleOld' : ''">土地性质或来源:</div>
        <div class="itemContent marBottom30">
          <van-field
            v-model="state.formData.land_nature_source"
            rows="8"
            required
            name="land_nature_source"
            autosize
            maxlength="1000"
            :class="state.ZLBFitForOld ? 'fieldOld' : ''"
            type="textarea"
            :rules="state.validator.land_nature_source"
            placeholder="请输入土地性质或来源"
          />
        </div>
      </div>

      <!-- <div class="marBottom30">
        <van-cell title="合计:" :class="state.ZLBFitForOld ? 'cellOld' : ''">
          <template #value>
            <span class="summary" :class="state.ZLBFitForOld ? 'summaryOld' : ''">{{ state.formData.build_contents && calcFunction(state.formData.build_contents) }}</span
            ><span class="commonUnit" :class="state.ZLBFitForOld ? 'commonUnitOld' : ''"> 万元 </span>
          </template>
        </van-cell>
      </div> -->
      <div class="fixBottom fixPaddingBottom">
        <van-button class="saveBtn" block @click="saveAction" :class="state.ZLBFitForOld ? 'btnTextOld' : ''">保存</van-button>
        <van-button class="submitBtn" block type="primary" native-type="submit" :class="state.ZLBFitForOld ? 'btnTextOld' : ''">下一步</van-button>
      </div>
    </van-form>

    <div class="itemCon approval-result" v-if="id">
      <div class="title">审核结果</div>
      <div class="result-content">
        <div class="item">
          <div class="item-title">状态：</div>
          <div class="value">
            {{ state.detail.status == 1 ? '审核中' : state.detail.status == 2 ? '已通过' : '未通过' }}
          </div>
        </div>
        <div class="item">
          <div class="item-title">意见：</div>
          <div class="value">{{ state.detail.audit_reason || '-' }}</div>
        </div>
        <div class="item">
          <div class="item-title">联系方式：</div>
          <div class="value">{{ state.detail.link_mobile || '-' }}</div>
        </div>
        <div class="item">
          <div class="item-title">附件：</div>
          <div class="value" style="color: #1b82ec" @click="showImages">查看附件</div>
        </div>
      </div>
    </div>
    <van-calendar :lazy-render="false" v-model:show="state.calenderShow" :minDate="state.minDate" :maxDate="state.maxDate" type="range" @confirm="onCalenderConfirm" />
    <van-calendar v-model:show="state.singleCalenderShow" @confirm="onSingleConfirm" />
    <van-popup v-model:show="state.showStartDatePicker" round position="bottom"
      >.
      <van-datetime-picker
        v-model="state.select_start_date"
        type="date"
        title="选择起始日期"
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
        title="选择结束日期"
        @cancel="state.showEndDatePicker = false"
        @confirm="confirmEndDate"
        :min-date="state.minDate"
        :max-date="state.maxDate"
      />
    </van-popup>

    <van-popup v-model:show="state.show" round position="bottom">
      <van-cascader v-model="state.cascaderValue" title="请选择所在地区" :field-names="fieldNames" :options="state.options" @close="state.show = false" @change="onChange" @finish="onFinish" />
    </van-popup>

    <van-popup v-model:show="state.typeShow" round position="bottom">
      <van-picker :columns="state.columns" @cancel="state.typeShow = false" @confirm="onType" :defaultIndex="state.typeDefaultIndex" />
    </van-popup>

    <Loading :visiable="state.visible"></Loading>
  </div>
</template>
<script>
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Toast, ImagePreview, Dialog } from 'vant'
import Request from '@/service/request'
import dayjs from 'dayjs'
import { isZLB } from '@/util/index'
import Loading from '@/components/loading'

export default defineComponent({
  components: { Loading },
  setup(props, { emit }) {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      ZLBFLAG: isZLB(),
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
      cascaderValue: '',
      typeDefaultIndex: 0,
      singleCalenderShow: false,
      city: '',
      town: '',
      village: '',
      options: [],
      minDate: new Date('2020/01/01'),
      maxDate: new Date('2026/01/01'),
      select_start_date: new Date(),
      select_end_date: new Date(),
      showStartDatePicker: ref(false),
      showEndDatePicker: ref(false),
      calenderShow: false,
      show: false,
      detail: {},
      area_ids: [],
      area_idsString: '',
      areaList: [],
      columns: [
        { text: '种植业', value: 1 },
        { text: '养殖业', value: 2 },
        { text: '加工业', value: 3 },
        { text: '乡村建设', value: 4 },
        { text: '其他', value: 9 }
      ],
      ids: [],
      validator: {
        project_name: [{ required: true, trigger: 'onBlur', message: '请输入' }],
        declare_unit: [{ required: true, trigger: 'onBlur', message: '请输入' }],
        content: [{ required: true, trigger: 'onBlur', message: '请输入' }],
        invest_money: [{ required: true, trigger: 'onBlur', message: '请输入' }],
        unit_charge_name: [{ required: true, trigger: 'onBlur', message: '请输入' }],
        build_start_at: [{ required: true, trigger: 'onBlur', message: '请选择起始日期' }],
        build_end_at: [{ required: true, trigger: 'onBlur', message: '请选择结束日期' }],
        // build_at: [{ required: true, trigger: 'onBlur', message: '请选择' }],
        project_type: [{ required: true, trigger: 'onBlur', message: '请选择' }],
        area_idsString: [{ required: true, trigger: 'onBlur', message: '请选择' }],
        area_detail: [{ required: false, trigger: 'onBlur', message: '请输入' }],
        declare_at: [{ required: true, trigger: 'onBlur', message: '请选择' }],
        product_benefit: [{ required: true, trigger: 'onBlur', message: '请输入' }],
        land_nature_source: [{ required: true, trigger: 'onBlur', message: '请输入' }],
        unit_charge_mobile: [
          {
            required: true,
            trigger: 'onBlur',
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确手机号'
          }
        ]
      },
      formData: {
        project_name: '',
        area_detail: '',
        project_type: '',
        project_typeText: '',
        build_at: '',
        declare_unit: '',
        unit_charge_name: '',
        unit_charge_mobile: '',
        declare_at: dayjs().format('YYYY-MM-DD'),
        build_contents: [
          {
            content: '',
            invest_money: 0
          }
        ],
        part_options: [
          {
            option_name: '基础设施建设',
            option_mark: 'infrastructure_construction',
            list: []
          },
          {
            option_name: '设施设备',
            option_mark: 'mechanical_equipment',
            list: []
          },
          {
            option_name: '技术引进推广',
            option_mark: 'technology_promotion',
            list: []
          },
          {
            option_name: '其他',
            option_mark: 'other',
            list: []
          }
        ],
        province_amount: 0,
        place_amount: 0,
        self_amount: 0,
        build_start_at: '',
        build_end_at: '',
        project_build_area: '',
        project_ss_unit: '',
        product_benefit: '',
        land_nature_source: ''
      },
      visible: ref(false)
    })

    // 数据处理
    const layer1 = (res) => {
      state.detail = res.data.info
      let shorter = res.data.info
      if (shorter.build_start_at && shorter.build_end_at) {
        shorter.build_start_at = dayjs(shorter.build_start_at).format('YYYY/MM/DD')
        shorter.build_end_at = dayjs(shorter.build_endt_at).format('YYYY/MM/DD')
      }
      state.formData = shorter
      state.formData.project_type = String(shorter.project_type)
      let trackTypeIndex = state.columns.findIndex((ele) => {
        return ele.value == shorter.project_type
      })
      state.typeDefaultIndex = trackTypeIndex
      state.formData.project_typeText = state.columns[trackTypeIndex].text
      state.ids = [shorter.city_id, shorter.town_id, shorter.village_id]

      state.formData.build_contents = shorter.build_contents || []
      if (state.formData.declare_at) {
        state.formData.declare_at = dayjs(state.formData.declare_at).format('YYYY-MM-DD')
      } else {
        state.formData.declare_at = dayjs().format('YYYY-MM-DD')
      }

      if (state.ZLBFLAG) {
        Request.getAreaListMGOP({})
          .then((res) => {
            state.areaList = res.data.data && res.data.data.list
            let track1 = state.areaList[0].children.find((ele) => {
              return ele.id == shorter.town_id
            })
            if (track1) {
              let track2 = track1.children.find((ele) => {
                return ele.id == shorter.village_id
              })
              state.area_ids = [state.areaList[0].name, track1.name, track2.name]
              const tempAddress = state.areaList[0].name + track1.name + track2.name
              state.area_idsString = tempAddress
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      } else {
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
                const tempAddress = state.areaList[0].name + track1.name + track2.name
                state.area_idsString = tempAddress
              }
            } else {
              Toast(res.msg)
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      }
    }

    // 获取储备申报详情
    const fetchList = () => {
      if (Route.query.id) {
        if (state.ZLBFLAG) {
          Request.projectReserveDetailMGOP({ id: Route.query.id }).then((res) => {
            if (res && res.data && res.data.code == 0) {
              layer1(res.data)
            } else {
              Toast(res.msg)
            }
          })
        } else {
          Request.projectReserveDetail({ id: Route.query.id })
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
    }
    onMounted(() => {
      fetchAddress()
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
    const onSubmit = (params) => {
      if (state.formData.build_contents && state.formData.build_contents.length) {
        let requestData = {
          save_type: 'save',
          project_name: state.formData.project_name,
          project_type: state.formData.project_type,
          city_id: state.ids[0],
          town_id: state.ids[1],
          village_id: state.ids[2],
          area_detail: state.formData.area_detail,
          build_start_at: state.formData.build_start_at,
          build_end_at: state.formData.build_end_at,
          declare_unit: state.formData.declare_unit,
          unit_charge_name: state.formData.unit_charge_name,
          unit_charge_mobile: state.formData.unit_charge_mobile,
          declare_at: dayjs(state.formData.declare_at).format('YYYY-MM-DD HH:mm:ss'),
          build_contents: JSON.stringify(state.formData.build_contents),
          project_build_area: state.formData.project_build_area,
          project_ss_unit: state.formData.project_ss_unit,
          product_benefit: state.formData.product_benefit,
          land_nature_source: state.formData.land_nature_source,
          part_options: JSON.stringify(state.formData.part_options),
          province_amount: state.formData.province_amount,
          place_amount: state.formData.place_amount,
          self_amount: state.formData.self_amount
        }
        state.visible = true
        if (state.ZLBFLAG) {
          if (Route.query.id) {
            requestData.id = Route.query.id
            Request.projectReserveActionMGOP(requestData)
              .then((res) => {
                if (res && res.data && res.data.code == 0) {
                  Toast('提交成功')
                  Router.push({
                    name: 'projectReserveBigTable',
                    query: {
                      id: res.data.data.id
                    }
                  })
                } else {
                  Toast(res.msg)
                }
              })
              .catch((err) => {
                console.log('err', err)
              })
              .finally(() => {
                state.visible = false
              })
          } else {
            Request.projectReserveActionMGOP(requestData)
              .then((res) => {
                if (res && res.data && res.data.code == 0) {
                  Toast('提交成功')
                  //   Router.go(-1)
                  Router.push({
                    name: 'projectReserveBigTable',
                    query: {
                      id: res.data.data.id
                    }
                  })
                } else {
                  Toast(res.msg)
                }
              })
              .catch((err) => {
                console.log('err', err)
              })
              .finally(() => {
                state.visible = false
              })
          }
        } else {
          if (Route.query.id) {
            requestData.id = Route.query.id
            Request.projectReserveAction(requestData)
              .then((res) => {
                if (res && res.code == 0) {
                  Toast('提交成功')
                  //   Router.go(-1)
                  Router.push({
                    name: 'projectReserveBigTable',
                    query: {
                      id: res.data.id
                    }
                  })
                } else {
                  Toast(res.msg)
                }
              })
              .catch((err) => {
                console.log('err', err)
              })
              .finally(() => {
                state.visible = false
              })
          } else {
            Request.projectReserveAction(requestData)
              .then((res) => {
                if (res && res.code == 0) {
                  Toast('提交成功')
                  //   Router.go(-1)
                  Router.push({
                    name: 'projectReserveBigTable',
                    query: {
                      id: res.data.id
                    }
                  })
                } else {
                  Toast(res.msg)
                }
              })
              .catch((err) => {
                console.log('err', err)
              })
              .finally(() => {
                state.visible = false
              })
          }
        }
      } else {
        Toast('项目建设内容不能为空')
      }
    }
    const saveAction = () => {
      if (state.formData.project_name) {
        let requestData = {
          save_type: 'save',
          project_name: state.formData.project_name,
          project_type: state.formData.project_type,
          city_id: state.ids[0] ? state.ids[0] : 0,
          town_id: state.ids[1] ? state.ids[1] : 0,
          village_id: state.ids[2] ? state.ids[2] : 0,
          area_detail: state.formData.area_detail,
          unit_charge_name: state.formData.unit_charge_name,
          unit_charge_mobile: state.formData.unit_charge_mobile,
          build_contents: JSON.stringify(state.formData.build_contents),
          declare_unit: state.formData.declare_unit,
          project_build_area: state.formData.project_build_area,
          project_ss_unit: state.formData.project_ss_unit,
          product_benefit: state.formData.product_benefit,
          land_nature_source: state.formData.land_nature_source,
          part_options: JSON.stringify(state.formData.part_options),
          province_amount: state.formData.province_amount,
          place_amount: state.formData.place_amount,
          self_amount: state.formData.self_amount
        }
        state.visible = true
        if (state.formData.declare_at) {
          requestData.declare_at = dayjs(state.formData.declare_at).format('YYYY-MM-DD HH:mm:ss')
        } else {
          requestData.declare_at = dayjs().format('YYYY-MM-DD HH:mm:ss')
        }
        if (state.formData.build_start_at) {
          requestData.build_start_at = state.formData.build_start_at
        } else {
          requestData.build_start_at = ''
        }
        if (state.formData.build_end_at) {
          requestData.build_end_at = state.formData.build_end_at
        } else {
          requestData.build_end_at = ''
        }
        if (Route.query.id) {
          requestData.id = Route.query.id
          if (state.ZLBFLAG) {
            Request.projectReserveActionMGOP(requestData)
              .then((res) => {
                if (res && res.data && res.data.code == 0) {
                  Toast('保存成功')
                } else {
                  Toast(res.msg)
                }
              })
              .catch((err) => {
                console.log('err', err)
              })
              .finally(() => {
                state.visible = false
              })
          } else {
            Request.projectReserveAction(requestData)
              .then((res) => {
                if (res && res.code == 0) {
                  Toast('保存成功')
                } else {
                  Toast(res.msg)
                }
              })
              .catch((err) => {
                console.log('err', err)
              })
              .finally(() => {
                state.visible = false
              })
          }
        } else {
          if (state.ZLBFLAG) {
            Request.projectReserveActionMGOP(requestData)
              .then((res) => {
                if (res && res.data && res.data.code == 0) {
                  Toast('保存成功')
                  Router.replace({
                    name: 'projectReservePublish',
                    query: {
                      id: res.data.data.id
                    }
                  })
                } else {
                  Toast(res.msg)
                }
              })
              .catch((err) => {
                console.log('err', err)
              })
              .finally(() => {
                state.visible = false
              })
          } else {
            Request.projectReserveAction(requestData)
              .then((res) => {
                if (res && res.code == 0) {
                  Toast('保存成功')
                  Router.replace({
                    name: 'projectReservePublish',
                    query: {
                      id: res.data.id
                    }
                  })
                } else {
                  Toast(res.msg)
                }
              })
              .catch((err) => {
                console.log('err', err)
              })
              .finally(() => {
                state.visible = false
              })
          }
        }
      } else {
        Toast('项目名称不能为空')
      }
    }
    const onCalenderConfirm = (values) => {
      const [start, end] = values
      state.calenderShow = false
      state.build_at = `${dayjs(start).format('YYYY-MM')}-${dayjs(end).format('YYYY-MM')}`
      state.formData.build_start_at = dayjs(start).format('YYYY-MM-DD HH:mm:ss')
      state.formData.build_end_at = dayjs(end).format('YYYY-MM-DD HH:mm:ss')
    }
    const areaDetailChange = () => {
      state.formData.project_build_area = state.area_idsString + state.formData.area_detail
    }
    const declareUnitChange = () => {
      state.formData.project_ss_unit = state.formData.declare_unit
    }
    const onFinish = ({ selectedOptions }) => {
      state.show = false
      state.city = selectedOptions[0].name
      state.town = selectedOptions[1].name
      state.village = selectedOptions[2].name
      state.cascaderValue = selectedOptions.map((option) => option.id).join('/')
      state.ids = [selectedOptions[0].id, selectedOptions[1].id, selectedOptions[2].id]
      state.area_idsString = selectedOptions[0].name + selectedOptions[1].name + selectedOptions[2].name
      state.formData.project_build_area = state.area_idsString + state.formData.area_detail
    }
    const popAddress = () => {
      state.show = true
    }
    const popCalender = () => {
      state.calenderShow = true
    }
    const popType = () => {
      state.typeShow = true
    }
    const onSingleConfirm = (value) => {
      state.singleCalenderShow = false
      // console.log('value', value)
      //   let str = dayjs(value).format('YYYY-MM-DD HH:mm:ss')
      let str = dayjs(value).format('YYYY-MM-DD')
      console.log(str)
      state.formData.declare_at = str
    }
    const popSingleCalender = () => {
      state.singleCalenderShow = true
    }
    const fetchAddress = () => {
      if (state.ZLBFLAG) {
        Request.getAreaListMGOP({})
          .then((res) => {
            state.options = res.data.data && res.data.data.list
          })
          .catch((err) => {
            console.log('err', err)
          })
      } else {
        Request.getAreaList({})
          .then((res) => {
            if (res && res.code == 0) {
              state.options = res.data.list
            } else {
              Toast(res.msg)
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      }
    }
    const fieldNames = {
      text: 'name',
      value: 'id',
      children: 'children'
    }
    const onType = (e) => {
      if (e.value == 1) {
        // 选择种植业时增加提示
        Dialog.confirm({
          title: '提示',
          message: '种植花卉、水果、茶叶等经济作物，禁止占用永久基本农田。'
        })
          .then(() => {
            state.formData.project_typeText = e.text
            state.formData.project_type = e.value
            state.typeShow = false
          })
          .catch(() => {})
        return
      }
      state.formData.project_typeText = e.text
      state.formData.project_type = e.value
      state.typeShow = false
    }
    const calcFunction = (array) => {
      let temp = array.map((ele) => {
        if (!ele.invest_money) {
          return {
            ...ele,
            invest_money: ele.invest_money ? +ele.invest_money : 0
          }
        } else {
          return {
            ...ele
          }
        }
      })
      let res = temp.reduce((acc, current) => {
        return acc + +current.invest_money
      }, 0)
      return res
    }
    const addMore = () => {
      state.formData.build_contents.push({
        content: '',
        invest_money: 0
      })
    }
    const moneyChange = (e, index) => {
      let after = e.target.value.toString().match(/^\d*(\.?\d{0,2})/g)[0] || null
      state.formData.build_contents[index].invest_money = +after
    }
    const deleteCurrent = (index) => {
      state.formData.build_contents.splice(index, 1)
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

    const openStartDatePicker = () => {
      if (state.formData.build_start_at) {
        state.select_start_date = dayjs(state.formData.build_start_at).toDate()
      }
      state.showStartDatePicker = true
    }
    const openEndDatePicker = () => {
      if (state.formData.build_end_at) {
        state.select_end_date = dayjs(state.formData.build_end_at).toDate()
      }
      state.showEndDatePicker = true
    }
    const confirmStartDate = (e) => {
      state.formData.build_start_at = dayjs(e).format('YYYY/MM/DD')
      state.showStartDatePicker = false
    }
    const confirmEndDate = (e) => {
      state.formData.build_end_at = dayjs(e).format('YYYY/MM/DD')
      state.showEndDatePicker = false
    }
    const onChange = () => {}
    return {
      state,
      checkDetail,
      onFailed,
      onSubmit,
      popAddress,
      onFinish,
      fieldNames,
      onChange,
      onCalenderConfirm,
      popCalender,
      dayjs,
      onType,
      popType,
      onSingleConfirm,
      popSingleCalender,
      calcFunction,
      addMore,
      moneyChange,
      deleteCurrent,
      saveAction,
      showImages,
      openStartDatePicker,
      openEndDatePicker,
      confirmStartDate,
      confirmEndDate,
      id: Route.query.id,
      areaDetailChange,
      declareUnitChange
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
.projectReservePublishCon {
  box-sizing: border-box;
  padding: 0.3rem;
  padding-bottom: 1.3rem;
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
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
  display: none;
  justify-content: center;
  align-items: center;
  align-content: center;
  background-color: #fff;
  border-radius: 0.1rem;
  margin-bottom: 0.3rem;
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
    justify-content: center;
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
.required-holder {
  &:before {
    margin-right: 2px;
    color: #fff;
    content: '*';
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
  margin-top: 0.2rem;
  width: 1.5rem;
  font-size: 0.3rem;
}
.littleBtnOld {
  font-size: 0.35rem;
}
.endBtn {
  display: none;
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
  .itemMoney {
    .van-field__control {
      text-align: right;
    }
  }
  .field-with-extra {
    .van-cell {
      padding: 0;
      .van-field__control {
        text-align: right;
      }
    }
    .van-cell__title {
      font-size: 0.28rem;
      font-weight: 500;
    }
  }
  .field-extra {
    padding-left: 0.05rem;
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
