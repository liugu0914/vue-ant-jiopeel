import router from '@/router/index.js'
import Lockr from 'lockr'
import Utils from '@/utils/utils'

// 不重定向白名单
const whiteList = ['/login']
router.beforeEach((to, from, next) => {
  console.log('to : ')
  console.log(to)
  console.log('from : ')
  console.log(from)
  /** 全局路由触发这个方法  如果有缓存暂时在这里交与 */
  const token = Lockr.get('access_token')
  // 拥有token之后 不允许访问/login
  if (token && Utils.contains('/login', to.path)) {
    return next('/')
  }
  // 放行不需要认证的路由
  if (to.matched.some(record => record.meta.requiresAuth === false)) {
    return next()
  }

  if (!token) {
    if (Utils.contains(whiteList, to.path)) {
      return next()
    }
    return next('/login')
  }
  return next()
})

router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  const targetPath = router.history.pending.fullPath
  if (isChunkLoadFailed) {
    router.replace(targetPath)
  }
})
