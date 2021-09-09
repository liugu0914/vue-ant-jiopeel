export const columns = [
  {
    title: '列名',
    dataIndex: 'name',
    align: 'center',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '字段类型',
    dataIndex: 'extra',
    align: 'center',
    customRender: text => text ? '拓展项' : '主表'
  },
  {
    title: '类型',
    dataIndex: 'valueType',
    align: 'center',
    scopedSlots: { customRender: 'type' }
  },
  {
    title: '是否启用',
    dataIndex: 'enable',
    align: 'center',
    scopedSlots: { customRender: 'enable' },
    visible: false
  },
  {
    title: '排序',
    dataIndex: 'orderNum',
    align: 'center',
    scopedSlots: { customRender: 'sort' }
  }
]
