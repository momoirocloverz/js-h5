<template>
  <div class="investHomeCon">
    <!-- <van-search v-model.trim="state.searchValue" placeholder="请输入地块名称搜索" @change="searchChange" @blur="blurInput" /> -->
    <div class="search">
      <input type="text" v-model.trim="state.searchValue" placeholder="请输入地块名称搜索" :class="state.ZLBFitForOld ? 'searchInputOld' : ''" @blur="blurInput" />
      <van-icon name="search" />
      <van-icon name="cross" v-if="state.searchValue" @click="allClear" />
      <span @click="onSearch" :class="state.ZLBFitForOld ? 'searchInputOld' : ''">搜索</span>
    </div>
    <div class="scrollConOuter" v-show="state.showSerachList" @click.stop="state.showSerachList = false">
      <div class="scrollCon">
        <template v-for="(item, index) in state.serachResList" :key="index">
          <div>
            <div class="listItem" @click.stop="selectCurrent(item)">{{ item.properties.小地名 }}</div>
          </div>
        </template>
      </div>
    </div>
    <van-dropdown-menu active-color="#1B82EC">
      <van-dropdown-item v-model="state.address1" :title="state.addressDropTitle" ref="item">
        <van-cascader :closeable="state.negative" v-model="state.addressValue" :title="state.areaaddressTitle" :field-names="fieldNames" :options="state.addressOptions" @finish="onFinish" />
        <div class="addressOperateCon withMargin">
          <van-button type="primary" class="cancelBtn" plain @click="resetDrop" size="mini">重置</van-button>
          <van-button type="primary" class="confirmBtn" plain @click="shutDrop" size="mini">确认</van-button>
        </div>
      </van-dropdown-item>
      <!-- :options="state.option2" -->
      <van-dropdown-item v-model="state.types" ref="item2" :title="state.areaDropTitle">
        <van-radio-group v-model="state.radioCheck">
          <van-cell-group inset>
            <van-cell title="100亩以下" clickable @click="state.radioCheck = '1'">
              <template #right-icon>
                <van-radio name="1" />
              </template>
            </van-cell>
            <van-cell title="100-200亩" clickable @click="state.radioCheck = '2'">
              <template #right-icon>
                <van-radio name="2" />
              </template>
            </van-cell>
            <van-cell title="200亩以上" clickable @click="state.radioCheck = '3'">
              <template #right-icon>
                <van-radio name="3" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
        <div class="addressOperateCon withMargin">
          <van-button type="primary" plain class="cancelBtn" @click="reset2Drop" size="mini">重置</van-button>
          <van-button type="primary" plain class="confirmBtn" @click="shut2Drop" size="mini">确认</van-button>
        </div>
      </van-dropdown-item>
    </van-dropdown-menu>
    <mapCon :showDataTag="state.dynamicShowDataTag" :searchResData="state.searchResData" :area="state.area" :address="state.address" :town="state.town"></mapCon>
    <!-- <iframe id="gisI2frame" src="/mapModule/PHJSC_final.html" style="width: 100%; height: 100%; background-color: transparent; border: rgba(255, 255, 255, 0)" key="12"></iframe> -->
    <!-- <div @click="gobackLayer" class="gobackBtn">
      <img src="https://img.hzanchu.com/acimg/634a90dcfa7cc834e7e35ec5b426a4eb.png" />
      <div>返回上一级</div>
    </div> -->
    <div class="rightArea">
      <div class="rightFirst" @click="toMatch">
        <img src="https://img.hzanchu.com/acimg/56bcd64b71363a77985aea1cb4dcb83f.png" />
        <div class="rightText">政策匹配</div>
      </div>
      <div class="rightSecond" @click="toNotice">
        <img class="addonImg" src="https://img.hzanchu.com/acimg/8bbcbd24cddd7120d27921d5137a2ae7.png" />
        <div class="rightText">注意事项</div>
      </div>
      <div class="rightThird" @click="toProgress">
        <img class="addonImg" src="https://img.hzanchu.com/acimg/ba415d3be7c777500240870fc999ea35.png" />
        <div class="rightText">办事流程</div>
      </div>
    </div>

    <div class="bottomArea" @click="toPreserve">项目申报</div>

    <van-popup v-model:show="state.show" round position="bottom">
      <!-- <div class="addressOperateCon">
        <div class="cancelBtn" @click="state.show = false">取消</div>
        <div class="confirmBtn" @click="confirmAddress">确定</div>
      </div> -->
      <van-cascader closeable v-model="state.cascaderValue" :title="state.areaPopTitle" :field-names="fieldNames" :options="state.options" @finish="onTypeFinish" @close="state.show = false" />
    </van-popup>
    <Loading :visiable="visiable"></Loading>
  </div>
