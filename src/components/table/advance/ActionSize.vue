<template>
  <div class="action-size float-right">
    <a-button-group>
      <slot name="default" />
      <a-tooltip title="密度">
        <a-dropdown placement="bottomCenter">
          <a-button>
            <a-icon class="action" type="column-height" />
          </a-button>
          <a-menu slot="overlay" :selected-keys="[value]" @click="onClick">
            <a-menu-item key="default">
              默认
            </a-menu-item>
            <a-menu-item key="middle">
              中等
            </a-menu-item>
            <a-menu-item key="small">
              紧密
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-tooltip>
      <slot name="setting" />
    </a-button-group>
  </div>
</template>

<script>

export default {
  name: 'ActionSize',
  props: {
    value: String,
    columns: Array
  },
  data() {
    return {
      fullScreen: false
    }
  },
  methods: {
    onClick({ key }) {
      this.$emit('input', key)
    },
    toggleScreen() {
      if (this.fullScreen) {
        this.outFullScreen()
      } else {
        this.inFullScreen()
      }
    },
    inFullScreen() {
      const el = document.body
      if (el.requestFullscreen) {
        el.requestFullscreen()
        return true
      } else if (el.webkitRequestFullScreen) {
        el.webkitRequestFullScreen()
        return true
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen()
        return true
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen()
        return true
      }
      this.$message.warn('对不起，您的浏览器不支持全屏模式')
      el.classList.remove('beauty-scroll')
      return false
    },
    outFullScreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    },
    addListener() {
      document.addEventListener('fullscreenchange', this.fullScreenListener)
      document.addEventListener('webkitfullscreenchange', this.fullScreenListener)
      document.addEventListener('mozfullscreenchange', this.fullScreenListener)
      document.addEventListener('msfullscreenchange', this.fullScreenListener)
    },
    removeListener() {
      document.removeEventListener('fullscreenchange', this.fullScreenListener)
      document.removeEventListener('webkitfullscreenchange', this.fullScreenListener)
      document.removeEventListener('mozfullscreenchange', this.fullScreenListener)
      document.removeEventListener('msfullscreenchange', this.fullScreenListener)
    },
    fullScreenListener(e) {
      if (e.target.id === this.id) {
        this.fullScreen = !this.fullScreen
      }
    }
  }
}
</script>

<style scoped lang="less">
.action-size{
  display: inline-block;
}
</style>
