// 审批记录根据record_type字段获取action_type映射
const DOING_ICON =
  'https://img.hzanchu.com/acimg/0e70d75c10eed40b091a62c52e6fb978.png?x-oss-process=image/resize,l_300'
const PASS_ICON =
  'https://img.hzanchu.com/acimg/0af59cff0b5c183267143702261ae1a9.png?x-oss-process=image/resize,l_300'
const REJECT_ICON =
  'https://img.hzanchu.com/acimg/629dd22da121895eef970acc091c1147.png?x-oss-process=image/resize,l_300'
const EDIT_ICON =
  'https://img.hzanchu.com/acimg/883cb3cc1fa612db7c4f0cfc8db2363c.png?x-oss-process=image/resize,l_300'

const DECLARE_MAP = {
  1: { title: '材料提交', icon: PASS_ICON },
  2: { title: '乡镇审核', icon: REJECT_ICON },
  3: { title: '乡镇审核', icon: PASS_ICON },
  4: { title: '材料需修改', icon: EDIT_ICON },
  5: { title: '材料审核', icon: PASS_ICON },
  59: { title: '材料审核不通过', icon: REJECT_ICON },
  6: { title: '评审', icon: REJECT_ICON },
  7: { title: '评审', icon: PASS_ICON },
  8: { title: '联审', icon: REJECT_ICON },
  9: { title: '联审', icon: PASS_ICON },
  10: { title: '公示', icon: PASS_ICON },
  11: { title: '公示', icon: REJECT_ICON },
}

const CHECK_MAP = {
  1: { title: '材料提交', icon: PASS_ICON },
  2: { title: '审核', icon: PASS_ICON },
  3: { title: '审核', icon: REJECT_ICON },
}

const CORPS_MAP = {
  1: { title: '材料提交', icon: PASS_ICON },
  12: { title: '乡镇经办人', icon: PASS_ICON },
  19: { title: '乡镇经办人', icon: REJECT_ICON },
  22: { title: '公示(所在村)', icon: PASS_ICON },
  29: { title: '公示(所在村)', icon: REJECT_ICON },
  32: { title: '乡镇领导', icon: PASS_ICON },
  39: { title: '乡镇领导', icon: REJECT_ICON },
  42: { title: '农业农村局', icon: PASS_ICON },
  49: { title: '农业农村局', icon: REJECT_ICON },
  52: { title: '公示(政府网)', icon: PASS_ICON },
  59: { title: '公示(政府网)', icon: REJECT_ICON },
  62: { title: '资金拨付', icon: PASS_ICON },
  69: { title: '资金拨付', icon: REJECT_ICON },
}

const LAMBS_MAP = {
  1: { title: '材料提交', icon: PASS_ICON },
  12: { title: '乡镇经办人', icon: PASS_ICON },
  19: { title: '乡镇经办人', icon: REJECT_ICON },
  22: { title: '市养殖发展服务中心', icon: PASS_ICON },
  29: { title: '市养殖发展服务中心', icon: REJECT_ICON },
  32: { title: '农业农村局审核', icon: PASS_ICON },
  39: { title: '农业农村局审核', icon: REJECT_ICON },
  42: { title: '公示', icon: PASS_ICON },
  49: { title: '公示', icon: REJECT_ICON },
  52: { title: '资金拨付', icon: PASS_ICON },
  59: { title: '资金拨付', icon: REJECT_ICON },
}

const HARMLESS_MAP = {
  1: { title: '材料提交', icon: PASS_ICON },
  31: { title: '材料提交', icon: PASS_ICON },
  12: { title: '申报-市养殖中心人员', icon: PASS_ICON },
  19: { title: '申报-市养殖中心人员', icon: REJECT_ICON },
  22: { title: '申报-公示', icon: PASS_ICON },
  29: { title: '申报-公示', icon: REJECT_ICON },
  32: { title: '申请-市养殖中心人员', icon: PASS_ICON },
  39: { title: '申请-市养殖中心人员', icon: REJECT_ICON },
  42: { title: '申请-公示', icon: PASS_ICON },
  49: { title: '申请-公示', icon: REJECT_ICON },
}

const LY_MAP = {
  1: { title: '材料提交', icon: PASS_ICON },
  12: { title: '公示人（所在村）', icon: PASS_ICON },
  19: { title: '公示人（所在村）', icon: REJECT_ICON },
  22: { title: '村级审核人员', icon: PASS_ICON },
  29: { title: '村级审核人员', icon: REJECT_ICON },
  32: { title: '乡镇街道', icon: PASS_ICON },
  39: { title: '乡镇街道', icon: REJECT_ICON },
  42: { title: '乡镇农机中心领导', icon: PASS_ICON },
  49: { title: '乡镇农机中心领导', icon: REJECT_ICON },
  52: { title: '农业农村局审核人员', icon: PASS_ICON },
  59: { title: '农业农村局审核人员', icon: REJECT_ICON },
  62: { title: '第三方公司核查审核人', icon: PASS_ICON },
  69: { title: '第三方公司核查审核人', icon: REJECT_ICON },
  72: { title: '公示人（政府网）', icon: PASS_ICON },
  79: { title: '公示人（政府网）', icon: REJECT_ICON },
  82: { title: '资金拨付', icon: PASS_ICON },
  89: { title: '资金拨付', icon: REJECT_ICON },
}

const generateTypeMap = record_type => {
  if (record_type == 1) {
    return DECLARE_MAP
  } else if (record_type == 3) {
    return CHECK_MAP
  } else if ([5, 6, 7, 8].some(v => v == record_type)) {
    return CORPS_MAP
  } else if (record_type == 9) {
    return LAMBS_MAP
  } else if (record_type == 10) {
    return HARMLESS_MAP
  } else if (record_type == 11) {
    return LY_MAP
  } else {
    return {}
  }
}

export default generateTypeMap
