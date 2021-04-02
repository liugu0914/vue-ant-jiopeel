// 公共路由组件
const common = {
  main: {
    path: '/main',
    name: '工作台',
    component: () => import('@/views/main/admin.vue'),
    meta: {
      page: {
        closable: false
      }
      // requiresAuth: false
    }
  },
  login: {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login.vue'),
    meta: {
      requiresAuth: false
    }
  },
  authorize: {
    path: '/login/authorize/:grantType',
    name: 'authorize',
    component: () => import('@/views/login/authorize.vue'),
    props:
     (route) => ({ grantType: route.params.grantType, code: route.query.code }),
    meta: {
      requiresAuth: false
    }
  },
  exp404: {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: {
      // requiresAuth: false
    }
  }
}
export default common

