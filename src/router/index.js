/**
 * 路由配置页面
 * @author lyc
 * @date 2020年10月27日22:41:05
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)


// 不需要登录拦截的路由配置
const whiteList = {
  names: [], // 根据路由名称匹配
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


/**
 * 初始化路由实例
 * @returns {VueRouter}
 */
function initRouter() {
  const options = {
    mode: 'history',
    routes: require('./config/config.base').default
  }
  return new VueRouter(options)
}


export { whiteList, initRouter }
