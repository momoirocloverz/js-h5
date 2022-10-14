import Request from '@/service/request'

export const util = {
  // 防抖
  debounce: (fn, wait, immediate = false) => {
    let timer,
      startTimeStamp = 0,
      context,
      args
    let run = (timerInterval) => {
      timer = setTimeout(() => {
        let now = new Date().getTime()
        let interval = now - startTimeStamp
        // 如果当前时间差小于传入的时间
        if (interval < timerInterval) {
          startTimeStamp = now
          run(wait - interval)
        } else {
          if (!immediate) {
            fn.apply(context, args)
          }
          clearTimeout(timer)
          timer = null
        }
      }, timerInterval)
    }
    return function () {
      context = this
      args = arguments
      let now = new Date().getTime()
      startTimeStamp = now
      if (!timer) {
        if (immediate) {
          fn.apply(context, args)
        }
        run(wait)
      }
    }
  },
  // 节流
  throttling: (fn, wait, immediate) => {
    let timer, context, args
    let run = () => {
      timer = setTimeout(() => {
        if (!immediate) {
          fn.apply(context, args)
        }
        clearTimeout(timer)
        timer = null
      }, wait)
    }
    return function () {
      context = this
      args = arguments
      if (!timer) {
        if (immediate) {
          fn.apply(context, args)
        }
        run()
      }
    }
  },

  // 阿拉伯数字转汉字
  num2Char: (val) => {
    let chin_list = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'] //所有的数值对应的汉字
    let sn = parseInt(val) + 1 //这里由于我的后台是从0开始排序
    if (sn <= 10) {
      return chin_list[sn - 1]
    } else if (sn <= 100) {
      if (sn < 20) return '十' + chin_list[(sn % 10) - 1]
      if (sn % 10 == 0) return chin_list[Math.floor(sn / 10) - 1] + '十'
      else return chin_list[Math.floor(sn / 10) - 1] + '十' + chin_list[(sn % 10) - 1]
    } else {
      // 一百以上暂不支持
    }
  },

  // 图片url转base64
  getBase64: async (imgUrl) => {
    window.URL = window.URL || window.webkitURL
    let base64 = await xhrImg(imgUrl)
    return base64
  },

  // base64转File对象
  base64ToPng: (dataUrl, name) => {
    var arr = dataUrl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], name + '.png', { type: 'image/png' })
  }
}

const xhrImg = (url) => {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open('get', url, true)
    // 至关重要
    xhr.responseType = 'blob'
    xhr.onload = function () {
      if (this.status == 200) {
        //得到一个blob对象
        var blob = this.response
        // 至关重要
        let oFileReader = new FileReader()
        oFileReader.onloadend = function (e) {
          // 此处拿到的已经是 base64的图片了
          let base64 = e.target.result
          resolve(base64)
        }
        oFileReader.readAsDataURL(blob)
      }
    }
    xhr.send()
  })
}

/**
 * TODO 获取URL参数
 * @param {name} String
 */
export function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

export function isZLB() {
  const sUserAgent = window.navigator.userAgent.toLowerCase()
  const bIsDtDreamApp = sUserAgent.indexOf('dtdreamweb') > -1 // 浙里办APP
  const bIsAlipayMini = sUserAgent.indexOf('miniprogram') > -1 && sUserAgent.indexOf('alipay') > -1
  return bIsDtDreamApp || bIsAlipayMini
}

export function isAliPay() {
  const sUserAgent = window.navigator.userAgent.toLowerCase()
  const bIsAlipayMini = sUserAgent.indexOf('miniprogram') > -1 && sUserAgent.indexOf('alipay') > -1
  return bIsAlipayMini
}

export function fitForOld() {
  localStorage.setItem('fitForOld', '2')
  const sUserAgent = window.navigator.userAgent.toLowerCase()
  const bIsDtDreamApp = sUserAgent.indexOf('dtdreamweb') > -1 // 浙里办APP
  if (bIsDtDreamApp) {
    ZWJSBridge.getUiStyle({})
      .then((result) => {
        switch (result.uiStyle) {
          case 'normal':
            break
          case 'elder':
            localStorage.setItem('fitForOld', '1')
            break
          default:
        }
        console.log(result)
      })
      //浙里办APP 6.11.0 版本以下版本标准模式兼容
      .catch((error) => {
        console.log(error)
        console.log('ZWJSBridge', '错误模式')
      })
  }
}

// 下划线参数转小驼峰
export function convert(obj) {
  if (Object.prototype.toString.call(obj) !== '[object Object]') return obj
  let res = {}
  for (let key in obj) {
    let newKey = toCamel(key)
    res[newKey] = obj[key]
  }
  return res
}

