
import axios from 'axios'
import { message } from 'ant-design-vue'
import Lockr from 'lockr'
import router from '@/router/index.js'
import qs from 'qs'
import '@/utils/promise'

// 消息提示
const Msg = message
Msg.config({
  top: `40px`,
  duration: 2, // 2s 消失
  maxCount: 3 // 最大3个
})
/**
 * 请求类型
 */
const ContentType = {
  JSON: 'application/json;charset=utf-8',
  FORM: 'application/x-www-form-urlencoded;charset=utf-8',
  MULTIPART: 'multipart/form-data;charset=utf-8'
}

const ACCESS_TOKEN = 'access_token'

// 默认JSON
axios.defaults.headers['Content-Type'] = ContentType.FORM
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 15000 // 超时时间
})

// requset拦截器
request.interceptors.request.use(
  (config) => {
  // 发送请求之前 将access_token加到header
    const access_token = Lockr.get(ACCESS_TOKEN) || ''
    if (access_token) { config.headers[ACCESS_TOKEN] = access_token }

    if (config.method === 'get') {
      config.params = { ...(config.data || {}), ...config.params }
      return config
    }
    const flag = config.headers['Content-Type'] && config.headers['Content-Type'].indexOf('application/json') !== -1
    if (!flag) {
      const form = config.headers['Content-Type'] && config.headers['Content-Type'].indexOf('application/x-www-form-urlencoded') !== -1
      if (form) {
        config.data = qs.stringify(config.data)
      }
    } else {
      if (config.data === undefined || config.data === null) {
        // 不传参的情况下 json类型的提交数据，校准为 空对象
        config.data = {}
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// response拦截器
request.interceptors.response.use(
  (response) => {
    const DefaultMsg = '操作失败'
    const res = response.data
    if (response.status === 200) {
      if (res.status === 200) {
        return Promise.resolve(res)
      } else {
        const message = res.message || DefaultMsg
        Msg.error(message)
        return Promise.reject(message)
      }
    } else {
      return Promise.reject(DefaultMsg)
    }
  }, (error) => {
    let msg = '操作失败'
    let state = 'error' // 提示框状态
    if (error.response) {
      const response = error.response
      if (response.data && response.data.message) {
        msg = response.data.message
      }
      if (response.status == 500) {
        msg = '服务器连接错误'
      } else if (response.status === 401) { // 登录超时
        msg = msg || '登录超时,请重新登录'
        state = 'warn'
        Lockr.rm(ACCESS_TOKEN)
        router.push('/login')
      }
    }
    Msg[state](msg)
    return Promise.reject(msg)
  }
)

export { ContentType, Msg }

export default request
