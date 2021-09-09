export const columns = [
  {
    title: '统计名称',
    dataIndex: 'name'
  },
  {
    title: '统计节点',
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
