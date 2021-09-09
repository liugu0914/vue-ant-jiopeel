const AuthorityPlugin = {
  install: function(Vue) {
    Vue.mixin({
      methods: {
        /**
         * 操作权限校验
         * @param check 需要校验的操作名
         * @returns {boolean} 是否校验通过
         */
        $hasp(check, method = 'every') {
          const permissions = this.$store.getters['account/permissions']
          const isRight = Array.isArray(check) ? check[method](rights => permissions.includes(rights)) : permissions.includes(check)
          return permissions.includes('*') || isRight
        }
      }
    })
  }
}

export default AuthorityPlugin
