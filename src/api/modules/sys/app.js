/**
 * 应用 - 接口
 * @author lyc
 * @date 2021年3月1日16:54:36
 */
import { request, METHOD } from '@/utils/request.js'


/**
 * 获取分页数据
 * @param { param: {需要查询的数据} , page: { pageNum: 第几页, pageSize: 每页大小} } params
 */
export async function getListPage(params) {
  return await request('/sys/admin/app/getListPage', METHOD.POST, params)
}

/**
 * 查询所有数据
 */
export async function getAppList() {
  return await request(`/sys/admin/app/getList`, METHOD.GET)
}


/**
 * 通过Id查询数据

 */
export async function getOne(id) {
  return await request(`/sys/admin/app/getOneById`, METHOD.GET, { id })
}

/**
 * 保存数据

 */
export async function save(params) {
  return await request('/sys/admin/app/save', METHOD.POST, params)
}


/**
 * 删除数据
 */
export async function del(ids) {
  return await request(`/sys/admin/app/del`, METHOD.GET, { ids })
}