</template>
<script>
import { reactive, onMounted, ref, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import Loading from '@/components/loading'
import { isZLB } from '@/util/index'
import { Toast } from 'vant'
import Request from '@/service/request'
import realData from './real.json'
import mapCon from './mapCon.vue'
export default {
  components: { Loading, mapCon },
  setup() {
    const Router = useRouter()
    const visiable = ref(false)
    const item = ref(null)
    const item2 = ref(null)
    const state = reactive({
      serachResList: [],
      showSerachList: false,
      show: false,
      showMap: true,
      negative: false,
      cascaderValue: '',
      addressValue: '',
      addressOptions: [],
      areaaddressTitle: '请选择地址',
      areaPopTitle: '请选择类目',
      addressDropTitle: '江山市',
      areaDropTitle: '面积',
      radioCheck: '',
      options: [],
      ZLBFLAG: isZLB(),
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
      searchValue: '',
      address1: 0,
      types: '',
      option1: [
        { text: '全部商品', value: 0 },
        { text: '新款商品', value: 1 },
        { text: '活动商品', value: 2 }
      ],
      option2: [
        { text: '100亩以下', value: '1' },
        { text: '100-200亩', value: '2' },
        { text: '200亩以上', value: '3' }
      ],
      mixData: [],
      mixAddress: [],
      detail: {},
      sourceSearchArray: [],
      dynamicShowDataTag: '0',
      searchResData: {},
      area: '',
      address: '',
      town: ''
    })
    const sendMessage = (type, data) => {}
    const fetchInitArray = () => {
      Request.investCategoryGetList()
        .then((res) => {
          if (res && res.code == 0) {
            state.options = res.data
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    const controlShow = () => {
      let track = sessionStorage.getItem('investCode1')
      let normalArray = sessionStorage.getItem('investArray1')
      if (normalArray) {
        state.mixData = JSON.parse(normalArray)
      }
      console.log('state.mixData ', state.mixData)
      if (track) {
        visiable.value = true
        Request.investBsydGetInfo({ invest_category_id: track })
          .then((res) => {
            if (res && res.code == 0) {
              state.detail = res.data.info
            }
          })
          .finally(() => {
            visiable.value = false
          })
        state.show = false
      } else {
        state.show = true
      }
    }
    const anlayseData = () => {
      const special = new acol_dea().decodeGeoJson({ data: realData })
      state.sourceSearchArray = special.features.filter((ele) => {
        return ele.properties.小地名
      })
    }

    const blurInput = () => {
      state.showSerachList = false
    }
    const selectCurrent = (item) => {
      state.searchValue = item.properties.小地名
      state.showSerachList = false
      let track = state.sourceSearchArray.find((item) => {
        return item.properties.小地名 == state.searchValue
      })
      if (track) {
        state.searchResData = track
      }
    }
    onMounted(() => {
      controlShow()
      anlayseData()
      fetchCity()
      fetchInitArray()
      setTimeout(() => {
        if (state.mixData[0] && state.mixData[0].name == '养殖业') {
          state.dynamicShowDataTag = '1'
        } else {
          //   Toast('该产业暂无内容')
          state.searchValue = ''
          state.serachResList = []
          state.sourceSearchArray = []
          state.dynamicShowDataTag = '0'
        }
      }, 2000)
    })

    const fetchCity = () => {
      Request.areaGetMapAreaList().then((res) => {
        if (res && res.code == 0) {
          res.data.list[0].children.forEach((ele) => {
            delete ele.children
          })
          res.data.list[0].children.unshift({
            id: 0,
            name: '本级'
          })
          state.addressOptions = res.data.list
        }
      })
    }

    const fieldNames = {
      text: 'name',
      value: 'id',
      children: 'children'
    }
    const onFinish = ({ selectedOptions }) => {
      state.mixAddress = selectedOptions
    }
    const onTypeFinish = ({ selectedOptions }) => {
      state.show = false
      state.mixData = selectedOptions
      if (selectedOptions[0] && selectedOptions[0].name == '养殖业') {
        anlayseData()
        state.dynamicShowDataTag = '1'
      } else {
        Toast('该产业暂无内容')
        state.searchValue = ''
        state.serachResList = []
        state.sourceSearchArray = []
        state.dynamicShowDataTag = '0'
      }
      console.log('state.cascaderValue', state.cascaderValue)
      if (state.cascaderValue) {
        visiable.value = true
        Request.investBsydGetInfo({ invest_category_id: state.cascaderValue })
          .then((res) => {
            if (res && res.code == 0) {
              state.detail = res.data.info
            }
          })
          .finally(() => {
            visiable.value = false
          })
        sessionStorage.setItem('investArray1', JSON.stringify(state.mixData))
        sessionStorage.setItem('investCode1', state.cascaderValue)
      }
    }

    const gobackLayer = () => {
      let message = {
        key: 'goBack',
        value: { name: '1' }
      }
    }
    const toMatch = () => {
      let track = sessionStorage.getItem('investCode1')
      if (track) {
        if (state.mixData) {
          Router.push({
            name: 'investDetail',
            query: {
              invest_category_id: track
            }
          })
        } else {
          Toast('请选择类目')
          state.show = true
        }
      } else {
        Toast('请选择类目')
        state.show = true
      }
    }
    const toNotice = () => {
      let track = sessionStorage.getItem('investCode1')
      if (track) {
        if (state.detail.id) {
          Router.push({
            name: 'investNotice',
            query: {
              invest_category_id: track
            }
          })
        } else {
          Toast('暂不可查看注意事项/办事流程')
        }
      } else {
        Toast('请选择类目')
        state.show = true
      }
    }
    const toProgress = () => {
      let track = sessionStorage.getItem('investCode1')
      if (track) {
        if (state.detail.id) {
          Router.push({
            name: 'investProgress',
            query: {
              invest_category_id: track
            }
          })
        } else {
          Toast('暂不可查看注意事项/办事流程')
        }
      } else {
        Toast('请选择类目')
        state.show = true
      }
    }
    const resetDrop = () => {
      item.value.toggle()
      state.mixAddress = [
        {
          id: 1,
          name: '江山市'
        },
        {
          id: 0,
          name: '本级'
        }
      ]
      state.addressDropTitle = state.mixAddress[0].name
      state.address = '1'
      state.town = ''
    }
    const shutDrop = () => {
      item.value.toggle()
      if (state.mixAddress && state.mixAddress.length) {
        if (state.mixAddress[1] && state.mixAddress[1].id) {
          state.addressDropTitle = state.mixAddress
            .map((ele) => {
              return ele.name
            })
            .join('/')
          state.address = '2'
          state.town = state.mixAddress[1].name
        } else {
          state.address = '1'
          state.town = ''
        }
      } else {
        state.mixAddress = [
          {
            id: 1,
            name: '江山市'
          },
          {
            id: 0,
            name: '本级'
          }
        ]
        state.addressDropTitle = state.mixAddress[0].name
      }
    }
    const reset2Drop = () => {
      item2.value.toggle()
      state.radioCheck = ''
      state.areaDropTitle = '面积'
      state.area = state.radioCheck
    }
    const shut2Drop = () => {
      item2.value.toggle()
      let map = {
        1: '100亩以下',
        2: '100-200亩',
        3: '200亩以上'
      }
      if (state.radioCheck) {
        state.areaDropTitle = map[state.radioCheck]
        state.area = state.radioCheck
      } else {
        state.areaDropTitle = '面积'
      }
    }
    const onSearch = () => {
      if (state.searchValue) {
        state.serachResList = state.sourceSearchArray.filter((item) => {
          return item.properties.小地名.indexOf(state.searchValue) > -1
        })
      } else {
        state.serachResList = []
      }
      console.log(state.serachResList)
      if (state.serachResList.length) {
        state.showSerachList = true
      } else {
        state.showSerachList = false
      }
    }
    const allClear = () => {
      state.searchValue = ''
    }
    const toPreserve = () => {
      Router.push({
        name: 'projectReservePublish'
      })
    }
    return {
      allClear,
      state,
      fieldNames,
      onFinish,
      toMatch,
      toNotice,
      toProgress,
      onTypeFinish,
      visiable,
      item,
      item2,
      shutDrop,
      resetDrop,
      reset2Drop,
      shut2Drop,
      blurInput,
      onSearch,
      selectCurrent,
      gobackLayer,
      toPreserve
    }
  }
}
</script>
<style scoped lang="less">
.scrollConOuter {
  position: absolute;
  width: 100%;
  height: calc(100vh - 3rem);
  //   background-color: rgb(101, 70, 70);
  z-index: 9999;
  //   overflow-y: scroll;
  //   padding-left: 0.3rem;
  //   padding-right: 0.3rem;
  //   box-sizing: border-box;
}

.scrollCon {
  width: 100%;
  height: 5rem;
  background-color: #fff;
  z-index: 99999;
  overflow-y: scroll;
  padding-left: 0.3rem;
  padding-right: 0.3rem;
  box-sizing: border-box;
}
.listItem {
  font-size: 0.3rem;
  padding-left: 0.3rem;
  padding-right: 0.3rem;
  padding-top: 0.16rem;
  padding-bottom: 0.16rem;
  border-bottom: 0.01rem solid rgb(207, 206, 206);
}
.investHomeCon {
  height: calc(100vh - 1.3rem);
  position: relative;
}
.bottomArea {
  position: absolute;
  width: 92%;
  height: 0.84rem;
  left: 4%;
  bottom: 0.3rem;
  border-radius: 0.16rem;
  text-align: center;
  color: #fff;
  line-height: 0.84rem;
  font-size: 0.36rem;
  font-weight: 500;
  background-color: #1b82ec;
}
.rightArea {
  position: absolute;
  width: 1.12rem;
  height: 3.36rem;
  background-color: #fff;
  right: 0.2rem;
  top: 6rem;
  border-radius: 0.06rem;
  padding: 0.08rem;
  box-sizing: border-box;
  box-shadow: 0px 4px 18px rgba(6, 0, 1, 0.3);
}
.rightFirst {
  height: 31%;
  border-bottom: 1px solid #e6e6e6;
}
.rightSecond {
  height: 31%;
  border-bottom: 1px solid #e6e6e6;
}
.rightThird {
  height: 32%;
}
.rightText {
  font-size: 0.2rem;
  margin-bottom: 0.1rem;
  text-align: center;
}
img {
  width: 0.48rem;
  height: 0.48rem;
  display: block;
  margin: 0 auto;
  margin-bottom: 0.14rem;
}
.addonImg {
  margin-top: 0.1rem;
}
.addressOperateCon {
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;

  .confirmBtn {
    margin-top: 0.3rem;
    margin-right: 0.3rem;
    font-size: 0.3rem;
  }
  .cancelBtn {
    margin-top: 0.3rem;
    margin-left: 0.3rem;
    font-size: 0.3rem;
  }
}
.withMargin {
  margin-bottom: 0.4rem;
}
.search {
  background: #fff;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.2rem 0.3rem;
  .van-icon-search {
    position: absolute;
    font-size: 0.3rem;
    left: 0.4rem;
    color: #999;
  }
  .van-icon-cross {
    position: absolute;
    font-size: 0.3rem;
    right: 1.3rem;
    color: #999;
  }
  span {
    font-size: 0.28rem;
    font-weight: 500;
    color: #666;
    margin-left: 0.2rem;
  }
  input {
    height: 0.6rem;
    flex: 1;
    border-radius: 0.3rem;
    font-size: 0.28rem;
    text-indent: 0.5rem;
    background: #f6f6f6;
  }
  .searchInputOld {
    font-size: 0.35rem;
  }
}
.gobackBtn {
  position: absolute;
  width: 2.1rem;
  height: 0.56rem;
  background-color: #fff;
  left: 0.2rem;
  top: 2.2rem;
  color: #1b82ec;
  font-size: 0.28rem;
  border-radius: 0.06rem;
  box-sizing: border-box;
  box-shadow: 0px 4px 18px rgba(6, 0, 1, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  img {
    width: 0.28rem;
    height: 0.24rem;
    display: block;
    margin: 0 !important;
  }
  div {
    margin-left: 0.1rem;
  }
}
</style>
