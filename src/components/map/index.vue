<template>
  <div class="baidu-map" />
</template>

<script>
export default {
  name: 'Map',
  data() {
    return {
      map: {}
    }
  },
  mounted() {
    this.initBaiduMap()
  },
  methods: {
    /**
     * 初始化百度地图
     */
    initBaiduMap() {
      const box = document.querySelectorAll('.baidu-map')
      // 创建地图实例
      this.map = new window.BMapGL.Map(box[box.length - 1])
      // 设置中心点
      const point = new window.BMapGL.Point(118.293328, 33.945154)
      // 地图初始化
      this.map.centerAndZoom(point, 11)
      // 开启鼠标滚轮缩放
      this.map.enableScrollWheelZoom(true)
      // 监听地图点击事件
      this.map.addEventListener('click', e => {
        this.$emit('mapClick', e.latlng.lng.toFixed(6), e.latlng.lat.toFixed(6))
      })
    }
  }
}
</script>
<style scoped lang="less">
.baidu-map {
  width: 100%;
  height: 100%;
}
</style>
