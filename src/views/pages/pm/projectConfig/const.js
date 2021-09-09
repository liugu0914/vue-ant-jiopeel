export const columns = [
  {
    title: '配置名称',
    dataIndex: 'des',
    align: 'center'
  },
  {
    title: '目标值',
    dataIndex: 'value',
    align: 'center',
    scopedSlots: { customRender: 'value' }
  }
]
