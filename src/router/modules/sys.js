/**
 *  系统配置模块
 */

// sys 路径
const path = 'views/pages/sys'

export default [
  {
    path: '/app',
    name: 'app',
    component: () => import(`@/${path}/app/main.vue`)
  }
]
