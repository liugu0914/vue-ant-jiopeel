<template>
  <div class="admin-drawer-body">
    <a-layout-sider
      v-model="collapsed"
      :theme="sideTheme"
      :class="['admin-side-menu', 'beauty-scroll']"
      width="220"
      :collapsible="collapsible"
      :trigger="null"
    >
      <!-- <div :class="['logo', theme]">
      <router-link to="/dashboard/workplace">
        <img src="@/assets/img/logo.png">
        <h1>{{ systemName }}</h1>
      </router-link>
    </div> -->
      <router-link to="/">
        <div class="admin-side-menu-header">
          <div :class="['logo', theme]" />
          <h1 v-if="!collapsed">
            {{ 'white ice' }}
          </h1>
        </div>
      </router-link>
      <i-menu
        :theme="theme"
        :collapsed="collapsed"
        :options="menuData"
        :show-item-icon="false"
        :open-keys="openKeys"
        class="menu"
        @select="onSelect"
        @openChange="openChange"
      />
    </a-layout-sider>
  </div>
</template>

<script>
import IMenu from './menu'
import { mapState } from 'vuex'
export default {
  name: 'SideMenu',
  components: { IMenu },
  props: {
    collapsible: {
      type: Boolean,
      required: false,
      default: false
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    menuData: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'light'
    }
  },
  data() {
    return {
      openKeys: []
    }
  },
  computed: {
    sideTheme() {
      return this.theme == 'light' ? this.theme : 'dark'
    },
    ...mapState('setting', ['isMobile', 'systemName'])
  },
  methods: {
    onSelect(obj) {
      this.$emit('menuSelect', obj)
    },
    openChange(openKeys) {
      this.openKeys = openKeys
      // console.log(openKeys)
      const arr = this.menuData.map(item => item.id)
      const lastKey = openKeys[openKeys.length - 1]
      // 判断点击的是否是一级菜单
      if (arr.indexOf(lastKey) !== -1) return (this.openKeys = [lastKey])
    }
  }
}
</script>

<style lang="less" scoped>
@import 'index';
</style>
