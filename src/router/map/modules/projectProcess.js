/**
 *  手续管理模块
 */

// procedure 路径
const path = 'views/pages/projectProcess'

export default {
  procedure: {
    path: '/projectProcess',
    name: 'projectProcess',
    component: () => import(`@/${path}/index.vue`)
  }
}
