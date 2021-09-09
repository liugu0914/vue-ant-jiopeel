/**
 *  项目概况模块
 */

// overview 路径
const path = 'views/pages/overview'

export default {
  overview: {
    path: '/overview',
    name: 'overview',
    component: () => import(`@/${path}/index.vue`)
  }
}
