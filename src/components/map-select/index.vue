<template>
  <!-- 选择坐标地图 -->
  <shade :visible.sync="visible" width="80%" height="600px">
    <Map @mapClick="$emit('mapClick', arguments)" />
  </shade>
</template>

<script>
import Shade from '@/components/shade'
import Map from '@/components/map'
export default {
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
