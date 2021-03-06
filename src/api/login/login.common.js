import { setAuthorization } from '@/utils/request'
import { simple2Tree } from '@/utils/tool'
import { loadRoutes } from '@/utils/routerUtil'
import store from '@/store'

/**
 * 保存用户信息
 * @param {*} user
 */
function setUser(user) {
  store.commit('account/setUser', user)
}

/**
 * 保存组织信息
 * @param {Array} organization
 */
function setOrganization(organization) {
  store.commit('account/setOrganization', organization)
}

/**
 * 保存权限信息
 * @param {*} permissions
 */
function setPermissions(permissions) {
  store.commit('account/setPermissions', permissions)
}

/**
 * 保存角色信息
 * @param {*} roles
 */
function setRoles(roles) {
  store.commit('account/setRoles', roles)
}

/**
 * 保存token信息
 * @param {*} token
 */
function setToken(token) {
  store.commit('account/setToken', token)
}

/**
 * 保存角色信息
 * @param {*} roles
 */
export function saveUserInfo(userInfo) {
  const { user, organization, permissions, roleList, menus } = userInfo
  setUser(user)
  setOrganization(organization)
  setPermissions(permissions)
  setRoles(roleList)
  loadRoutes(simple2Tree(menus, 'id', 'superId', 'children'))
}

/**
 * 保存信息
 */
export function saveUserData(data) {
  const { Authorization, user: userInfo } = data
  setAuthorization(Authorization)
  setToken(Authorization.access_token)
  saveUserInfo(userInfo)
  // 登录成功移除tabs
  sessionStorage.removeItem(process.env.VUE_APP_TBAS_KEY)
}


