// 部门接口
import { request, METHOD } from '@/utils/request'

const prefix = '/sys/admin/dept'

// 获取树形数据
export const getSectionData = params => request(`${prefix}/getListPage`, METHOD.POST, params)

// 获取父级部门列表
export const getParentSectionList = () => request(`${prefix}/getSuperDepts`)

// 根据id获取部门信息
export const getOneSection = id => request(`${prefix}/getOneById`, null, { id })

// 保存部门信息
export const saveSectionData = params => request(`${prefix}/save`, METHOD.POST, params)

// 删除部门信息
export const delSectionData = id => request(`${prefix}/deleteById/${id}`)

// 拖拽部门
export const dragSection = params => request(`${prefix}/dragTree`, METHOD.POST, params)

// 获取审批人数据
export const getApproval = () => request(`${prefix}/getDeptUsers`)
