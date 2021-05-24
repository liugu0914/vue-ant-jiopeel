// 视频监控模块
import { request, METHOD } from '@/utils/request'

const prefix = '/project/monitor'

// 获取项目列表
export const getProjectList = () => request('/project/project/getProjectBaseInfo')

// 获取监控设备列表
export const getMonitorList = params => request(`${prefix}/getListPage`, METHOD.POST, params)

// 添加、修改监控设备信息
export const saveMonitroData = params => request(`${prefix}/save`, METHOD.POST, params)

// 删除监控设备信息
export const delMonitorData = id => request(`${prefix}/deleteById/${id}`)

// 获取萤石云 accessToken
export const getAccessToken = () => request(`${prefix}/getAccessToken`)

// 开始控制摄像头
export const startControl = params => request(`${prefix}/startTurning`, METHOD.POST, params)

// 停止控制摄像头
export const endControl = params => request(`${prefix}/stopTurning`, METHOD.POST, params)
