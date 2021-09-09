<template>
  <div class="swiper" :style="{ height: format(height)}">
    <div :id="id" class="swiper-container" :style="{width: format(width)}">
      <div class="swiper-wrapper">
        <slot />
      </div>
    </div>
    <div class="swiper-prev" @click.stop="prev">
      <a-icon type="left" />
    </div>
    <div class="swiper-next" @click.stop="next">
      <a-icon type="right" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    move: {
      type: Boolean,
      default: false
    },
    width: {
      type: [Number, String],
      default: '80%'
    },
    height: {
      type: [Number, String],
      default: 300
    },
    moveWidth: { // 每次移动的宽度
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      id: new Date().getTime(),
      current: 0 // 移动次数
    }
  },
  methods: {
    /**
     * 左滑
     */
    prev(e) {
      if (!this.current) return
      this.current--
      const wrapper = e.target.parentNode.children[0].children[0]
      wrapper.style.transform = `translateX(-${this.current * this.moveWidth}px)`
    },
    /**
     * 右滑
     */
    next(e) {
      const container = e.target.parentNode.children[0]
      const wrapper = container.children[0]
      const containerWidth = container.clientWidth
      const wrapperWidth = wrapper.clientWidth
      if (this.current * this.moveWidth + containerWidth > wrapperWidth || wrapperWidth < containerWidth) return
      this.current++
      wrapper.style.transform = `translateX(-${this.current * this.moveWidth}px)`
    },
    /**
     * 格式化 widht height
     */
    format(value) {
      if (typeof value == 'number') return value + 'px'
      return value.includes('px') || value.includes('%') ? value : value + 'px'
    },
    /**
     * 组件初始化
     */
    swiperInit() {
      const container = document.getElementById(this.id)
      const wrapper = container.querySelector('.swiper-wrapper')
      const containerWidth = container.clientWidth
      const wrapperWidth = wrapper.clientWidth
      const flag = containerWidth > wrapperWidth
      const prev = container.nextElementSibling
      const next = prev.nextElementSibling
      if (!flag && this.move) {
        wrapper.classList.add('move')
        prev.style.display = 'none'
        next.style.display = 'none'
      }
      wrapper.style['animation-duration'] = !flag && this.move ? `${wrapperWidth / this.moveWidth * 2}s` : '0s'
      container.style['justify-content'] = flag ? 'center' : 'left'
      prev.className = flag ? 'swiper-prev hidden' : 'swiper-prev show'
      next.className = flag ? 'swiper-next hidden' : 'swiper-next show'
    }
  },
  mounted() {
    this.swiperInit()
    window.addEventListener('resize', this.swiperInit)
  },
  destroyed() {
    window.removeEventListener('resize', this.swiperInit)
  }
}
</script>
<style scoped lang="less">
.swiper {
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  .swiper-prev, .swiper-next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    font-size: 16px;
    display: none;
    -moz-user-select:none;
    -ms-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    i {
      pointer-events:none
    }
  }
  .swiper-prev {
    left: 2px;
  }
  .swiper-next {
    right: 2px;
  }
  &:hover {
    .show {
      display: block;
    }
  }
}

.swiper-container {
  display: flex;
  overflow: hidden;
  margin: 0 auto;
  position: absolute;
  .swiper-wrapper {
    display: flex;
    height: 100%;
    transition: transform .6s;
  }
}

@keyframes move {
  0% {
  }
  100% {
    transform: translateX(-100%);
  }
}

.move {
  animation: move 0s linear infinite;
}
</style>
