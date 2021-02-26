<template>
  <component
    :is="type"
    :visible="newValue"
    :title="title"
    :closable="closable"
    :width="width"
    :top="top"
    :placemen="placement"
    :destroy="destroy"
    :centered="centered"
    :cancel-text="cancelText"
    :ok-text="okText"
    :footer="footer"
    :confirm-loading="confirmLoading"
    v-bind="{...$options.propsData}"
    @close="cancel"
    @cancel="cancel"
    @ok="ok"
  >
    <template v-for="slot in Object.keys($slots)" :slot="slot">
      <slot :name="slot" />
    </template>
  </component>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    type: {
      type: [String],
      default: 'IDrawer' // IDrawer IModal
    },
    value: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    title: [String, Function],
    closable: {
      type: Boolean,
      default: true
    },
    width: [String, Number],
    top: {
      type: [String, Number],
      default: 0
    },
    placement: String,
    destroy: {
      type: Boolean,
      default: true
    },
    centered: {
      type: Boolean,
      default: true
    },
    cancelText: String,
    okText: String,
    footer: String,
    confirmLoading: Boolean
  },
  components: {
    IDrawer: () => import('./i-drawer'),
    IModal: () => import('./i-modal')
  },
  computed: {
    newValue() {
      return this.value && typeof this.value === 'boolean' ? this.value : this.visible
    }
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    },
    ok() {
      this.$emit('ok')
    }
  }
}
</script>
<style scoped></style>
