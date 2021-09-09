export const columns = [
  {
    title: '任务名称',
    dataIndex: 'name'
  },
  {
    title: '任务分类',
    dataIndex: 'type',
    align: 'center',
    scopedSlots: { customRender: 'type' }
  },
  {
    title: '权限管理',
    dataIndex: 'competence',
    align: 'center',
    scopedSlots: { customRender: 'competence' }
  },
  {
    title: '操作',
    align: 'center',
    scopedSlots: { customRender: 'ops' }
  }
]

export const expandColumns = [
  {
    title: '名称',
    dataIndex: 'extraName'
  },
  {
    title: '类型',
    dataIndex: 'extraValueType',
    align: 'center',
    customRender: text => text == 'text' ? '文本' : '数字'
  },
  {
    title: '排序',
    align: 'center',
    scopedSlots: { customRender: 'sort' }
  },
  {
    title: '操作',
    align: 'center',
    scopedSlots: { customRender: 'ops' }
  }
]
