<template>
  <div v-if="visible" class="Shade" @click="maskClick">
    <div class="container" :style="{width: w, height: h, background: bgc}">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Shade',
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
      type: String,
      default: '#fff'
    }
  },
  methods: {
    maskClick(e) {
      if (e.target.className === 'Shade') {
        this.$emit('update:visible', false)
      }
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
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background: rgba(0,0,0,.7);
  z-index: 1998;
  .container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
