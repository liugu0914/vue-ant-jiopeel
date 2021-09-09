import { getNodeTree } from '@/views/pages/work/uploading/async'
import { getAsyncUsers } from '@/views/pages/sys/user/async'

const nodeState = [
  { title: '进行中', value: '1' },
  { title: '待审批', value: '2' },
  { title: '已审批', value: '3' }
]

const taskState = [
  { label: '待上传', value: '0' },
  { label: '已上传', value: '1' },
  { label: '待审核', value: '2' },
  { label: '通过', value: '3' },
  { label: '驳回', value: '4' }
]


/**
 * 表头
 * @date 2021-2-26 10:23:26
 * @author lyc
 */
export const columns = [
  {
    title: '项目名称',
    align: 'center',
    dataIndex: 'projectName'
  },
  {
    title: '项目编号',
    align: 'center',
    dataIndex: 'projectNum'
  },
  {
    title: '节点名称',
    align: 'center',
    dataIndex: 'nodeName',
    searchAble: true,
    dataType: 'tree',
    search: { async: getNodeTree, name: 'nodeId' }
  },
  {
    title: '任务名称',
    dataIndex: 'taskName',
    align: 'center'
  },
  {
    title: '任务状态',
    align: 'center',
    dataIndex: 'taskState',
    scopedSlots: { customRender: 'taskState' },
    searchAble: true,
    dataType: 'select',
    search: {
      name: 'taskStateList',
      options: taskState,
      multiple: true
    }
  },
  {
    title: '任务文件',
    align: 'center',
    dataIndex: 'taskFiles',
    scopedSlots: { customRender: 'taskFiles' }
  },
  {
    title: '任务审批意见',
    align: 'center',
    dataIndex: 'feedback',
    scopedSlots: { customRender: 'feedback' }
  },
  {
    title: '节点状态',
    align: 'center',
    dataIndex: 'nodeState',
    scopedSlots: { customRender: 'nodeState' },
    searchAble: true,
    dataType: 'select',
    search: {
      name: 'nodeStateList',
      options: nodeState,
      multiple: true
    }
  },
  {
    title: '成果文件',
    align: 'center',
    dataIndex: 'resultFiles',
    scopedSlots: { customRender: 'resultFiles' }
  },
  {
    title: '审批备注',
    align: 'center',
    dataIndex: 'nodeRemark'
  },
  {
    title: '操作人',
    align: 'center',
    dataIndex: 'userName',
    searchAble: true,
    disable: true,
    dataType: 'select',
    search: { async: getAsyncUsers, name: 'userId' }
  }
]

