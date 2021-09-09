/**
 *  质量管理模块
 */

// approval 路径
const path = 'views/pages/approval'

export default {
  quality: {
    path: '/quality',
    name: 'quality',
    component: () => import(`@/${path}/index.vue`),
    meta: { taskType: '3', rights: 'quality' }
  }
}
