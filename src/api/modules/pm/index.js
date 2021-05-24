// 项目管理接口
import { request, METHOD, exportExcel } from '@/utils/request.js'

const prefix = '/project/project'

// 获取分页数据
export const getProjectList = params => request(`${prefix}/getListPage`, METHOD.POST, params)

// 添加、编辑项目信息
export const saveProjectData = params => request(`${prefix}/save`, METHOD.POST, params)

// 删除项目信息
export const delProjectData = id => request(`${prefix}/deleteById/${id}`)

// 导出项目信息
export const exportProjectData = params => exportExcel(`${prefix}/export`, params)

// excle 导入地址
export const excleImportUrl = process.env.VUE_APP_BASE_API + `${prefix}/import`

// 下载 excle 模板
export const excleDownload = params => exportExcel(`${prefix}/template`, params)
