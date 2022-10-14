import { mgop } from '@aligov/jssdk-mgop'
import { isZLB, ZLBJump } from '../util/index'
const MGOP = (api, data, type) => {
  const loginToken = localStorage.getItem('token')
    ? localStorage.getItem('token')
    : ''
  return new Promise((resolve, reject) => {
    mgop({
      api, // 必须
      host: 'https://mapi.zjzwfw.gov.cn/',
      dataType: 'JSON',
      type,
      appKey: '9qz1aeub+2001923948+qsmsjd', // 必须
      data,
      header: {
        Authorization: loginToken,
        // isTestUrl: '1',
      },
      onSuccess: (data) => {
        if (data.data.code == 21001) {
          localStorage.removeItem('token')
          if (isZLB()) {
            ZLBJump()
          }
          reject(data)
        } else {
          resolve(data)
        }
      },
      onFail: (e) => {
        reject(e)
      },
    })
  })
}
export default MGOP
