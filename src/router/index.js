import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Blank from '../components/blank.vue'
import { Dialog, Toast } from 'vant'
import { isZLB } from '../util/index.js'

const routes = [
  {
    path: '/',
    redirect: {
      name: isZLB() ? 'blank' : 'newHome'
    }
  },
  {
    path: '/blank',
    name: 'blank',
    component: () => import(/* webpackChunkName: "blank" */ '../views/blank'),
    meta: {
      title: '江农投'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/login/index.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "tempHome" */ '../views/tempHome.vue'),
    meta: {
      title: '江农投'
    }
  },
  {
    path: '/',
    name: 'homeTabCon',
    component: Home,
    meta: {
      title: '江农投'
    },
    children: [
      // 首页
      {
        path: 'newHome',
        name: 'newHome',
        component: () => import(/* webpackChunkName: "home" */ '../views/tab/realHome.vue'),
        meta: {
          title: '江农投'
        }
      },
      {
        path: 'policy',
        name: 'policy',
        component: () => import(/* webpackChunkName: "policy" */ '../views/policy/index.vue'),
        meta: {
          title: '惠农政策申报'
        }
      },
      {
        path: 'serve',
        name: 'serve',
        component: () => import(/* webpackChunkName: "policy" */ '../views/serve/index.vue'),
        meta: {
          title: '服务'
        }
      },
      {
        path: 'invest',
        name: 'invest',
        component: () => import(/* webpackChunkName: "invest" */ '../views/invest/index.vue'),
        meta: {
          title: '投资'
        }
      },
      {
        path: 'understandPolicy',
        name: 'understandPolicy',
        component: () => import(/* webpackChunkName: "understandPolicy" */ '../views/understandPolicy/index.vue'),
        meta: {
          title: '投资明白纸'
        }
      },

      {
        path: 'mine',
        name: 'mine',
        component: () => import(/* webpackChunkName: "mine" */ '../views/tab/mine.vue'),
        meta: {
          title: '我的'
        }
      }
    ]
  },
  {
    path: '/znx/unstarnd',
    name: 'znx/unstarnd',
    component: () => import(/* webpackChunkName: "invest" */ '../views/znxUnderstandPolicy/index.vue'),
    meta: {
      title: '政策明白纸'
    }
  },
  {
    path: '/znx/unstarndDetail',
    name: 'znx/unstarndDetail',
    component: () => import(/* webpackChunkName: "invest" */ '../views/znxUnderstandPolicy/detail.vue'),
    meta: {
      title: '政策详情'
    }
  },
  {
    path: '/invest/detail',
    name: 'investDetail',
    component: () => import(/* webpackChunkName: "invest" */ '../views/invest/detail.vue'),
    meta: {
      title: '政策匹配'
    }
  },
  {
    path: '/invest/notice',
    name: 'investNotice',
    component: () => import(/* webpackChunkName: "invest" */ '../views/invest/notice.vue'),
    meta: {
      title: '注意事项'
    }
  },
  {
    path: '/invest/progress',
    name: 'investProgress',
    component: () => import(/* webpackChunkName: "invest" */ '../views/invest/progress.vue'),
    meta: {
      title: '办事流程'
    }
  },
  {
    path: '/invest/understand',
    name: 'investUnderstand',
    component: () => import(/* webpackChunkName: "understand" */ '../views/invest/understand.vue'),
    meta: {
      title: '办事流程'
    }
  },
  {
    path: '/program',
    name: 'program',
    component: () => import(/* webpackChunkName: "program" */ '../views/tab/program.vue'),
    meta: {
      title: '项目办事'
    }
  },
  {
    path: '/support',
    name: 'support',
    component: () => import(/* webpackChunkName: "support" */ '../views/support/index.vue'),
    meta: {
      title: '咨询意见'
    }
  },
  {
    path: '/advice',
    name: 'advice',
    component: () => import(/* webpackChunkName: "advice" */ '../views/tab/Mine/advice.vue'),
    meta: {
      title: '意见建议'
    }
  },
  {
    path: '/voiceFindServe',
    name: 'voiceFindServe',
    component: () => import(/* webpackChunkName: "policy" */ '../views/voiceFindServe/index.vue'),
    meta: {
      title: '语音找服务'
    }
  },
  {
    path: '/info',
    name: 'info',
    component: () => import(/* webpackChunkName: "info" */ '../views/tab/Mine/info.vue'),
    meta: {
      title: '个人信息'
    }
  },
  {
    path: '/info/phoneEdit',
    name: 'infoPhoneEdit',
    component: () => import(/* webpackChunkName: "info" */ '../views/tab/Mine/phoneEdit.vue'),
    meta: {
      title: '联系方式'
    }
  },
  {
    path: '/setup',
    name: 'setup',
    component: () => import(/* webpackChunkName: "setup" */ '../views/tab/Mine/setup.vue'),
    meta: {
      title: '设置'
    }
  },
  {
    path: '/notice',
    component: Blank,
    children: [
      {
        path: '',
        name: 'notice',
        component: () => import(/* webpackChunkName: "notice" */ '../views/notice/index.vue'),
        meta: {
          title: '公示公告栏'
        }
      },
      {
        path: 'detail',
        name: 'noticeDetail',
        component: () => import(/* webpackChunkName: "notice" */ '../views/notice/detail.vue'),
        meta: {
          title: '公示公告详情'
        }
      }
    ]
  },
  {
    path: '/attract',
    component: Blank,
    children: [
      {
        path: '',
        name: 'attract',
        component: () => import(/* webpackChunkName: "attract" */ '../views/attract/index.vue'),
        meta: {
          title: '招商列表'
        }
      },
      {
        path: 'detail',
        name: 'attractDetail',
        component: () => import(/* webpackChunkName: "attract" */ '../views/attract/detail.vue'),
        meta: {
          title: '招商推介详情'
        }
      }
    ]
  },
  {
    path: '/understandPolicy',
    component: Blank,
    children: [
      {
        path: 'detail',
        name: 'understandPolicyDetail',
        component: () => import(/* webpackChunkName: "projectReserve" */ '../views/understandPolicy/detail.vue'),
        meta: {
          title: '明白纸详情'
        }
      }
    ]
  },
  {
    path: '/projectReserve',
    component: Blank,
    children: [
      {
        path: '',
        name: 'projectReserve',
        component: () => import(/* webpackChunkName: "projectReserve" */ '../views/projectReserve/index.vue'),
        meta: {
          title: '项目储备'
        }
      },
      {
        path: 'detail',
        name: 'projectReserveDetail',
        component: () => import(/* webpackChunkName: "projectReserve" */ '../views/projectReserve/detail.vue'),
        meta: {
          title: '项目储备详情'
        }
      },
      {
        path: 'legend',
        name: 'projectReserveLegend',
        component: () => import(/* webpackChunkName: "projectReserve" */ '../views/projectReserve/legend.vue'),
        meta: {
          title: '申报'
        }
      },
      {
        path: 'publish',
        name: 'projectReservePublish',
        component: () => import(/* webpackChunkName: "projectReserve" */ '../views/projectReserve/publish.vue'),
        meta: {
          title: '项目储备申报'
        }
      },
      {
        path: 'bigTable',
        name: 'projectReserveBigTable',
        component: () => import(/* webpackChunkName: "projectReserve" */ '../views/projectReserve/bigTable.vue'),
        meta: {
          title: '项目储备申报'
        }
      },
      {
        path: 'draft',
        name: 'projectReserveDraft',
        component: () => import(/* webpackChunkName: "projectReserve" */ '../views/projectReserve/draft.vue'),
        meta: {
          title: '草稿箱'
        }
      },
      {
        path: 'draftDetail',
        name: 'projectReserveDraftDetail',
        component: () => import(/* webpackChunkName: "projectReserve" */ '../views/projectReserve/draftDetail.vue'),
        meta: {
          title: '草稿箱'
        }
      },
      {
        path: 'draftDetailBigTable',
        name: 'projectReserveDraftDetailBigTable',
        component: () => import(/* webpackChunkName: "projectReserve" */ '../views/projectReserve/bigTable.vue'),
        meta: {
          title: '草稿箱'
        }
      }
    ]
  },
  {
    path: '/policy',
    component: Blank,
    children: [
      {
        path: 'list',
        name: 'policyList',
        component: () => import(/* webpackChunkName: "policy" */ '../views/policy/list.vue'),
        meta: {
          title: '项目申报'
        }
      },
      {
        path: 'detail',
        name: 'policyDetail',
        component: () => import(/* webpackChunkName: "policy" */ '../views/policy/detail.vue'),
        meta: {
          title: '政策详情'
        }
      }
    ]
  },
  {
    path: '/declareMain',
    name: 'declareMain',
    component: () => import(/* webpackChunkName: "declareMain" */ '../views/policy/declareMain.vue'),
    meta: {
      title: '项目申报'
    }
  },
  {
    path: '/declareReport',
    name: 'declareReport',
    component: () => import(/* webpackChunkName: "declareReport" */ '../views/declare/report.vue'),
    meta: {
      title: '项目申报'
    }
  },
  {
    path: '/declareReportTwo',
    name: 'declareReportTwo',
    component: () => import(/* webpackChunkName: "declareReport" */ '../views/declare/report2.vue'),
    meta: {
      title: '项目申报'
    }
  },
  {
    path: '/declareImplementationPlant',
    name: 'declareImplementationPlant',
    component: () => import(/* webpackChunkName: "declareImplementationPlant" */ '../views/declare/implementationPlan.vue'),
    meta: {
      title: '项目申报'
    }
  },
  {
    path: '/declareImplementationPlantTwo',
    name: 'declareImplementationPlantTwo',
    component: () => import(/* webpackChunkName: "declareImplementationPlantTwo" */ '../views/declare/implementation2.vue'),
    meta: {
      title: '项目申报'
    }
  },
  {
    path: '/declareImplementationPlantThree',
    name: 'declareImplementationPlantThree',
    component: () => import(/* webpackChunkName: "declareImplementationPlantThree" */ '../views/declare/implementation3.vue'),
    meta: {
      title: '项目申报'
    }
  },
  {
    path: '/projectEquipment',
    name: 'projectEquipment',
    component: () => import(/* webpackChunkName: "projectEquipment" */ '../views/declare/projectEquipment.vue'),
    meta: {
      title: '项目申报'
    }
  },
  {
    path: '/policySearch',
    component: Blank,
    children: [
      {
        path: '',
        name: 'policySearch',
        component: () => import(/* webpackChunkName: "policySearch" */ '../views/policySearch/index.vue'),
        meta: {
          title: '政策'
        }
      }
    ]
  },
  {
    path: '/applyFor',
    name: 'applyFor',
    component: () => import(/* webpackChunkName: "projectReserve" */ '../views/implement/applyFor.vue'),
    meta: {
      title: '验收申请书'
    }
  },
  {
    path: '/summarize',
    name: 'summarize',
    component: () => import(/* webpackChunkName: "projectReserve" */ '../views/implement/summarize.vue'),
    meta: {
      title: '工作总结'
    }
  },
  {
    path: '/compare',
    name: 'compare',
    component: () => import(/* webpackChunkName: "projectReserve" */ '../views/implement/compare.vue'),
    meta: {
      title: '项目完成情况对比表'
    }
  },
  {
    path: '/sketch',
    name: 'sketch',
    component: () => import(/* webpackChunkName: "projectReserve" */ '../views/implement/sketch.vue'),
    meta: {
      title: '竣工验收示意图'
    }
  },
  {
    path: '/compareChart',
    name: 'compareChart',
    component: () => import(/* webpackChunkName: "projectReserve" */ '../views/implement/compareChart.vue'),
    meta: {
      title: '实施前后对照图'
    }
  },
  {
    path: '/projectChange',
    name: 'projectChange',
    component: () => import(/* webpackChunkName: "policySearch" */ '../views/projectImplement/projectChange'),
    meta: {
      title: '项目变更'
    }
  },
  {
    path: '/projectImplementRecord',
    name: 'projectImplementRecord',
    component: () => import(/* webpackChunkName: "policySearch" */ '../views/projectImplement/record'),
    meta: {
      title: '进度记录'
    }
  },
  {
    path: '/projectPerform',
    name: 'projectPerform',
    component: () => import(/* webpackChunkName: "policySearch" */ '../views/projectPerform/projectPerform'),
    meta: {
      title: '项目办事'
    }
  },
  {
    path: '/projectPerformBaseInfo',
    name: 'projectPerformBaseInfo',
    component: () => import(/* webpackChunkName: "projectPerformBaseInfo" */ '../views/declare/baseInfo'),
    meta: {
      title: '修改意见'
    }
  },
  {
    path: '/fundForm',
    name: 'fundForm',
    component: () => import(/* webpackChunkName: "fundForm" */ '../views/payFor/fundForm'),
    meta: {
      title: '资金申请'
    }
  },
  {
    path: '/fundApproval',
    name: 'fundApproval',
    component: () => import(/* webpackChunkName: "fundApproval" */ '../views/payFor/fundApproval'),
    meta: {
      title: '审核进度'
    }
  },
  // 有机肥申报表单页面
  {
    path: '/yjfDeclare',
    name: 'yjfDeclare',
    component: () => import(/* webpackChunkName: "yjfDeclare" */ '../views/helpFarmer/yjfDeclare'),
    meta: {
      title: '有机肥补贴申报'
    }
  },
  // 秸秆申报表单页面
  {
    path: '/jgDeclare',
    name: 'jgDeclare',
    component: () => import(/* webpackChunkName: "jgDeclare" */ '../views/helpFarmer/jgDeclare'),
    meta: {
      title: '秸秆补贴申报'
    }
  },
  // 农机申报表单页面
  {
    path: '/njDeclare',
    name: 'njDeclare',
    component: () => import(/* webpackChunkName: "njDeclare" */ '../views/helpFarmer/njDeclare'),
    meta: {
      title: '农机补贴申报'
    }
  },
  // 社会化申报表单页面
  {
    path: '/shhDeclare',
    name: 'shhDeclare',
    component: () => import(/* webpackChunkName: "shhDeclare" */ '../views/helpFarmer/shhDeclare'),
    meta: {
      title: '社会化服务补贴申报'
    }
  },
  // 湖羊补贴表单页面
  {
    path: '/hyDeclare',
    name: 'hyDeclare',
    component: () => import(/* webpackChunkName: "hyDeclare" */ '../views/helpFarmer/hyDeclare'),
    meta: {
      title: '湖羊补贴申报'
    }
  },
  // 无害化表单页面
  {
    path: '/whh/index',
    name: 'whh',
    component: () => import(/* webpackChunkName: "whhDeclare" */ '../views/helpFarmer/whh/index'),
    meta: {
      title: '无害化处理补贴申报'
    }
  },
  // 粮油申报表单页面
  {
    path: '/lyDeclare',
    name: 'lyDeclare',
    component: () => import(/* webpackChunkName: "lyDeclare" */ '../views/helpFarmer/lyDeclare'),
    meta: {
      keepAlive: true,
      title: '粮油补贴申报'
    }
  },
  {
    path: '/lyDeclare2',
    name: 'lyDeclare2',
    component: () => import(/* webpackChunkName: "lyDeclare" */ '../views/helpFarmer/lyDeclareStep2'),
    meta: {
      title: '粮油补贴申报'
    }
  },
  {
    path: '/lyDeclare3',
    name: 'lyDeclare3',
    component: () => import(/* webpackChunkName: "lyDeclare" */ '../views/helpFarmer/lyDeclareStep3'),
    meta: {
      title: '粮油补贴申报'
    }
  },
  // 审核记录页面
  {
    path: '/approval/record',
    name: 'approvalRecord',
    component: () => import(/* webpackChunkName: "approvalRecord" */ '../views/approval/record'),
    meta: {
      title: '审核记录'
    }
  },
  // 签名
  {
    path: '/signature',
    name: 'signature',
    component: () => import(/* webpackChunkName: "signature" */ '../views/signature/index'),
    meta: {
      title: '签名'
    }
  },
  {
    path: '/QASection',
    name: 'QASection',
    component: () => import(/* webpackChunkName: "QASection" */ '../views/QASection/index.vue'),
    meta: {
      title: '问答专区'
    }
  },
  {
    path: '/QADetail/:id',
    name: 'QADetail',
    component: () => import(/* webpackChunkName: "QADetail" */ '../views/QASection/detail.vue'),
    meta: {
      title: '问答详情'
    }
  },
  {
    path: '/QASection/consult',
    name: 'QAConsult',
    component: () => import(/* webpackChunkName: "QAConsult" */ '../views/QASection/consult.vue'),
    meta: {
      title: '在线咨询'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
