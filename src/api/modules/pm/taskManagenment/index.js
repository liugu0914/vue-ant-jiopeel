// 任务管理接口
import { request, METHOD } from '@/utils/request'

const prefix = '/project/processTask'

// 获取节点对应任务
export const getTaskList = processNodeId => request(`${prefix}/getListByProcessNodeId`, METHOD.GET, { processNodeId })

// 保存节点任务
export const saveNodeTask = params => request(`${prefix}/save`, METHOD.POST, params)

// 删除节点任务
export const delNodeTask = ids => request(`${prefix}/delete`, METHOD.GET, { ids })