function toCamel(a) {
  return a.replace(/_(\w)/g, function (a, b) {
    return b.toUpperCase()
  })
}
export function ZLBJump(extra) {
  const sUserAgent = window.navigator.userAgent.toLowerCase()
  const bIsDtDreamApp = sUserAgent.indexOf('dtdreamweb') > -1 // 浙里办APP
  const bIsAlipayMini = sUserAgent.indexOf('miniprogram') > -1 && sUserAgent.indexOf('alipay') > -1
  console.log('检查环境')
  if (bIsDtDreamApp) {
    console.log('环境浙里办')
    ZWJSBridge.getUserType({})
      .then((res) => {
        if (res.userType == 2) {
          let goto = 'https://mapi.zjzwfw.gov.cn/web/mgop/gov-open/zj/2001923948/reserved/index.html?sp=' + extra
          window.location.replace('https://esso.zjzwfw.gov.cn/opensso/spsaehandler/metaAlias/sp?spappurl=https://jiangshan-tzyjs-apiweb.zjsszxc.com/web/legal/get_token?goto=' + encodeURIComponent(goto))
          window.onpageshow = (event) => {
            if (event.persisted || (window.performance && window.performance.navigation.type == 2)) {
              ZWJSBridge.close()
            }
          }
        } else {
          if (bIsAlipayMini) {
            //   window.onpageshow = (event) => {
            //     if (
            //       event.persisted ||
            //       (window.performance &&
            //         (window.performance.navigation.type == 1 ||
            //           window.performance.navigation.type == 0))
            //     ) {
            //       window.location.replace(
            //         'https://puser.zjzwfw.gov.cn/sso/alipay.do?action=ssoLogin&servicecode=jnt'
            //       )
            //     } else {
            //       my.navigateBack()
            //     }
            //   }
            try {
              location.replace('https://puser.zjzwfw.gov.cn/sso/alipay.do?action=ssoLogin&servicecode=jnt&goto=' + extra)
              // location.replace(
              //   'https://puser.zjzwfw.gov.cn/sso/alipay.do?action=ssoLogin&servicecode=jnt&goto=' + extra + '&redirectUrl=https://mapi.zjzwfw.gov.cn/web/mgop/gov-open/zj/2001923948/2.9.14/index.html?debug=true'
              // )
            } catch (err) {
              console.log('err', err)
            }
          } else {
            // window.location.replace('https://puser.zjzwfw.gov.cn/sso/mobile.do?action=oauth&scope=1&servicecode=jnt&goto=' + extra)
            window.location.replace(
              'https://puser.zjzwfw.gov.cn/sso/mobile.do?action=oauth&scope=1&servicecode=jnt&goto=' + extra + '&redirectUrl=https://mapi.zjzwfw.gov.cn/web/mgop/gov-open/zj/2001923948/2.9.16/index.html?debug=true'
            )
            window.onpageshow = (event) => {
              if (event.persisted || (window.performance && window.performance.navigation.type == 2)) {
                ZWJSBridge.close()
              }
            }
          }
        }
      })
      .catch((err) => {
        console.log('err', err)
      })
  } else {
    console.log('环境支付宝')
    try {
      location.replace('https://puser.zjzwfw.gov.cn/sso/alipay.do?action=ssoLogin&servicecode=jnt')
    } catch (err) {
      console.log('err', err)
    }
  }
}

// 根据文件地址获取文件后缀名
export function getExtension(name) {
  return name.substring(name.lastIndexOf('.') + 1).toLowerCase()
}

// 附件分类 图片 和pdf、doc文件
export function filterAttachment(attachment) {
  let imgs = []
  let documents = []
  if (attachment && attachment.length) {
    attachment.forEach((file) => {
      if (['pdf', 'doc', 'docx'].includes(getExtension(file))) {
        documents.push(file)
      } else {
        imgs.push(file)
      }
    })
  }
  return [imgs, documents]
}

// 获取系统配置
export function getConfigByKey(key) {
  return new Promise((resolve, reject) => {
    if (!key) resolve(null)
    Request.getSysSingleConfig({ key })
      .then((res) => {
        resolve(res.data.info.value)
      })
      .catch((err) => {
        resolve(null)
      })
  })
}

// 处理富文本字符串中的table 外层套一个div 做横向滚动
export function genHtmlTableWraper(content) {
  if (!content) return content
  try {
    let htmlStr = content
    let tempStr = htmlStr.replace(/<table/g, '<div class="tableWrapper"><table')
    let result = tempStr.replace(/<\/table>/g, '</table></div>')
    return result
  } catch (e) {
    console.log(e)
    return content
  }
}

const spliceString = function (start, newStr, html) {
  return html.slice(0, start) + newStr + html.slice(start)
}
