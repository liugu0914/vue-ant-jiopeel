// 项目统计配置接口
import { request, METHOD } from '@/utils/request'

const prefix = '/project/projectConfig'

// 获取所有配置
export const getList = () => request(`${prefix}/getList`)

// 保存
export const save = params => request(`${prefix}/save`, METHOD.POST, params)
