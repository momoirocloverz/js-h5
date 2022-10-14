import axios from 'axios'
import Router from '../router'
const Http = axios.create({
  baseURL: '/web',
  timeout: 60000,
  withCredentials: true,
})
Http.interceptors.request.use(
  config => {
    const loginToken = localStorage.getItem('token') ? localStorage.getItem('token') : '"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImp0aSI6IjRmMXQyM2E4OGJiIn0.eyJpc3MiOiJqaWFuZ3NoYW5fdG91emlfeWlqaWFuc2hpIiwiYXVkIjoiamlhbmdzaGFuX3RvdXppX3lpamlhbnNoaSIsImp0aSI6IjRmMXQyM2E4OGJiIiwiaWF0IjoxNjY0MjgwODIxLCJleHAiOjE2NjY4NzI4MjEsInVpZCI6bnVsbH0.fQNjizt3-dlmo3IN_Hytg1R75j16SHg_CGya9-w_U1o"'
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
        Router.push({name: 'login', query: {
          goto: encodeURIComponent(window.location.hash)
        }})
      }
    }
    return res.data
  },
  error => {
    return Promise.reject(error)
  }
)

// post封装
const uploadFile = (url, data, config = {}) => {
  return Http.post(url, data, config)
}

export { Http, uploadFile }
