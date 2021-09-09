/**
 *  系统管理模块
 */

// sys 路径
const path = 'views/pages/sys'

export default {
  organization: {
    path: '/organization',
    name: 'organization',
    component: () => import(`@/${path}/organization/main.vue`)
  },
  user: {
    path: '/user',
    name: 'user',
    component: () => import(`@/${path}/user/main.vue`)
  },
  menu: {
    path: '/menu',
    name: 'menu',
    component: () => import(`@/${path}/menu/main.vue`)
  },
  role: {
    path: '/role',
    name: 'role',
    component: () => import(`@/${path}/role/main.vue`)
  },
  app: {
    path: '/app',
    name: 'app',
    component: () => import(`@/${path}/app/main.vue`)
  },
  permission: {
    path: '/permission',
    name: 'permission',
    component: () => import(`@/${path}/permission/main.vue`)
  },
  dept: {
    path: '/dept',
    name: 'dept',
    component: () => import(`@/${path}/dept`)
  },
  dictionary: {
    path: '/dictionary',
    name: 'dictionary',
    component: () => import(`@/${path}/dictionary`)
  }
}
