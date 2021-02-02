export default {
  namespaced: true,
  state: {
    user: undefined,
    permissions: null,
    roles: null,
    menus: null
  },
  getters: {
    user: state => {
      if (!state.user) {
        try {
          const user = localStorage.getItem(process.env.VUE_APP_USER_KEY)
          state.user = JSON.parse(user)
        } catch (e) {
          console.error(e)
        }
      }
      return state.user
    },
    permissions: state => {
      if (!state.permissions) {
        try {
          const permissions = localStorage.getItem(process.env.VUE_APP_PERMISSIONS_KEY)
          state.permissions = JSON.parse(permissions)
          state.permissions = state.permissions ? state.permissions : []
        } catch (e) {
          console.error(e.message)
        }
      }
      return state.permissions
    },
    roles: state => {
      if (!state.roles) {
        try {
          const roles = localStorage.getItem(process.env.VUE_APP_ROLES_KEY)
          state.roles = JSON.parse(roles)
          state.roles = state.roles ? state.roles : []
        } catch (e) {
          console.error(e.message)
        }
      }
      return state.roles
    },
    menus: state => {
      if (!state.menus) {
        try {
          const menus = localStorage.getItem(process.env.VUE_APP_MENUS_KEY)
          state.menus = JSON.parse(menus)
          state.menus = state.menus ? state.menus : []
        } catch (e) {
          console.error(e.message)
        }
      }
      return state.menus
    }
  },
  mutations: {
    setUser(state, user) {
      state.user = user
      localStorage.setItem(process.env.VUE_APP_USER_KEY, JSON.stringify(user))
    },
    setPermissions(state, permissions) {
      state.permissions = permissions
      localStorage.setItem(process.env.VUE_APP_PERMISSIONS_KEY, JSON.stringify(permissions))
    },
    setRoles(state, roles) {
      state.roles = roles
      localStorage.setItem(process.env.VUE_APP_ROLES_KEY, JSON.stringify(roles))
    },
    setMenus(state, menus) {
      state.menus = menus
      localStorage.setItem(process.env.VUE_APP_MENUS_KEY, JSON.stringify(menus))
    }
  }
}
