<template>
  <div class="login-app">
    <div class="login-container">
      <div class="login-header" :class="{hidden: isMobile}">
        <a-row class="w-100" style="display: flex; align-items: center">
          <a-col :span="18" style="display: flex; align-items: center">
            <!-- <div class="logo ml-4 mr-2" /> -->
            <div class="header-title ellipsis ml-3">
              宿迁市中心城市西南片区项目工程管理平台
            </div>
          </a-col>
          <a-col :span="6" class="toggle-link text-right pr-4">
            <a href="javascript:;" :style="{color: isLogin ? '#55fbfd' : '#fff'}" @click="isLogin = true">
              <a-icon type="user" />用户登录
            </a>
            <a href="javascript:;" :style="{color: isLogin ? '#fff' : '#55fbfd'}" @click="isLogin = false">
              <a-icon type="phone" />联系我们
            </a>
          </a-col>
        </a-row>
      </div>
      <div class="main beauty-scroll">
        <a-row v-if="isLogin" :gutter="[24,24]" class="login-box">
          <a-col :span="24">
            <a-card class="login-main" :bordered="false">
              <div class="code-title">
                {{ toggle ? '密码登录' : '扫码验证，安全登录' }}
              </div>
              <div v-if="toggle" class="pt-3">
                <a-row :gutter="[0 ,16]">
                  <a-form-model ref="loginForm" :model="loginData" :rules="loginRules" hide-required-mark>
                    <a-col :span="24">
                      <a-form-model-item prop="account">
                        <a-input v-model="loginData.account" autocomplete="off" tabindex="1" placeholder="账号" @pressEnter="login">
                          <template slot="prefix">
                            <i class="cs cs-user primary" />
                          </template>
                        </a-input>
                      </a-form-model-item>
                    </a-col>

                    <a-col :span="24">
                      <a-form-model-item prop="password">
                        <a-input
                          v-model="loginData.password"
                          autocomplete="off"
                          tabindex="2"
                          :type="see?'text':'password'"
                          placeholder="密码"
                          @pressEnter="login"
                        >
                          <template slot="prefix">
                            <i class="cs cs-password primary" />
                          </template>
                          <template slot="suffix">
                            <a-tooltip bottom color="#000" :title="see?'密码可见':'密码不可见'">
                              <i :class="see?'cs-see':'cs-nosee'" class="cs is-see primary" @click="isSee()" />
                            </a-tooltip>
                          </template>
                        </a-input>
                      </a-form-model-item>
                    </a-col>
                  </a-form-model>
                </a-row>

                <a-row>
                  <a-col :span="24" class="mt-3">
                    <!-- <slide-verify
                      ref="slideblock"
                      :imgs="imgs"
                      slider-text="向右滑动验证码"
                      :w="328"
                      @success="login()"
                    /> -->
                    <a-button type="primary" class="w-100" :loading="loading" @click="login">
                      登录
                    </a-button>
                  </a-col>
                </a-row>
              </div>

              <div v-else class="pt-3">
                <div class="code">
                  <img :src="qrCodeUrl" alt="">
                </div>
              </div>

              <div class="toggle">
                <i v-if="toggle" class="icon-scan" @click="toggle = false" />
                <i v-else class="icon-form" @click="toggle = true" />
              </div>
            </a-card>
          </a-col>
        </a-row>
        <div v-else class="about">
          <div class="contactR">
            <img src="~@/assets/img/contactLogo.png" alt="">
            <div>
              <img src="~@/assets/img/address.png" alt="">
              <span>武汉总部：</span>
              <span>武汉市东湖高新开发区光谷大道3号未来之光3栋6楼</span>
            </div>
            <div>
              <span>北京分公司：</span>
              <span>北京市西海48文化创意园区C栋102号</span>
            </div>
            <div>
              <img src="~@/assets/img/hotline.png" alt="">
              <span>服务热线：</span>
              <span>400-886-5237</span>
            </div>
            <div>
              <img src="~@/assets/img/switchboard.png" alt="">
              <span>总机：</span>
              <span>027-87775236</span>
            </div>
            <div>
              <img src="~@/assets/img/fax.png" alt="">
              <span>传真：</span>
              <span>027-87775237</span>
            </div>
            <div>
              <img src="~@/assets/img/website.png" alt="">
              <span>官网：</span>
              <span>www.huaxindata.com.cn</span>
            </div>
          </div>
          <div class="QRcode">
            <img src="~@/assets/img/QRcode.png" alt="">
          </div>
        </div>
      </div>
      <div class="footer">
        <span class="mr-2">武汉华信数据系统有限公司</span>
        <span class="mr-3">技术支持服务热线：400-886-5237</span>
        <span class="mr-4">最佳分辨率1920*1080，<a href="https://union.huaxindata.com.cn/uploads/ChromeSetup.exe">请使用谷歌浏览器访问</a></span>
      </div>
    </div>
  </div>
