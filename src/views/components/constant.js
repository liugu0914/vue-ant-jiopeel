export const columns = [
  {
    title: '任务名称',
    dataIndex: 'name',
    align: 'center'
  },
  {
    title: '任务文件',
    dataIndex: 'files',
    align: 'center',
    scopedSlots: { customRender: 'files' }
  },
  {
    title: '处理结果',
    dataIndex: 'state',
    align: 'center',
    scopedSlots: { customRender: 'state' }
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'ops' },
    align: 'center'
  }
]

export const stateArr = [
  { name: '待上传', color: 'red' }, { name: '上传中', color: 'orange' }, { name: '已上传', color: 'green' },
  { name: '提交中', color: 'purple' }, { name: '待审核', color: '#2db7f5' }, { name: '审核中', color: 'cyan' },
  { name: '通 过', color: '#87d068' }, { name: '驳 回', color: '#f50' }, { name: '已上传', color: 'green' }
]


export const nodeState = [
  { name: '未开始', color: '' }, { name: '进行中', color: 'orange' },
  { name: '待审批', color: '#2db7f5' }, { name: '已审批', color: '#008700' }]
