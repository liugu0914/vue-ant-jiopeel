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
    title: '组织名称',
    dataIndex: 'name',
    searchAble: true,
    disable: true
  },
  {
    title: '组织别称',
    dataIndex: 'alias',
    searchAble: true,
    disable: true
  },
  {
    title: '组织描述',
    dataIndex: 'des',
    searchAble: true
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
  alias: undefined,
  des: undefined,
  enable: '1'
}
