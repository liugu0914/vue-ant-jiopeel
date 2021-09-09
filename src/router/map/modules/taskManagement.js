/**
 *  项目管理模块
 */

// pm 路径
const path = 'views/pages/taskManagement'

export default {
  // 上传
  uploading: {
    path: '/uploading',
    name: 'uploading',
    component: () => import(`@/${path}/uploading`)
  },
  // 审核
  audit: {
    path: '/audit',
    name: 'audit',
    component: () => import(`@/${path}/audit`)
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
  }
}
