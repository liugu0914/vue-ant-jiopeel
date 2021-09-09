// 任务管理接口
import { request, METHOD } from '@/utils/request'

const prefix = '/project/projectNodeTask/upload'

// 获取任务列表
export const getTaskList = params => request(`${prefix}/getListPage`, METHOD.POST, params)

// 上传并保存文件
export const saveFile = params => request(`${prefix}/saveFile`, METHOD.POST, params)

// 提交任务
export const subMitTask = params => request(`${prefix}/submit`, METHOD.POST, params)

// 删除文件
export const delFiles = params => request(`${prefix}/deleteFiles`, METHOD.POST, params)

// 撤回任务
export const withdrawTask = params => request(`${prefix}/withdrawFile`, METHOD.POST, params)
