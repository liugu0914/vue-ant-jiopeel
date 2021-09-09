import { getFlowTree } from '@/api/modules/pm/nodeManagement'
import { formatObj } from '@/utils/tool'
import { getProjectList } from '@/api/modules/pm/projectInfo'
import { getSysConfigByAlias } from '@/api/modules/sys/dictionary'
import { getAllProjectType } from '@/api/modules/pm/projectType'

// 获取节点树
export const getNodeTree = async() => {
  const { data = [] } = await getFlowTree()
  formatObj(data, { value: 'id' })
  return data
}

// 获取项目列表
export const projectList = async() => {
  const { data = [] } = await getProjectList()
  formatObj(data, { name: 'projectName', value: 'id' })
  return data
}

// 获取项目区属数据字典
export const getProjectArea = async() => {
  const { data = [] } = await getSysConfigByAlias('projectArea')
  formatObj(data)
  return data
}

// 获取项目类型数据字典
export const getProjectType = async() => {
  const { data = [] } = await getAllProjectType()
  formatObj(data, { value: 'id' })
  return data
}
