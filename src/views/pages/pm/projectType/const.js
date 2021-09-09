export const columns = [
  {
    title: '项目类型',
    dataIndex: 'name'
  },
  {
    title: '流程节点',
    dataIndex: 'topList',
    align: 'center',
    customRender: text => text.length ? text.map(item => item.name).join(' | ') : ''
  },
  {
    title: '操作',
    align: 'center',
    scopedSlots: { customRender: 'ops' }
  }
]
