import { request, METHOD } from '@/utils/request.js'


/**
 * 获取用户分页数据
 * @param { param: {需要查询的数据} , page: { pageNum: 第几页, pageSize: 每页大小} } params
 */
export async function getListPage(params) {
  return await request('/admin/user/getListPage', METHOD.POST, params)
}
