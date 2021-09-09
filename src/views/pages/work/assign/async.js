import { getProjectList } from '@/api/modules/pm/projectInfo'
import { formatObj } from '@/utils/tool'

// 获取项目列表
export const projectList = async() => {
  const { data = [] } = await getProjectList()
  formatObj(data, { name: 'projectName', value: 'id' })
  return data
}
