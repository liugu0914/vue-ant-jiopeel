// echarts 数据

// 项目进度总览
export const option1 = {
  color: ['#40ca40', '#fbb355', '#29d285'],
  grid: {
    top: 20,
    right: 0,
    bottom: 20,
    left: 0
  },
  tooltip: {},
  xAxis: [
    {
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: 'white' },
      data: ['计划项目', '在建项目', '完工项目']
    }
  ],
  yAxis: { show: false },
  series: [
    {
      name: '项目进度统计', // 序列名称
      type: 'bar', // 类型
      itemStyle: { // 图形的形状
        barBorderRadius: [4, 4, 0, 0]
      },
      label: {
        show: true,
        position: 'top',
        color: 'white',
        valueAnimation: true
      },
      barWidth: 20, // 柱形的宽度
      data: []
    }
  ]
}

// 年度投资计划
export const option2 = {
  color: ['#00fcfd', '#8bf39a', '#3e82ff', '#503eff'],
  series: [
    {
      name: '2021年计划投资',
      type: 'pie',
      radius: ['40%', '70%'],
      labelLine: {
        length2: 0
        // length: 0
      },
      label: { color: 'white', formatter: '{b}\n{d}%' },
      data: []
    }
  ]
}

// 项目建设类型数量统计
export const option3 = {
  grid: {
    top: 0,
    right: 20,
    bottom: 0,
    left: 120
  },
  tooltip: {},
  yAxis: [
    {
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: 'white', margin: 20 },
      data: []
    }
  ],
  xAxis: { show: false },
  series: [
    {
      name: '项目建设类型数量统计', // 序列名称
      type: 'bar', // 类型
      itemStyle: { // 图形的形状
        color: '#088ca0',
        barBorderRadius: [0, 8, 8, 0]
      },
      label: {
        show: true,
        position: 'right',
        color: 'white',
        valueAnimation: true
      },
      barWidth: 10, // 柱形的宽度
      data: []
    }
  ]
}
