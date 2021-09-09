// 任务管理接口
import { request, METHOD } from '@/utils/request'

const prefix = '/project/projectTask'

// 获取任务列表
export const getTaskList = params => request(`${prefix}/getListPage`, METHOD.POST, params)

// 上传并保存文件
export const saveFile = params => request(`${prefix}/saveFile`, METHOD.POST, params)

// 提交任务
export const subMitTask = id => request(`${prefix}/submit`, METHOD.GET, { id })

// 删除文件
export const delFiles = params => request(`${prefix}/deleteFiles`, METHOD.POST, params)

// 撤回任务
export const withdrawTask = params => request(`${prefix}/withdrawFile`, METHOD.POST, params)

// 审核任务
export const reviewTask = params => request(`${prefix}/review`, METHOD.POST, params)

// 撤回审核
export const withdrawReview = params => request(`${prefix}/withdrawReview`, METHOD.POST, params)
