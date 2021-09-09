// 节点管理接口
import { request, METHOD } from '@/utils/request'

const prefix = '/project/processNode'

// 获取节点树
export const getFlowTree = () => request(`${prefix}/getListPage`, METHOD.POST, {})

// 新增、修改节点
export const saveNodeData = params => request(`${prefix}/save`, METHOD.POST, params)

// 删除节点
export const delNode = ids => request(`${prefix}/delete`, null, { ids })