</template>
<script>
import Oauth from '@/api/login/oauth'
import { updCode } from '@/api/login/scanCode'
import { saveUserData } from '@/api/login/login.common'
import { mapMutations } from 'vuex'
import { isJSON } from '@/utils/tool'
import { wsUrl } from '@/api/common/ws'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { checkAuthorization } from '@/utils/request'

const ACTIVE_TYPE = {
  Login: 'login',
  Register: 'register',
  Forget: 'forget'
}
export default {

  data: () => {
    const account = [
      { required: true, message: '账号不能为空', trigger: 'blur' }
    ]
    const password = [
      { required: true, message: '密码不能为空', trigger: 'blur' }
    ]
    const email = [
      { required: true, message: '邮箱不能为空', trigger: 'blur' },
      { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
    ]
    return {
      ACTIVE_TYPE,
      valid: true,
      see: false,
      title: '宿迁市水环境综合整治信息化数据平台',
      activeType: ACTIVE_TYPE.Login,
      loading: false,
      disabled: false,
      loginData: {
        account: '',
        password: ''
      },
      loginRules: {
        account,
        password
      },
      registerData: {
        account: '',
        password: '',
        email: ''
      },
      registerRules: {
        account,
        password,
        email
      },
      forgetData: {
        account: '',
        email: ''
      },
      forgetRules: {
        account,
        email
      },
      toggle: true,
      isLogin: true,
      // 二维码登录信息
      code: undefined,
      qrCodeUrl: undefined,
      stompClient: undefined
    }
  },
  created() {

  },
  watch: {
    activeType(val, oldval) {
      switch (val) {
        default:
        case ACTIVE_TYPE.Login:
          this.title = '宿迁市水环境综合整治信息化数据平台'
          break
        case ACTIVE_TYPE.Register:
          this.title = '注册账号！'
          break
        case ACTIVE_TYPE.Forget:
          this.title = '忘记密码'
          break
      }
      return this.$refs[`${oldval}Form`].resetFields()
    },
    loading(val) {
      if (val) {
        this.$message.loading('登陆中...')
      }
    },
    toggle(val) {
      if (this.code && this.stompClient) {
        return
      }
      if (!val) { // 二维码
        this.qrCode()
      } else {
        this.disconnect()
      }
    }
  },
  methods: {
    ...mapMutations('setting', ['setsTompClient']),
    isSee() {
      this.see = !this.see
    },
    /**
     * 登录
     */
    login() {
      this.$refs.loginForm.validate(valid => {
        if (!valid) {
          // 重置验证码
          // this.$refs.slideblock.reset()
          return
        } // 验证失败
        this.loading = true
        this.disabled = true
        // 开始登录操作
        let grantType = ''
        Oauth.getAuthUrl().then(res => {
          const auth = res.data
          console.log(auth)
          console.log('login :' + JSON.stringify(this.loginData))
          grantType = auth.grantType || 'local'
          return Oauth.login({ ...auth, ...this.loginData })
        }).then(res => {
          console.log(res.data)
          return Oauth.authRedirect(grantType, res.data.code)
        }).then(res => {
          const { data } = res
          saveUserData(data)
          this.$message.destroy()
          this.$message.success('登录成功')
          this.$nextTick(() => {
            this.disconnect() // 关闭二维码ws
            this.setsTompClient()
            this.$router.push('/')
          })
        }).catch((err) => {
          this.$message.destroy()
          this.$message.warning(err)
          // 重置验证码
          // this.$refs.slideblock.reset()
        }).finally(() => {
          setTimeout(() => {
            this.loading = false
            this.disabled = false
          }, 800)
        })
      })
    },
    /**
     * 注册
     */
    register() {
      this.$refs.registerForm.validate(valid => {
        if (!valid) { return } // 验证失败
        this.loading = true
        this.disabled = true
        const account = this.registerData.account
        Oauth.register(this.registerData).then(res => {
          this.$message.success('注册成功')
          this.activeType = ACTIVE_TYPE.Login
          this.$nextTick(() => {
            this.loginData.account = account
          })
        }).done().finally(() => {
          setTimeout(() => {
            this.loading = false
            this.disabled = false
          }, 800)
        })
      })
    },
    /**
     * 重置密码 重置为123456
     */
    forget() {
      this.$refs.forgetForm.validate(valid => {
        if (!valid) { return } // 验证失败
        this.loading = true
        this.disabled = true
        const account = this.forgetData.account
        Oauth.resetPassword(this.forgetData).then(res => {
          this.$message.success(res.message)
          this.activeType = ACTIVE_TYPE.Login
          this.$nextTick(() => {
            this.loginData.account = account
          })
        }).done().finally(() => {
          setTimeout(() => {
            this.loading = false
            this.disabled = false
          }, 800)
        })
      })
    },
    /**
     * 授权登录
     */
    OauthLogin(grantType) {
      this.$message.loading('开始授权...', 0)
      Oauth.getAuthUrl(grantType).then(res => {
        const auth = res.data
        console.log(auth)
        window.location.href = auth.url
      }).done()
    },

    /**
     * 刷新code
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    qrCode() {
      Oauth.getCode().then(res => {
        console.log(res)
        const data = res.data
        this.code = data.code
        this.qrCodeUrl = `${process.env.VUE_APP_BASE_API}/sys/oauth/getLoginQrCode?code=${this.code}`
        this.disconnect()
        if (!checkAuthorization()) {
          try {
            const socket = new SockJS(`${wsUrl}/stomp?userId=${this.code}`)
            this.stompClient = Stomp.over(socket)
            this.headers = {
              code: this.code
            }
            this.stompClient.connect(this.headers, () => {
              // 开始建立连接
              this.stompClient.subscribe('/user/queue/login', (msg) => {
                if (!isJSON(msg)) {
                  return
                }
                const data = JSON.parse(msg.body)
                Promise.resolve(saveUserData(data)).then(() => updCode({ // 更新二维码状态
                  code: data.code,
                  state: '2' // 已登录
                })).then(() => {
                  this.$message.success('登录成功')
                  setTimeout(() => {
                    this.$nextTick(() => {
                      this.disconnect() // 关闭二维码ws
                      this.setsTompClient()
                      this.$router.push('/')
                    })
                  }, 500)
                }).over()
              })
            }, (error) => console.error(error))
            window.onbeforeunload = () => {
              // 窗口关闭前
              this.disconnect()
            }
          } catch (error) {
            console.error(error)
          }
        }
      }).over()
    },
    /**
     * 关闭信息
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    disconnect() {
      if (this.stompClient) {
        this.stompClient.disconnect()
        this.stompClient = null
      }
    }
  },
  computed: {
    isMobile() {
      return this.$store.state.setting.isMobile
    }
  }
}
</script>
<style lang="less">
 @import "@/less/login/login.less";
 .ant-card-body {
   padding: 30px !important;
 }
</style>
