export const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    customRender: (text, record, index) => index + 1,
    align: 'center'
  },
  {
    title: '项目名称',
    dataIndex: 'projectId',
    searchAble: true,
    dataType: 'select',
    search: {
      options: []
    },
    customRender: (text, record, index) => record.projectName,
    align: 'center'
  },
  {
    title: '设备名称',
    dataIndex: 'name',
    align: 'center'
  },
  // {
  //   title: '设备品牌',
  //   dataIndex: 'brand',
  //   align: 'center'
  // },
  // {
  //   title: '设备型号',
  //   dataIndex: 'model',
  //   align: 'center'
  // },
  {
    title: '设备编号',
    dataIndex: 'monitorNum',
    align: 'center'
  },
  {
    title: '设备状态',
    dataIndex: 'deviceStatus',
    align: 'center',
    customRender: text => +text ? '在线' : '不在线'
  },
  {
    title: '位置坐标',
    customRender: (text, record, index) => `经度：${record.longitude} 纬度：${record.latitude}`,
    align: 'center'
  },
  // {
  //   title: '访问地址',
  //   dataIndex: 'urlPreview',
  //   align: 'center'
  // },
  {
    title: '操作',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]
