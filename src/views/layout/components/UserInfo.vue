<template>
  <div class="userInfo">
    <div class="header-main">
      <div class="header-child ">
        <div class="header-child-item">
          <a-popover v-if="orgs.length>1" v-model="orgShow" title="选择组织/企业">
            <template slot="content">
              <a-list size="small" :data-source="orgs">
                <a-list-item slot="renderItem" slot-scope="item" class="pointer" @click="()=>changeOrg(item)">
                  <div>
                    <a-badge :status="organization.id === item.id?'success':'default'" />
                    <span class="mr-1">{{ item.name }}</span>
                  </div>
                  <span v-if="organization.id === item.id" slot="extra" class="ant-tag ant-tag-has-color primary">
                    当前
                  </span>
                </a-list-item>
              </a-list>
            </template>
            <span>
              {{ organization.name }} <a-icon type="caret-down" />
            </span>
          </a-popover>
        </div>
        <div class="header-child-item">
          <a :href="bigScreenUrl" target="_blank" style="color: #fff">
            <my-icon type="icon-daping" style="font-size: 20px" />
            <span class="ml-1">大屏展示</span>
          </a>
        </div>
        <!-- <div v-if="$hasp('sys-ws-mssage')" class="header-child-item">
          <a @click="openChat">
            <a-icon type="wechat" style="color: #fff; font-size: 20px" />
          </a>
        </div> -->
        <a-dropdown>
          <div class="header-child-item">
            <a-avatar size="default" shape="circle" :src="user.imgUrl" icon="user" />
            <span class="ml-1 item-name d-none">{{ user.userName }}</span>
          </div>
          <a-menu slot="overlay">
            <a-menu-item v-if="$hasp('sys-upd-userInfo')" @click="openUserInfo">
              <a-icon type="user" />
              <span>修改个人信息</span>
            </a-menu-item>
            <a-menu-item v-if="$hasp('sys-upd-password')" @click="openUpdPassword">
              <a-icon type="swap" />
              <span>修改密码</span>
            </a-menu-item>
            <a-menu-item @click="showSetting =!showSetting">
              <a-icon type="setting" />
              <span>个性化设置</span>
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item @click="logOut()">
              <a-icon style="margin-right: 8px;" type="poweroff" />
              <span>退出登录</span>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>
    <drawer v-model="showSetting" placement="right" :show-handler="false">
      <setting />
    </drawer>
    <!-- 弹窗 -->
    <modal
      v-model="visible"
      :confirm-loading="confirmLoading"
      ok-text="确认" cancel-text="取消" title="修改个人信息"
      @ok="handleOk"
      @cancel="handleCancel">
      <a-form-model ref="userForm" :model="dataForm" layout="vertical">
        <a-row>
          <a-col :sm="24">
            <div class="avatar">
              <upload file-type="img" :show-upload-list="false" @change="handleChange">
                <a-avatar :size="150" :src="dataForm.imgUrl" icon="user" />
              </upload>
            </div>
          </a-col>
          <a-col :sm="24">
            <a-form-model-item
              :rules=" { required: true, message: '用户名称不能为空', trigger: 'blur' }"
              label="用户名称" prop="userName">
              <a-input v-model="dataForm.userName" class="w-100" :max-length="255" autocomplete="off" allow-clear />
            </a-form-model-item>
          </a-col>
          <a-col :sm="24">
            <a-form-model-item
              :rules=" [{ required: true, message: '手机号不能为空',trigger: 'blur' },
                        { validator: checkPhone, trigger: 'blur' }]"
              label="手机号" prop="phone">
              <a-input v-model="dataForm.phone" class="w-100" :max-length="255" autocomplete="off" allow-clear />
            </a-form-model-item>
          </a-col>
          <a-col :sm="24">
            <a-form-model-item
              :rules=" [{ required: true, message: '身份证不能为空', trigger: 'blur' },
                        { validator: checkIdCard, trigger: 'blur' }]"
              label="身份证" prop="idCard">
              <a-input v-model="dataForm.idCard" class="w-100" :max-length="255" autocomplete="off" allow-clear />
            </a-form-model-item>
          </a-col>
          <a-col :sm="24">
            <a-form-model-item
              :rules=" { required: false, message: '邮箱不能为空', trigger: 'blur' }"
              label="邮箱" prop="email">
              <a-input v-model="dataForm.email" class="w-100" :max-length="255" autocomplete="off" allow-clear />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </modal>
    <!-- 修改密码弹窗 -->
    <modal v-model="passwordVisible" title="修改密码" @ok="passwordOk" @cancel="passwordVisible = false">
      <a-form-model ref="passwordForm" :model="passwordForm" layout="vertical">
        <a-row>
          <a-col :sm="24">
            <a-form-model-item
              :rules="[{ required: true, message: '密码不能为空', trigger: 'blur' }, { min: 6, message: '密码长度不能小于6位数', trigger: 'blur' }]"
              label="密码" prop="password">
              <a-input v-model="passwordForm.password" type="password" class="w-100" :max-length="255" autocomplete="off" allow-clear />
            </a-form-model-item>
          </a-col>
          <a-col :sm="24">
            <a-form-model-item
              :rules=" [{ required: true, message: '确认密码不能为空', trigger: 'blur' }, { validator: checkPassword, trigger: 'blur'}]"
              label="确认密码" prop="confirm">
              <a-input v-model="passwordForm.confirm" type="password" class="w-100" :max-length="255" autocomplete="off" allow-clear />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </modal>
    <!-- 聊天框 -->
    <modal v-model="chatVisible" title="聊天框" :footer="null" @cancel="chatVisible = false">
      <a-list
        class="show-comment beauty-scroll"
        item-layout="horizontal" :data-source="chats">
        <a-list-item slot="renderItem" slot-scope="item">
          <a-list-item-meta
            :description="item.action === 'SPEAK'?item.message:''"
          >
            <div slot="title">
              <a>{{ item.userName }}</a>
              <span v-if="item.action !== 'SPEAK'" style="font-weight: bold">{{ item.message }}</span>
            </div>
            <a-avatar
              slot="avatar"
              :src="item.imgUrl"
            />
          </a-list-item-meta>
        </a-list-item>
      </a-list>
      <a-comment>
        <a-avatar
          slot="avatar"
          :src="user.imgUrl"
          :alt="user.userName"
        />
        <div slot="content">
          <a-form-item>
            <a-textarea :value="message" :rows="4" @pressEnter="sendMsg" @change="messageChange" />
          </a-form-item>
          <a-form-item>
            <a-button html-type="submit" type="primary" @click="sendMsg">
              发送
            </a-button>
          </a-form-item>
        </div>
      </a-comment>
    </modal>
  </div>
