import Lockr from 'lockr'

export default {
  namespaced: true,
  state: {
    user: undefined,
    organization: null,
    permissions: null,
    roles: null,
    menus: null
  },
  getters: {
    user: state => {
      if (!state.user) {
        try {
          state.user = Lockr.get(process.env.VUE_APP_USER_KEY)
        } catch (e) {
          console.error(e)
        }
      }
      return state.user
    },
    organization: state => {
      if (!state.organization) {
        try {
          state.organization = Lockr.get(process.env.VUE_APP_ORGANIZATION_KEY)
        } catch (e) {
          console.error(e)
        }
      }
      return state.organization
    },
    permissions: state => {
      if (!state.permissions) {
        try {
          const permissions = Lockr.get(process.env.VUE_APP_PERMISSIONS_KEY)
          state.permissions = permissions || []
        } catch (e) {
          console.error(e.message)
        }
      }
      return state.permissions
    },
    roles: state => {
      if (!state.roles) {
        try {
          const roles = Lockr.get(process.env.VUE_APP_ROLES_KEY)
          state.roles = roles || []
        } catch (e) {
          console.error(e.message)
        }
      }
      return state.roles
    },
    menus: state => {
      if (!state.menus) {
        try {
          const menus = Lockr.get(process.env.VUE_APP_MENUS_KEY)
          state.menus = menus || []
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
      Lockr.set(process.env.VUE_APP_USER_KEY, user)
    },
    setOrganization(state, organization) {
      state.organization = organization
      Lockr.set(process.env.VUE_APP_ORGANIZATION_KEY, organization)
    },
    setPermissions(state, permissions) {
      state.permissions = permissions
      Lockr.set(process.env.VUE_APP_PERMISSIONS_KEY, permissions)
    },
    setRoles(state, roles) {
      state.roles = roles
      Lockr.set(process.env.VUE_APP_ROLES_KEY, roles)
    },
    setMenus(state, menus) {
      state.menus = menus
      Lockr.set(process.env.VUE_APP_MENUS_KEY, menus)
    }
  }
}
