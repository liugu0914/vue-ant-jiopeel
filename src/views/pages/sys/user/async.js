import { toTree } from '@/utils/tool'
import { getSectionData } from '@/api/modules/sys/dept'
import { getUsers } from '@/api/modules/sys/user'

/**
 * 部门树
 */
export async function getAsyncDepts() {
  return await getSectionData().then(res => {
    const { data = [] } = res
    return toTree(data, { title: 'name', key: 'id', value: 'id' })
  })
}


/**
 * 用户
 */
export async function getAsyncUsers() {
  return await getUsers().then(res => {
    const { data = [] } = res
    return data.map(item => ({
      title: item.userName,
      value: item.id
    }))
  })
}
