/**
 * 项目手续管理 - 接口
 * @author lyc
 * @date 2021年3月1日16:54:36
 */
import { request, METHOD } from '@/utils/request.js'


const prefix = '/project/projectProcess'

/**
 * 获取分页数据
 * @param { param: {需要查询的数据} , page: { pageNum: 第几页, pageSize: 每页大小} } params
 */
export async function getListPage(params) {
  return await request(`${prefix}/getListPage`, METHOD.POST, params)
}


/**
 * 通过项目Id获取手续管理信息
 * @param { String} projectId 项目Id
 */
export async function getProcessByProjectId(projectId) {
  return await request(`${prefix}/getProcessByProjectId`, METHOD.GET, { projectId })
}


/**
 * 通过子流程Id获取文件列表
 * @param { String} projectId 项目Id
 */
export async function getProcessKidByProcessId(processId) {
  return await request(`${prefix}/getProcessKidByProcessId`, METHOD.GET, { processId })
}



/**
 * 通过子流程Id获取文件列表
 * @param { String} projectId 项目Id
 */
export async function getFiles(processKidId) {
  return await request(`${prefix}/getFiles`, METHOD.GET, { processKidId })
}



/**
 * 保存当前文件列表
 * @param { Object} param
 */
export async function saveFiles(param) {
  return await request(`${prefix}/saveFiles`, METHOD.POST, param)
}

/**
 * 保存当前文件
 * @param { Object} param
 */
export async function saveCurrent(param) {
  return await request(`${prefix}/saveCurrent`, METHOD.POST, param)
}



/**
 * 提交文件
 * @param { String} processKidFileId 子流程文件ID
 */
export async function submitFile(processKidFileId) {
  return await request(`${prefix}/submitFile`, METHOD.GET, { processKidFileId })
}


/**
 * 审批文件
 * @param { Object} params 提交信息
 */
export async function applyFile(params) {
  return await request(`${prefix}/applyFile`, METHOD.POST, params)
}


/**
 * 查看
 * @param { String} projectId 项目Id
 */
export async function getInfo(projectId) {
  return await request(`${prefix}/getInfo`, METHOD.GET, { projectId })
}


/**
 * 查看审批日志
 * @param { String} processKidId 子流程Id
 */
export async function getLogs(processKidId) {
  return await request(`${prefix}/getLogs`, METHOD.GET, { processKidId })
}
