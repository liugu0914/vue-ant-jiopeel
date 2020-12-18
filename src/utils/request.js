import axios from 'axios'
import Lockr from 'lockr'

// 跨域认证信息 header 名
const xsrfHeaderName = 'Authorization'
const Authorization = 'access_token'

axios.defaults.timeout = 15000
axios.defaults.baseURL = process.env.VUE_APP_BASE_API
axios.defaults.withCredentials = true
axios.defaults.Authorization = Authorization
axios.defaults.xsrfHeaderName = xsrfHeaderName
axios.defaults.xsrfCookieName = xsrfHeaderName
axios.defaults.headers.post['Content-Type'] = CONTENT_TYPE.FORM

// 认证类型
const AUTH_TYPE = {
  BEARER: 'Bearer',
  BASIC: 'basic',
  AUTH1: 'auth1',
  AUTH2: 'auth2'
}

/**
 * 请求类型
 */
const CONTENT_TYPE = {
  JSON: 'application/json;charset=utf-8',
  FORM: 'application/x-www-form-urlencoded;charset=utf-8',
  MULTIPART: 'multipart/form-data;charset=utf-8'
}

// http method
const METHOD = {
  GET: 'get',
  POST: 'post'
}

/**
 * axios请求
 * @param url 请求地址
 * @param method {METHOD} http method
 * @param params 请求参数
 * @returns {Promise<AxiosResponse<T>>}
 */
async function request(url, method, params) {
  switch (method) {
    case METHOD.GET:
      return axios.get(url, { params })
    case METHOD.POST:
      return axios.post(url, params)
    default:
      return axios.get(url, { params })
  }
}

/**
 * 设置认证信息
 * @param auth {Object}
 * @param authType {AUTH_TYPE} 认证类型，默认：{AUTH_TYPE.BEARER}
 */
function setAuthorization(auth) {
  Lockr.set(Authorization, auth.token)
}

/**
 * 移出认证信息
 * @param authType {AUTH_TYPE} 认证类型
 */
function removeAuthorization() {
  Lockr.rm(Authorization)
}

/**
 * 检查认证信息
 * @param authType
 * @returns {boolean}
 */
function checkAuthorization() {
  const token = Lockr.get(Authorization)
  return !!token
}

/**
 * 加载 axios 拦截器
 * @param interceptors
 * @param options
 */
function loadInterceptors(interceptors, options) {
  const { request, response } = interceptors
  // 加载请求拦截器
  request.forEach(item => {
    let { onFulfilled, onRejected } = item
    if (!onFulfilled || typeof onFulfilled !== 'function') {
      onFulfilled = config => config
    }
    if (!onRejected || typeof onRejected !== 'function') {
      onRejected = error => Promise.reject(error)
    }
    axios.interceptors.request.use(
      config => onFulfilled(config, options),
      error => onRejected(error, options)
    )
  })
  // 加载响应拦截器
  response.forEach(item => {
    let { onFulfilled, onRejected } = item
    if (!onFulfilled || typeof onFulfilled !== 'function') {
      onFulfilled = response => response
    }
    if (!onRejected || typeof onRejected !== 'function') {
      onRejected = error => Promise.reject(error)
    }
    axios.interceptors.response.use(
      response => onFulfilled(response, options),
      error => onRejected(error, options)
    )
  })
}

/**
 * 解析 url 中的参数
 * @param url
 * @returns {Object}
 */
function parseUrlParams(url) {
  const params = {}
  if (!url || url === '' || typeof url !== 'string') {
    return params
  }
  const paramsStr = url.split('?')[1]
  if (!paramsStr) {
    return params
  }
  const paramsArr = paramsStr.replace(/&|=/g, ' ').split(' ')
  for (let i = 0; i < paramsArr.length / 2; i++) {
    const value = paramsArr[i * 2 + 1]
    params[paramsArr[i * 2]] = value === 'true' ? true : (value === 'false' ? false : value)
  }
  return params
}

export {
  METHOD,
  AUTH_TYPE,
  CONTENT_TYPE,
  request,
  setAuthorization,
  removeAuthorization,
  checkAuthorization,
  loadInterceptors,
  parseUrlParams
}
