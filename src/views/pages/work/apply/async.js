import { getFlowTree } from '@/api/modules/pm/nodeManagement'
import { getSysConfigByAlias } from '@/api/modules/sys/dictionary'
import { formatObj } from '@/utils/tool'
import { getProjectList } from '@/api/modules/pm/projectInfo'

// 获取节点树
export const getNodeTree = async() => {
  const { data = [] } = await getFlowTree()
  formatObj(data, { value: 'id' })
  return data
}

// 获取任务分类字典
export const getTaskType = async() => {
  const { data = [] } = await getSysConfigByAlias('taskType')
  return data.map(item => ({ ...item, label: item.name }))
}

// 获取项目列表
export const projectList = async() => {
  const { data = [] } = await getProjectList()
  formatObj(data, { name: 'projectName', value: 'id' })
  return data
}
