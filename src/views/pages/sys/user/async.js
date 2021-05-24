import { toTree } from '@/utils/tool'
import { getSectionData } from '@/api/modules/sys/dept'


/**
 * 部门树
 */
export async function getAsyncDepts() {
  return await getSectionData().then(res => {
    const { data = [] } = res
    return toTree(data, { title: 'name', key: 'id', value: 'id' })
  })
}
