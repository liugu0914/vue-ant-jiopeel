export const contractTypeArr = [
  { label: '劳务合同', value: 1 },
  { label: '施工合同', value: 2 },
  { label: '设备材料合同', value: 3 },
  { label: '专业分包合同', value: 4 },
  { label: '勘察合同', value: 5 },
  { label: '设计合同', value: 6 },
  { label: '建设工程其他费', value: 7 }
]

export const moneyArr = [
  { label: '0~20w', value: 1 },
  { label: '10~30w', value: 1 },
  { label: '20~40w', value: 2 },
  { label: '30~50w', value: 3 },
  { label: '40~60w', value: 4 },
  { label: '50~70w', value: 5 },
  { label: '60~80w', value: 6 },
  { label: '70~90w', value: 7 },
  { label: '90~100w', value: 8 }
]

export const columns1 = [
  {
    title: '序号',
    width: 80,
    dataIndex: 'index',
    customRender: (text, record, index) => index + 1,
    align: 'center'
  },
  {
    title: '文件名称',
    width: 180,
    dataIndex: 'name',
    align: 'center',
    scopedSlots: { customRender: 'fileName' }
  },
  {
    title: '文件附件',
    width: 220,
    dataIndex: 'fileList',
    align: 'center',
    scopedSlots: { customRender: 'upload' }
  },
  {
    title: '操作',
    dataIndex: 'ops',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]
export const data1 = [
  { id: 1, name: '合同文件', fileList: [] },
  { id: 2, name: '招投标文件', fileList: [] },
  { id: 3, name: '其他文件', fileList: [] }
]

export const columns = [
  {
    title: '序号',
    width: '6%',
    dataIndex: 'index',
    customRender: (text, record, index) => index + 1,
    disable: true,
    align: 'center'
  },
  {
    title: '合同编号',
    width: '10%',
    dataIndex: 'contractId',
    disable: true,
    align: 'center'
  },
  {
    title: '合同名称',
    width: '20%',
    dataIndex: 'name',
    disable: true,
    align: 'center'
  },
  {
    title: '合同类型',
    width: '10%',
    dataIndex: 'type',
    searchAble: true,
    dataType: 'select',
    align: 'center',
    search: {
      options: contractTypeArr
    },
    customRender: text => contractTypeArr[text - 1].label
  },
  {
    title: '合同金额',
    width: '8%',
    dataIndex: 'money',
    searchAble: true,
    dataType: 'select',
    align: 'center',
    search: {
      options: moneyArr
    }
  },
  {
    title: '发包方',
    width: '8%',
    dataIndex: 'employee',
    disable: true,
    searchAble: true,
    align: 'center'
  },
  {
    title: '承包方',
    width: '8%',
    dataIndex: 'contractor',
    disable: true,
    searchAble: true,
    align: 'center'
  },
  {
    title: '签订时间',
    width: '8%',
    dataIndex: 'signingTime',
    disable: true,
    searchAble: true,
    align: 'center',
    dataType: 'date'
  },
  {
    title: '合同文件',
    width: '15%',
    dataIndex: 'contractMaterials',
    disable: true,
    align: 'center',
    scopedSlots: { customRender: 'file' }
  },
  {
    title: '操作',
    dataIndex: 'ops',
    disable: true,
    align: 'center',
    scopedSlots: { customRender: 'action' },
    fixed: 'right'
  }
]

export const defaultForm = {
  id: undefined,
  contractId: undefined,
  name: undefined,
  type: undefined,
  money: undefined,
  employee: undefined,
  contractor: undefined,
  signingTime: undefined,
  contractMaterials: undefined
}
