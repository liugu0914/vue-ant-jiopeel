/**
 *  实时监控模块
 */

// monitoring 路径
const path = 'views/pages/monitoring'

export default {
  // 实时监控
  monitoring: {
    path: '/monitoring',
    name: 'monitoring',
    component: () => import(`@/${path}/index.vue`)
  }
}
