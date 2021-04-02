/**
 * 角色 - 接口
 * @author lyc
 * @date 2021年3月1日16:54:36
 */
import { request, METHOD } from '@/utils/request.js'


const prefix = '/admin/role'

/**
 * 获取分页数据
 * @param { param: {需要查询的数据} , page: { pageNum: 第几页, pageSize: 每页大小} } params
 */
export async function getListPage(params) {
  return await request(`${prefix}/getListPage`, METHOD.POST, params)
}

/**
 * 获取数据
 * @param { param: {需要查询的数据} , page: { pageNum: 第几页, pageSize: 每页大小} } params
 */
export async function getList(params) {
  return await request(`${prefix}/getList`, METHOD.POST, params)
}


/**
 * 通过Id查询数据

 */
export async function getOne(id) {
  return await request(`${prefix}/getOneById`, METHOD.GET, { id })
}

/**
 * 查询配置信息
 *@param appId 应用Id
 *@param roleId 角色Id
 */
export async function configDetail(appId, roleId) {
  return await request(`${prefix}/configDetail`, METHOD.GET, { appId, roleId })
}

/**
 * 保存数据

 */
export async function save(params) {
  return await request(`${prefix}/save`, METHOD.POST, params)
}

/**
 * 保存权限数据
 * @param {roleId: 角色ID, sysPes: 系统权限, menuPes: 菜单权限} params 应用Id
 */
export async function savePes(params) {
  return await request(`${prefix}/savePes`, METHOD.POST, params)
}


/**
 * 删除数据
 */
export async function del(ids) {
  return await request(`${prefix}/del`, METHOD.GET, { ids })
}


/**
 * 通过用户Id查询角色
 */
export async function getUserRole(useId) {
  return await request(`${prefix}/getUserRole`, METHOD.GET, { useId })
}



/**
 * 获取可选角色
 */
export async function getUseFulRoles() {
  return await request(`${prefix}/getUseFulRoles`, METHOD.GET)
}



/**
 * 保存选择的角色
 */
export async function saveUserRole(params) {
  return await request(`${prefix}/saveUserRole`, METHOD.POST, params)
}
