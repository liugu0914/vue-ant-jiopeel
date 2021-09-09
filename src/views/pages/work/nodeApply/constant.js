import { getNodeTree, projectList, getProjectArea, getProjectType } from './async'
export const columns = [
  {
    title: '项目编号',
    dataIndex: 'projectNum',
    searchAble: true,
    align: 'center'
  },
  {
    title: '项目名称',
    dataIndex: 'projectName',
    searchAble: true,
    dataType: 'select',
    search: { async: projectList, name: 'projectId' },
    align: 'center'
  },
  {
    title: '项目区属',
    dataIndex: 'projectArea',
    searchAble: true,
    dataType: 'select',
    search: { async: getProjectArea },
    align: 'center'
  },
  {
    title: '项目类型',
    dataIndex: 'projectType',
    searchAble: true,
    dataType: 'select',
    search: { async: getProjectType },
    align: 'center'
  },
  {
    title: '当前阶段',
    dataIndex: 'name',
    align: 'center',
    searchAble: true,
    dataType: 'tree',
    search: { async: getNodeTree, name: 'nodeId' }
  },
  {
    title: '审批部门',
    dataIndex: 'applyDeptName',
    align: 'center'
  },
  {
    title: '审批状态',
    dataIndex: 'state',
    scopedSlots: { customRender: 'state' },
    searchAble: true,
    dataType: 'checkbox',
    search: {
      name: 'nodeState',
      options: [{ title: '待审批', value: '2' }, { title: '已审批', value: '3' }],
      multiple: true
    },
    align: 'center'
  },
  {
    title: '用时',
    dataIndex: 'useTime',
    scopedSlots: { customRender: 'useTime' },
    align: 'center'
  },
  {
    title: '操作',
    align: 'center',
    disable: true,
    scopedSlots: { customRender: 'ops' }
  }
]


export const taskColumns = [
  {
    title: '任务名称',
    dataIndex: 'name',
    align: 'center'
  },
  {
    title: '任务文件',
    dataIndex: 'fileId',
    scopedSlots: { customRender: 'files' },
    align: 'center'
  },
  {
    title: '所属节点',
    dataIndex: 'nodeName',
    align: 'center'
  },
  {
    title: '审核结果',
    dataIndex: 'state',
    scopedSlots: { customRender: 'state' },
    align: 'center'
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'ops' },
    align: 'center'
  }
]

/**
 * 表单
 * @date 2021-2-26 10:23:26
 * @author lyc
 */
export const defaultForm = {
  id: undefined,
  projectNodeId: undefined,
  resultFileId: undefined,
  remark: undefined,
  nextProjectNodeId: undefined,
  nextUserId: undefined
}
