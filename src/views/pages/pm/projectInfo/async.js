import { getSysConfigByAlias } from '@/api/modules/sys/dictionary'
import { getAllProjectType } from '@/api/modules/pm/projectType'


// 获取项目区属字典
export const getProjectArea = async() => {
  const { data = [] } = await getSysConfigByAlias('projectArea')
  return data.length ? data.map(item => ({ ...item, title: item.name })) : data
}

// 获取项目类型
export const getProjectType = async() => {
  const { data = [] } = await getAllProjectType()
  return data.length ? data.map(item => ({ ...item, title: item.name, value: item.id })) : data
}
