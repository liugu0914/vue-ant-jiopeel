/**
 *  大屏展示模块
 */

// bigScreen 路径
const path = 'views/pages/bigScreen'

export default {
  bigScreen: {
    path: '/bigScreen',
    name: 'bigScreen',
    component: () => import(`@/${path}/index.vue`)
  }
}
