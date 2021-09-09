// 项目管理接口
import { request, METHOD, exportExcel } from '@/utils/request.js'

const prefix = '/project/project'

// 获取表格数据
export const getTableData = params => request(`${prefix}/getListPage`, METHOD.POST, params)

// 添加、编辑项目信息
export const saveProjectData = params => request(`${prefix}/save`, METHOD.POST, params)

// 删除项目信息
export const delProjectData = id => request(`${prefix}/deleteById/${id}`)

// 导出项目信息
export const exportProjectData = () => exportExcel(`${prefix}/exportProject`)

// 项目信息 导入地址
export const projectInfoUrl = process.env.VUE_APP_BASE_API + `${prefix}/importProject`

// 项目信息  模板
export const getProjectTemplate = () => exportExcel(`${prefix}/getProjectTemplate`)

// 年度投资计划 导入地址
export const investmentPlanUrl = process.env.VUE_APP_BASE_API + `${prefix}/importInvestmentPlan`

// 年度投资计划  模板
export const getInvestmentPlanTemplate = () => exportExcel(`${prefix}/getInvestmentPlanTemplate`)

// 根据项目id获取对应节点树
export const getSetting = projectId => request(`${prefix}/getSetting`, METHOD.GET, { projectId })

// 根据节点id获取任务
export const getTasksById = projectNodeId => request(`${prefix}/getTasksById`, METHOD.GET, { projectNodeId })

// 根据节点id获取设置信息
export const getProjectNodeById = projectNodeId => request(`${prefix}/getProjectNodeById`, METHOD.GET, { projectNodeId })

// 保存节点任务配置
export const saveSetting = params => request(`${prefix}/saveSetting`, METHOD.POST, params)

// 获取项目统计信息
export const getProjectStatistics = () => request(`${prefix}/getProjectStatistics`)

// 获取项目列表
export const getProjectList = () => request(`${prefix}/getProjectBaseInfo`)

// 新增任务
export const saveTaskSetting = params => request(`${prefix}/saveTaskSetting`, METHOD.POST, params)

// 删除任务
export const delTaskSetting = ids => request(`${prefix}/delTaskSetting`, METHOD.GET, { ids })

// 根据统计获取项目信息
export const getListByShowId = ({ showId, params }) => request(`${prefix}/getListPageByShowId?showId=${showId}`, METHOD.POST, params)
