/**
 *  系统配置模块
 */

// sys 路径
const sys = 'views/pages/sys'

export default [
  {
    path: '/app',
    name: 'app',
    component: () => import(`@/${sys}/app/main.vue`)
  }
]
