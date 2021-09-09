/**
 * 表头
 * @date 2021-2-26 10:23:26
 * @author lyc
 */
export const columns = [
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '值',
    dataIndex: 'value'
  },
  {
    title: '操作',
    dataIndex: 'ops',
    scopedSlots: { customRender: 'action' },
    disable: true
  }
]


/**
 * 表数据
 * @date 2021-2-26 10:23:26
 * @author lyc
 */
export const defaultForm = {
  id: undefined,
  name: undefined,
  alias: undefined,
  value: undefined
}


/**
 * 表数据
 * @date 2021-2-26 10:23:26
 * @author lyc
 */
export const deTailDefaultForm = {
  id: undefined,
  sysConfigId: undefined,
  name: undefined,
  value: undefined
}
