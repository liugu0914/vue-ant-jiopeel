import { request, METHOD } from '@/utils/request'

/**
 * 节点任务操作记录
 */
const prefix = '/project/projectNodeTaskLog'

/**
 * 查询分页数据
 */
export async function getListPage(params) {
  return await request(`${prefix}/getListPage`, METHOD.POST, params)
}
