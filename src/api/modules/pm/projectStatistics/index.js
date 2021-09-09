// 项目统计配置接口
import { request, METHOD } from '@/utils/request'

const prefix = '/project/projectShow'

// 获取所有统计配置
export const getStatistics = () => request(`${prefix}/getList`)

// 保存统计配置
export const saveStatistics = params => request(`${prefix}/save`, METHOD.POST, params)

// 删除统计配置
export const delStatistics = ids => request(`${prefix}/delete`, METHOD.GET, { ids })
