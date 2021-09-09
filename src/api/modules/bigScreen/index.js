// 大屏展示接口
import { request, METHOD } from '@/utils/request'

const prefix = '/project/api-nta/bigScreen'
const prefix1 = '/project/api-nta/monitor'

// 获取项目进度统计
export const getProjectSchedule = () => request(`${prefix}/statisticProjectSchedule`)

// 获取年度投资计划统计
export const getInvestmentPlan = () => request(`${prefix}/statisticInvestmentPlan`)

// 获取建设类型数量统计
export const getConstructType = () => request(`${prefix}/statisticConstructType`)

// 获取项目基本信息
export const getProjectBaseInfo = () => request(`${prefix}/staticticProjectBaseInfo`)

// 获取项目审批办理统计
export const getProjectApproval = businessTypeId => request(`${prefix}/staticticProjectApproval`, null, { businessTypeId })

// 获取项目审批流程节点
export const getProjectApplyInfo = projectId => request(`${prefix}/statisticProjectApplyInfo`, null, { projectId })

// 获取数据字典
export const getSysConfigByAlias = alias => request(`${prefix}/getSysConfigByAlias`, null, { alias })

// 获取当天天气信息
export const getWeather = () => request(`${prefix}/getTodayWeather?location=101191301`)

// 获取三天天气信息
export const getThreeDaysWeather = () => request(`${prefix}/getThreeDaysWeather?location=101191301`)

// 获取 AccessToken
export const getAccessToken = () => request(`${prefix1}/getAccessToken`)

// 开始控制摄像头
export const startControl = params => request(`${prefix1}/startTurning`, METHOD.POST, params)

// 停止控制摄像头
export const endControl = params => request(`${prefix1}/stopTurning`, METHOD.POST, params)
