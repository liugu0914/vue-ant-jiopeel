// 任务类型管理接口
import { request, METHOD } from '@/utils/request'

const prefix = '/project/projectProcessExtra'

// 获取任务类型对应表单配置
export const getList = taskType => request(`${prefix}/getList`, METHOD.GET, { taskType })

// 保存已选字段配置
export const save = ({ taskType, list }) => request(`${prefix}/save?taskType=${taskType}`, METHOD.POST, list)

// 保存拓展项配置
export const saveExtra = ({ taskType, list }) => request(`${prefix}/saveExtra?taskType=${taskType}`, METHOD.POST, list)

// 删除拓展项字段
export const delField = ids => request(`${prefix}/del`, METHOD.GET, { ids })

// 根据任务类型获取表格标题
export const getTitle = taskType => request(`${prefix}/getTitle`, METHOD.GET, { taskType })

// 获取 任务、项目 可用扩展配置
export const getTaskConfigList = params => request(`${prefix}/getTaskConfigList`, METHOD.POST, params)
