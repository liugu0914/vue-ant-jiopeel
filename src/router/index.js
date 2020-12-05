/**
 * 路由配置页面
 * @author lyc
 * @date 2020年10月27日22:41:05
 */
import Router from 'vue-router'
import Vue from 'vue'


Vue.use(Router)

const common = [
  {
    path: '/',
    redirect: '/main'
  },
  {
    path: '/main',
    name: 'main',
    component: () => import('@/views/app/main.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/login/authorize/:grantType',
    name: 'authorize',
    component: () => import('@/views/login/authorize.vue'),
    props:
     (route) => ({ grantType: route.params.grantType, code: route.query.code }),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/404',
    component: () => import('@/views/404.vue')
  },
  {
    path: '*',
    redirect: '/404'
  }
]


const routes = [
  ...common
]
export default new Router({
  mode: 'history',
  routes
})
