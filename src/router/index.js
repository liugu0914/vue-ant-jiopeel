/**
 * 路由配置页面
 * @author lyc
 * @date 2020年10月27日22:41:05
 */
import Router from 'vue-router'
import Vue from 'vue'
import modules from './modules'


Vue.use(Router)

const common = [
  {
    path: '/',
    redirect: '/main'
  },
  {
    path: '/main',
    name: 'main',
    component: () => import('@/views/main/admin.vue'),
    children: modules
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
    component: () => import('@/views/error/404.vue')
  },
  {
    path: '*',
    redirect: '/404'
  }
]


// 不需要登录拦截的路由配置
export const whiteList = {
  names: ['404', '403'], // 根据路由名称匹配
  paths: ['/login'], // 根据路由Path匹配
  /**
   * 判断路由是否包含在该配置中
   * @param route vue-router 的 route 对象
   * @returns {boolean}
   */
  includes(route) {
    return this.names.includes(route.name) || this.paths.includes(route.path)
  }
}

const routes = [
  ...common
]
export default new Router({
  // mode: 'history',
  routes
})

