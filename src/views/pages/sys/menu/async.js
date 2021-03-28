import { toTree } from '@/utils/tool'
import { getListPage } from '@/api/modules/sys/menu'
import { getAppList } from '@/api/modules/sys/app'



/**
 * 应用列表
 */
export async function getAsyncApps() {
  return await getAppList().then(res => {
    const { data = [] } = res
    return data.map(item => ({
      title: item.name,
      value: item.id
    }))
  })
}


/**
 * 菜单列表
 */
export async function getAsyncMenus() {
  return await getListPage().then(res => {
    const { data = [] } = res
    return toTree(data, { title: 'name', key: 'id', value: 'id' })
  })
}
