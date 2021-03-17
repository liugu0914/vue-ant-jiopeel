<template>
  <div :class="['permission-item',color]">
    <span>{{ message }}</span>
    <div class="permission-item-action">
      <slot v-if="hasSlot" />
      <template v-else>
        <a-tooltip title="编辑">
          <a>
            <a-icon type="edit" style="margin-right:4px" @click="edit" />
          </a>
        </a-tooltip>
        <a-popconfirm title="是否确认删除?" @confirm="del">
          <a-tooltip title="删除">
            <a>
              <a-icon type="delete" />
            </a>
          </a-tooltip>
        </a-popconfirm>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ActionAlert',
  props: {
    message: String,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    edit() {
      this.$emit('edit')
    },
    del() {
      this.$emit('delete')
    }
  },
  computed: {
    hasSlot() {
      return this.$slots.default
    },
    color() {
      return this.disabled ? 'gray' : 'normal'
    }
  }
}
</script>
<style scoped lang="less">
  .normal{
    background-color: @blue-1;
  }
  .gray{
    background-color:  @gray-5;
  }
  .permission-item{
    margin: 0;
    line-height: 1.5;
    list-style: none;
    position: relative;
    padding: 8px 16px;
    border-radius: @border-radius-base;
    overflow: auto;
    .permission-item-action{
      float: right;
      // padding: 8px 16px;
      // position: absolute;
      // top: 0;
      // right: 0;
    }
  }
</style>
