import { getProjectArea, getProjectType } from './async'

const options = [{ label: '否', value: 0 }, { label: '是', value: 1 }]

export const options1 = {
  color: ['#1e44f3', '#eee'],
  series: [
    {
      type: 'pie',
      radius: ['50%', '90%'],
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
  color: ['#6dcee6', '#eee'],
  series: [
    {
      type: 'pie',
      radius: ['50%', '90%'],
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
  color: ['#d73cf3', '#eee'],
  series: [
    {
      type: 'pie',
      radius: ['50%', '90%'],
      avoidLabelOverlap: false,
      label: {
        show: false
      },
      data: [
        {
          name: '未办理',
          value: 2,
          label: {
            show: true,
            position: 'center',
            formatter: '{d}%'
          }
        },
        {
          name: '其他',
          value: 18
        }
      ]
    }
  ]
}

export const columns = [
  {
    title: '项目编号',
    dataIndex: 'projectNum',
    disable: true,
    align: 'center',
    searchAble: true,
    sorter: true
    // sortOrder: 'ascend'
  },
  {
    title: '项目名称',
    dataIndex: 'projectName',
    disable: true,
    searchAble: true,
    align: 'center'
  },
  {
    title: '项目区属',
    dataIndex: 'projectArea',
    searchAble: true,
    dataType: 'select',
    align: 'center',
    search: {
      async: getProjectArea
    },
    scopedSlots: { customRender: 'projectArea' }
  },
  {
    title: '项目类型',
    dataIndex: 'projectType',
    searchAble: true,
    dataType: 'select',
    align: 'center',
    search: {
      async: getProjectType
    },
    scopedSlots: { customRender: 'projectType' }
  },
  {
    title: '是否开工',
    dataIndex: 'work',
    align: 'center',
    searchAble: true,
    dataType: 'select',
    search: { options },
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
    align: 'center',
    searchAble: true,
    dataType: 'date'
  },
  {
    title: '操作',
    dataIndex: 'ops',
    disable: true,
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]

export const settingColumns = [
  {
    title: '任务名称',
    dataIndex: 'name',
    align: 'center'
  },
  {
    title: '任务分类',
    dataIndex: 'type',
    align: 'center',
    scopedSlots: { customRender: 'type' }
  },
  {
    width: '20%',
    align: 'center',
    slots: { title: 'executor' },
    scopedSlots: { customRender: 'update' }
  },
  {
    width: '30%',
    align: 'center',
    slots: { title: 'auditor' },
    scopedSlots: { customRender: 'audit' }
  },
  {
    title: '流程图',
    dataIndex: 'processFiles',
    align: 'center',
    scopedSlots: { customRender: 'processFiles' }
  }
]

export const expandColumns = [
  {
    title: '名称',
    dataIndex: 'extraName'
  },
  {
    title: '类型',
    dataIndex: 'extraValueType',
    align: 'center',
    customRender: text => text == 'text' ? '文本' : '数字'
  },
  {
    title: '排序',
    align: 'center',
    scopedSlots: { customRender: 'sort' }
  },
  {
    title: '操作',
    align: 'center',
    scopedSlots: { customRender: 'ops' }
  }
]
