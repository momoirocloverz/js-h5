# 1.项目名称：）h5

# 2.项目分支 dev/pre/master/test-child-route/dev-zzd/pre-zzd/master-zzd/test-child-route-zzd

# 3.🌿🌿 重要 🌿🌿 本仓库包含了两个项目，分别是 1.jnt h5(jnt web 端移动版)，2.jnt浙政钉 h5(jnt admin 端移动版)

# 4.关于上架平台说明，目前已经上线了 1.jnt h5 网页端、浙里办(app 与支付宝) 2.jnt浙政钉 h5 网页端与浙政钉

# 5.关于部署发布

## 发布时需要自行 build 并提交代码

## 1.jnt h5 需要发布 master 与 test-child-route（统一域名分支）

## 2.jnt浙政钉 h5 需要发布 master-zzd 与 test-child-route-zzd（统一域名分支）

## 3.jnt h5 与jnt浙政钉 h5 环境依赖需要分别安装

## 4.根据发布平台需要调整 vue.config.js 内 outputDir: 'build', publicPath: './',两个配置项。 outputDir: 'build'适用于于浙里办的平台打包与发布。outputDir 默认或者 'dist'适用于常规网页端。

## 5.jnt h5 分支合并说明：只需要 master 向 test-child-route 单向合并代码，不需要反向合并,合并时注意 vue.config.js proxy 的配置，避免冲突导致的错误

## 6.jnt浙政钉 h5 分支合并说明：只需要 master-zzd 向 test-child-route-zzd 单向合并代码，不需要反向合并,合并时注意 vue.config.js proxy 的配置，避免冲突导致的错误

---

# 6.关于jnt h5 文件结构

## 1.细分结构 public/index.html 内部说明

![image](https://img.hzanchu.com/acimg/ac73ba8ffc6c9709b10be225c122562a.png)

### 浙里办埋点

![image](https://img.hzanchu.com/acimg/5bac570de6a966b9398e192ac27b6039.png)

### 地图 gis 相关依赖

---

## 2.细分结构 src/variable.less 内部说明

### 浙里办适老化相关策略

---

## 3.细分结构 src/router/index 内部说明

### jnt h5 相关路由

![image](https://img.hzanchu.com/acimg/428e1180c5a575084a12b9dbfee74a9a.png)

### 浙里办与 h5 环境重定向页面有区别，浙里办首先重定向到空白页面

### 空白页面是为了解决浙里办 app/支付宝环境二次回退问题

---

## 4.细分结构 src/service/request 内部说明

### jnt h5 相关网络请求 部分请求兼容 axios 与 mgop

### mgop 请求封装使用 mgopNew 文件

---

## 5.细分结构 src/util/index 内部说明

### 1.isZLB 判断浙里办环境

### 2.fitForOld 适老化标记

### 3.convert 浙里办 mgop 请求参数驼峰化

### 4.ZLBJump 浙里办环境下，页面跳转逻辑。ZWJSBridge.getUserType 方法只适用于浙里办 app，其它环境都会出错。 userType == 2 则是浙里办法人身份标记。需要区分支付宝与浙里办 app 环境。

### 5.https://puser.zjzwfw.gov.cn/sso/mobile.do?action=oauth&scope=1&servicecode=jnt&redirectUrl=XXXX 浙里办测试环境调试方法 https://puser.zjzwfw.gov.cn/sso/alipay.do?action=ssoLogin&servicecode=jnt&redirectUrl=XXXX

### 6.浙里办的支付宝端与微信端不支持法人登录

### 7.摘自浙里办文档： [关于测试地址！（白名单需要我这边配置，不是你们那边配置的）白名单里配置域名例如 https://mapi.zjzwfw.gov.cn/web/mgop/gov-open/的测试地址，我这边只需要配置 https://mapi.zjzwfw.gov.cn 就能跳转这个域名的所有地址。所以测试地址不更改域名的情况下，你们都可以跳转你们具体的测试地址。 调试完成之后再发正式的地址给我放在默认的回调地址上，例如移动端请求如下 https://puser.zjzwfw.gov.cn/sso/mobile.do?action=oauth&scope=1&servicecode=你的 ak&redirectUrl=你的测试地址）切记不是 goto 参数不是 goto 参数。 不加&redirectUrl 字段，则跳转默认正式地址。]

### 8. 测试地址现在可以配置在白名单上(找浙里办进行配置)

---

## 6.细分结构 src/util/zzd 内部说明

### 浙政钉相关逻辑封装

---

## 7.细分结构 src/views/blank 内部说明

### 根据浙里办环境与身份进行对应的跳转操作

### 法人测试账号 zjfrcszh 密码 Zjfrcszh123

---

## 8.细分结构 src/views/tab/realHome 内部说明

### 首页 接收 blank 页面携带的参数，执行浙里办相关请求

---

## 9.细分结构 src/views/home 内部说明

### tab 容器

### 切换 tab 页面之后，每次点击投资 tab 都需要重新选择分类才可以查看地图

---

## 10.关于图片上传

### lrz 插件压缩处理

---

## 11.关于浙里办相关说明

### 浙里办环境需要脱敏处理，姓名，电话，身份证号

### 浙里办环境 isTestUrl 互相切换可以实现接口环境的切换

### 浙里办环境网络请求工具 mgop

### 浙里办环境 mgop 响应体与 axios 响应体有结构差异

---

## 12.细分结构 src/views/understandPolicy 内部说明

### 语音播报 检测环境是否支持原生 api,分别使用原生 api 和百度语音服务

---

## 13.细分结构 src/views/policy 内部说明

### 地区选择功能，竞争性财政 tab 添加选择本级功能，惠农补贴及其他 tab 暂未添加

---

# 7.关于jnt浙政钉 h5 文件结构

## 1.细分结构 public/index.html 内部说明

![image](https://img.hzanchu.com/acimg/cf88935acfa4efe44b59a75f0ed5c2e3.png)

### 浙政钉埋点

---

## 2.细分结构 src/router/operation 内部说明

### jnt浙政钉 h5 相关路由

---

## 3.细分结构 src/service/operation/index 内部说明

### jnt浙政钉 h5 相关网络请求

---

## 3.细分结构 src/service/operation/index 内部说明

### jnt浙政钉 h5 相关网络请求

---

## 4.细分结构 src/service/operation/projectReserve/index 内部说明

### 需要补全赋码类储备项目的详情

---

## 5.细分结构 src/service/operation/competitive/detail/editBaseInfo 内部说明

### 需要同步 admin 端功能

---

# 8.备注

## 1.浙里办 js 依赖于 ZWJSBridge