</template>
<script>

import { Modal as AModal } from 'ant-design-vue'
import { getUserOrganization, changeOrganization } from '@/api/modules/sys/organization'
import { saveUserInfo } from '@/api/login/login.common'
import { getOne, editUserInfo, updatePassword } from '@/api/modules/sys/user'
import { cloneDeep, chkPhone, chkIdCard } from '@/utils/tool'
import Drawer from '@/components/tool/Drawer'
import Setting from '@/components/setting/Setting'
import Oauth from '@/api/login/oauth'
import Modal from '@/components/modal/Modal'
import Upload from '@/components/upload'
import { downloadUrl } from '@/api/common/upload'
import { removeAuthorization } from '@/utils/request'
import { mapGetters } from 'vuex'
// import { wsUrl } from '@/api/common/ws'
// import SockJS from 'sockjs-client'
// import Stomp from 'stompjs'

/**
 * 用户信息
 */
export const defaultForm = {
  id: undefined,
  imgUrl: undefined,
  phone: undefined,
  idCard: undefined,
  email: undefined,
  userName: undefined
}

export default {
  name: 'AdminHead',
  components: {
    Setting,
    Drawer,
    Modal,
    Upload
  },
  props: {
    isMobile: Boolean,
    collapsed: Boolean
  },
  data() {
    return {
      showSetting: false,
      breadcrumb: [],
      orgs: [],
      bigScreenUrl: process.env.VUE_APP_PUBLICPATH + '/bigScreen',
      orgShow: false,
      // 个人信息
      loading: false, // 表格加载
      visible: false, // 弹窗控制
      confirmLoading: false, // 确认按钮控制
      dataForm: cloneDeep(defaultForm), // 单条数据显示
      // 修改密码
      passwordVisible: false, // 修改密码弹窗开关
      passwordForm: {}, // 修改密码表单数据

      chatVisible: false,
      chats: [], // 消息列表
      headers: {}, // header
      message: '' // 消息
    }
  },
  created() {
    this.boxBreadcrumb(this.$route)
    this.getOrgs()
  },
  mounted() {
    // try {
    //   this.headers = {
    //     userId: this.user.id,
    //     [process.env.VUE_APP_ACCESS_TOKEN_KEY]: this.token
    //   }
    //   this.stompClient.connect(this.headers, () => {
    //     // 开始建立连接
    //     this.stompClient.send('/app/onOpen', this.headers)
    //     this.stompClient.subscribe('/topic/onMessage', (msg) => {
    //       if (!isJSON(msg)) {
    //         return
    //       }
    //       const data = JSON.parse(msg.body)
    //       console.log(data)
    //       this.chats.push(data)
    //     })
    //     // this.stompClient.send('/app/todo', this.headers)
    //   }, (error) => console.error(error))
    //   window.onbeforeunload = () => {
    //     // 窗口关闭前
    //     this.disconnect()
    //   }
    // } catch (e) {
    //   console.error(e)
    // }
  },
  watch: {
    $route(val) {
      this.boxBreadcrumb(val)
    }
  },
  computed: {
    ...mapGetters('account', ['user', 'token', 'organization'])
    // ...mapGetters('setting', ['stompClient'])
  },
  methods: {

    fetchNotice() {
      if (this.todoLoading) {
        this.todoLoading = false
        return
      }
      this.todoLoading = true
      setTimeout(() => {
        this.todoLoading = false
      }, 1000)
    },
    /**
     * 发送信息
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    sendMsg() {
      if (!this.message && !this.message.trim()) {
        return
      }
      this.message.replace('\n')
      if (!this.message) {
        return
      }
      setTimeout(() => {
        this.stompClient.send('/app/onMessage', this.headers, this.message)
        this.message = ''
      }, 0)
    },
    /**
     * 关闭信息
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    disconnect(callback) {
      if (this.stompClient) {
        Promise.resolve(this.stompClient.send(`/app/onClose`, this.headers)).then(() => {
          console.log('关闭stomp')
          this.stompClient.disconnect((res) => {
            if (callback && typeof callback === 'function') {
              callback(res)
            }
          })
        })
      }
    },
    /**
     * 发送信息
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    messageChange(e) {
      this.message = e.target.value
    },
    /**
     * 打开用户信息
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    openChat() {
      this.chatVisible = true
    },
    /**
     * 打开用户信息
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    openUserInfo() {
      getOne(this.user.id).then(res => {
        this.visible = true
        this.dataForm = res.data || {}
      }).over()
    },
    /**
     * 检查手机号
     * @date 2021-5-21 12:10:43
     * @author lyc
     */
    checkPhone(rule, value, callback) {
      return chkPhone(value) ? callback() : callback(new Error('手机号格式不正确'))
    },
    /**
     * 检查身份证号
     * @date 2021-5-21 12:11:06
     * @author lyc
     */
    checkIdCard(rule, value, callback) {
      return chkIdCard(value) ? callback() : callback(new Error('身份证格式不正确'))
    },
    /**
     * 重置数据
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dataForm = cloneDeep(defaultForm)
    },
    /**
     * 保存
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    handleOk() {
      this.$refs['userForm'].validate(valid => {
        if (!valid) return
        this.confirmLoading = true
        editUserInfo(this.dataForm).then(() => {
          this.$message.success('保存成功!')
        }).over().finally(() => {
          this.handleCancel()
        })
      })
    },
    /**
     * 取消
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
      this.resetForm('userForm')
    },
    /**
     * 确认密码
     * @date 2021-5-31 9:31:00
     * @author zxp
     */
    checkPassword(rule, value, callback) {
      if (this.visible) return value !== this.dataForm.password ? callback(new Error('两次输入密码不一致')) : callback()
      if (this.passwordVisible) return value !== this.passwordForm.password ? callback(new Error('两次输入密码不一致')) : callback()
    },
    /**
     * 修改密码
     * @date 2021-5-31 9:47:00
     * @author zxp
     */
    openUpdPassword() {
      this.passwordVisible = true
      this.passwordForm = { id: this.user.id }
    },
    /**
     * 确认修改密码
     * @date 2021-5-31 10:06:00
     * @author zxp
     */
    passwordOk() {
      this.$refs.passwordForm.validate(val => {
        if (!val) return
        delete this.passwordForm.confirm
        updatePassword(this.passwordForm)
          .then(() => {
            this.passwordForm.password = undefined
            this.passwordForm.id = undefined
            this.passwordVisible = false
            this.$message.success('保存成功!')
          }).over()
      })
    },
    /**
     * 上传文件改变时的状态
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    handleChange({ file }) {
      if (file.status === 'done') {
        const response = file.response
        const { data = {}} = response
        this.dataForm.imgUrl = downloadUrl + data.url
        console.log(this.dataForm.imgUrl)
      }
    },
    toggleCollapse() {
      this.$emit('toggleCollapse')
    },
    toggleSideMenuShow() {
      this.$emit('toggleSideMenuShow')
    },
    boxBreadcrumb(route) {
      const { meta = {}} = route
      this.breadcrumb = meta.breadcrumb
    },
    getOrgs() {
      getUserOrganization(this.user.id).then(res => {
        this.orgs = res.data || []
      }).done()
    },
    /**
     * 切换组织
     */
    changeOrg(item) {
      this.orgShow = false
      if (this.organization.id === item.id) { // 当前
        return
      }
      AModal.confirm({
        title: (h) => h('span', ['是否切换到组织/企业', h('a', { class: 'primary' }, item.name), '?']),
        onOk: () => {
          this.$message.success('切换成功')
          changeOrganization(item.id).then(res => {
            const { data } = res
            saveUserInfo(data)

            this.$closeAllPage()
            this.$router.push('/')
          }).done().finally(() => {
            Promise.resolve()
          })
        },
        onCancel() {
          Promise.resolve()
        }
      })
    },
    logOut() {
      Oauth.logout().then(res => {
        removeAuthorization()
        this.$router.push('/login')
      }).over()
    }
  }
}
</script>
<style lang="less" scoped>

