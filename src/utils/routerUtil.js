import routerMap from '@/router/map'
// import { mergeI18nFromRoutes } from '@/utils/i18n'
import VueRouter from 'vue-router'
import deepMerge from 'deepmerge'
import baseRouter from '@/router/config/config.base'

// 应用配置
const appOptions = {
  router: undefined,
  i18n: undefined,
  store: undefined
}

/**
 * 设置应用配置
 * @param options
 */
function setAppOptions(options) {
  const { router, store, i18n } = options
  appOptions.router = router
  appOptions.store = store
  appOptions.i18n = i18n
}

/**
 * 根据 路由配置 和 路由组件注册 解析路由
 * @param routesConfig 路由配置
 * @param routerMap 本地路由组件注册配置
 */
function parseRoutes(routesConfig, routerMap, routes = []) {
  routesConfig.forEach(item => {
    // 获取注册在 routerMap 中的 router，初始化 routeCfg
    let router; let routeCfg = {}
    if (typeof item === 'string' && routerMap[item]) {
      router = routerMap[item]
      routeCfg = { path: router.path || item, router: item }
    } else if (typeof item === 'object') {
      router = routerMap[item.router]
      routeCfg = item
    }
    if (!router) {
      router = typeof item === 'string' ? { path: item, name: item } : item
    }
    // 从 router 和 routeCfg 解析路由
    const { meta = {}} = router
    const route = {
      ...router,
      path: routeCfg.path || router.path || routeCfg.router,
      component: router.component,
      redirect: routeCfg.redirect || router.redirect,
      meta: {
        name: routeCfg.name || router.name,
        ...meta
      }
    }
    if (routeCfg.children && routeCfg.children.length > 0) {
      route.children = parseRoutes(routeCfg.children, routerMap, routes)
    }
    if (route.path) {
      routes.push(route)
    }
  })
  return routes
}

/**
 * 加载路由
 * @param menus  菜单配置
 */
function loadRoutes(menus) {
  // 应用配置
  const { router, store } = appOptions

  const routerTmpMap = routerMap

  // 如果 routesConfig 有值，则更新到本地，否则从本地获取
  if (!menus || menus.length === 0) { // 原路由数据
    menus = store.getters['account/menus']
  }
  if (menus && menus.length > 0) {
    menus = boxMeta(menus, routerTmpMap)
    const routes = parseRoutes(menus, routerTmpMap)
    const finalRoutes = addMainRoutes(baseRouter, routes)
    router.options = { ...router.options, routes: finalRoutes }
    router.matcher = new VueRouter({ ...router.options, routes: [] }).matcher
    router.addRoutes(finalRoutes)
  }
  if (menus) {
    store.commit('account/setMenus', menus)
  }
  // }
  // 提取路由国际化数据
  // mergeI18nFromRoutes(i18n, router.options.routes)
}

/**
 * 加入菜单子路由
 * @param target {Route[]}
 * @param source {Route[]}
 * @returns {Route[]}
 */
function addMainRoutes(target, source) {
  const routesMap = {}
  target.forEach(item => {
    if (item.path === '/main') { item.children = source }
    routesMap[item.path] = item
  })
  return Object.values(routesMap)
}

/**
 * 深度合并路由
 * @param target {Route[]}
 * @param source {Route[]}
 * @returns {Route[]}
 */
function deepMergeRoutes(target, source) {
  // 映射路由数组
  const mapRoutes = routes => {
    const routesMap = {}
    routes.forEach(item => {
      routesMap[item.path] = {
        ...item,
        children: item.children ? mapRoutes(item.children) : undefined
      }
    })
    return routesMap
  }
  const tarMap = mapRoutes(target)
  const srcMap = mapRoutes(source)

  // 合并路由
  const merge = deepMerge(tarMap, srcMap)

  // 转换为 routes 数组
  const parseRoutesMap = routesMap => {
    return Object.values(routesMap).map(item => {
      if (item.children) {
        item.children = parseRoutesMap(item.children)
      } else {
        delete item.children
      }
      return item
    })
  }
  return parseRoutesMap(merge)
}

/**
 * 格式化路由
 * @param routes 路由配置
 */
function formatRoutes(routes) {
  routes.forEach(route => {
    const { path } = route
    if (!path.startsWith('/') && path !== '*') {
      route.path = '/' + path
    }
  })
}



/**
 * 组装子路由菜单的mete数据
 * @param menus 菜单数据
 * @param routeMap 路由组件
 * @param breadcrumb 面包屑数据
 */
function boxMeta(menus, routeMap, breadcrumb = []) {
  if (menus == null || menus.length == 0) {
    return menus
  }
  menus.forEach(menu => {
    const route = routeMap[menu.router] // 获取Map中对应的路由信息
    if (menu.name) {
      breadcrumb.push({ id: menu.id, name: menu.name })
    }
    if (route) { // 菜单是否存在路由信息
      const { meta = {}} = route
      menu.path = route.path
      meta.breadcrumb = meta.breadcrumb && meta.breadcrumb.length > 0 ? meta.breadcrumb : [...breadcrumb]
      meta.icon = menu.icon
      meta.key = menu.id
      route.meta = meta
    }
    if (menu.children && menu.children.length > 0) { // 存在子菜单
      boxMeta(menu.children, routeMap, breadcrumb)
    } else {
      if (breadcrumb.length > 0) {
        breadcrumb.pop()
      }
    }
  })
  return menus
}

/**
 * 格式化路由的权限配置
 * @param routes 路由
 * @param pAuthorities 父级路由权限配置集合
 */
function formatAuthority(routes, pAuthorities = []) {
  routes.forEach(route => {
    const meta = route.meta
    const defaultAuthority = pAuthorities[pAuthorities.length - 1] || { permission: '*' }
    if (meta) {
      let authority = {}
      if (!meta.authority) {
        authority = defaultAuthority
      } else if (typeof meta.authority === 'string') {
        authority.permission = meta.authority
      } else if (typeof meta.authority === 'object') {
        authority = meta.authority
        const { role } = authority
        if (typeof role === 'string') {
          authority.role = [role]
        }
        if (!authority.permission && !authority.role) {
          authority = defaultAuthority
        }
      }
      meta.authority = authority
    } else {
      const authority = defaultAuthority
      route.meta = { authority }
    }
    route.meta.pAuthorities = pAuthorities
    if (route.children) {
      formatAuthority(route.children, [...pAuthorities, route.meta.authority])
    }
  })
}

/**
 * 从路由 path 解析 i18n key
 * @param path
 * @returns {*}
 */
function getI18nKey(path) {
  const keys = path.split('/').filter(item => !item.startsWith(':') && item != '')
  keys.push('name')
  return keys.join('.')
}

/**
 * 加载导航守卫
 * @param guards
 * @param options
 */
function loadGuards(guards, options) {
  const { beforeEach, afterEach } = guards
  const { router } = options
  beforeEach.forEach(guard => {
    if (guard && typeof guard === 'function') {
      router.beforeEach((to, from, next) => guard(to, from, next, options))
    }
  })
  afterEach.forEach(guard => {
    if (guard && typeof guard === 'function') {
      router.afterEach((to, from) => guard(to, from, options))
    }
  })
}




export {
  parseRoutes,
  loadRoutes,
  formatAuthority,
  getI18nKey, loadGuards,
  deepMergeRoutes,
  formatRoutes,
  setAppOptions }
