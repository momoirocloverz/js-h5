import Http from './http'

class Request {
  // 登录
  adminLogin(data) {
    return Http.post(`/admin/login`, data)
  }

  // 获取admin信息
  getAdminInfo(data) {
    return Http.post(`/admin/get_admin_info`, data)
  }

  // 获取城镇列表
  getTownList(data) {
    return Http.post(`/area/get_town_list`, data)
  }

  // 获取首页统计数据
  getHomeData(data) {
    return Http.post(`home_page/list`, data)
  }

  // 项目储备列表
  projectReserveList(data) {
    return Http.post(`/project_reserve/get_list`, data)
  }

  // 项目储备详情
  projectReserveDetail(data) {
    return Http.post(`/project_reserve/detail`, data)
  }

  // 项目储备审核
  projectReserveAudit(data) {
    return Http.post(`/project_reserve/audit`, data)
  }

  // 上传图片
  uploadImages(data) {
    return Http.post(`/upload/upload_images`, data)
  }

  // 获取tab待审核数量
  getAuditCount(data) {
    return Http.post(`/audit/get_audit_info`, data)
  }

  // 获取对应镇的竞争性项目列表
  getProjectListByTownId(data) {
    return Http.post(`/home_page/get_click_map_town_project_list`, data)
  }

  // 浙政钉相关 start
  // 浙政钉登录
  zzdLogin(data) {
    return Http.post('/admin/login_zzd_gzt', data)
  }

  // 浙政钉获取应用access_token
  getZZDToken(data) {
    return Http.post('/zhezd/get_access_token', data)
  }

  // 浙政钉获取用户详情
  getZZDUserInfo(data) {
    return Http.post('/zhezd/get_dingtalk_app_user_info', data)
  }
  // 浙政钉相关 end
}

export default new Request()
