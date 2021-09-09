export const projectTypeArr = [
  { label: '水利类', value: 1 },
  { label: '市政类', value: 2 }
]

export const columns = [
  // {
  //   title: '审批名称',
  //   align: 'center',
  //   colSpan: 0
  // },
  {
    title: '审批节点',
    dataIndex: 'spName',
    align: 'center',
    colSpan: 0,
    customRender: (value, row) => ({ children: value, attrs: { rowSpan: row.spNameRowSpan }})
  },
  {
    title: '审批流程',
    dataIndex: 'name',
    width: '47%',
    colSpan: 2
  },
  {
    title: '审批人',
    width: '53%',
    scopedSlots: { customRender: 'approver' }
  }
]

