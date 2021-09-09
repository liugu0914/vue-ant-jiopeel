<template>
  <div v-if="visible" ref="Shade" class="Shade" @click="maskClick">
    <div v-if="close" class="close" @click="shut">
      <a-icon type="close" />
    </div>
    <div class="container beauty-scroll" :style="{width: w, height: h, background: bgc}">
      <slot />
    </div>
    <slot name="footer" />
  </div>
</template>

<script>
export default {
  name: 'Shade',
  model: {
    prop: 'visible'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    width: {
      type: [String, Number],
      default: 800
    },
    height: {
      type: [String, Number],
      default: 500
    },
    bgc: {
      type: String
    },
    close: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    maskClick(e) {
      if (e.target.className === 'Shade') {
        this.$parent.$refs.mapSelect ? this.$emit('close') : this.$emit('input', false)
      }
    },
    shut() {
      this.$parent.$refs.mapSelect ? this.$emit('close') : this.$emit('input', false)
    }
  },
  computed: {
    w({ width }) {
      if (typeof width !== 'string') return width + 'px'
      return width.indexOf('%') !== -1 || width.indexOf('px') !== -1 ? width : width + 'px'
    },
    h({ height }) {
      if (typeof height !== 'string') return height + 'px'
      return height.indexOf('%') !== -1 || height.indexOf('px') !== -1 ? height : height + 'px'
    }
  },
  watch: {
    visible(val) {
      if (!val) this.$emit('close')
    }
  }
}
</script>
<style scoped lang="less">
.Shade {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background: rgba(0,0,0,.5);
  z-index: 1005;
  overflow: hidden;
  .container {
    position: relative;
    overflow: auto;
  }
  .close {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    cursor: pointer;
    height: 80px;
    overflow: hidden;
    position: absolute;
    right: -40px;
    top: -40px;
    -webkit-transition: background-color 0.15s;
    transition: background-color 0.15s;
    width: 80px;
    z-index: 1;
    i {
      position: absolute;
      top: 48px;
      left: 15px;
      font-size: 16px;
      color: #fff;
    }
  }
}
</style>
