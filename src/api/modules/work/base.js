// 任务管理接口
import { request, METHOD } from '@/utils/request'

const prefix = '/project/projectNodeTask/base'

// 获取任务详情
export const getTaskDetail = id => request(`${prefix}/getTaskDetail`, METHOD.GET, { id })

// 获取节点详情
export const getNodeDetail = id => request(`${prefix}/getNodeDetail`, METHOD.GET, { id })

// 获取任务扩展数据
export const getTaskExtraByTaskId = id => request(`${prefix}/getTaskExtraByTaskId`, METHOD.GET, { id })

// 保存扩展性数据
export const saveExtraData = params => request(`${prefix}/saveExtraData`, METHOD.POST, params)
