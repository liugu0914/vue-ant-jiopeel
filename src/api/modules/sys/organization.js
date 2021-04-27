/**
 * 组织 - 接口
 * @author lyc
 * @date 2021年3月1日16:54:36
 */
import { request, METHOD } from '@/utils/request.js'


/**
 * 获取分页数据
 * @param { param: {需要查询的数据} , page: { pageNum: 第几页, pageSize: 每页大小} } params
 */
export async function getListPage(params) {
  return await request('/sys/admin/organization/getListPage', METHOD.POST, params)
}

/**
 * 获取所有组织
 */
export async function getList() {
  return await request(`/sys/admin/organization/getList`, METHOD.GET)
}

/**
 * 切换组织
 */
export async function changeOrganization(organizationId) {
  return await request(`/sys/admin/organization/changeOrganization`, METHOD.GET, { organizationId })
}



/**
 * 获取用户对应的组织
 */
export async function getUserOrganization(userId) {
  return await request(`/sys/admin/organization/getUserOrganization`, METHOD.GET, { userId })
}


/**
 * 通过Id查询数据

 */
export async function getOne(id) {
  return await request(`/sys/admin/organization/getOneById`, METHOD.GET, { id })
}

/**
 * 保存数据

 */
export async function save(params) {
  return await request('/sys/admin/organization/save', METHOD.POST, params)
}


/**
 * 删除数据
 */
export async function del(ids) {
  return await request(`/sys/admin/organization/del`, METHOD.GET, { ids })
}
