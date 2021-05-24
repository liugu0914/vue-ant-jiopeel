
const projectTypeArr = [
  { label: '水利类', value: 1 },
  { label: '市政类', value: 2 }
]

export const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    customRender: (text, record, index) => index + 1,
    disable: true
  },
  {
    title: '项目编号',
    dataIndex: 'projectNum'
  },
  {
    title: '项目名称',
    dataIndex: 'projectName'
  },
  {
    title: '项目类型',
    dataIndex: 'projectType',
    dataType: 'select',
    search: {
      options: projectTypeArr
    },
    customRender: text => projectTypeArr[text - 1].label
  },
  {
    title: '审批阶段',
    dataIndex: 'stage'
  },
  {
    title: '审批部门',
    dataIndex: 'applyUserDeptName'
  },
  {
    title: '审批状态',
    dataIndex: 'state',
    scopedSlots: { customRender: 'state' }
  },
  {
    title: '审批用时',
    dataIndex: 'date',
    scopedSlots: { customRender: 'date' }
  },
  // {
  //   title: '项目进度',
  //   dataIndex: 'process',
  //   disable: true,
  //   slots: { title: 'customTitle' },
  //   scopedSlots: { customRender: 'process' }
  // },
  {
    title: '操作',
    dataIndex: 'ops',
    disable: true,
    scopedSlots: { customRender: 'action' },
    fixed: 'right'
  }
]

export const fileColumns = [
  {
    title: '序号',
    width: '70px',
    dataIndex: 'index',
    customRender: (text, record, index) => index + 1,
    align: 'center'
  },
  {
    title: '文件名称',
    dataIndex: 'name',
    align: 'center',
    scopedSlots: { customRender: 'fileName' }
  },
  {
    title: '文件附件',
    dataIndex: 'fileList',
    align: 'center',
    scopedSlots: { customRender: 'upload' }
  },
  {
    title: '状态',
    dataIndex: 'state',
    scopedSlots: { customRender: 'state' },
    align: 'center'
  },
  {
    title: '操作',
    width: '200px',
    dataIndex: 'ops',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]

export const applyColumns = [
  {
    title: '序号',
    width: '70px',
    dataIndex: 'index',
    customRender: (text, record, index) => index + 1,
    align: 'center'
  },
  {
    title: '文件名称',
    dataIndex: 'name',
    align: 'center'
  },
  {
    title: '文件附件',
    dataIndex: 'fileList',
    align: 'center',
    scopedSlots: { customRender: 'upload' }
  },
  {
    title: '状态',
    dataIndex: 'state',
    scopedSlots: { customRender: 'state' },
    align: 'center'
  },
  {
    title: '审核人',
    dataIndex: 'applyUserName',
    align: 'center'
  },
  {
    title: '审核意见',
    dataIndex: 'feedback',
    align: 'center'
  },
  {
    title: '操作',
    width: '100px',
    dataIndex: 'ops',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]

export const logColumns = [
  {
    title: '序号',
    width: '70px',
    dataIndex: 'index',
    customRender: (text, record, index) => index + 1,
    align: 'center'
  },
  {
    title: '审批人',
    dataIndex: 'applyUserName',
    align: 'center'
  },
  {
    title: '审批部门',
    dataIndex: 'applyUserDeptName',
    align: 'center'
  },
  {
    title: '审批材料',
    dataIndex: 'fileId',
    scopedSlots: { customRender: 'files' },
    align: 'center'
  },
  {
    title: '审核成果',
    dataIndex: 'name',
    align: 'center'
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    align: 'center'
  },
  {
    title: '状态',
    dataIndex: 'state',
    scopedSlots: { customRender: 'state' },
    align: 'center'
  },
  // {
  //   title: '耗时',
  //   dataIndex: 'time',
  //   align: 'center'
  // },
  {
    title: '审批意见',
    dataIndex: 'feedback', // 状态为通过或者驳回才显示意见
    customRender: (text, record, index) => record.state === 3 || record.state === 4 ? text : '',
    align: 'center'
  }
]
