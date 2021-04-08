<template>
  <div class="admin-drawer-body">
    <a-layout-sider v-model="collapsed" :theme="sideTheme" :class="['admin-side-menu', 'beauty-scroll']" width="220" :collapsible="collapsible" :trigger="null">
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
      <i-menu :theme="theme" :collapsed="collapsed" :options="menuData" :show-item-icon="false" class="menu" @select="onSelect" />
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
  computed: {
    sideTheme() {
      return this.theme == 'light' ? this.theme : 'dark'
    },
    ...mapState('setting', ['isMobile', 'systemName'])
  },
  methods: {
    onSelect(obj) {
      this.$emit('menuSelect', obj)
    }
  }
}
</script>

<style lang="less" scoped>
@import "index";
</style>
