<template>
  <a-layout-header class="admin-header-round">
    <div class="header-main">
      <div class="header-child ">
        <!-- 折叠按钮 -->
        <div v-if="isMobile" class="header-child-item px-3" @click="toggleSideMenuShow">
          <a-icon
            class="icon-size" type="menu-unfold"
          />
        </div>
        <div v-else class="header-child-item px-3" @click="toggleCollapse">
          <a-icon
            class="icon-size"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          />
        </div>
        <div v-if="breadcrumb && breadcrumb.length >0" class="header-child-item normal d-none">
          <a-breadcrumb>
            <a-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index">
              {{ item.name }}
            </a-breadcrumb-item>
          </a-breadcrumb>
        </div>
      </div>
      <div class="header-child ">
        <div class="header-child-item">
          <a-popover v-model="orgShow" title="选择组织/企业">
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
          <a-icon class="icon-size" type="github" />
        </div>
        <div class="header-child-item">
          <a-badge count="5">
            <a-icon class="icon-size" type="bell" />
          </a-badge>
        </div>
        <a-dropdown>
          <div class="header-child-item">
            <a-avatar size="default" shape="circle" src="https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png" />
            <span class="ml-1 item-name d-none">{{ user.userName }}</span>
          </div>
          <a-menu slot="overlay">
            <a-menu-item>
              <a-icon type="user" />
              <span>个人中心</span>
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
  </a-layout-header>
</template>
<script>

import { Modal } from 'ant-design-vue'
import { getList } from '@/api/modules/sys/organization'
import Drawer from '@/components/tool/Drawer'
import Setting from '@/components/setting/Setting'
import Oauth from '@/api/login/oauth'
import { removeAuthorization } from '@/utils/request'
import { mapGetters } from 'vuex'

export default {
  name: 'AdminHead',
  components: {
    Setting,
    Drawer
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
      orgShow: false
    }
  },
  created() {
    this.boxBreadcrumb(this.$route)
    this.getOrgs()
  },
  watch: {
    $route(val) {
      this.boxBreadcrumb(val)
    }
  },
  computed: {
    ...mapGetters('account', ['user', 'organization'])
  },
  methods: {
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
      getList().then(res => {
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
      Modal.confirm({
        title: (h) => h('span', ['是否切换到组织/企业', h('a', { class: 'primary' }, item.name), '?']),
        onOk: () => {
          this.$message.success('切换成功')
          Promise.resolve()
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
.primary{
  background-color:  @primary-color;
}
.pointer{
  cursor: pointer;
}

.admin-header-round {

  background: #fff;
  padding: 0;
  overflow: hidden;
  margin: 10px 10px 0 10px;
  border-radius: @border-radius-xl;
  box-shadow: @card-shadow;
  transition: all 0.2s;

  &.fixed-tabs {
    height: 0;
    opacity: 0;
    margin: 0 10px;
  }

  .header-main {
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
          background-color: @primary-1;
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

</style>
