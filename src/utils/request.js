import axios from 'axios'
import Lockr from 'lockr'
import Cookie from 'js-cookie'

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


// 前端鉴别认证
// const Authorization = process.env.VUE_APP_AUTHORIZATION_KEY

// token名称
const ACCESS_TOKEN = process.env.VUE_APP_ACCESS_TOKEN_KEY

const Authorization = ACCESS_TOKEN


axios.defaults.timeout = 15000
axios.defaults.baseURL = process.env.VUE_APP_BASE_API
axios.defaults.withCredentials = true
axios.defaults.Authorization = Authorization
axios.defaults.xsrfHeaderName = ACCESS_TOKEN
axios.defaults.xsrfCookieName = ACCESS_TOKEN
axios.defaults.headers.post['Content-Type'] = CONTENT_TYPE.JSON

/**
 * axios请求
 * @param url 请求地址
 * @param method {METHOD} http method
 * @param params 请求参数
 * @returns {Promise<AxiosResponse<T>>}
 */
async function request(url, method, params) {
  // 兼容axios.request
  if (arguments.length === 1 && Object.prototype.toString.call(arguments[0]) === '[object Object]') {
    return axios.request(arguments[0])
  }
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
 * @param token {Object}
 */
function setAuthorization(token) {
  Lockr.set(Authorization, token.access_token)
  Cookie.set(Authorization, token.access_token, {
    expires: 1,
    path: '/'
  })
}

/**
 * 移出认证信息
 */
function removeAuthorization() {
  Lockr.rm(Authorization)
  Cookie.remove(Authorization)
  removeUser()
  removeOrganization()
  removeRoles()
  removePermissions()
  removeMenus()
}

/**
 * 移出用户信息
 */
function removeUser() {
  Lockr.rm(process.env.VUE_APP_USER_KEY)
}

/**
 * 移出组织信息
 */
function removeOrganization() {
  Lockr.rm(process.env.VUE_APP_ORGANIZATION_KEY)
}

/**
 * 移出角色信息
 */
function removeRoles() {
  Lockr.rm(process.env.VUE_APP_ROLES_KEY)
}

/**
 * 移出权限信息
 */
function removePermissions() {
  Lockr.rm(process.env.VUE_APP_PERMISSIONS_KEY)
}

/**
 * 移出菜单信息
 */
function removeMenus() {
  Lockr.rm(process.env.VUE_APP_MENUS_KEY)
}


/**
 * 检查认证信息
 */
function checkAuthorization() {
  return !!Lockr.get(Authorization) || !!Cookie.get(Authorization)
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
  CONTENT_TYPE,
  request,
  setAuthorization,
  removeAuthorization,
  removeUser,
  removeOrganization,
  removeRoles,
  removePermissions,
  removeMenus,
  checkAuthorization,
  loadInterceptors,
  parseUrlParams
}
