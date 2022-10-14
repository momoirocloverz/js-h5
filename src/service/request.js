import { Http, uploadFile } from './http'
import { isZLB } from '../util/index'
const ISZLB = isZLB()
import MGOP from './mgop'
import MGOPNEW from './mgopNew'
// let bridge = ''
// if (process.env.NODE_ENV == 'development') {
//   bridge = '/web'
// }
class Request {
  fetchHomePage(data) {
    return Http.post(`/home_page`, data)
  }
  fetchHomePageMGOP(data) {
    return MGOP('mgop.zjanchu.jnt.homePage', data, 'POST')
  }
  fetchOssInfo(data) {
    return MGOP('mgop.zjanchu.jnt.getOssInfo', data, 'POST')
  }
  fetchNewOssInfo(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.getOssInfo', data, 'POST')
    } else {
      return Http.post(`/zhelb/get_oss_info`, data)
    }
  }
  fetchAttractCategoryList(data) {
    return Http.post(`/attract_category/list`, data, 'POST')
  }
  fetchAttractCategoryListMGOP(data) {
    return MGOP('mgop.zjanchu.jnt.attractCategoryList', data, 'POST')
  }
  fetchAttractInvestmentList(data) {
    return Http.post(`/attract_investment/list`, data)
  }
  fetchAttractInvestmentListMGOP(data) {
    return MGOP('mgop.zjanchu.jnt.attractInvestmentList', data, 'POST')
  }
  fetchAttractInvestmentInfo(data) {
    return Http.post(`/attract_investment/info`, data)
  }
  fetchAttractInvestmentInfoMGOP(data) {
    return MGOP('mgop.zjanchu.jnt.attractInvestmentInfo', data, 'POST')
  }

  fetchNoticeList(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.noticeBoardList', data, 'POST')
    } else {
      return Http.post(`/notice_board/list`, data)
    }
  }
  fetchNoticeDetail(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.noticeBoardInfo', data, 'POST')
    } else {
      return Http.post(`/notice_board/info`, data)
    }
  }
  fetchNoticeDetailMGOP(data) {
    return MGOP('mgop.zjanchu.jnt.noticeBoardList', data, 'POST')
  }
  fetchProjectReserveList(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectReserveGetList', data, 'POST')
    } else {
      return Http.post(`/project_reserve/get_list`, data)
    }
  }

  projectChangeProjectReserveSyncForm(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectChangeProjectReserveSyncForm', data, 'POST')
    } else {
      return Http.post(`/project/change_project_reserve_sync_form`, data)
    }
  }

  zhelbZhelbTicketValidation(data) {
    return MGOP('mgop.zjanchu.jnt.zhelbZhelbTicketValidation', data, 'POST')
  }
  fetchProjectReserveListMGOP(data) {
    return MGOP('mgop.zjanchu.jnt.projectReserveGetList', data, 'POST')
  }
  projectReserveDetail(data) {
    return Http.post(`/project_reserve/detail`, data)
  }
  projectReserveDetailMGOP(data) {
    return MGOP('mgop.zjanchu.jnt.projectReserveDetail', data, 'POST')
  }
  projectReserveNewDetail(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectReserveDetail', data, 'POST')
    } else {
      return Http.post(`/project_reserve/detail`, data)
    }
  }
  getAreaList(data) {
    return Http.post(`/area/get_area_list`, data)
  }
  getAreaListMGOP(data) {
    return MGOP('mgop.zjanchu.jnt.getAreaList', data, 'POST')
  }
  userLogin(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.userLogin', data, 'POST')
    } else {
      return Http.post(`/user/login`, data)
    }
  }
  getUserInfo(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.userGetUserInfo', data, 'POST')
    } else {
      return Http.post(`/user/get_user_info`, data)
    }
  }
  projectReserveAction(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectReserveAction', data, 'POST')
    } else {
      return Http.post(`/project_reserve/action`, data)
    }
  }

  getPolicyList(data) {
    return Http.post(`/understand_paper/list`, data)
  }
  getPolicyListMGOP(data) {
    return MGOP(`mgop.zjanchu.jnt.understandPaperList`, data, 'POST')
  }

  getPolicyDetail(data) {
    return Http.post(`/understand_paper/info`, data)
  }
  getPolicyDetailMGOP(data) {
    return MGOP(`mgop.zjanchu.jnt.understandPaperInfo`, data, 'POST')
  }
  getPolicyInfo(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.policyDocumentInfo', data, 'POST')
    } else {
      return Http.post(`/policy_document/info`, data)
    }
  }
  getPolicyInfoMGOP(data) {
    return MGOP(`mgop.zjanchu.jnt.policyDocumentInfo`, data, 'POST')
  }
  projectReserveActionMGOP(data) {
    return MGOP('mgop.zjanchu.jnt.projectReserveAction', data, 'POST')
  }
  fetchPolicyCategoryList(data) {
    return Http.post(`/policy_category/list`, data)
  }
  fetchPolicyCategoryListMGOP(data) {
    return MGOP('mgop.zjanchu.jnt.policyCategoryList', data, 'POST')
  }
  fetchPolicyDocumentList(data) {
    return Http.post(`/policy_document/list`, data)
  }
  fetchPolicyDocumentListMGOP(data) {
    return MGOP('mgop.zjanchu.jnt.policyDocumentList', data, 'POST')
  }
  fetchPolicyDocumentInfo(data) {
    return Http.post(`/policy_document/info`, data)
  }
  fetchPolicyDocumentInfoMGOP(data) {
    return MGOP('mgop.zjanchu.jnt.policyDocumentInfo', data, 'POST')
  }
  setPorjectArea(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectActionProjectArea', data, 'POST')
    } else {
      return Http.post(`/project/action_project_area`, data)
    }
  }
  getProjectList(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectGetList', data, 'POST')
    } else {
      return Http.post(`/project/get_list`, data)
    }
  }
  getProjectListMGOP(data) {
    return MGOPNEW('mgop.zjanchu.jnt.projectGetList', data, 'POST')
  }

  deleteMyProject(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectRemove', data, 'POST')
    } else {
      return Http.post(`/project/remove`, data)
    }
  }

  // 项目实施 - 进度汇报
  procressReport(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectReportAdd', data, 'POST')
    } else {
      return Http.post(`/project_report/add`, data)
    }
  }
  // 项目实施 - 进度列表
  procressReportInfo(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectReportList', data, 'POST')
    } else {
      return Http.post(`/project_report/list`, data)
    }
  }
  // 项目实施 - 项目变更申请
  changeApplyAdd(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.changeApplyAdd', data, 'POST')
    } else {
      return Http.post(`/change_apply/add`, data)
    }
  }
  // 项目实施 - 项目变更申请
  changeApplyEdit(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.changeApplyEdit', data, 'POST')
    } else {
      return Http.post(`/change_apply/edit`, data)
    }
  }
  // 项目实施 - 项目变更申请 信息
  changeApplyAddInfo(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.changeApplyInfo', data, 'POST')
    } else {
      return Http.post(`/change_apply/info`, data)
    }
  }
  // 项目实施 - 项目变更申请 列表
  changeApplyList(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.changeApplyList', data, 'POST')
    } else {
      return Http.post(`/change_apply/list`, data)
    }
  }
  // 项目实施 - 资金兑换 -  添加拨款申请
  amountApplyAdd(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.amountApplyAdd', data, 'POST')
    } else {
      return Http.post(`/amount_apply/add`, data)
    }
  }
  // 项目实施 - 资金兑换 -  添加拨款申请
  amountApplyEdit(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.amountApplyEdit', data, 'POST')
    } else {
      return Http.post(`/amount_apply/edit`, data)
    }
  }
  // 拨款申请详情
  amountApplyInfo(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.amountApplyInfo', data, 'POST')
    } else {
      return Http.post(`/amount_apply/info`, data)
    }
  }
  // 资金拨付详情（可补助金额、剩余可申报金额、累计补助金额）
  amountApplySummarInfo(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.amountApplyGetProjectAmountApplySummarInfo', data, 'POST')
    } else {
      return Http.post(`/amount_apply/get_project_amount_apply_summar_info`, data)
    }
  }
  // 资金拨付申请记录
  amountApplyRecord(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.amountApplyList', data, 'POST')
    } else {
      return Http.post(`/amount_apply/list`, data)
    }
  }
  // ys  验收
  getProjectYsDetail(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectYsProjectYsDetail', data, 'POST')
    } else {
      return Http.post(`/project_ys/project_ys_detail`, data)
    }
  }
  edidProjectYsApply(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectYsActionProjectYsFinanceApplication', data, 'POST')
    } else {
      return Http.post(`/project_ys/action_project_ys_finance_application`, data)
    }
  }
  getProjectYsApply(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectYsProjectYsFinanceApplicationDetail', data, 'POST')
    } else {
      return Http.post(`/project_ys/project_ys_finance_application_detail`, data)
    }
  }
  editProjectYsSummarize(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectYsActionProjectYsWorkSummary', data, 'POST')
    } else {
      return Http.post(`/project_ys/action_project_ys_work_summary`, data)
    }
  }
  getProjectYsSummarize(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectYsProjectYsWorkSummaryDetail', data, 'POST')
    } else {
      return Http.post(`/project_ys/project_ys_work_summary_detail`, data)
    }
  }
  editProjectYsCompare(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectYsActionProjectYsCompleteCompare', data, 'POST')
    } else {
      return Http.post(`/project_ys/action_project_ys_complete_compare`, data)
    }
  }
  getProjectYsCompare(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectYsProjectYsCompleteCompareDetail', data, 'POST')
    } else {
      return Http.post(`/project_ys/project_ys_complete_compare_detail`, data)
    }
  }
  editProjectYsComparePic(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectYsActionProjectYsComparisonPic', data, 'POST')
    } else {
      return Http.post(`/project_ys/action_project_ys_comparison_pic`, data)
    }
  }
  getProjectYsComparePic(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectYsProjectYsComparisonPicDetail', data, 'POST')
    } else {
      return Http.post(`/project_ys/project_ys_comparison_pic_detail`, data)
    }
  }
  editProjectYsSketch(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectYsActionProjectYsCompletedSketch', data, 'POST')
    } else {
      return Http.post(`/project_ys/action_project_ys_completed_sketch`, data)
    }
  }
  getProjectYsSketch(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectYsProjectYsCompletedSketchDetail', data, 'POST')
    } else {
      return Http.post(`/project_ys/project_ys_completed_sketch_detail`, data)
    }
  }
  editProjectYsMaterials(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectYsProjectYsUploadMaterialsZlb', data, 'POST')
    } else {
      return Http.post(`/project_ys/project_ys_upload_materials`, data)
    }
  }
  getProjectYsMaterials(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectYsProjectYsMaterialsDetail', data, 'POST')
    } else {
      return Http.post(`/project_ys/project_ys_materials_detail`, data)
    }
  }
  deleteProjectYsMaterials(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectYsRemoveProjectMaterials', data, 'POST')
    } else {
      return Http.post(`/project_ys/remove_project_materials`, data)
    }
  }
  submitProjectYs(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectYsSubmitProjectYs', data, 'POST')
    } else {
      return Http.post(`/project_ys/submit_project_ys`, data)
    }
  }
  getProjectSchedule(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectProjectSchedule', data, 'POST')
    } else {
      return Http.post(`/project/project_schedule`, data)
    }
  }
  uploadImages(data) {
    return Http.post(`/upload/upload_images`, data)
  }
  addFeedback(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.feedbackAdd', data, 'POST')
    } else {
      return Http.post(`/feedback/add`, data)
    }
  }
  fetchProjectDeclarationDetail(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectProjectDeclarationDetail', data, 'POST')
    } else {
      return Http.post(`/project/project_declaration_detail`, data)
    }
  }
  actionProjectDeclaration(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectActionProjectDeclaration', data, 'POST')
    } else {
      return Http.post(`/project/action_project_declaration`, data)
    }
  }
  fetchProjectImplementPlanDetail(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectProjectImplementPlanDetail', data, 'POST')
    } else {
      return Http.post(`/project/project_implement_plan_detail`, data)
    }
  }
  actionProjectImplementPlan(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectActionProjectImplementPlan', data, 'POST')
    } else {
      return Http.post(`/project/action_project_implement_plan`, data)
    }
  }
  actionProjectFacilityList(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectActionProjectFacilityList', data, 'POST')
    } else {
      return Http.post(`/project/action_project_facility_list`, data)
    }
  }
  fetchProjectFacilityDetail(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectProjectFacilityListDetail', data, 'POST')
    } else {
      return Http.post(`/project/project_facility_list_detail`, data)
    }
  }
  submitProjectAction(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectSubmitProject', data, 'POST')
    } else {
      return Http.post(`/project/submit_project`, data)
    }
  }
  projectUploadMaterials(data, config = {}) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectProjectUploadMaterialsZlb', data, 'POST')
    } else {
      // return Http.post(`/project/project_upload_materials`, data)
      // console.log(`/project/project_upload_materials`, data, config);
      return uploadFile(`/project/project_upload_materials`, data, config)
    }
  }
  fetchProjectMaterialsDetail(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectProjectMaterialsDetail', data, 'POST')
    } else {
      return Http.post(`/project/project_materials_detail`, data)
    }
  }
  projectRemoveMaterials(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectRemoveProjectMaterials', data, 'POST')
    } else {
      return Http.post(`/project/remove_project_materials`, data)
    }
  }

  // 有机肥-申报
  applyYjfSubsidy(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.manureEdit', data, 'POST')
    } else {
      return Http.post(`/manure/edit`, data)
    }
  }
  // 有机肥-查看
  getYjfSubsidy(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.manureFind', data, 'POST')
    } else {
      return Http.post(`/manure/find`, data)
    }
  }
  // 有机肥-获取id
  getYjfSubsidyId(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.manureGetProjectId', data, 'POST')
    } else {
      return Http.post(`/manure/get_project_id`, data)
    }
  }
  // 秸秆-申报
  applyJgSubsidy(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.strawEdit', data, 'POST')
    } else {
      return Http.post(`/straw/edit`, data)
    }
  }
  // 秸秆-查看
  getJgSubsidy(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.strawFind', data, 'POST')
    } else {
      return Http.post(`/straw/find`, data)
    }
  }
  // 秸秆-获取id
  getJgSubsidyId(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.strawGetProjectId', data, 'POST')
    } else {
      return Http.post(`/straw/get_project_id`, data)
    }
  }
  // 农机-申报
  applyNjSubsidy(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.agriculturalEdit', data, 'POST')
    } else {
      return Http.post(`/agricultural/edit`, data)
    }
  }
  // 农机-查看
  getNjSubsidy(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.agriculturalFind', data, 'POST')
    } else {
      return Http.post(`/agricultural/find`, data)
    }
  }
  // 农机-获取id
  getNjSubsidyId(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.agriculturalGetProjectId', data, 'POST')
    } else {
      return Http.post(`/agricultural/get_project_id`, data)
    }
  }
  // 社会化-申报
  applyShhSubsidy(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.societyEdit', data, 'POST')
    } else {
      return Http.post(`/society/edit`, data)
    }
  }
  // 社会化-查看
  getShhSubsidy(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.societyFind', data, 'POST')
    } else {
      return Http.post(`/society/find`, data)
    }
  }
  // 社会化-获取id
  getShhSubsidyId(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.societyGetProjectId', data, 'POST')
    } else {
      return Http.post(`/society/get_project_id`, data)
    }
  }
  // 湖羊-申报
  applyHySubsidy(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.hyEdit', data, 'POST')
    } else {
      return Http.post(`/hy/edit`, data)
    }
  }
  // 湖羊-查看
  getHySubsidy(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.hyFind', data, 'POST')
    } else {
      return Http.post(`/hy/find`, data)
    }
  }
  // 湖羊-获取id
  getHySubsidyId(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.hyGetProjectId', data, 'POST')
    } else {
      return Http.post(`/hy/get_project_id`, data)
    }
  }
  // 无害化项目-申报
  applyWhhSubsidy(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.innocuityApplyInnocuityProject', data, 'POST')
    } else {
      return Http.post(`/innocuity/apply_innocuity_project`, data)
    }
  }
  // 无害化项目-查看
  getWhhSubsidy(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.innocuityFindInnocuityProject', data, 'POST')
    } else {
      return Http.post(`/innocuity/find_innocuity_project`, data)
    }
  }
  // 无害化项目-获取id
  getWhhSubsidyId(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.innocuityGetProjectId', data, 'POST')
    } else {
      return Http.post(`/innocuity/get_project_id`, data)
    }
  }
  // 无害化项目申请-申请
  applyWhhFinalSubsidy(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.innocuityApplyInnocuityProject', data, 'POST')
    } else {
      return Http.post(`/innocuity/apply_innocuity`, data)
    }
  }
  // 无害化项目申请-查看
  getWhhFinalSubsidy(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.innocuityFindInnocuity', data, 'POST')
    } else {
      return Http.post(`/innocuity/find_innocuity`, data)
    }
  }
  // 无害化项目申请-汇总清单
  getWhhFinalSubsidyDetail(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.innocuityFindCollectList', data, 'POST')
    } else {
      return Http.post(`/innocuity/find_collect_list`, data)
    }
  }
  // 粮油项目-获取id
  getLySubsidyId(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectSubLyGetProjectId', data, 'POST')
    } else {
      return Http.post(`/project_sub_ly/get_project_id`, data)
    }
  }
  // 粮油-保存提交
  applyLySubsidy(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectSubLyAction', data, 'POST')
    } else {
      return Http.post(`/project_sub_ly/action`, data)
    }
  }
  // 粮油-查看
  getLySubsidy(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectSubLyGetInfo', data, 'POST')
    } else {
      return Http.post(`/project_sub_ly/get_info`, data)
    }
  }
  // 获取审核记录
  getApprovalRecord(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectProjectDeclarationRecordList', data, 'POST')
    } else {
      return Http.post(`/project/project_declaration_record_list`, data)
    }
  }
  // 删除项目储备
  deleteProjectReserve(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectReserveRemove', data, 'POST')
    } else {
      return Http.post(`/project_reserve/remove`, data)
    }
  }

  // 获取单个配置信息
  getSysSingleConfig(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.configGetSingleInfo', data, 'POST')
    } else {
      return Http.post(`/config/get_single_info`, data)
    }
  }
  checkCanApply(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectCheckCanApply', data, 'POST')
    } else {
      return Http.post(`/project/check_can_apply`, data)
    }
  }

  // 获取oss信息
  getOssConfig(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.getOssInfo', data, 'POST')
    } else {
      return Http.post('/zhelb/get_oss_info')
    }
  }

  // 签名上传
  uploadSignatureMaterials(data, config = {}) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.projectProjectUploadMaterialsZlb', data, 'POST')
    } else {
      return uploadFile(`/project/project_upload_materials_zlb`, data, config)
    }
  }
  // 获取政策分类层级列表--v2.15.0
  getPolicyCategoryTabList(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.policyCategoryGetAllList', data, 'POST')
    } else {
      return Http.post('/policy_category/get_all_list')
    }
  }
  // 获取明白纸分类层级列表--v2.15.0
  getUnderstandCategoryTabList(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.understandCategoryList', data, 'POST')
    } else {
      return Http.post('/understand_category/list')
    }
  }
  // 获取语音识别返回文字--v2.15.0
  getVoicesValue(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.yuYinIdentify', data, 'POST')
    } else {
      return Http.post('/yu_yin/identify', data)
    }
  }
  // 问答专区--发送问题
  submitQuestion(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.sectionQuestionSubmitQuestion', data, 'POST')
    } else {
      return Http.post('/section_question/submit_question', data)
    }
  }
  // 问答专区--分页列表
  questionList(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.sectionQuestionGetList', data, 'POST')
    } else {
      return Http.post('/section_question/get_list', data)
    }
  }
  // 问答专区--提交回答
  submitAnswer(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.sectionQuestionSubmitAnswer', data, 'POST')
    } else {
      return Http.post('/section_question/submit_answer', data)
    }
  }
  // 问答专区--问答详情
  questionInfo(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.sectionQuestionGetInfo', data, 'POST')
    } else {
      return Http.post('/section_question/get_info', data)
    }
  }
  // 问答专区--点赞
  execLike(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.sectionQuestionExecLike', data, 'POST')
    } else {
      return Http.post('/section_question/exec_like', data)
    }
  }
  // 搜索--搜索词列表(搜索次数前10)-
  getTopSearchKeyWords(data = {}) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.searchGetTopList', data, 'POST')
    } else {
      return Http.post('/search/get_top_list', data)
    }
  }

  submitConsultAdvise(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.consultAdviseSubmit', data, 'POST')
    } else {
      return Http.post('/consult_advise/submit', data)
    }
  }

  areaGetMapAreaList(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.areaGetMapAreaList', data, 'POST')
    } else {
      return Http.post(`/area/get_map_area_list`, data)
    }
  }

  investBsydGetInfo(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.investBsydGetInfo', data, 'POST')
    } else {
      return Http.post(`/invest_bsyd/get_info`, data)
    }
  }

  investTagGetList(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.investTagGetList', data, 'POST')
    } else {
      return Http.post(`/invest_tag/get_list`, data)
    }
  }

  investCategoryGetList(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.investCategoryGetList', data, 'POST')
    } else {
      return Http.post(`/invest_category/get_list`, data)
    }
  }

  understandNewPaperList(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.understandPaperList', data, 'POST')
    } else {
      return Http.post(`/understand_paper/list`, data)
    }
  }

  ssoLogin(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.ssoLogin', data, 'POST')
    } else {
      return Http.post(`/sso/login`, data)
    }
  }

  szUnderstandPaperGetMatchList(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.szUnderstandPaperGetMatchList', data, 'POST')
    } else {
      return Http.post(`/sz_understand_paper/get_match_list`, data)
    }
  }
  szUnderstandPaperGetInfo(data) {
    if (ISZLB) {
      return MGOPNEW('mgop.zjanchu.jnt.szUnderstandPaperGetInfo', data, 'POST')
    } else {
      return Http.post(`/sz_understand_paper/get_info`, data)
    }
  }


}

export default new Request()
