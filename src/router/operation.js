import {
  createRouter,
  createWebHashHistory,
  onBeforeRouteLeave,
} from 'vue-router'
import OperationHome from '../views/operation/operationHome'

const routes = [
  {
    path: '/operation',
    name: 'operationHome',
    component: OperationHome,
    // redirect: '/operation/dashboard',
    meta: {
      isOperation: true,
      title: '江农投治理端',
    },
    children: [
      // 首页
      {
        path: '/operation/dashboard',
        name: 'dashboard',
        component: () =>
          import(
            /* webpackChunkName: "operation-dashboard" */ '../views/operation/dashboard/dashboard.vue'
          ),
        meta: {
          isOperation: true,
          title: '数据大屏',
        },
      },
      // 审核
      {
        path: '/operation/approval',
        name: 'approval',
        component: () =>
          import(
            /* webpackChunkName: "operation-approval" */ '../views/operation/approval/approval.vue'
          ),
        meta: {
          isOperation: true,
          title: '审核',
        },
      },
      // 项目监测
      {
        path: '/operation/monitor',
        name: 'monitor',
        component: () =>
          import(
            /* webpackChunkName: "operation-monitor" */ '../views/operation/monitor/monitor.vue'
          ),
        meta: {
          keepAlive: true,
          isOperation: true,
          title: '项目监测',
        },
      },
      // 我的
      {
        path: '/operation/mine',
        name: 'operationMine',
        component: () =>
          import(
            /* webpackChunkName: "operation-mine" */ '../views/operation/mine/mine.vue'
          ),
        meta: {
          isOperation: true,
          title: '我的',
        },
        children: [],
      },
    ],
  },
  {
    path: '/operation/mine/info',
    name: 'personalInfo',
    component: () =>
      import(
        /* webpackChunkName: "operation-mine" */ '../views/operation/mine/personalInfo.vue'
      ),
    meta: {
      isOperation: true,
      title: '个人信息',
    },
  },
  {
    path: '/operation/mine/config',
    name: 'operationConfig',
    component: () =>
      import(
        /* webpackChunkName: "operation-mine" */ '../views/operation/mine/config.vue'
      ),
    meta: {
      isOperation: false,
      title: '设置',
    },
  },
  {
    path: '/operation/login',
    name: 'operationLogin',
    component: () =>
      import(
        /* webpackChunkName: "operation-login" */ '../views/operation/login/login.vue'
      ),
    meta: {
      isOperation: true,
      title: '登录',
    },
  },
  {
    path: '/operation/register',
    name: 'operationRegister',
    component: () =>
      import(
        /* webpackChunkName: "operation-login" */ '../views/operation/login/register.vue'
      ),
    meta: {
      isOperation: true,
      title: '注册',
    },
  },
  {
    path: '/operation/projectReserve',
    name: 'operationProjectReserve',
    component: () =>
      import(
        /* webpackChunkName: "operationProjectReserve" */ '../views/operation/projectReserve/index.vue'
      ),
    meta: {
      isOperation: true,
      title: '审核',
    },
  },
  {
    path: '/operation/projectReserve/detail',
    name: 'operationProjectReserveDetail',
    component: () =>
      import(
        /* webpackChunkName: "operationProjectReserve" */ '../views/operation/projectReserve/detail.vue'
      ),
    meta: {
      isOperation: true,
      title: '审核',
    },
  },
]

export default routes
