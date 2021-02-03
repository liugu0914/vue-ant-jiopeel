<template>
  <div class="app">
    <router-view />
  </div>
</template>
<script>
import { enquireScreen } from '@/utils/utils'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'App',
  created() {
    enquireScreen(isMobile => this.setDevice(isMobile))
  },
  methods: {
    ...mapMutations('setting', ['setDevice'])
  },
  computed: {
    ...mapState('setting', ['theme', 'weekMode', 'lang'])
  }
}
</script>
<style scoped>
  .app{
    height: 100%;
  }
</style>
