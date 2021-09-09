/**
 *  个人办公模块
 */

// work 路径
const path = 'views/pages/work'

export default {
  // 上传
  uploading: {
    path: '/uploading',
    name: 'uploading',
    component: () => import(`@/${path}/uploading`)
  },
  // 审核
  apply: {
    path: '/apply',
    name: 'apply',
    component: () => import(`@/${path}/apply`)
  },
  // 审核
  nodeApply: {
    path: '/nodeApply',
    name: 'nodeApply',
    component: () => import(`@/${path}/nodeApply`)
  },
  // 操作记录
  nodeTaskRecord: {
    path: '/nodeTaskRecord',
    name: 'nodeTaskRecord',
    component: () => import(`@/${path}/nodeTaskRecord`)
  },
  // 任务分派
  assign: {
    path: '/assign',
    name: 'assign',
    component: () => import(`@/${path}/assign`)
  }
}
