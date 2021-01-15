import routerMap from '@/router/map'
import { parseRoutes } from '@/utils/routerUtil'

/**
 * 公共组件
 */
const routesConfig = [
  'main',
  'login',
  'authorize',
  'exp404',
  {
    path: '/',
    redirect: '/main'
  },
  {
    path: '*',
    redirect: '/404'
  }
]

export default parseRoutes(routesConfig, routerMap)
