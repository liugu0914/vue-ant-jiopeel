// 任务分派接口
import { request, METHOD } from '@/utils/request'

const prefix = '/project/projectNodeTask/assign'

// 获取分派任务列表
export const getAssignTask = params => request(`${prefix}/getListPage`, METHOD.POST, params)

// 分派处理
export const handleAssign = params => request(`${prefix}/handleAssign`, METHOD.POST, params)

// 撤回处理
export const withdraw = params => request(`${prefix}/withdraw`, METHOD.POST, params)
