/**
 * 权限 - 接口
 * @author lyc
 * @date 2021年3月1日16:54:36
 */
import { request, METHOD } from '@/utils/request.js'

const prefix = '/admin/permission'

/**
 * 获取系统级别权限
 * @param { String } appId 应用Id
 */
export async function getSys(appId) {
  return await request(`${prefix}/getSys`, METHOD.GET, { appId })
}

/**
 * 获取菜单级别权限
 * @param { String } appId 应用Id
 */
export async function getMenu(appId) {
  return await request(`${prefix}/getMenu`, METHOD.GET, { appId })
}


/**
 * 获取功能级别权限
 * @param { String } menuId 菜单Id
 */
export async function getFuc(menuId) {
  return await request(`${prefix}/getFuc`, METHOD.GET, { menuId })
}



/**
 * 配置菜单
 * @param { String } appId 应用Id
 */
export async function getConfigMenu(appId) {
  return await request(`${prefix}/getConfigMenu`, METHOD.GET, { appId })
}


/**
 * 保存配置菜单
 * @param { String } appId 应用Id
 * @param { String[] } Ids 选中的菜单Id
 */
export async function saveMenu(appId, Ids) {
  return await request(`${prefix}/saveMenu?appId=${appId}`, METHOD.POST, Ids)
}



/**
 * 通过Id查询数据

 */
export async function getOne(id) {
  return await request(`${prefix}/getOneById`, METHOD.GET, { id })
}

/**
 * 保存数据

 */
export async function save(params) {
  return await request(`${prefix}/save`, METHOD.POST, params)
}


/**
 * 删除数据
 */
export async function del(ids) {
  return await request(`${prefix}/del`, METHOD.GET, { ids })
}
