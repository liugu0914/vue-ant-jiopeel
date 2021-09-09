import { projectList } from './async'

const statusArr = [
  { label: '未处理', value: 0 },
  { label: '已处理', value: 1 },
  { label: '撤回', value: 2 }
]

export const columns = [
  {
    title: '任务名称',
    dataIndex: 'name',
    align: 'center',
    searchAble: true
  },
  {
    title: '所属项目',
    dataIndex: 'projectName',
    searchAble: true,
    dataType: 'select',
    search: { async: projectList, name: 'projectId' },
    align: 'center'
  },
  {
    title: '分派人',
    dataIndex: 'applyUserId',
    align: 'center',
    scopedSlots: { customRender: 'dispatchUser' }
  },
  {
    title: '状态',
    dataIndex: 'state',
    align: 'center',
    searchAble: true,
    dataType: 'checkbox',
    search: { name: 'assignState', options: statusArr, multiple: true },
    scopedSlots: { customRender: 'state' }
  },
  {
    title: '任务文件',
    dataIndex: 'taskFiles',
    align: 'center',
    scopedSlots: { customRender: 'taskFiles' }
  },
  {
    title: '附件',
    dataIndex: 'files',
    align: 'center',
    scopedSlots: { customRender: 'files' }
  },
  // {
  //   title: '操作时间',
  //   dataIndex: 'operateTime',
  //   align: 'center'
  // },
  {
    title: '用时',
    dataIndex: 'timeCost',
    align: 'center',
    scopedSlots: { customRender: 'timeCost' }
  },
  {
    title: '操作',
    align: 'center',
    scopedSlots: { customRender: 'ops' }
  }

]
