import { getContractType } from './async'

export const columns1 = [
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
  { id: 1, name: '合同文件', files: [] },
  { id: 2, name: '招投标文件', files: [] },
  { id: 3, name: '其他文件', files: [] }
]

export const columns = [
  {
    title: '合同编号',
    dataIndex: 'contractNum',
    disable: true,
    searchAble: true,
    align: 'center'
  },
  {
    title: '合同名称',
    dataIndex: 'name',
    disable: true,
    searchAble: true,
    align: 'center'
  },
  {
    title: '项目名称',
    dataIndex: 'projectName',
    searchAble: true,
    align: 'center'
  },
  {
    title: '合同类型',
    dataIndex: 'type',
    searchAble: true,
    dataType: 'select',
    align: 'center',
    search: {
      async: getContractType
    },
    scopedSlots: { customRender: 'contractType' }
  },
  {
    title: '合同金额(万元)',
    dataIndex: 'money',
    searchAble: true,
    align: 'center',
    dataType: 'twiceNumber',
    search: {
      twice: {
        minName: 'min',
        maxName: 'max'
      }
    }
  },
  {
    title: '发包方',
    dataIndex: 'employee',
    disable: true,
    searchAble: true,
    align: 'center'
  },
  {
    title: '承包方',
    dataIndex: 'contractor',
    disable: true,
    searchAble: true,
    align: 'center'
  },
  {
    title: '签订时间',
    dataIndex: 'signingTime',
    disable: true,
    searchAble: true,
    align: 'center',
    dataType: 'date'
  },
  {
    title: '合同文件',
    dataIndex: 'contractMaterials',
    disable: true,
    align: 'center',
    scopedSlots: { customRender: 'file' }
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
