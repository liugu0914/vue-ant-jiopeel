<template>
  <div class="Menu">
    <a-menu :key="$route.path" :theme="menuTheme" :default-selected-keys="[selectKeys]">
      <a-menu-item v-for="item in menus" :key="item.id" @click="menuClick(item)">
        <my-icon :type="item.icon" />
        <span>{{ item.name }}</span>
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  methods: {
    menuClick(item) {
      if (item.path) {
        if (item.path === this.$route.path) return
        return this.$router.push(item.path)
      }
      if (item.children && item.children.length) {
        const path = item.children[0].path
        if (path === this.$route.path) return
        this.$router.push(path)
      }
    }
  },
  computed: {
    ...mapGetters(['menus']),
    ...mapState('setting', ['theme']),
    selectKeys() {
      return this.$route.meta.breadcrumb[0].id
    },
    menuTheme() {
      return this.theme.mode === 'light' ? this.theme.mode : 'dark'
    }
  }
}
</script>
<style scoped lang="less">
/deep/ .ant-menu-item {
  display: flex;
  margin: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  height: 78px;
  .anticon {
    margin-top: 10px;
    margin-right: 0;
    font-size: 22px;
  }
  span {
    margin: 5px;
    height: 24px;
    line-height: 24px;
    font-size: 12px;
  }
}

.ant-menu-vertical .ant-menu-item:not(:last-child) {
  margin-bottom: 0;
}
</style>
