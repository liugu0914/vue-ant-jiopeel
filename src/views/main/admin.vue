<template>
  <a-layout class="h-100">
    <a-drawer
      v-if="isMobile"
      placement="left"
      :closable="false"
      :visible="sideMenuShow"
      :width="240"
      @close="()=> sideMenuShow = false"
    >
      <side-menu :theme="theme.mode" :menu-data="menus" :collapsed="false" :collapsible="false" />
    </a-drawer>
    <side-menu v-show="!isMobile" :theme="theme.mode" :menu-data="menus" :collapsed="collapsed" :collapsible="true" />
    <a-layout>
      <a-layout-header class="admin-header-round">
        <div class="header-main">
          <div class="header-child ">
            <!-- 折叠按钮 -->
            <div v-if="isMobile" class="header-child-item px-3" @click="() =>(sideMenuShow = !sideMenuShow)">
              <a-icon
                class="icon-size" type="menu-unfold"
              />
            </div>
            <div v-else class="header-child-item px-3" @click="() => (collapsed = !collapsed)">
              <a-icon
                class="icon-size"
                :type="collapsed ? 'menu-unfold' : 'menu-fold'"
              />
            </div>
            <div v-if="breadcrumb && breadcrumb.length >0" class="header-child-item normal d-none">
              <a-breadcrumb>
                <a-breadcrumb-item v-for="item in breadcrumb" :key="item">
                  {{ item }}
                </a-breadcrumb-item>
              </a-breadcrumb>
            </div>
          </div>
          <div class="header-child ">
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
                <span class="ml-1 item-name d-none">系统管理员</span>
              </div>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a-icon type="user" />
                  <span>个人中心</span>
                </a-menu-item>
                <a-menu-item>
                  <a-icon type="setting" />
                  <span>设置</span>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item>
                  <a-icon style="margin-right: 8px;" type="poweroff" />
                  <span>退出登录</span>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </div>
      </a-layout-header>
      <a-layout-content class="admin-content">
        <div class="admin-content-tab">
          <a-tabs :tab-bar-gutter="4" type="editable-card" hide-add closable>
            <a-tab-pane v-for="i in 10" :key="i">
              <span slot="tab"><a-icon v-if="i == 1" type="sync" />{{ `Tab-${i}` }}</span>
            </a-tab-pane>
          </a-tabs>
        </div>
        <div class="admin-content-view fixed">
          <div class="admin-content-body">
            <router-view />
          </div>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>

import SideMenu from '@/components/menu/SideMenu'
import { mapState, mapGetters } from 'vuex'

export default {
  components: {
    SideMenu
  },
  data() {
    return {
      collapsed: false,
      sideMenuShow: false,
      breadcrumb: []
    }
  },
  created() {
    console.log(this.menus)
    this.boxBreadcrumb(this.$route)
  },
  watch: {
    $route(val) {
      this.boxBreadcrumb(val)
    },
    isMobile(val) {
      if (!val) {
        this.sideMenuShow = false
      }
    }
  },
  computed: {
    ...mapState('setting', ['isMobile', 'theme', 'layout', 'footerLinks', 'copyright', 'fixedHeader', 'fixedSideBar',
      'fixedTabs', 'hideSetting', 'multiPage']),
    ...mapGetters('account', ['menus'])
  },
  methods: {
    boxBreadcrumb(route) {
      const { meta = {}} = route
      this.breadcrumb = meta.breadcrumb
    }
  }
}
</script>
<style lang="less">
@import "@/less/admin/index";
</style>
