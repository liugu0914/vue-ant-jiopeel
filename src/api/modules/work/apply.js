// 任务审核接口
import { request, METHOD } from '@/utils/request'

const prefix = '/project/projectNodeTask/apply'

// 获取任务列表
export const getTaskList = params => request(`${prefix}/getListPage`, METHOD.POST, params)

// 审核任务
export const reviewTask = params => request(`${prefix}/apply`, METHOD.POST, params)

// 撤回
export const withdrawReview = params => request(`${prefix}/withdraw`, METHOD.POST, params)

// 分派任务
export const assignUsers = params => request(`${prefix}/assign`, METHOD.POST, params)

// 获取分派记录
export const getAssignDetail = id => request(`${prefix}/getAssignDetail`, METHOD.GET, { id })
