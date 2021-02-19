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
 * 保存信息
 */
export function saveUserData(data) {
  const { Authorization, user: userInfo } = data
  console.log('Authorization ==> ', Authorization)
  setAuthorization(Authorization)
  const { user, permissions, roleList, menus } = userInfo
  setUser(user)
  setPermissions(permissions)
  setRoles(roleList)
  loadRoutes(simple2Tree(menus, 'id', 'superId', 'children'))
  // 登录成功移除tabs
  sessionStorage.removeItem(process.env.VUE_APP_TBAS_KEY)
}
