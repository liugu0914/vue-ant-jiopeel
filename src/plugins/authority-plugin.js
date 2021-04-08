const AuthorityPlugin = {
  install: function(Vue) {
    Vue.mixin({
      methods: {
        /**
         * 操作权限校验
         * @param check 需要校验的操作名
         * @returns {boolean} 是否校验通过
         */
        $hasp(check) {
          const permissions = this.$store.getters['account/permissions']
          return permissions.includes('*') || permissions.includes(check)
        }
      }
    })
  }
}

export default AuthorityPlugin
