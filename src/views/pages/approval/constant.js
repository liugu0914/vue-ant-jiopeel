import { getProjectArea, getProjectType } from './async'

export const columns = [
  {
    title: '项目编号',
    searchAble: true,
    dataIndex: 'projectNum',
    align: 'center'
  },
  {
    title: '项目名称',
    searchAble: true,
    dataIndex: 'projectName',
    align: 'center'
  },
  {
    title: '项目区属',
    dataIndex: 'projectArea',
    align: 'center',
    searchAble: true,
    dataType: 'select',
    search: { async: getProjectArea },
    scopedSlots: { customRender: 'projectArea' },
    request: true
  },
  {
    title: '项目类型',
    searchAble: true,
    dataType: 'select',
    search: { async: getProjectType, name: 'projectType' },
    dataIndex: 'projectTypeName',
    align: 'center',
    request: true
  },
  {
    title: '当前阶段',
    dataIndex: 'stage',
    align: 'center',
    searchAble: true,
    dataType: 'tree',
    search: { name: 'nodeId' },
    request: true
  },
  {
    title: '审批部门',
    dataIndex: 'applyUserDeptName',
    align: 'center'
  },
  {
    title: '任务总数',
    dataIndex: 'taskNum',
    align: 'center',
    scopedSlots: { customRender: 'taskNum' }
  },
  {
    title: '完成率',
    dataIndex: 'completionRate',
    align: 'center',
    width: 120,
    scopedSlots: { customRender: 'completionRate' }
  }
]

export const columnsTask = [
  {
    title: '当前阶段',
    dataIndex: 'nodeName',
    align: 'center'
  },
  {
    title: '任务名称',
    dataIndex: 'name',
    align: 'center'
  },
  {
    title: '任务文件',
    dataIndex: 'files',
    width: '300px',
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
