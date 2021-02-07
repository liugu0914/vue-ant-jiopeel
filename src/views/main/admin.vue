<template>
  <a-layout class="h-100">
    <a-drawer
      v-if="isMobile"
      class="admin-drawer"
      placement="left"
      :closable="false"
      :visible="sideMenuShow"
      :width="240"
      @close="()=> sideMenuShow = false"
    >
      <side-menu :theme="theme.mode" :menu-data="menus" :collapsed="false" :collapsible="false" />
    </a-drawer>
    <side-menu v-show="!isMobile" :theme="theme.mode" :menu-data="menus" :collapsed="collapsed" :collapsible="true" />
    <a-layout class="beauty-scroll">
      <admin-head :class="[{'fixed-tabs': fixedTabs}]" :is-mobile="isMobile" :collapsed="collapsed" @toggleCollapse="toggleCollapse" @toggleSideMenuShow="toggleSideMenuShow" />
      <admin-content />
    </a-layout>
  </a-layout>
</template>
<script>

import AdminHead from './AdminHead'
import AdminContent from './AdminContent'
import SideMenu from '@/components/menu/SideMenu'
import { mapState, mapGetters } from 'vuex'

export default {
  components: {
    AdminHead,
    AdminContent,
    SideMenu
  },
  data() {
    return {
      collapsed: false,
      sideMenuShow: false
    }
  },
  created() {
  },
  watch: {
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
    toggleCollapse() {
      this.collapsed = !this.collapsed
    },
    toggleSideMenuShow() {
      this.sideMenuShow = !this.sideMenuShow
    }
  }
}
</script>
<style lang="less">
@import "@/less/admin/index";
</style>
