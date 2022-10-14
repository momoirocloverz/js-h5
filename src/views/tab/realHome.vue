<template>
  <div class="realHome">
    <div class="headCon">
      <img class="headerImg" :src="state.bannerHome ? state.bannerHome.cover : 'https://img.hzanchu.com/acimg/27551499dda6a96238115ae8b6b4ada0.png?x-oss-process=image/resize,l_300'" />
      <div class="search">
        <img src="https://img.hzanchu.com/acimg/c546612969ba3aff09fbdc4cdb5b55c3.png" alt="" />
        <div class="subSearch" ref="titleBox">
          <template v-for="(item, index) in state.newNoticeBoardArray" :key="index">
            <div class="noticeItem" @click="toNoticeDetail(item)">
              <div class="noticeLeft" :class="state.ZLBFitForOld ? 'noticeLeftOld' : ''">
                {{ item.title }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="understandEntrance">
      <div class="understandImgCon" @click="toUnderstand">
        <div class="under-first-con-text" :class="state.ZLBFitForOld ? 'underConTextOld' : ''">明白纸专区</div>
        <div class="underConText" :class="state.ZLBFitForOld ? 'underConTextOld' : ''">解读政策&nbsp;&nbsp;人人明白</div>
        <img class="understandMainImg" src="https://img.hzanchu.com/acimg/a7ee8525a493711f758bbbded9c71b10.png" />
        <button class="underSmallImg" :class="state.ZLBFitForOld ? 'underSmallImgOld' : ''">点击查看 ></button>
      </div>
    </div>

    <div class="paddingCon">
      <div class="competitive-projects center-box">
        <div class="header-box">
          <div class="folding-bar">
            <div class="title" :class="state.ZLBFitForOld ? 'tagTextOld' : ''">竞争性财政支农项目</div>
          </div>
          <div class="more" @click="toPolicy(tabIdObj.competeCategoryId)" :class="state.ZLBFitForOld ? 'moreOld' : ''">
            更多
            <van-icon name="arrow" />
          </div>
        </div>
        <van-list v-model:loading="state.loading" :finished="state.finished" :immediate-check="false">
          <div class="listCon">
            <template v-for="(item, index) in state.bannerJzxList" :key="index">
              <div class="itemCon" @click="checkDetail(item)" :style="`background: url(${item.cover}) no-repeat;background-size: 100% 100%;`">
                <div class="title van-multi-ellipsis--l2" :class="state.ZLBFitForOld ? 'titleOld' : ''" :style="{ color: item.color }">{{ item.title }}</div>
              </div>
            </template>
          </div>
          <div class="emptyHolder" v-if="!state.loading && state.bannerJzxList && !state.bannerJzxList.length">
            <img src="https://img.hzanchu.com/acimg/698206a6fba0842528424a9f6f7e0cd4.png" />
            <p>没有更多了</p>
          </div>
        </van-list>
      </div>
      <div class="policyEntrance center-box">
        <div class="folding-bar">
          <div class="title" :class="state.ZLBFitForOld ? 'tagTextOld' : ''">惠农补贴</div>
          <div class="more" @click="toPolicy(tabIdObj.discountCategoryId)" :class="state.ZLBFitForOld ? 'moreOld' : ''">
            更多
            <van-icon name="arrow" />
          </div>
        </div>
        <van-list v-model:loading="state.loading" :finished="state.finished" :immediate-check="false">
          <div class="discountlistCon">
            <template v-for="(item, index) in state.bannerPhList" :key="index">
              <div
                class="discountCon"
                @click="toPolicy(tabIdObj.discountCategoryId, item.policy_category_id)"
                :style="`background: url(${state.imgList[index].imgId}) no-repeat;background-size: 100% 100%;`"
              >
                <div class="itemInnerCon">
                  <div class="leftCon">
                    <div class="title van-multi-ellipsis--l2" :class="state.ZLBFitForOld ? 'titleOld' : ''" :style="{ color: state.imgList[index].color }">
                      {{ item.title }}
                    </div>
                  </div>
                  <img :src="state.imgList[index].imgIcon" class="icon" />
                  <!-- <div class="rightCon">
                    <div class="submitBtn">
                      <img :src="item.imgIcon" :style="{ width: index == 3 ? '1rem' : '0.7rem' }" alt="" />
                    </div>
                  </div> -->
                </div>
              </div>
            </template>
            <div class="emptyHolder" v-if="!state.loading && state.imgList && !state.imgList.length">
              <img src="https://img.hzanchu.com/acimg/698206a6fba0842528424a9f6f7e0cd4.png" />
              <p>没有更多了</p>
            </div>
          </div>
        </van-list>
      </div>
      <div class="noticeCon center-box">
        <div class="folding-bar">
          <div class="title" :class="state.ZLBFitForOld ? 'tagTextOld' : ''">公示公告栏</div>
          <div class="more" @click="toNoticeList" :class="state.ZLBFitForOld ? 'moreOld' : ''">
            更多
            <van-icon name="arrow" />
          </div>
        </div>
        <div class="noticeListCon">
          <template v-for="(item, index) in state.noticeBoardArray" :key="index">
            <div v-if="index <= 3" class="noticeItem" @click="toNoticeDetail(item)">
              <div class="noticeLeft" :class="state.ZLBFitForOld ? 'noticeLeftOld' : ''">
                {{ item.title }}
              </div>
              <div class="noticeRight" :class="state.ZLBFitForOld ? 'noticeRightOld' : ''">
                {{ dayjs(item.created_at).format('YYYY-MM-DD') }}
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="merchantsCon center-box">
        <div class="folding-bar">
          <div class="title" :class="state.ZLBFitForOld ? 'tagTextOld' : ''">招商推介</div>
          <div class="more" @click="toAttractList" :class="state.ZLBFitForOld ? 'moreOld' : ''">
            更多
            <van-icon name="arrow" />
          </div>
        </div>
        <div class="merchantsListCon">
          <template v-for="(item, index) in state.merchantsArray" :key="index">
            <div class="merchantItem" @click="toAttractDetail(item)">
              <div class="merchantLeft">
                <div class="merchantTitle" :class="state.ZLBFitForOld ? 'merchantTitleOld' : ''">
                  {{ item.title }}
                </div>
                <div class="merchantTime" :class="state.ZLBFitForOld ? 'merchantTimeOld' : ''">
                  {{ item.created_at && dayjs(item.created_at).format('YYYY-MM-DD') }}
                </div>
              </div>
              <div class="merchantRight">
                <img :src="item.cover" v-if="item.cover" />
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="fourPartOuterCon">
        <div class="fourPartCon">
          <div class="folding-bar">
            <div class="title" :class="state.ZLBFitForOld ? 'tagTextOld' : ''">其他</div>
          </div>
          <div class="centent-box">
            <template v-for="(item, index) in state.fourPartArray" :key="index">
              <div
                class="fourItem"
                @click="jumpAction(item)"
                :style="{
                  backgroundImage: 'url(' + item.backImage + ')',
                  marginRight: index % 2 ? '0rem' : '0.15rem'
                }"
              >
                <div class="fourItemText" :class="state.ZLBFitForOld ? 'fourItemTextOld' : ''">
                  {{ item.text }}
                </div>
                <img :src="item.image" alt="" />
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div class="serviceCon" v-if="state.ZLBFLAG">
      <div class="service" :class="state.ZLBFitForOld ? 'serviceOld' : ''">本服务由浙江政务服务网、江山市农业农村局提供。</div>
      <div class="service" :class="state.ZLBFitForOld ? 'serviceOld' : ''">
        服务咨询热线：
        <span @click="toCall">0570-4022874</span>
      </div>
    </div>
    <!-- 地址选择器 -->
    <van-popup v-model:show="state.show" round position="bottom">
      <div class="addressOperateCon">
        <div class="cancelBtn" @click="state.show = false">取消</div>
        <div class="confirmBtn" @click="confirmAddress">确定</div>
      </div>
      <van-cascader :closeable="false" :title="state.areaPopTitle" :field-names="fieldNames" :options="state.options" @finish="onFinish" />
    </van-popup>
    <Loading :visiable="state.visible"></Loading>
  </div>
