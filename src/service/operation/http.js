import axios from 'axios'
import Router from '@/router'
import { Toast } from 'vant'

const Http = axios.create({
  baseURL: '/admin',
  timeout: 60000,
  withCredentials: true,
})

Http.interceptors.request.use(
  config => {
    const loginToken = localStorage.getItem('operation_token') || ''
    if (loginToken) {
      config.headers.Authorization = loginToken
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

Http.interceptors.response.use(
  res => {
    if (res && res.data && res.data.code == 21001) {
      if (window) {
        Router.replace({ name: 'operationLogin' })
      }
    }
    const { code, msg } = res.data
    if (code == 0) {
      return res.data
    } else {
      return Toast(msg)
    }
  },
  error => {
    return Promise.reject(error)
  }
)

export default Http
