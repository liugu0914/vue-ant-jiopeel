<template>
  <div>
    <a-layout>
      <a-layout-content>{{ message }}</a-layout-content>
    </a-layout>
  </div>
</template>

<script>
import Oauth from '@/api/login/oauth'
import { saveUserData } from '@/api/login/login.common'
export default {
  props: {
    grantType: String,
    code: String
  },
  data: () => ({
    message: ' 授权认证中...'
  }),
  created() {
    console.log('grantType :' + this.grantType)
    console.log('code :' + this.code)
    Oauth.authRedirect(this.grantType, this.code).then(res => {
      const { data } = res
      saveUserData(data)
      this.message = '授权认证成功,正在跳转...'
      this.$nextTick(() => {
        this.$router.push('/main')
      })
    }).catch(res => {
      this.message = '授权认证失败,正在返回登录界面...'
      setTimeout(() => {
        this.$router.push('/login')
      }, 500)
    }).done()
  }
}
</script>
