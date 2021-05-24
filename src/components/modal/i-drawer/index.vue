<template>
  <a-drawer
    ref="drawer"
    :closable="closable"
    :placement="placement"
    :visible="visible"
    :title="title"
    :width="width"
    :destroy-on-close="destroy"
    :drawer-style="{ ...$options.propsData.drawerStyle,height: topHeight}"
    v-bind="{...$options.propsData}"
    @close="cancel"
  >
    <div
      v-for="(slot,index) in Object.keys($slots)" :key="index" :slot="slot" class="addForm beauty-scroll"
      :style="{height: footer !== null ? `calc(100vh - 55px - 52px - 48px - ${top.toString().indexOf('px') == -1 ? top + 'px' : top})` : '100%'}"
    >
      <slot :name="slot" />
    </div>
    <div v-if="footer !== null" class="drawer-btn-group">
      <a-button :style="{ marginRight: '8px' }" @click="cancel">
        {{ cancelText }}
      </a-button>
      <a-button type="primary" :loading="confirmLoading" @click="ok">
        {{ okText }}
      </a-button>
    </div>
  </a-drawer>
</template>

<script>
export default {
  name: 'IDrawer',
  props: {
    // 控制抽屉显示与隐藏
    visible: Boolean,
    // 定义抽屉的标题
    title: String,
    // 右上角 X 是否显示
    closable: Boolean,
    // 抽屉宽度
    width: {
      type: [String, Number],
      default: 480
    },
    // 取消按钮的文字
    cancelText: {
      type: String,
      default: '取消'
    },
    // 确认按钮文字
    okText: {
      type: String,
      default: '确定'
    },
    // 抽屉位置
    placement: String,
    // 关闭时销毁弹出层内子元素
    destroy: Boolean,
    // 弹出层离顶部距离
    top: [String, Number],
    confirmLoading: Boolean,
    footer: Boolean
  },
  methods: {
    // 点击遮罩层、x或取消按钮时触发
    cancel() {
      this.$emit('cancel')
    },
    // 点击确认按钮时触发
    ok() {
      this.$emit('ok')
    }
  },
  updated() {
    const el = this.$refs.drawer.$vnode.elm
    if (el && el.nodeName === 'DIV') {
      const wrapperContent = el.querySelector('.ant-drawer-content-wrapper')
      if (!wrapperContent || wrapperContent.length === 0 || wrapperContent.style.top) {
        return
      }
      wrapperContent.style.top = this.top.toString().indexOf('px') === -1 ? this.top + 'px' : this.top
    }
  },
  computed: {
    topHeight() {
      const top = this.top.toString().indexOf('px') === -1 ? this.top + 'px' : this.top
      return `calc(100% - ${top})`
    }
  }
}
</script>
<style scoped lang="less">
/deep/ .ant-drawer-body {
  padding: 24px 0;
}

.addForm {
  overflow-y: auto;
  padding: 0 24px;
}

.drawer-btn-group{
    // position: absolute;
    // right: 0;
    // bottom: 0;
    // border-top: 1px solid #f0f0f0;
    width: 100%;
    padding: 10px 24px;
    background:  @component-background;
    text-align: right;
    z-index: 1;
}
</style>
