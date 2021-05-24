/**
 *  项目管理模块
 */

// pm 路径
const path = 'views/pages/pm'

export default {
  pm: {
    path: '/pm',
    name: 'pm',
    component: () => import(`@/${path}/index.vue`)
  }
}
