/**
 * 表头
 * @date 2021-2-26 10:23:26
 * @author lyc
 */
export const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    customRender: (text, record, index) => index + 1
  },
  {
    title: '角色名称',
    dataIndex: 'name',
    disable: true
  },
  {
    title: '角色权重',
    dataIndex: 'weight'
  },
  {
    title: '角色描述',
    dataIndex: 'remark'
  },
  {
    title: '是否可用',
    dataIndex: 'enable',
    scopedSlots: { customRender: 'enable' },
    disable: true
  },
  {
    title: '操作',
    dataIndex: 'ops',
    scopedSlots: { customRender: 'action' },
    disable: true
  }
]


/**
 * 表头
 * @date 2021-2-26 10:23:26
 * @author lyc
 */
export const defaultForm = {
  id: undefined,
  name: undefined,
  weight: undefined,
  remark: undefined,
  enable: '1'
}
