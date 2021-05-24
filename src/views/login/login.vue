<template>
  <div class="login-app">
    <div class="login-header" :class="{hidden: isMobile}">
      <a-row class="w-100" style="display: flex; align-items: center">
        <a-col :span="18">
          <div class="logo" />
          <div class="header-title primary">
            宿迁市水环境综合整治信息化数据平台
          </div>
        </a-col>
        <a-col :span="6" class="toggle-link text-right pr-4">
          <a-button type="link" @click="isLogin = true">
            <a-icon type="user" />用户登录
          </a-button>
          <a-button type="link" @click="isLogin = false">
            <a-icon type="phone" />联系我们
          </a-button>
        </a-col>
      </a-row>
    </div>

    <div v-if="isLogin" class="login-container">
      <a-row :gutter="[24,24]" class="login-box" style="height: 80%">
        <a-col :span="24">
          <!-- <div class="login-logo">
            <img height="60" width="60" :src="require('@/assets/img/login.svg')">
            <i class="cs cs-login primary" />
          </div> -->
          <a-card class="login-main" :bordered="false">
            <!-- <div class="login-title">
              {{ title }}
            </div> -->
            <div class="code-title">
              {{ toggle ? '密码登录' : '扫码验证，安全登录' }}
            </div>
            <div v-if="toggle" class="pt-3 pb-2">
              <a-row :gutter="[0 ,16]">
                <a-form-model ref="loginForm" :model="loginData" :rules="loginRules">
                  <a-col :span="24">
                    <a-form-model-item prop="account">
                      <a-input
                        v-model="loginData.account"
                        autocomplete="off"
                        tabindex="1"
                        placeholder="账号"
                      >
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
                <a-col :span="24" class="mt-2">
                  <slide-verify
                    ref="slideblock"
                    slider-text="向右滑动验证码"
                    :w="328"
                    @success="login()"
                  />
                </a-col>
              </a-row>
              <!-- <a-row :gutter="[0 ,16]">
                <a-col span="24">
                  <a-button :loading="loading" :disabled="disabled" tabindex="3" block x-large class="login-btn" @click="login()">
                    登录
                  </a-button>
                </a-col>
              </a-row> -->

              <!-- <a-row :gutter="[0,24]" class="py-3">
                <a-col
                  :span="12" class="text-left login-font"
                >
                  <a class="a" @click.prevent="activeType = ACTIVE_TYPE.Register">注册账号</a>
                </a-col>
                <a-col
                  :span="12" class="text-right"
                >
                  <a class="a" @click.prevent="activeType = ACTIVE_TYPE.Forget">忘记密码</a>
                </a-col>
              </a-row> -->
              <!-- <a-row :gutter="[0,16]" class="py-2">
                <div class="login-font text-center pb-2">
                  第三方登录
                </div>
              </a-row>
              <a-row>
                <a-col :span="12" class="text-center">
                  <a-tooltip title="Github">
                    <a-button shape="circle" type="link" @click="OauthLogin('github')">
                      <svg class="cs-svg" aria-hidden="true">
                        <use xlink:href="#cs-github" />
                      </svg>
                    </a-button>
                  </a-tooltip>
                </a-col>
                <a-col :span="12" class="text-center">
                  <a-tooltip title="Gitee">
                    <a-button shape="circle" type="link" @click="OauthLogin('gitee')">
                      <svg class="cs-svg" aria-hidden="true">
                        <use xlink:href="#cs-gitee" />
                      </svg>
                    </a-button>
                  </a-tooltip>
                </a-col>
              </a-row> -->
            </div>
            <div v-else class="pt-3 pb-2">
              <div class="code">
                <img src="@/assets/img/code.png" alt="">
              </div>
            </div>
            <!-- <div v-if="activeType === ACTIVE_TYPE.Register" class="pt-4 pb-2">
              <a-row :gutter="[0 ,16]">
                <a-form-model ref="registerForm" :model="registerData" :rules="registerRules">
                  <a-col :span="24">
                    <a-form-model-item prop="account">
                      <a-input
                        v-model="registerData.account"
                        autocomplete="off"
                        tabindex="1"
                        placeholder="账号"
                        @pressEnter="register()"
                      >
                        <template slot="prefix">
                          <i class="cs cs-user primary" />
                        </template>
                      </a-input>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="24">
                    <a-form-model-item prop="email">
                      <a-input
                        v-model="registerData.email"
                        autocomplete="off"
                        tabindex="2"
                        placeholder="邮箱"
                        @pressEnter="register()"
                      >
                        <template slot="prefix">
                          <i class="cs cs-email primary" />
                        </template>
                      </a-input>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="24">
                    <a-form-model-item prop="password">
                      <a-input
                        v-model="registerData.password"
                        autocomplete="off"
                        tabindex="3"
                        :type="see?'text':'password'"
                        placeholder="密码"
                        @pressEnter="register()"
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
                <a-col class="pb-4" :span="24">
                  <a-button :loading="loading" :disabled="disabled" tabindex="4" block x-large class="login-btn" @click="register()">
                    注册
                  </a-button>
                </a-col>
              </a-row>
              <div class="login-font text-center py-2">
                已有账号?点击 <a class="a" @click.prevent="activeType = ACTIVE_TYPE.Login">登陆</a>
              </div>
            </div>
            <div v-if="activeType === ACTIVE_TYPE.Forget" class="pt-4 pb-2">
              <a-row :gutter="[0 ,16]">
                <a-form-model ref="forgetForm" :model="forgetData" :rules="forgetRules">
                  <a-col :span="24">
                    <a-form-model-item prop="account">
                      <a-input
                        v-model="forgetData.account"
                        autocomplete="off"
                        tabindex="1"
                        placeholder="账号"
                        @pressEnter="forget()"
                      >
                        <template slot="prefix">
                          <i class="cs cs-user primary" />
                        </template>
                      </a-input>
                    </a-form-model-item>
                  </a-col>

                  <a-col :span="24">
                    <a-form-model-item prop="email">
                      <a-input
                        v-model="forgetData.email"
                        autocomplete="off"
                        tabindex="2"
                        placeholder="邮箱"
                        @pressEnter="forget()"
                      >
                        <template slot="prefix">
                          <i class="cs cs-email primary" />
                        </template>
                      </a-input>
                    </a-form-model-item>
                  </a-col>
                </a-form-model>
              </a-row>
              <a-row>
                <a-col :span="24" class="pb-4">
                  <a-button :loading="loading" :disabled="disabled" tabindex="4" block x-large class="login-btn" @click="forget()">
                    重置密码
                  </a-button>
                </a-col>
              </a-row>
              <div class="login-font text-center py-2">
                已有账号?点击 <a class="a" @click.prevent="activeType = ACTIVE_TYPE.Login">登陆</a>
              </div>
            </div> -->
            <div class="toggle">
              <i v-if="toggle" class="icon-scan" @click="toggle = false" />
              <i v-else class="icon-form" @click="toggle = true" />
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>

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
          <span>400-866-5837</span>
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
      <div class="cicle" />
    </div>
  </div>
</template>
<script>
import Oauth from '@/api/login/oauth'
import { saveUserData } from '@/api/login/login.common'
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
      isLogin: true
    }
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
    }
  },
  created: () => {
  },
  methods: {
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
          this.$refs.slideblock.reset()
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
            this.$router.push('/')
          })
        }).catch((err) => {
          this.$message.destroy()
          this.$message.warning(err)
          // 重置验证码
          this.$refs.slideblock.reset()
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
</style>
