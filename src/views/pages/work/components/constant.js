export const obj = {
  1: [
    { name: '待上传', color: 'red' }, { name: '上传中', color: 'orange' }, { name: '待提交', color: '#2db7f5' },
    { name: '提交中', color: 'purple' }, { name: '已提交', color: '#008700' }, { name: '审核中', color: 'cyan' },
    { name: '通 过', color: '#008700' }, { name: '驳 回', color: '#f50' }, { name: '撤回', color: '#f50' }
  ],
  2: [
    { name: '待审核', color: '#2db7f5' }, { name: '通过', color: '#008700' }, { name: '分派', color: '#359fec' },
    { name: '通过', color: '#008700' }, { name: '驳回', color: '#f50' }, { name: '撤回', color: '#f50' }, { name: '撤回', color: '#f50' }
  ]
}

export const typeMap = {
  1: '提交任务',
  2: '审核任务',
  3: '处理分派'
}

export const assignState = [{ name: '待处理', color: '#2db7f5' }, { name: '已处理', color: '#008700' }, { name: '撤回', color: '#f50' }]
