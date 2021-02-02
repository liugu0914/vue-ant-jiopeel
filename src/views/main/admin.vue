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
      <a-layout-sider :class="['admin-side']" theme="light">
        <div class="admin-side-header">
          <div class="logo" />
          <h1>
            {{ 'white ice' }}
          </h1>
        </div>
        <a-menu
          mode="inline" theme="light"
          :default-selected-keys="['1']"
          :default-open-keys="['sub1']"
        >
          <a-sub-menu key="sub1">
            <span slot="title">
              <a-icon type="user" />
              <span>subnav 1</span>
            </span>
            <a-menu-item key="1">
              option1
            </a-menu-item>
            <a-menu-item key="2">
              option2
            </a-menu-item>
            <a-menu-item key="3">
              option3
            </a-menu-item>
            <a-menu-item key="4">
              option4
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <span slot="title"><a-icon type="laptop" /><span>subnav 2</span>
            </span>
            <a-menu-item key="5">
              option5
            </a-menu-item>
            <a-menu-item key="6">
              option6
            </a-menu-item>
            <a-menu-item key="7">
              option7
            </a-menu-item>
            <a-menu-item key="8">
              option8
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub3">
            <span slot="title"><a-icon type="notification" /><span>subnav 3</span>
            </span>
            <a-menu-item key="9">
              option9
            </a-menu-item>
            <a-menu-item key="10">
              option10
            </a-menu-item>
            <a-menu-item key="11">
              option11
            </a-menu-item>
            <a-menu-item key="12">
              option12
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
    </a-drawer>
    <a-layout-sider v-model="collapsed" :class="['admin-side',isMobile?'hidden':null]" :trigger="null" theme="light" breakpoint="md" :collapsed-width="collapsedWidth" collapsible @breakpoint="changeBreakpoint">
      <div class="admin-side-header">
        <div class="logo" />
        <h1 v-if="!collapsed">
          {{ 'white ice' }}
        </h1>
      </div>
      <a-menu
        mode="inline" theme="light"
      >
        <a-sub-menu v-for="menu in menus" :key="menu.id">
          <span slot="title">
            <a-icon type="user" />
            <span>{{ menu.name }}</span>
          </span>
          <a-menu-item v-for="menuItem in menu.children" :key="menuItem.id">
            {{ menuItem.name }}
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="admin-header-round">
        <div class="header-main">
          <div class="header-child ">
            <!-- 折叠按钮 -->
            <div v-if="isMobile" class="header-child-item px-3" @click="() =>(sideMenuShow = !sideMenuShow)">
              <a-icon
                class="icon-size"
                :type="collapsed ? 'menu-unfold' : 'menu-fold'"
              />
            </div>
            <div v-else class="header-child-item px-3" @click="() => (collapsed = !collapsed)">
              <a-icon
                class="icon-size"
                :type="collapsed ? 'menu-unfold' : 'menu-fold'"
              />
            </div>
            <div class="header-child-item normal d-none">
              <a-breadcrumb>
                <a-breadcrumb-item>系统配置</a-breadcrumb-item>
                <a-breadcrumb-item>菜单管理</a-breadcrumb-item>
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

import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      collapsed: true,
      sideMenuShow: false,
      isMobile: false,
      collapsedWidth: 80
    }
  },
  created() {
    console.log(this.menus)
  },
  computed: {
    ...mapGetters('account', ['menus'])
  },
  methods: {
    changeBreakpoint(broken) {
      this.isMobile = broken
      this.collapsedWidth = broken ? 0 : 80
      console.log('broken :' + broken)
    }
  }
}
</script>
<style lang="less">
@import "@/less/admin/index";
</style>
