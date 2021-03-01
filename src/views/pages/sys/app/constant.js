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
    title: '应用图标',
    dataIndex: 'icon',
    scopedSlots: { customRender: 'icon' },
    disable: true
  },
  {
    title: '应用名称',
    dataIndex: 'name',
    searchAble: true
  },
  {
    title: '应用标识',
    dataIndex: 'shortname',
    searchAble: true
  },
  {
    title: '应用描述',
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
  icon: undefined,
  name: undefined,
  shortname: undefined,
  des: undefined,
  enable: 0
}
