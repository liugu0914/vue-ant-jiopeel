/**
 *  系统配置模块
 */

// sys 路径
const path = 'views/pages/sys'

export default {
  user: {
    path: '/user',
    name: 'user',
    component: () => import(`@/${path}/user/main.vue`)
  },
  menu: {
    path: '/menu',
    name: 'menu',
    component: () => import(`@/${path}/app/main.vue`)
  },
  role: {
    path: '/role',
    name: 'role',
    component: () => import(`@/${path}/app/main.vue`)
  },
  app: {
    path: '/app',
    name: 'app',
    component: () => import(`@/${path}/app/main.vue`)
  },
  permission: {
    path: '/permission',
    name: 'permission',
    component: () => import(`@/${path}/app/main.vue`)
  }
}
