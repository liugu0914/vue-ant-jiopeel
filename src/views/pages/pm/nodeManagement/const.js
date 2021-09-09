export const columns = [
  {
    title: '节点名称',
    dataIndex: 'name',
    width: '40%'
  },
  {
    title: '是否审批',
    dataIndex: 'process',
    align: 'center',
    customRender: value => value ? '是' : '否'
  },
  {
    title: '超时预警',
    dataIndex: 'overWarning',
    align: 'center',
    customRender: value => value ? '是' : '否'
  },
  {
    title: '操作',
    align: 'center',
    scopedSlots: { customRender: 'ops' }
  }
]

