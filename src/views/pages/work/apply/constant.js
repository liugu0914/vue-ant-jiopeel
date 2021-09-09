import { getNodeTree, getTaskType, projectList } from './async'

const filterStateArr = [
  { label: '待审核', value: '4' },
  { label: '审核中', value: '5' },
  { label: '通过', value: '6' },
  { label: '驳回', value: '7' }
]

export const stateArr = [
  { name: '待上传', color: 'red' }, { name: '上传中', color: 'orange' }, { name: '已上传', color: 'green' },
  { name: '提交中', color: 'purple' }, { name: '待审核', color: '#2db7f5' }, { name: '审核中', color: 'cyan' },
  { name: '通 过', color: '#008700' }, { name: '驳 回', color: '#f50' }, { name: '审核中', color: 'cyan' }
]

export const columns = [
  {
    title: '任务名称',
    dataIndex: 'name',
    width: '20%',
    searchAble: true,
    align: 'center'
  },
  {
    title: '任务分类',
    dataIndex: 'type',
    align: 'center',
    scopedSlots: { customRender: 'type' },
    searchAble: true,
    dataType: 'select',
    search: { async: getTaskType }
  },
  {
    title: '所属节点',
    dataIndex: 'nodeName',
    align: 'center',
    searchAble: true,
    dataType: 'tree',
    search: { async: getNodeTree, name: 'node' }
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
    title: '状态',
    dataIndex: 'state',
    align: 'center',
    scopedSlots: { customRender: 'status' },
    searchAble: true,
    dataType: 'checkbox',
    search: { options: filterStateArr, name: 'taskState', multiple: true }
  },
  {
    title: '任务文件',
    dataIndex: 'files',
    align: 'center',
    scopedSlots: { customRender: 'outcomeFile' }
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
