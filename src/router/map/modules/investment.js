/**
 *  投资管理模块
 */

// approval 路径
const path = 'views/pages/approval'

export default {
  investment: {
    path: '/investment',
    name: 'investment',
    component: () => import(`@/${path}/index.vue`),
    meta: { taskType: '2', rights: 'investment' }
  }
}

