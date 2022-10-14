import { mgop } from '@aligov/jssdk-mgop'
import { isZLB, ZLBJump } from '../util/index'
import { convert } from '@/util/index'
const MGOP = (api, data, type) => {
  // 参数格式转换成小驼峰
  data = convert(data)
  // console.log('data', data)
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
          // console.log('asdas', data.data)
          localStorage.removeItem('token')
          if (isZLB()) {
            ZLBJump()
          }
          reject(data.data)
        } else {
          resolve(data.data)
        }
        // 20211215
      },
      onFail: (e) => {
        reject(e)
      },
    })
  })
}
export default MGOP
