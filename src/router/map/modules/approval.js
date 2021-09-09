/**
 *  审批管理模块
 */

// approval 路径
const path = 'views/pages/approval'

export default {
  approval: {
    path: '/approval',
    name: 'approval',
    component: () => import(`@/${path}/index.vue`),
    meta: { taskType: '1', rights: 'projectApproval' }
  }
}
