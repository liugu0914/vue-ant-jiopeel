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
</template>
<script>

export default {
  name: 'AdminHead',
  props: {
    isMobile: Boolean,
    collapsed: Boolean
  },
  data() {
    return {
      breadcrumb: []
    }
  },
  created() {
    this.boxBreadcrumb(this.$route)
  },
  watch: {
    $route(val) {
      this.boxBreadcrumb(val)
    }
  },
  computed: {
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
    }
  }
}
</script>
<style lang="less">
</style>
