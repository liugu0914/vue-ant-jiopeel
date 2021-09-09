import { request, METHOD } from '@/utils/request'

/**
 * 节点审批
 */
const prefix = '/project/projectNode'

/**
 * 查询分页数据
 */
export async function getListPage(params) {
  return await request(`${prefix}/getListPage`, METHOD.POST, params)
}


/**
 * 查看节点下任务详情
 */
export async function getTasks(projectNodeId) {
  return await request(`${prefix}/getNodeTasksByProjectNodeId`, METHOD.GET, { projectNodeId })
}


/**
 * 项目节点审批
 */
export async function nodeApply(params) {
  return await request(`${prefix}/nodeApply`, METHOD.POST, params)
}


/**
 * 查看节点详情
 */
export async function getOneById(projectNodeId) {
  return await request(`${prefix}/getOneById`, METHOD.GET, { projectNodeId })
}



/**
 * 查看节点详情
 */
export async function getGantData(projectId) {
  return await request(`${prefix}/getGantData`, METHOD.GET, { projectId })
}
