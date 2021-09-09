import { getSysConfigByAlias } from '@/api/modules/sys/dictionary'
import { getAllProjectType } from '@/api/modules/pm/projectType'
import { formatObj } from '@/utils/tool'

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
