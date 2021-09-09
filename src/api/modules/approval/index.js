// 审批管理、投资管理、质量管理 公共接口
import { request, exportExcel, METHOD } from '@/utils/request'

const prefix = '/project/projectApproval'

// 获取对应节点信息
export const getNodeData = taskType => request(`${prefix}/getParentNodeByTaskType`, METHOD.GET, { taskType })

// 获取对应项目信息
export const getProjectData = params => request(`${prefix}/getListPage`, METHOD.POST, params)

// 获取项目流程
export const getProjectFlow = params => request(`${prefix}/getProjectNodeByTaskType`, METHOD.GET, params)

// 获取对应节点的任务列表
export const getTaskList = projectNodeId => request(`${prefix}/getProjectNodeTaskByProjectNodeId`, METHOD.GET, { projectNodeId })

// 导出文件项目流程
export const excelPage = params => exportExcel(`${prefix}/export`, params)

// 获取指定任务分类的节点树
export const getNodeByTaskType = taskType => request(`${prefix}/getNodeByTaskType`, METHOD.GET, { taskType })
