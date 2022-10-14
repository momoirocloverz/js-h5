/**
 * 浙政钉相关工具api封装
 */
import dd from 'gdt-jsapi'
import Request from '@/service/operation'
import { Dialog } from 'vant'

const DDUtils = {
  /**
   * 判断浙政钉环境 获取应用免登授权码
   * @return code	String	授权码（移动端返回值）
   * @return expiresln	Integer	失效时间/秒（移动端返回值）
   * @return auth_code	String	授权码（PC端返回值）
   * @return expires_in	Integer	失效时间/秒（PC端返回值）
   *  */
  getAuthCode: (data = {}) => {
    return new Promise((resolve, reject) => {
      dd.getAuthCode(data)
        .then(res => {
          // alert('getAuthCode then => '+ JSON.stringify(res))
          resolve(res)
        })
        .catch(err => {
          // alert('getAuthCode catch => '+ JSON.stringify(err))
          resolve(null)
        })
    })
  },

  /**
   * 获取access_token
   */
  getAccessToken: (data = {}) => {
    return new Promise((resolve, reject) => {
      Request.getZZDToken(data)
        .then(res => {
          // alert('getAccessToken then => '+ JSON.stringify(res))
          resolve(res)
        })
        .catch(err => {
          // alert('getAccessToken catch => '+ JSON.stringify(err))
          resolve(null)
        })
    })
  },

  /**
   * 获取浙政钉用户信息
   * @param {*} data
   * @returns
   */
  getZZDUserInfo: (data = {}) => {
    return new Promise((resolve, reject) => {
      Request.getZZDUserInfo(data)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          resolve(null)
        })
    })
  },

  /**
   * 浙政钉登录
   */
  zzdLogin: (data = {}) => {
    return new Promise((resolve, reject) => {
      Request.zzdLogin(data)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          resolve(null)
        })
    })
  },
}

export default DDUtils