.primary {
  background-color: @primary-color;
}

.userInfo {
  padding: 0;
  overflow: hidden;
  border-radius: @border-radius-xl;
  box-shadow: @card-shadow;
  transition: all 0.2s;

  &.fixed-tabs {
    height: 0;
    opacity: 0;
    margin: 0 10px;
  }

  .header-main {
    float: right;
    display: flex;
    justify-content: space-between;

    .icon-size {
      font-size: 18px;
    }

    .header-child {
      display: flex;
      align-items: center;
      justify-content: center;

      .header-child-item {
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        padding-left: 14px;
        padding-right: 14px;

        &:not(.normal):hover {
          cursor: pointer;
        //   background-color: @primary-1;
        }

        .item-name {
          max-width: 100px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }
    }
  }

  .header-child:first-child .header-child-item:first-child {
    border-top-left-radius: @border-radius-xl;
    border-bottom-left-radius: @border-radius-xl;
  }

  .header-child:last-child .header-child-item:last-child {
    border-top-right-radius: @border-radius-xl;
    border-bottom-right-radius: @border-radius-xl;
  }
}

.d-none {
  @media (max-width: 600px) {
    & {
      display: none !important;
    }
  }
}

/deep/ .ant-badge-count {
  width: 18px;
  height: 18px;
  line-height: 18px;
  border-radius: 50%
}

/deep/ .ant-list-item-meta-description{
  color: rgba(0, 0, 0, 0.65);
}

.avatar{
  text-align: center;
  margin-bottom: 16px;
}

.show-comment{
  height: calc(100% - 220px);
  overflow: auto;
}

.tab-pane{
  padding: 0 24px 12px;
  width: 250px;
  min-height: 250px;
}

</style>
