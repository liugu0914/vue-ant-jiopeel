export const projectTypeArr = [
  { label: '水利类', value: 1 },
  { label: '市政类', value: 2 }
]

export const projectAreaArr = [
  { label: '宿城', value: 1 },
  { label: '经开', value: 2 }
]

export const options1 = {
  color: ['#1e44f3', '#ccc'],
  series: [
    {
      type: 'pie',
      radius: ['60%', '90%'],
      avoidLabelOverlap: false,
      label: {
        show: false
      },
      data: [
        {
          name: '已办理',
          value: 10,
          label: {
            show: true,
            position: 'center',
            formatter: '{d}%'
          }
        },
        {
          name: '其他',
          value: 10
        }
      ]
    }
  ]
}
export const options2 = {
  color: ['#6dcee6', '#ccc'],
  series: [
    {
      type: 'pie',
      radius: ['60%', '90%'],
      avoidLabelOverlap: false,
      label: {
        show: false
      },
      data: [
        {
          name: '办理中',
          value: 6,
          label: {
            show: true,
            position: 'center',
            formatter: '{d}%'
          }
        },
        {
          name: '其他',
          value: 14
        }
      ]
    }
  ]
}
export const options3 = {
  color: ['#d73cf3', '#ccc'],
  series: [
    {
      type: 'pie',
      radius: ['60%', '90%'],
      avoidLabelOverlap: false,
      label: {
        show: false
      },
      data: [
        {
          name: '未办理',
          value: 4,
          label: {
            show: true,
            position: 'center',
            formatter: '{d}%'
          }
        },
        {
          name: '其他',
          value: 16
        }
      ]
    }
  ]
}

export const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    customRender: (text, record, index) => index + 1,
    disable: true,
    align: 'center'
  },
  {
    title: '项目编号',
    dataIndex: 'projectNum',
    disable: true,
    align: 'center'
  },
  {
    title: '项目名称',
    dataIndex: 'projectName',
    disable: true,
    align: 'center'
  },
  {
    title: '项目区属',
    dataIndex: 'projectArea',
    searchAble: true,
    dataType: 'select',
    align: 'center',
    search: {
      options: projectAreaArr
    },
    customRender: text => projectAreaArr[text - 1].label
  },
  {
    title: '项目类型',
    dataIndex: 'projectType',
    searchAble: true,
    dataType: 'select',
    align: 'center',
    search: {
      options: projectTypeArr
    },
    customRender: text => projectTypeArr[text - 1].label
  },
  {
    title: '是否开工',
    dataIndex: 'work',
    align: 'center',
    customRender: text => text ? '是' : '否'
  },
  {
    title: '开工时间',
    dataIndex: 'startTime',
    disable: true,
    searchAble: true,
    align: 'center',
    dataType: 'date'
  },
  {
    title: '完工时间',
    dataIndex: 'overTime',
    disable: true,
    searchAble: true,
    align: 'center',
    dataType: 'date'
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
  projectNum: undefined,
  projectName: undefined,
  projectArea: undefined,
  projectType: undefined,
  work: undefined,
  startTime: undefined,
  overTime: undefined
}
