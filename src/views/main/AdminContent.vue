<template>
  <a-layout-content class="admin-content">
    <tabs-wice
      ref="tabs"
      :active="active"
      :page-list="pageList"
      @change="changePage"
      @close="remove"
      @refresh="refresh" />
    <div ref="contentView" :class="['admin-content-view','beauty-scroll' ,fixedHeader?'fixed':'']">
      <div class="admin-content-body">
        <page-toggle-transition :disabled="animate.disabled" :animate="animate.name" :direction="animate.direction">
          <a-keep-alive v-model="clearCaches">
            <router-view v-if="!refreshing" ref="tabContent" :key="getKey()" />
          </a-keep-alive>
        </page-toggle-transition>
      </div>
    </div>
  </a-layout-content>
</template>
<script>

import AKeepAlive from '@/components/cache/AKeepAlive'
import PageToggleTransition from '@/components/transition/PageToggleTransition'
import TabsWice from '@/views/main/TabsWice'
import { mapState } from 'vuex'

export default {
  name: 'AdminContent',
  components: {
    AKeepAlive,
    PageToggleTransition,
    TabsWice
  },
  data() {
    return {
      pageList: [],
      active: '',
      clearCaches: [],
      refreshing: false
    }
  },
  created() {
    this.loadCachedTabs()
    const route = this.$route
    const { meta = {}} = route
    const key = meta.key || route.fullPath
    if (this.pageList.findIndex(item => item.key === key) === -1) {
      this.pageList.push(this.createPage(route))
    }
    this.active = key
    this.addListener()
  },
  provide() {
    return {
      content: this
    }
  },
  watch: {
    $route: function(newRoute) {
      const { meta = {}} = newRoute
      const key = meta.key || newRoute.fullPath
      if (this.pageList.findIndex(item => item.key === key) === -1) {
        this.pageList.push(this.createPage(newRoute))
      }
      this.active = key
      this.$nextTick(() => {
        this.setCachedKey(newRoute)
      })
    }
  },
  computed: {
    ...mapState('setting', ['fixedHeader', 'animate'])
  },
  methods: {
    /**
     * 切换页面
     */
    changePage(page) {
      this.active = page.key
      this.$router.push(page.fullPath)
    },
    /**
     * 获取路由key
     */
    getKey() {
      const route = this.$route
      const { meta = {}} = this.$route
      return meta.key || route.fullPath
    },
    /**
     * 关闭页面
     */
    remove(key, next) {
      if (this.pageList.length === 1) {
        return this.$message.warning(this.$t('warn'))
      }
      // 清除缓存
      let index = this.pageList.findIndex(item => item.key === key)
      this.clearCaches = this.pageList.splice(index, 1).map(page => page.cachedKey)
      if (next) {
        this.$router.push(next)
      } else if (key === this.active) {
        index = index >= this.pageList.length ? this.pageList.length - 1 : index
        const page = this.pageList[index]
        this.active = page.key
        this.$router.push(page.fullPath)
      }
    },
    /**
     * 刷新页面
     */
    refresh(page) {
      const key = page.key
      page.loading = true
      this.clearCache(page)
      if (key === this.active) {
        // eslint-disable-next-line no-return-assign
        this.reloadContent(() => page.loading = false)
      } else {
        // 其实刷新很快，加这个延迟纯粹为了 loading 状态多展示一会儿，让用户感知刷新这一过程
        // eslint-disable-next-line no-return-assign
        setTimeout(() => page.loading = false, 500)
      }
    },
    /**
     * 刷新页面
     */
    reloadContent(onLoaded) {
      this.refreshing = true
      setTimeout(() => {
        this.refreshing = false
        this.$nextTick(() => {
          this.setCachedKey(this.$route)
          if (typeof onLoaded === 'function') {
            onLoaded.apply(this, [])
          }
        })
      }, 200)
    },
    /**
     * 设置页面缓存的key
     * @param route 页面对应的路由
     */
    setCachedKey(route) {
      const { meta = {}} = route
      const page = this.pageList.find(item => item.key === (meta.key || route.fullPath))
      if (!page._init_) {
        let vnode
        try {
          vnode = this.$refs.tabContent.$vnode
        } catch (e) {
          console.warn(`[${page.fullPath}]路由没有的对应子页面,请检查!`)
          console.warn(e)
        }
        page.cachedKey = vnode ? (vnode.key + vnode.componentOptions.Ctor.cid) : page.fullPath
        page._init_ = true
      }
    },
    /**
     * 添加监听器
     */
    addListener() {
      window.addEventListener('page:closeAll', this.closeAllPageListener)
      window.addEventListener('page:close', this.closePageListener)
      window.addEventListener('page:refresh', this.refreshPageListener)
      window.addEventListener('unload', this.unloadListener)
    },
    /**
     * 移出监听器
     */
    removeListener() {
      window.removeEventListener('page:closeAll', this.closeAllPageListener)
      window.removeEventListener('page:close', this.closePageListener)
      window.removeEventListener('page:refresh', this.refreshPageListener)
      window.removeEventListener('unload', this.unloadListener)
    },
    /**
     * 页签关闭事件监听
     * @param event 页签关闭事件
     */
    closeAllPageListener() {
      this.clearCaches = this.pageList.map(page => page.cachedKey)
      this.pageList = []
      this.active = ''
    },
    /**
     * 页签关闭事件监听
     * @param event 页签关闭事件
     */
    closePageListener(event) {
      const { closeRoute, nextRoute } = event.detail
      const closePath = typeof closeRoute === 'string' ? closeRoute : closeRoute.path
      this.remove(closePath, nextRoute)
    },
    /**
     * 页面刷新事件监听
     * @param event 页签关闭事件
     */
    refreshPageListener(event) {
      const { pageKey } = event.detail
      this.refresh(pageKey)
    },
    /**
     * 页面 unload 事件监听器，添加页签到 session 缓存，用于刷新时保留页签
     */
    unloadListener() {
      const tabs = this.pageList.map(item => ({ ...item, _init_: false }))
      sessionStorage.setItem(process.env.VUE_APP_TBAS_KEY, JSON.stringify(tabs))
    },
    /**
     * 创建新tab标签
     */
    createPage(route) {
      const { meta = {}} = route
      return {
        key: meta.key || route.fullPath,
        keyPath: route.matched[route.matched.length - 1].path,
        fullPath: route.fullPath,
        loading: false,
        title: meta.name,
        unclose: route.meta && route.meta.page && (route.meta.page.closable === false)
      }
    },
    clearCache(page) {
      page._init_ = false
      this.clearCaches = [page.cachedKey]
    },
    /**
     * 加载缓存的 tabs
     */
    loadCachedTabs() {
      const cachedTabsStr = sessionStorage.getItem(process.env.VUE_APP_TBAS_KEY)
      if (cachedTabsStr) {
        try {
          const cachedTabs = JSON.parse(cachedTabsStr)
          if (cachedTabs.length > 0) {
            this.pageList = cachedTabs
          }
        } catch (e) {
          console.warn('failed to load cached tabs, got exception:', e)
        } finally {
          sessionStorage.removeItem(process.env.VUE_APP_TBAS_KEY)
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>

.admin-content {
  min-height: 280px;
  margin-top: 10px;

  .admin-content-view {
    overflow-y: auto;
    overflow-x: hidden;
    &.fixed{
      height: calc(100% - 45px);
      max-height: 100%;
    }

    .admin-content-body {
      margin: 10px;
    }
  }
}
.enabled-scroll{
  overflow: auto;
}
</style>
