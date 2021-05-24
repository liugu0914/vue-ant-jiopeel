/**
 *  手续管理模块
 */

// procedure 路径
const path = 'views/pages/procedure'

export default {
  procedure: {
    path: '/procedure',
    name: 'procedure',
    component: () => import(`@/${path}/index.vue`)
  }
}
