<template>
  <a-popover placement="bottom">
    <template slot="content">
      <a-input-search v-model="value" class="mb-2" @change="$emit('search', value)" />
      <a-row class="iconBox beauty-scroll" :gutter="[20, 20]">
        <a-col v-for="item in iconList" :key="item" :span="6">
          <a-card hoverable style="height: 50px" @click="$emit('select', item)">
            <my-icon v-if="type === 'icon'" :type="item" />
            <img v-else :src="item">
          </a-card>
        </a-col>
      </a-row>
    </template>
    <slot />
  </a-popover>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'icon'
    },
    iconList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      value: ''
    }
  }
}
</script>
<style scoped lang="less">
/deep/ .ant-card-body {
  padding: 0;
  height: 100%;
  font-size: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  i {
    height: 28px;
  }
  img {
    width: 28px;
    height: 28px;
  }
}
.iconBox {
  width: 280px;
  height: 280px;
  overflow-y: auto;
}
</style>
