// 项目管理接口
import { request, METHOD } from '@/utils/request.js'

const prefix = '/project/projectApply'

// 获取审批配置
export const getSpSetting = projectType => request(`${prefix}/getProjectApplyList/${projectType}`)

// 初始化审批配置
export const getSpsetInit = () => request(`${prefix}/init`)

// 更改审批人
export const updateApproval = params => request(`${prefix}/updApprover`, METHOD.POST, params)
