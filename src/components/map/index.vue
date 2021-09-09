<template>
  <div class="map">
    <div v-if="isSearch && map" class="search">
      <a-auto-complete :data-source="dataSource" style="width: 240px" @select="onSelect">
        <a-input id="input" v-model="value" :max-length="100" placeholder="输入关键字搜索地点" allow-clear @change="onChange">
          <a-icon slot="suffix" type="search" @click="onSelect(value)" />
        </a-input>
      </a-auto-complete>
    </div>
    <div :id="id" class="baidu-map" />
  </div>
</template>

<script>
export default {
  props: {
    styleId: {
      type: String,
      default: ''
    },
    scale: {
      type: [Number, String],
      default: 11
    },
    isSearch: {
      type: Boolean,
      default: false
    }
  },
  name: 'Map',
  data() {
    return {
      id: +new Date(),
      map: null,
      dataSource: [],
      value: ''
    }
  },
  async mounted() {
    await this.loadingBMap()
    setTimeout(this.initBaiduMap, 300)
    window.addEventListener('resize', this.resetCenter)
  },
  methods: {
    /**
     * 初始化百度地图
     */
    initBaiduMap() {
      const box = document.getElementById(this.id)
      if (window.BMapGL) {
        // 创建地图实例
        const map = new window.BMapGL.Map(box)
        // 地图初始化
        map.centerAndZoom(new window.BMapGL.Point(118.293328, 33.945154), +this.scale)
        // 开启鼠标滚轮缩放
        map.enableScrollWheelZoom(true)
        // 监听地图点击事件
        map.addEventListener('click', e => {
          this.$emit('mapClick', e.latlng.lng.toFixed(6), e.latlng.lat.toFixed(6))
        })
        // 设置个性化地图
        map.setMapStyleV2({
          styleId: this.styleId
        })
        this.map = map
        if (this.isSearch) {
          // 建立一个自动完成的对象
          new window.BMapGL.Autocomplete({ input: 'input', 'location': map, onSearchComplete: result => {
            this.dataSource = result._pois.map(item => item.business).reduce((arr, curr) => {
              if (!arr.includes(curr)) arr.push(curr)
              return arr
            }, [])
          } })
        }
      }
    },
    /**
     * 输入框清空
     */
    onChange(e) {
      if (e.target.value.trim()) return
      // 清除标记
      this.map.clearOverlays()
      // 重置中心点和缩放级别
      this.dataSource = []
      this.resetCenter()
    },
    /**
      * 异步加载百度地图 js
      */
    loadingBMap() {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = 'https://api.map.baidu.com/getscript?v=1.0&type=webgl&ak=qXKs5IDrvZUqXkR1H5BUPOUSGdhBEwor'
      document.body.appendChild(script)
    },
    /**
     * 选择搜索建议时触发
     */
    onSelect(value) {
      const map = this.map
      const local = new window.BMapGL.LocalSearch(map, {
        renderOptions: { map }
      })
      local.search(value)
    },
    /**
     * 重置地图中心点
     */
    resetCenter() {
      this.map && this.map.centerAndZoom(new window.BMapGL.Point(118.293328, 33.945154), +this.scale)
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resetCenter)
  }
}
</script>
<style scoped lang="less">
.map {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
  .search {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 10;
  }
}
.baidu-map {
  width: 100%;
  height: 100%;
}
</style>
