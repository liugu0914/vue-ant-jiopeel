<template>
  <!-- 选择坐标地图 -->
  <shade ref="mapSelect" v-model="visible" width="80%" height="80%" @close="$emit('input', false)">
    <Map is-search @mapClick="$emit('mapClick', arguments)" />
  </shade>
</template>

<script>
import Shade from '@/components/shade'
import Map from '@/components/map'
export default {
  name: 'MapSelect',
  model: {
    prop: 'visible'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Shade,
    Map
  }
}
</script>
<style scoped>

</style>
