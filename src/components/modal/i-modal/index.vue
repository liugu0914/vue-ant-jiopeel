<template>
  <a-modal
    :visible="visible"
    :title="title"
    :cancel-text="cancelText"
    :ok-text="okText"
    :width="width"
    :closable="closable"
    :destroy-on-close="destroy"
    :centered="centered"
    :footer="footer"
    :confirm-loading="confirmLoading"
    v-bind="{...$options.propsData}"
    @cancel="cancel"
    @ok="ok"
  >
    <template v-for="slot in Object.keys($slots)" :slot="slot">
      <slot :name="slot" />
    </template>
  </a-modal>
</template>
<script>
export default {
  name: 'IModal',
  props: {
    // 控制 modal 的显示与隐藏
    visible: Boolean,
    // 标题
    title: String,
    // 取消按钮的文字
    cancelText: String,
    // 确认按钮文字
    okText: String,
    // modal 宽度
    width: {
      type: [String, Number]
    },
    // 是否显示右上角 x
    closable: {
      type: Boolean
    },
    // 关闭 modal 时是否销毁子元素
    destroy: Boolean,
    // modal 是否垂直居中显示
    centered: Boolean,
    // 底部内容，当不需要默认底部按钮时，可以设为 null
    footer: String,
    confirmLoading: Boolean
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
  }
}
</script>
