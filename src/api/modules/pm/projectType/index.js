// 项目类型管理接口
import { request, METHOD } from '@/utils/request'

const prefix = '/project/projectType'

// 发送请求生成节点树
export const getNodeTree = params => request(`${prefix}/generateProjecTypeNodeTree`, METHOD.POST, params)

// 新增、修改 项目类型
export const saveProjectType = params => request(`${prefix}/save`, METHOD.POST, params)

// 获取对应业务类型的项目类型列表
export const getProjectType = businessTypeId => request(`${prefix}/getListByBusinessType`, METHOD.GET, { businessTypeId })

// 删除项目类型
export const delProjectType = ids => request(`${prefix}/delete`, METHOD.GET, { ids })

// 获取所有项目类型
export const getAllProjectType = () => request(`${prefix}/getList`)
