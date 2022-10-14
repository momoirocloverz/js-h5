import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as echarts from 'echarts/core'
import { PieChart, MapChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, GridComponent, DatasetComponent, VisualMapComponent, GeoComponent, TransformComponent } from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import variable from './variable.less'
import './index.css'
import { fitForOld } from './util/index'

import {
  Icon,
  Popup,
  Cascader,
  Picker,
  Uploader,
  Step,
  Steps,
  Tab,
  Tabs,
  Tag,
  Field,
  Form,
  Cell,
  CellGroup,
  Button,
  Calendar,
  PullRefresh,
  List,
  Loading,
  DatetimePicker,
  Lazyload,
  RadioGroup,
  Radio,
  Collapse,
  CollapseItem,
  Dialog,
  SwipeCell,
  Rate,
  ActionSheet,
  Overlay,
  Search,
  DropdownMenu,
  DropdownItem,
  Checkbox,
  CheckboxGroup
} from 'vant'

createApp(App)
  .use(store)
  .use(router)
  .use(Icon)
  .use(Popup)
  .use(Cascader)
  .use(Picker)
  .use(Uploader)
  .use(Step)
  .use(Steps)
  .use(Field)
  .use(CellGroup)
  .use(Cell)
  .use(Form)
  .use(Calendar)
  .use(Button)
  .use(variable)
  .use(Tab)
  .use(Tabs)
  .use(Tag)
  .use(PullRefresh)
  .use(List)
  .use(Loading)
  .use(DatetimePicker)
  .use(Lazyload)
  .use(Radio)
  .use(RadioGroup)
  .use(Collapse)
  .use(CollapseItem)
  .use(Dialog)
  .use(SwipeCell)
  .use(Rate)
  .use(ActionSheet)
  .use(Overlay)
  .use(Search)
  .use(DropdownMenu)
  .use(DropdownItem)
  .use(Checkbox)
  .use(CheckboxGroup)

  .mount('#app')

fitForOld()

// 注册必须的组件
echarts.use([TitleComponent, TooltipComponent, GridComponent, DatasetComponent, TransformComponent, PieChart, LabelLayout, UniversalTransition, CanvasRenderer, VisualMapComponent, GeoComponent])

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})
