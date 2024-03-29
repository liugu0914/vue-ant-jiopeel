import store from '@/store'
import config from '@/config'
import { ADMIN } from '@/config/default'
// import { formatFullPath } from '@/utils/i18n'
// import { filterMenu } from '@/utils/authority-utils'
import { getLocalSetting } from '@/utils/themeUtil'
import { wsUrl } from '@/api/common/ws'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

const localSetting = getLocalSetting(true)

export default {
  namespaced: true,
  state: {
    isMobile: false,
    animates: ADMIN.animates,
    palettes: ADMIN.palettes,
    pageMinHeight: 0,
    menuData: [],
    activatedFirst: undefined,
    ...config,
    ...localSetting,
    stompClient: null
  },
  getters: {
    // menuData(state, getters, rootState) {
    //   if (state.filterMenu) {
    //     const { permissions, roles } = rootState.account
    //     filterMenu(state.menuData, permissions, roles)
    //   }
    //   return state.menuData
    // },
    // firstMenu(state) {
    //   const { menuData } = state
    //   if (menuData.length > 0 && !menuData[0].fullPath) {
    //     formatFullPath(menuData)
    //   }
    //   return menuData.map(item => {
    //     const menuItem = { ...item }
    //     delete menuItem.children
    //     return menuItem
    //   })
    // },
    // subMenu(state) {
    //   const { menuData, activatedFirst } = state
    //   if (menuData.length > 0 && !menuData[0].fullPath) {
    //     formatFullPath(menuData)
    //   }
    //   const current = menuData.find(menu => menu.fullPath === activatedFirst)
    //   return current && current.children || []
    // }
    stompClient: state => {
      if (state.stompClient || !store.state.account.user) return state.stompClient
      try {
        const socket = new SockJS(`${wsUrl}/stomp?userId=${store.state.account.user.id}`)
        const stompClient = Stomp.over(socket)
        state.stompClient = stompClient
        return state.stompClient
      } catch (err) {
        console.log(err)
      }
    }
  },
  mutations: {
    setDevice(state, isMobile) {
      console.log('isMobile', isMobile)
      state.isMobile = isMobile
    },
    setTheme(state, theme) {
      state.theme = theme
    },
    setLayout(state, layout) {
      state.layout = layout
    },
    setMultiPage(state, multiPage) {
      state.multiPage = multiPage
    },
    setAnimate(state, animate) {
      state.animate = animate
    },
    setWeekMode(state, weekMode) {
      state.weekMode = weekMode
    },
    setFixedHeader(state, fixedHeader) {
      state.fixedHeader = fixedHeader
    },
    setFixedSideBar(state, fixedSideBar) {
      state.fixedSideBar = fixedSideBar
    },
    setLang(state, lang) {
      state.lang = lang
    },
    setHideSetting(state, hideSetting) {
      state.hideSetting = hideSetting
    },
    correctPageMinHeight(state, minHeight) {
      state.pageMinHeight += minHeight
    },
    setMenuData(state, menuData) {
      state.menuData = menuData
    },
    setAsyncRoutes(state, asyncRoutes) {
      state.asyncRoutes = asyncRoutes
    },
    setPageWidth(state, pageWidth) {
      state.pageWidth = pageWidth
    },
    setActivatedFirst(state, activatedFirst) {
      state.activatedFirst = activatedFirst
    },
    setFixedTabs(state, fixedTabs) {
      state.fixedTabs = fixedTabs
    },
    clearSocket(state) {
      state.stompClient = null
    },
    setsTompClient: state => {
      const socket = new SockJS(`${wsUrl}/stomp?userId=${store.state.account.user.id}`)
      const stompClient = Stomp.over(socket)
      state.stompClient = stompClient
    }
  }
}
