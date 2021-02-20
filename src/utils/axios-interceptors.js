// import Cookie from 'js-cookie'
import Lockr from 'lockr'
import qs from 'qs'
import { isObject } from '@/utils/util'
// import { whiteList } from '@/router'


const SUCCESS_KEY = 200


// 请求前
const reqCommon = {
  /**
   * 发送请求之前做些什么
   * @param config axios config
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {*}
   */
  onFulfilled(config, options) {
    const { Authorization } = config
    config.headers.common[config.Authorization] = Lockr.get(Authorization)
    if (config.method === 'get') {
      config.params = { ...(config.data || {}), ...config.params }
      return config
    }
    const contentType = config.headers.post['Content-Type']
    const flag = contentType && contentType.indexOf('application/json') >= 0
    if (!flag) {
      const form = contentType && contentType.indexOf('application/x-www-form-urlencoded') >= 0
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
  /**
   * 请求出错时做点什么
   * @param error 错误对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {Promise<never>}
   */
  onRejected(error, options) {
    const { message } = options
    message.error(error.message)
    return Promise.reject(error)
  }
}

/**
 *  401处理 登录失效
 */
const resp401 = {
  /**
   *  响应数据之前做点什么
   * @param error 响应对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {*}
   */
  onRejected(error, options) {
    const { response, config } = error
    const { Authorization } = config
    const { router, message } = options
    if (response.status == 401) {
      const msg = '登录超时,请重新登录'
      if (Lockr.get(Authorization)) {
        Lockr.rm(Authorization)
      }
      router.push('/login')
      message.warn(msg)
      return Promise.reject(msg)
    }
    return error
  }
}

/**
 * 500 处理 服务内部错误
 */
const resp500 = {
  /**
   *  响应数据之前做点什么
   * @param error 响应对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {*}
   */
  onRejected(error, options) {
    if (!isObject(error)) {
      return error
    }
    const { response } = error
    const { message } = options
    if (response.status == 500) {
      const msg = '服务器连接错误'
      message.error(msg)
      return Promise.reject(msg)
    }
    return error
  }
}

// 公共响应拦截
const respCommon = {
  /**
   * 响应数据之前做点什么
   * @param response 响应对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {*}
   */
  onFulfilled(response, options) {
    const DefaultMsg = '操作失败'
    const res = response.data
    if (response.status === 200) {
      if (res.status === SUCCESS_KEY) {
        return Promise.resolve(res)
      } else {
        const msg = res.message || DefaultMsg
        return Promise.reject(msg)
      }
    } else {
      return Promise.reject(DefaultMsg)
    }
  },
  /**
   * 服务器状态码不是2开头的的情况
   * 响应出错时执行
   * @param error 错误对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {Promise<never>}
   */
  onRejected(error, options) {
    const { response = {}} = error
    const { message } = options
    let msg = '操作失败'
    const state = 'error' // 提示框状态
    if (response.data && response.data.message) {
      msg = response.data.message
    }
    message[state](msg)
    return Promise.reject(msg)
  }
}



export default {
  request: [reqCommon], // 请求拦截
  response: [resp401, resp500, respCommon] // 响应拦截
}
