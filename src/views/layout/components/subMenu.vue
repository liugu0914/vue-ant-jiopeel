<template>
  <div class="subMenu">
    <a-menu mode="horizontal" :default-selected-keys="[$route.path]">
      <template v-if="$route.meta.breadcrumb.length > 1">
        <a-menu-item v-for="item in menuList" :key="item.path" @click="subMenuClick(item.path)">
          <span>{{ item.name }}</span>
        </a-menu-item>
      </template>
      <a-menu-item v-else :key="$route.path">
        <span>{{ $route.meta.breadcrumb[0].name }}</span>
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['menus']),
    menuList() {
      if (this.$route.path === '/dashboard') return []
      const router = this.menus.find(item => item.id === this.$route.meta.breadcrumb[0].id)
      return router.children && router.children.length ? router.children : []
    }
  },
  methods: {
    subMenuClick(path) {
      if (this.$route.path === path) return
      this.$router.push(path)
    }
  }
}
</script>
<style scoped lang="less">
.subMenu {
  ul {
    height: 44px;
    line-height: 44px;
    border: 0;
    li {
      padding: 0;
      span {
        padding: 0 20px;
        border-left: 2px solid #e4e8f1;
      }
      &.ant-menu-item-selected {
        &:hover {
          border-color: @primary-color;
        }
      }
      &:hover {
          border-color: transparent;
      }
      &:nth-child(2) {
        span {
          border: none;
        }
      }
    }
  }
}
</style>