</template>

<script>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import dayjs from 'dayjs'
import { Dialog, Toast } from 'vant'
import { isZLB, getConfigByKey } from '@/util/index'
import Request from '@/service/request'
import { mgop } from '@aligov/jssdk-mgop'
import Loading from '@/components/loading'
export default {
  components: { Loading },
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const titleBox = ref(null)
    const tabIdObj = {
      competeCategoryId: '14', //竞争性财政支农项目 tabID
      discountCategoryId: '19', //惠农补贴 tabID
      allCategoryId: '0' //全部 tabID
    }
    const state = reactive({
      fourPartArray: [
        {
          image: 'https://img.hzanchu.com/acimg/2fcb81fe972dd3ebd30891ab386ce4a8.png',
          backImage: 'https://img.hzanchu.com/acimg/60702103f839872cf53a23c35d3cdd09.png',
          text: '项目储备',
          link: 'projectReserve',
          color: '#F0FFFA',
          source: ''
        },
        {
          image: 'https://img.hzanchu.com/acimg/d379ab6259046ace2db41066fa1cfb9e.png',
          text: '项目备案',
          color: '#EFF9FF',
          link: '',
          source: 'https://tzxm.zjzwfw.gov.cn/myProjectDeclareAction.do?method=goApprtProject&AUDIT_TYPE=03&IS_FOREIGN=0&IS_CAR=0&isBigJw=0&porject_apply_type=0',
          backImage: 'https://img.hzanchu.com/acimg/f0f789dcffb3606ec3557bed2331cc4c.png'
        },
        {
          image: 'https://img.hzanchu.com/acimg/03e0e696195f774eeaec6494928a6a8d.png',
          text: '用地审批',
          backImage: 'https://img.hzanchu.com/acimg/bb7fec1ec82b29bd65b94d5e4b27bc81.png',
          color: '#EEF5FF',
          link: '',
          source: 'https://www.zjzwfw.gov.cn/zjservice/item/detail/index.do?localInnerCode=ff03b7a3-7baa-4432-9454-19fbcc37dc8b'
        },
        {
          image: 'https://img.hzanchu.com/acimg/3d59e4d9d69b4226b210890d60289642.png',
          text: '我要报固投',
          backImage: 'https://img.hzanchu.com/acimg/373b1b5ddc30e148a7cff2aba69d49a8.png',
          color: '#FCF4E5',
          link: '',
          source: 'http://lwzbdr.tjj.zj.gov.cn/dr/queryLoginInfo.do'
        }
      ],
      visible: false,
      loading: ref(true),
      discountsDataList: [],
      competeDataList: [],
      projectSubSwitch: ref(false),
      projectSwitch: ref(false),
      show: ref(false), //控制地址选择栏显隐
      areaPopTitle: '请选择所在地区',
      options: [],
      activeName: '1',
      ZLBFLAG: isZLB(), //是否是浙里办
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
      inputVal: '',
      merchantsArray: [],
      noticeBoardArray: [],
      newNoticeBoardArray: [],
      imgList: [
        {
          title: '粮油适度规模经营补贴',
          imgId: 'https://img.hzanchu.com/acimg/83228f032b35ec0efe1ad96c5d62b1e2.png',
          color: '#D39405',
          imgIcon: 'https://img.hzanchu.com/acimg/11a80449c0b9d581494ebe290998763a.png',
          tabId: '34'
        },
        {
          title: '秸秆综合利用补贴',
          imgId: 'https://img.hzanchu.com/acimg/bd344c96be00719536a510061b742ff3.png',
          color: '#0564D3',
          imgIcon: 'https://img.hzanchu.com/acimg/686d339e2f7d29d923cdf8540a224511.png',
          tabId: '25'
        },
        {
          title: '有机肥使用补贴',
          imgId: 'https://img.hzanchu.com/acimg/cdc75dae488bb7c60cd5cc6a01c8eab8.png',
          color: '#054CD3',
          imgIcon: 'https://img.hzanchu.com/acimg/5da08ac23bc3c989dfe66fabb1d42538.png',
          tabId: '24'
        },
        {
          title: '湖羊产业补贴',
          imgId: 'https://img.hzanchu.com/acimg/f7c4fe9578c53bd6b1067a943b96a307.png',
          color: '#5EBC52',
          imgIcon: 'https://img.hzanchu.com/acimg/d7323cdce09802addbace37840bdd3ce.png',
          tabId: '31'
        }
      ],
      competeImgList: [
        { imgId: 'https://img.hzanchu.com/acimg/6b9631ef00ff5515bfef490d66e2c1cc.png', color: '#61B416' },
        { imgId: 'https://img.hzanchu.com/acimg/16496f4d6fff0b5cb12501414e194b9a.png', color: '#1B82EC' }
      ],
      bannerJzxList: reactive([]),
      bannerPhList: reactive([]),
      bannerHome: reactive(null)
    })
    const unite1 = (res) => {
      let temp1 = res.data.attract_investment
      if (temp1.length) {
        // temp1[0].image = 'https://img.hzanchu.com/acimg/f44ea543b604dfecf80c9154df963208.png?x-oss-process=image/resize,l_300'
        // temp1[1].image = 'https://img.hzanchu.com/acimg/678a6c4a1e4e8f078525e28b9d7e8ff8.png?x-oss-process=image/resize,l_300'
        // temp1[2].image = 'https://img.hzanchu.com/acimg/72273ecf6c4e774feb80ded163752aa1.png?x-oss-process=image/resize,l_300'
        state.merchantsArray = temp1
        state.noticeBoardArray = res.data.notice_board
        const newArr = res.data.notice_board.slice(0, 3) //复制一遍用来滚动公示栏使用
        state.newNoticeBoardArray = newArr.concat(newArr)
      }
      state.bannerJzxList = res.data.banner_project_jzx
      state.bannerPhList = res.data.banner_project_czbt.slice(0, 4)
      state.bannerHome = res.data.banner_index
      state.loading = false
      state.finished = true
    }
    watch(
      () => state.newNoticeBoardArray,
      () => {
        //监听标识栏数据拿到后头顶滚动标题栏开始运行
        scrollTitle()
      }
    )
    // 浙里办拨打电话
    const consultTrigger = (tel) => {
      ZWJSBridge.phoneCall({
        corpId: tel
      })
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
    }
    const fetchAddress = () => {
      //地址栏选中配置
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
    const fetchCategoryAction = () => {
      //查询惠农补贴和竞争性财政支农项目selectID
      if (state.ZLBFLAG) {
        //判断浙里办调用不同的requestAPi
        Request.fetchPolicyCategoryListMGOP({})
          .then((res) => {
            if (res.data && res.data.data) {
              if (Array.isArray(res.data.data)) {
                ;(res.data.data || []).forEach((element) => {
                  state.imgList.forEach((item) => {
                    if (element && element.category_name == item.title) {
                      item.tabId = element.id
                    }
                    // if (element?.category_name == item.title) item.tabId = element.id
                  })
                })
                let track2 = res.data.data.find((ele) => {
                  return ['惠农补贴', '财政补贴'].includes(ele.category_name)
                })
                tabIdObj.discountCategoryId = track2.id
                if (track2) {
                  fetchList(track2.id)
                }
                let track1 = res.data.data.find((ele) => {
                  return ele.category_name == '竞争性财政支农项目'
                })
                tabIdObj.competeCategoryId = track1.id
                if (track1) {
                  fetchList(track1.id)
                }
              }
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      } else {
        Request.fetchPolicyCategoryList({}).then((res) => {
          if (res && res.code == 0) {
            if (res && res.data) {
              if (Array.isArray(res.data)) {
                ;(res.data || []).forEach((element) => {
                  state.imgList.forEach((item) => {
                    // if (element?.category_name == item.title) item.tabId = element.id
                    if (element && element.category_name == item.title) {
                      item.tabId = element.id
                    }
                  })
                })
                let track2 = res.data.find((ele) => {
                  return ['惠农补贴', '财政补贴'].includes(ele.category_name)
                })
                tabIdObj.discountCategoryId = track2.id
                if (track2) {
                  fetchList(track2.id)
                }
                let track1 = res.data.find((ele) => {
                  return ele.category_name == '竞争性财政支农项目'
                })
                tabIdObj.competeCategoryId = track1.id
                if (track1) {
                  fetchList(track1.id)
                }
              }
            }
          } else {
            Toast(res.msg)
          }
        })
      }
    }

    const fetchList = (category_id) => {
      //查询惠农补贴和竞争性财政支农项目列表
      state.loading = true
      if (state.ZLBFLAG) {
        Request.fetchPolicyDocumentListMGOP({
          page: 1,
          pagesize: 100,
          category_id
        })
          .then((res) => {
            // const data = res?.data?.data?.data || []
            // if (category_id === tabIdObj.discountCategoryId) {
            //   state.discountsDataList = data
            // } else {
            //   const newRes = [] //目前写死只要下面两个数据 产品对接麦麦
            //   // 2022年度家庭农场
            //   //稻渔综合种养示范基地建设项目和省级稻渔综合种养示范基地项目
            //   newRes.push(
            //     data.find((item) => {
            //       return item.title.indexOf('稻渔综合种养示范基地建设项目和省级稻渔综合种养示范基地项目') != -1
            //     })
            //   )
            //   newRes.push(
            //     data.find((item) => {
            //       return item.title.indexOf('2022年度家庭农场') != -1
            //     })
            //   )
            //   newRes[0].title = '稻鱼综合种养田间工程建设补助' //目前先写死（因为太长了展示很奇怪）后续考虑如何动态展示 产品对接麦麦
            //   newRes[1].title = '家庭农场财政扶持项目' //目前先写死（因为太长了展示很奇怪）后续考虑如何动态展示 产品对接麦麦
            //   // console.log(newRes)
            //   state.competeDataList = newRes
            // }
            // state.loading = false
            // state.finished = true
            return res
          })
          .catch((err) => {
            console.log(err, 'err')
            state.finished = true
            state.loading = false
          })
          .finally(() => {
            state.loading = false
            state.finished = true
          })
      } else {
        Request.fetchPolicyDocumentList({
          page: 1,
          pagesize: 100,
          category_id
        })
          .then((res) => {
            // if (category_id === tabIdObj.discountCategoryId) {
            //   state.discountsDataList = res?.data?.data
            // } else {
            //   const newRes = [] //目前写死只要下面两个数据 产品对接麦麦
            //   // 2022年度家庭农场
            //   //稻渔综合种养示范基地建设项目和省级稻渔综合种养示范基地项目
            //   newRes.push(
            //     res?.data?.data.find((item) => {
            //       return item.title.indexOf('稻渔综合种养示范基地建设项目和省级稻渔综合种养示范基地项目') != -1
            //     })
            //   )
            //   newRes.push(
            //     res?.data?.data.find((item) => {
            //       return item.title.indexOf('2022年度家庭农场') != -1
            //     })
            //   )
            //   newRes[0].title = '稻鱼综合种养田间工程建设补助' //目前先写死（因为太长了展示很奇怪）后续考虑如何动态展示 产品对接麦麦
            //   newRes[1].title = '家庭农场财政扶持项目' //目前先写死（因为太长了展示很奇怪）后续考虑如何动态展示 产品对接麦麦
            //   state.competeDataList = newRes
            // }
            // state.loading = false
            // state.finished = true
            return res
          })
          .catch((err) => {
            console.log(err, 'err')
            state.loading = false
            state.finished = true
          })
      }
    }
    const fetchHomeList = () => {
      state.visible = true
      if (state.ZLBFLAG) {
        Request.fetchHomePageMGOP({})
          .then((res) => {
            if (res) {
              unite1(res.data)
            } else {
              Toast(res.msg)
            }
            state.visible = false
          })
          .catch((err) => {
            state.visible = false
            console.log('err', err)
          })
      } else {
        Request.fetchHomePage({})
          .then((res) => {
            if (res && res.code == 0) {
              unite1(res)
            } else {
              Toast(res.msg)
            }
            state.visible = false
          })
          .catch((err) => {
            state.visible = false
            console.log('err', err)
          })
      }
    }
    // 判断是否是第三方登录
    const thirdLogin = () => {
      // let herf = window.location.href + "#/blank"
      // console.log(herf)
      // console.log(herf.indexOf('token'))
      // console.log(herf.substring(herf.indexOf('token') + 5, herf.lastIndexOf("#")))
      // console.error(Route.query)

      if (Route.query.token_zxstmc && state.ZLBFLAG) {
        // Toast('thirdLogin' + Route.query.token)
        // console.log(Route.query)
        Request.ssoLogin({
          token: Route.query.token_zxstmc
        })
          .then((res) => {
            // Dialog.confirm({
            //   title: "then" + JSON.stringify(res)
            // })
            localStorage.setItem('token', res.data.token)
            setTimeout(() => {
              getUserInfo()
            }, 0)
          })
          .catch((res) => {
            // Dialog.confirm({
            //   title: 'catch' + JSON.stringify(res)
            // })
          })
      } else {
        fetchUserType()
      }
    }
    const getUserInfo = () => {
      Request.getUserInfo({})
        .then((res) => {
          if (res && res.code == 0) {
            // Toast(JSON.stringify(res))
            localStorage.setItem('zlbUserInfo', JSON.stringify(res.data.zhelb_user_info))
            localStorage.setItem('ourUserInfo', JSON.stringify(res.data.userinfo))
          } else {
            Toast(res.msg)
          }
          state.visible = false
          fetchHomeList()
        })
        .catch((err) => {
          console.log('err', err)
          state.visible = false
          fetchHomeList()
        })
    }
    onMounted(async () => {
      // console.log(Route.query)
      thirdLogin()
      // fetchUserType()
      fetchAddress() //获取地址配置
      fetchCategoryAction() //获取列表的id
      state.projectSubSwitch = await getConfigByKey('project_sub_apply_switch') // 惠农补贴开关
      state.projectSwitch = await getConfigByKey('project_apply_switch') // 竞争性项目开关
    })
    const legalRequest = () => {
      if (state.ZLBFLAG) {
        if (Route.query.token) {
          localStorage.setItem('token', Route.query.token)
          Request.getUserInfo({})
            .then((res) => {
              if (res && res.code == 0) {
                // Toast(JSON.stringify(res))
                localStorage.setItem('zlbUserInfo', JSON.stringify(res.data.zhelb_user_info))
                localStorage.setItem('ourUserInfo', JSON.stringify(res.data.userinfo))
              } else {
                Toast(res.msg)
              }
              state.visible = false
              fetchHomeList()
            })
            .catch((err) => {
              console.log('err', err)
              state.visible = false
              fetchHomeList()
            })
        } else {
          fetchHomeList()
        }
      }
    }
    const fetchUserType = () => {
      console.error('fetchUserType')
      if (state.ZLBFLAG) {
        const sUserAgent = window.navigator.userAgent.toLowerCase()
        const bIsDtDreamApp = sUserAgent.indexOf('dtdreamweb') > -1 // 浙里办APP
        const bIsAlipayMini = sUserAgent.indexOf('miniprogram') > -1 && sUserAgent.indexOf('alipay') > -1
        if (bIsAlipayMini) {
          ticketRequest()
        } else {
          ZWJSBridge.getUserType({})
            .then((res) => {
              // Toast(res.userType)
              state.visible = true
              if (res.userType == 2) {
                legalRequest()
              } else {
                ticketRequest()
              }
            })
            .catch((err) => {
              console.log('err', err)
            })
        }
      } else {
        fetchHomeList()
      }
    }
    const ticketRequest = () => {
      if (state.ZLBFLAG) {
        if (Route.query.ticket) {
          //   Toast(Route.query.ticket)
          if (Route.query.sp) {
            // window.location.href =
            //   Route.query.sp + '?ticket=' + Route.query.ticket
            fetchHomeList()
          } else {
            let tokenFlag = localStorage.getItem('token') ? localStorage.getItem('token') : ''
            if (tokenFlag) {
              let zlbInfo = JSON.parse(localStorage.getItem('ourUserInfo'))
              state.userInfo = zlbInfo
              fetchHomeList()
            } else {
              state.visible = true
              mgop({
                api: 'mgop.zjanchu.jnt.zhelbZhelbTicketValidation', // 必须
                host: 'https://mapi.zjzwfw.gov.cn/',
                dataType: 'JSON',
                type: 'POST',
                data: {
                  st: Route.query.ticket
                },
                header: {
                  Authorization: ''
                  // isTestUrl: '1'
                },
                appKey: '9qz1aeub+2001923948+qsmsjd', // 必须
                onSuccess: (data) => {
                  let shazam = data.data
                  if (shazam && shazam.code === 0) {
                    if (shazam.data.token) {
                      localStorage.setItem('token', shazam.data.token)
                      localStorage.setItem('zlbUserInfo', JSON.stringify(shazam.data.zhelb_user_info))
                      localStorage.setItem('ourUserInfo', JSON.stringify(shazam.data.user_info))
                      //   state.userInfo = shazam.data.user_info
                    }
                  } else {
                    Toast(shazam.msg)
                  }
                  state.visible = false
                  fetchHomeList()
                  console.log('请求成功回调', JSON.stringify(data))
                },
                onFail: (err) => {
                  console.log('请求失败回调', JSON.stringify(err))
                  Toast(JSON.stringify(err))
                  state.visible = false
                  fetchHomeList()
                }
              })
            }
          }
        } else {
          fetchHomeList()
        }
      } else {
        fetchHomeList()
      }
    }
    const toUnderstand = () => {
      Router.push({
        name: 'understandPolicy'
      })
    }
    const toNoticeList = () => {
      Router.push({
        name: 'notice'
      })
    }
    const toAttractList = () => {
      Router.push({
        name: 'attract'
      })
    }
    const toAttractDetail = (item) => {
      Router.push({
        name: 'attractDetail',
        query: {
          id: item.id
        }
      })
    }
    const toNoticeDetail = (item) => {
      Router.push({
        name: 'noticeDetail',
        query: {
          id: item.id
        }
      })
    }

    const checkDetail = (item) => {
      Router.push({
        name: 'policyDetail',
        query: {
          id: item.policy_document_id
        }
      })
    }
    const toSearch = () => {
      Router.push({
        name: 'policySearch'
      })
    }
    const toPolicy = (item, secondTabType) => {
      console.log(item, 'item')
      Router.push({
        name: 'policy',
        query: {
          type: item,
          secondTabType
        }
      })
    }
    const toCall = () => {
      ZWJSBridge.phoneCall({
        corpId: '0570-4022874'
      })
    }
    const fieldNames = {
      text: 'name',
      value: 'id',
      children: 'children'
    }

    const scrollTitle = () => {
      //动态滚动公示栏
      fn()
      setInterval(function () {
        fn()
      }, 12000)
    }

    const fn = () => {
      setTimeout(function () {
        if (titleBox.value) {
          titleBox.value.firstChild && titleBox.value.firstChild.nextElementSibling.classList.add('first-top')
          titleBox.value.firstChild && titleBox.value.firstChild.nextElementSibling.classList.remove('third-top')
          // titleBox?.value?.firstChild?.nextElementSibling?.animate({
          //   marginTop:"-0.6rem"
          // },4000);
        }
      }, 4000)
      setTimeout(function () {
        if (titleBox.value) {
          titleBox.value.firstChild && titleBox.value.firstChild.nextElementSibling.classList.add('second-top')
          titleBox.value.firstChild && titleBox.value.firstChild.nextElementSibling.classList.remove('first-top')
          // titleBox?.value?.firstChild?.nextElementSibling?.animate({
          //   marginTop:"-1.2rem"
          // },4000);
        }
      }, 8000)
      setTimeout(function () {
        if (titleBox.value) {
          titleBox.value.firstChild && titleBox.value.firstChild.nextElementSibling.classList.add('third-top')
          titleBox.value.firstChild && titleBox.value.firstChild.nextElementSibling.classList.remove('second-top')
          // titleBox?.value?.firstChild?.nextElementSibling?.animate({
          //   marginTop:"-1.8rem"
          // },4000);
        }
      }, 12000)
    }
    // 选择地址确定
    const confirmAddress = () => {
      const { selectItem } = state
      if (state.ids.length === 0) {
        Toast('请选择地址')
        return
      }
      state.show = false // 关闭地址选择框
      if (selectItem.category_name == '秸秆综合利用补贴') {
        // 继续选择补贴类型
        state.typeShow = true
      } else {
        setAddressAndJump()
      }
    }

    // 设置项目所在地 path：秸秆补贴跳转路由 api：秸秆补贴获取id api
    const setAddressAndJump = (path, api) => {
      const { ids, selectItem } = state
      const params = {
        project_id: '',
        policy_document_id: selectItem.id || null,
        // is_apply_check: 1, // 非必传,不传时不判断 (是否检测在线申报时判重 1=判断 0=不判断)
        city_id: ids[0],
        town_id: ids[1],
        village_id: ids[2]
      }
      let routerName = 'policyList'
      let apiName = 'setPorjectArea'
      if (selectItem.category_name == '有机肥使用补贴') {
        routerName = 'yjfDeclare'
        apiName = 'getYjfSubsidyId'
      } else if (selectItem.category_name == '秸秆综合利用补贴') {
        routerName = path
        apiName = api
      } else if (selectItem.category_name == '湖羊产业补贴') {
        routerName = 'hyDeclare'
        apiName = 'getHySubsidyId'
      } else if (selectItem.category_name == '病死动物无害化处理补贴') {
        routerName = 'whh'
        apiName = 'getWhhSubsidyId'
      } else if (selectItem.category_name == '粮油适度规模经营补贴') {
        routerName = 'lyDeclare'
        apiName = 'getLySubsidyId'
        params.cb_city_id = ids[0]
        params.cb_town_id = ids[1]
        params.cb_village_id = ids[2]
      }
      // return console.log(apiName, JSON.stringify(params))
      state.spining = true
      Request[apiName](params)
        .then((res) => {
          if (res && res.code === 0) {
            Router.push({
              name: routerName,
              query: {
                project_id: apiName == 'setPorjectArea' ? res.data.project_id : res.data,
                policy_document_id: selectItem.id
              }
            })
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          state.spining = false
        })
    }

    const onFinish = ({ selectedOptions }) => {
      state.ids = [selectedOptions[0].id, selectedOptions[1].id, selectedOptions[2].id]
    }
    const jumpAction = (item) => {
      //跳转
      if (item.link) {
        Router.push({
          name: item.link
        })
      } else if (item.source) {
        if (state.ZLBFLAG) {
          ZWJSBridge.openLink({
            url: item.source
          })
        } else {
          window.open(item.source, '_blank')
        }
      } else {
        return false
      }
    }

    return {
      state,
      dayjs,
      fieldNames,
      titleBox,
      checkDetail,
      toNoticeList,
      toAttractList,
      toAttractDetail,
      toNoticeDetail,
      toUnderstand,
      toSearch,
      toPolicy,
      toCall,
      consultTrigger,
      onFinish,
      confirmAddress,
      tabIdObj,
      jumpAction
    }
  }
}
</script>
<style lang="less" scoped>
.fourPartOuterCon {
  margin-bottom: 1rem;
}
.fourPartCon {
  display: flex;
  border-radius: 0.3rem;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
  margin-bottom: 0.3rem;
  background: #fff;
  .centent-box {
    padding: 0 0.3rem 0.3rem 0.3rem;
    width: 100%;
  }
  .folding-bar {
    height: 0.98rem;
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
    &::before {
      content: '';
      display: block;
      width: 0.08rem;
      height: 0.4rem;
      background: url('https://img.hzanchu.com/acimg/dd3a9c0c3ca479fe948fd8e1c6f6ad20.png') no-repeat;
      background-size: 100%;
      position: absolute;
      left: 0;
    }
    .title {
      font-size: 0.36rem;
      color: #2b333f;
      display: flex;
      align-items: center;
      margin-left: 0.3rem;
      font-weight: bold;
      .van-icon {
        margin-left: 0.16rem;
        transition: all 0.3s;
      }
    }
  }
  .homeTag {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    box-sizing: border-box;
  }
  .marBottom20 {
    margin-bottom: 0.2rem;
  }
  .tagLine {
    width: 0.08rem;
    height: 0.4rem;
    background: #1b82ec;
    opacity: 1;
    border-radius: 0.03rem;
    margin-right: 0.2rem;
  }
  .tagText {
    font-size: 0.35rem;
    line-height: 0.6rem;
    height: 0.4rem;
    margin-bottom: 0.25rem;
    font-weight: 600;
    color: #2b333f;
  }
  .tagTextOld {
    font-size: 0.4rem;
  }
  .fourItem {
    width: 48%;
    height: 1.16rem;
    display: inline-flex;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
    padding-left: 0.3rem;
    box-sizing: border-box;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    margin-bottom: 0.2rem;

    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;

    img {
      width: 0.8rem;
      height: 0.8rem;
      margin-left: auto;
      margin-right: 0.3rem;
    }
    .fourItemText {
      font-size: 0.28rem;
      color: #2b333f;
      font-family: PingFang SC;
    }
    .fourItemTextOld {
      font-size: 0.4rem;
    }
  }
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
.homeTag {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  box-sizing: border-box;
}
.marBottom20 {
  margin-bottom: 0.2rem;
}
.more {
  font-size: 0.26rem;
  line-height: 0.3rem;
  color: #999;
}
.moreOld {
  font-size: 0.4rem;
}
.tagLine {
  width: 0.05rem;
  height: 0.3rem;
  background: #1b82ec;
  opacity: 1;
  border-radius: 0.03rem;
  margin-right: 0.25rem;
}
.folding-bar {
  height: 0.98rem;
  display: flex;
  align-items: center;
  position: relative;
  &::before {
    content: '';
    display: block;
    width: 0.08rem;
    height: 0.4rem;
    background: url('https://img.hzanchu.com/acimg/dd3a9c0c3ca479fe948fd8e1c6f6ad20.png') no-repeat;
    background-size: 100%;
    position: absolute;
    left: 0;
  }
  .title {
    font-size: 0.36rem;
    color: #2b333f;
    display: flex;
    align-items: center;
    margin-left: 0.3rem;
    font-weight: bold;
    .van-icon {
      margin-left: 0.16rem;
      transition: all 0.3s;
    }
  }
  .more {
    margin: 0 0.3rem 0 auto;
    font-size: 0.24rem;
    color: #999999;
  }
}
.tagText {
  font-size: 0.3rem;
  line-height: 0.45rem;
  height: 0.4rem;
  color: #333;
}
.tagTextOld {
  font-size: 0.4rem;
}
.paddingCon {
  padding: 0.3rem;
  box-sizing: border-box;
  width: 100%;
  .center-box {
    background: #fff;
    border-radius: 0.2rem;
  }
}
.competitive-projects {
  margin-bottom: 0.3rem;
  width: 100%;
  .van-list {
    padding: 0 0.3rem 0.3rem 0.3rem;
  }
  .header-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    padding-right: 0.2rem;
  }
  .emptyHolder {
    margin-top: 0.6rem;
    display: flex;
    justify-content: center;
    flex-direction: column;
    img {
      width: 4rem;
      margin: 0 auto;
    }
    p {
      text-align: center;
      color: #999;
    }
  }
}

.itemCon {
  display: flex;
  align-items: center;
  height: 1.55rem;
  padding-left: 0.32rem;
  background-color: #fff;
  margin-bottom: 0.2rem;
  .title {
    width: 2.56rem;
    font-size: 0.32rem;
    font-weight: 500;
    line-height: 0.46rem;
    color: #61b416;
  }
  .itemInnerCon {
    border-bottom: 1px solid #ededed;
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;

    .rightCon {
      width: 32%;
      display: flex;
      flex-direction: column;
      .submitBtn {
        height: 0.5rem;
        margin-top: 0.2rem;
        display: flex;
        margin-left: auto;
        img {
          width: 0.7rem;
          height: 0.7rem;
        }
      }
      .submitBtnOld {
        font-size: 0.25rem !important;
      }
    }
  }
  &:last-child {
    .itemInnerCon {
      border: none;
    }
  }
  .title {
    font-size: 0.28rem;
    width: 44%;
    font-weight: 500;
    line-height: 0.55rem;
    color: #333;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .titleOld {
    font-size: 0.4rem;
    line-height: 0.45rem;
  }
  .time {
    font-size: 0.24rem;
    color: #666;
  }
  .timeOld {
    font-size: 0.35rem;
  }
}

.discountlistCon {
  > div {
    box-sizing: border-box;
  }
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;

  .discountCon {
    width: 49%;
    height: 1.8rem;
    padding: 0.32rem;
    position: relative;

    &:first-child,
    &:nth-child(2) {
      margin-bottom: 0.16rem;
    }

    .title {
      width: 1.92rem;
      font-size: 0.32rem;
      font-weight: 500;
      line-height: 0.46rem;
    }

    .itemInnerCon {
      .icon {
        width: 0.78rem;
        height: 0.85rem;
        position: absolute;
        right: 0.24rem;
        bottom: 0.2rem;
      }
    }
  }
}

.policyEntrance {
  margin-bottom: 0.3rem;
  width: 100%;
  .van-list {
    padding: 0 0.3rem 0.3rem 0.3rem;
  }
  .header-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    padding-right: 0.2rem;
  }
  .emptyHolder {
    margin-top: 0.6rem;
    display: flex;
    justify-content: center;
    flex-direction: column;
    p {
      text-align: center;
      color: #999;
    }
    img {
      width: 4rem;
      margin: 0 auto;
    }
  }
  .policyTwinCon {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
  }
  .policyTwin {
    background-color: #fff;
    box-shadow: 0px 4px 18px rgba(6, 0, 1, 0.05);
    border-radius: 0.1rem;
    width: 49%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    .mainImg {
      width: 50%;
    }
    .policyRight {
      padding-left: 0.15rem;
      box-sizing: border-box;
    }
    .policyTitle {
      width: 1.4rem;
      min-height: 0.8rem;
      font-size: 0.28rem;
      line-height: 0.4rem;
      color: #333;
      word-wrap: break-word;
      margin-bottom: 0.15rem;
    }
    .policyTitleOld {
      width: 1.55rem;
      font-size: 0.4rem;
    }
    .policyImg {
      width: 1.2rem;
    }
  }
}
.understandEntrance {
  margin-top: -1.32rem;
  width: calc(100vw - 0.6rem);
  padding: 0 0.3rem;
  .understandImgCon {
    position: relative;
    width: 100%;
    height: 1.8rem;
  }
  .under-first-con-text {
    color: #1b82ec;
    font-size: 0.35rem;
    position: absolute;
    top: 0.25rem;
    z-index: 3;
    font-weight: bolder;
    left: 0.6rem;
  }
  .underConText {
    position: absolute;
    top: 0.71rem;
    left: 0.6rem;
    z-index: 3;
    font-size: 0.25rem;
    line-height: 0.36rem;
    color: #7caef8;
  }
  .underConTextOld {
    font-size: 0.42rem;
    font-weight: 500;
    left: 0.3rem;
  }
  .understandMainImg {
    position: absolute;
    width: 100%;
    height: 1.8rem;
  }
  .underSmallImg {
    position: absolute;
    width: 1.4rem;
    height: 0.5rem;
    bottom: 0.15rem;
    border-radius: 1rem;
    left: 0.6rem;
    color: #1b82ec;
    background: #ffffff;
  }
  .underSmallImgOld {
    width: 2.5rem;
  }
}
.merchantsCon {
  //   margin-bottom: 1rem;
  margin-bottom: 0.3rem;
  .merchantsFirst {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    padding-right: 0.2rem;
  }
  .merchantsListCon {
    border-radius: 0.16rem;
    background-color: #fff;
    padding: 0 0.3rem 0.3rem 0.3rem;
    box-sizing: border-box;
    .merchantItem {
      border-bottom: 1px solid #ededed;
      padding-bottom: 0.16rem;
      padding-top: 0.16rem;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      align-content: center;
      &:last-child {
        border-bottom: none;
      }
      .merchantLeft {
        width: 50%;
        font-size: 0.28rem;
        line-height: 0.4rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        color: #333;
        .merchantTime {
          font-size: 0.24rem;
          color: rgba(102, 102, 102, 1);
        }
        .merchantTitle {
          height: 0.8rem;
          margin-bottom: 0.3rem;
          font-size: 0.28rem;
        }
        .merchantTitleOld {
          font-size: 0.35rem;
        }
        .merchantTimeOld {
          font-size: 0.35rem;
        }
      }
      .merchantRight {
        img {
          width: 2.44rem;
          height: 1.62rem;
        }
      }
    }
  }
}
.noticeCon {
  //   margin-bottom: 0.5rem;
  margin-bottom: 0.3rem;
  .noticeListCon {
    border-radius: 0.16rem;
    background-color: #fff;
    padding: 0 0.3rem 0.3rem 0.3rem;
    box-sizing: border-box;
  }
  .noticeItem {
    border-bottom: 1px solid #ededed;
    padding: 0.2rem 0;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    &:last-child {
      border-bottom: none;
    }
  }
  .noticeLeft {
    font-size: 0.28rem;
    line-height: 0.37rem;
    height: 0.37rem;
    color: #333;
    width: 70%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
  }
  .noticeRight {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    text-align: right;
    width: 29%;
    font-size: 0.24rem;
    line-height: 0.24rem;
    color: #666;
  }
  .noticeLeftOld {
    font-size: 0.4rem;
  }
  .noticeRightOld {
    font-size: 0.33rem;
  }
  .noticeFirst {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    padding-right: 0.2rem;
  }
}

.realHome {
  .headCon {
    width: 100%;
    height: 4.23rem;
    position: relative;
    .headerImg {
      width: 100%;
      height: 100%;
    }
  }
  .search {
    width: 92%;
    position: absolute;
    top: 0.3rem;
    left: 0.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #e8f2fd;
    height: 0.6rem;
    border-radius: 0.1rem;
    img {
      width: 0.3rem;
      margin-left: 0.1rem;
    }
    .subSearch {
      position: relative;
      width: 100%;
      height: 0.6rem;
      overflow: hidden;
      .first-top {
        margin-top: -0.6rem;
      }
      .second-top {
        margin-top: -1.2rem;
      }
      .third-top {
        margin-top: -1.8rem;
      }
      .noticeItem {
        padding: 0.15rem;
        box-sizing: border-box;
        height: 0.6rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        align-content: center;
        &:last-child {
          border-bottom: none;
        }
        .noticeLeft {
          font-size: 0.28rem;
          line-height: 0.37rem;
          height: 0.37rem;
          color: #333;
          width: 70%;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
        }
      }
    }
    .van-icon-search {
      position: absolute;
      font-size: 0.3rem;
      left: 0.2rem;
      top: 0.2rem;
      color: #999;
    }
    input {
      background-color: #fff;
      width: 100%;
      height: 0.66rem;
      text-indent: 0.7rem;
      font-size: 0.26rem;
      border-radius: 0.33rem;
    }
    .subSearchInputOld {
      font-size: 0.35rem;
    }
  }
}
.serviceCon {
  margin-bottom: 0.2rem;
  margin-bottom: 1.2rem;
  text-align: center;
}
.service {
  font-size: 0.26rem;
  color: #98999b;
  text-align: center;
  line-height: 0.4rem;
  span {
    color: #008fff;
  }
}
.serviceOld {
  font-size: 0.4rem;
}
</style>
