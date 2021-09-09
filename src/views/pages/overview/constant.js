import { getProjectArea, getProjectType } from './async'
// import { dateFormat } from '@/utils/tool'
import DhtmlGantt from '@/assets/js/dhtmlxgantt.js'

export const gantt = DhtmlGantt

const options = [{ label: '否', value: 0 }, { label: '是', value: 1 }]

export const columns = [
  {
    title: '项目编号',
    dataIndex: 'projectNum',
    disable: true,
    align: 'center',
    searchAble: true,
    sorter: true
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
    search: {
      options
    },
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
    title: '项目进度',
    dataIndex: 'completionRate',
    disable: true,
    align: 'center',
    scopedSlots: { customRender: 'progress' }
  }
]


export const ganttColumns = [
  {
    name: 'text', label: '节点名称', tree: true, width: '150'
  },
  {
    name: 'taskNum', label: '任务数量', width: '100', align: 'center',
    template(task) {
      return `<a style="cursor:pointer" class="gantt-task-num" data-name="${task.name}">${task.taskNum}</a>`
    }
  },
  // {
  //   name: 'startDate', label: '计划开始时间', width: '100', align: 'center', resize: true,
  //   template: function(task) {
  //     if (!task.startDate) {
  //       return ''
  //     }
  //     return dateFormat(new Date(Date.parse(task.startDate)))
  //   }
  // },
  // {
  //   name: 'endDate', label: '计划结束时间', width: '100', align: 'center', resize: true,
  //   template: function(task) {
  //     if (!task.endDate) {
  //       return ''
  //     }
  //     return dateFormat(new Date(Date.parse(task.endDate)))
  //   }
  // },
  {
    name: 'rate', label: '任务完成比', width: '80', align: 'center', resize: true,
    template: function(task) {
      return `<span>${task.rate}%</span>`
    }
  }
]

export const zoomConfig = {
  levels: [
    {
      name: 'day',
      scale_height: 50,
      min_column_width: 60,
      scales: [
        { unit: 'day', step: 1, format: '星期%D' },
        { unit: 'day', step: 1, format: '%M%d日' }
      ]
    },
    {
      name: 'week',
      scale_height: 50,
      min_column_width: 30,
      scales: [
        { unit: 'week', step: 1, format: function(date) {
          const year = gantt.date.date_to_str('%Y')(date)
          const weekNum = gantt.date.date_to_str('%W')(date)
          return year + '年第' + weekNum + '周'
        } },
        { unit: 'day', step: 1, format: '%d' }
      ]
    },
    {
      name: 'month',
      scale_height: 50,
      min_column_width: 30,
      scales: [
        { unit: 'month', format: '%Y%F' },
        { unit: 'day', step: 1, format: '%d' }
      ]
    },
    {
      name: 'quarter',
      height: 50,
      min_column_width: 90,
      scales: [
        { unit: 'month', step: 1, format: '%M' },
        {
          unit: 'quarter', step: 1, format: function(date) {
            var month = date.getMonth()
            var q_num

            if (month >= 9) {
              q_num = 4
            } else if (month >= 6) {
              q_num = 3
            } else if (month >= 3) {
              q_num = 2
            } else {
              q_num = 1
            }

            return '第' + q_num + '季度'
          }
        }
      ]
    },
    {
      name: 'year',
      scale_height: 50,
      min_column_width: 30,
      scales: [
        { unit: 'year', step: 1, format: '%Y' }
      ]
    }
  ]
}
