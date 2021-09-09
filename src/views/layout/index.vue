<template>
  <div class="layout">
    <!-- 顶部 logo 用户信息 -->
    <layout-header />
    <!-- 中间 title 二级菜单 -->
    <layout-title @reload="key = +new Date()" />
    <!-- 底部 一级菜单和二级路由 -->
    <div class="container">
      <!-- <div class="menu beauty-scroll" :style="{marginLeft: $store.getters.collapsed ? '-82px' : 0 }"> -->
      <a-layout-sider
        class="beauty-scroll"
        :theme="menuTheme"
        :style="{marginLeft: $store.getters.collapsed ? '-82px' : 0 }"
        :width="82">
        <Menu />
      </a-layout-sider>
      <div class="scroll content beauty-scroll" style="padding: 20px">
        <page-toggle-transition :disabled="animate.disabled" :animate="animate.name" :direction="animate.direction">
          <router-view :key="$route.path + key" />
        </page-toggle-transition>
      </div>
    </div>
  </div>
</template>

<script>
import LayoutHeader from './components/LayoutHeader'
import LayoutTitle from './components/LayoutTitle'
import Menu from './components/Menu'
import PageToggleTransition from '@/components/transition/PageToggleTransition'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      content: '',
      key: ''
    }
  },
  components: {
    LayoutHeader,
    LayoutTitle,
    Menu,
    PageToggleTransition
  },
  computed: {
    ...mapState('setting', ['theme', 'animate']),
    menuTheme() {
      return this.theme.mode === 'light' ? this.theme.mode : 'dark'
    }
  },
  mounted() {
    this.content = document.querySelector('.scroll')
  },
  watch: {
    $route(val) {
      this.content.scrollTop = 0
    }
  }
}
</script>
<style scoped lang="less">
.layout {
  min-width: 960px;
  height: 100%;
  display: flex;
  flex-direction: column;
  .container {
    flex: 1;
    display: flex;
    overflow-y: auto;
    .ant-layout-sider {
      overflow-y: auto;
      transition: all .3s;
      &::-webkit-scrollbar {
        display: none; /* Chrome Safari */
      }
    }
    .content {
      flex: 1;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      background-color: @layout-body-background;
    }
  }
}
</style>
