<template>
  <a-upload-dragger
    v-if="type === 'drop'"
    v-bind="props"
    @change="change"
  >
    <slot />
  </a-upload-dragger>

  <a-upload
    v-else
    v-bind="props"
    @change="change"
  >
    <slot />
  </a-upload>
</template>

<script>
import { uploadFileUrl } from '@/api/common/upload'
export default {
  props: {
    type: {
      type: String
    },
    name: {
      type: String,
      default: 'file'
    },
    action: {
      type: String,
      default: uploadFileUrl
    },
    headers: {
      type: Object,
      default: () => ({})
    },
    beforeUpload: {
      type: Function
    },
    showUploadList: {
      type: [Boolean, Object],
      default: true
    },
    remove: {
      type: Function
    },
    fileList: {
      type: Array
    },
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    listType: {
      type: String
    },
    method: {
      type: String,
      default: 'post'
    }
  },
  methods: {
    change(file) {
      this.$emit('change', file)
    }
  },
  computed: {
    header() {
      const obj = {}
      const token = this.$store.getters['account/token']
      obj[process.env.VUE_APP_ACCESS_TOKEN_KEY] = token
      return JSON.stringify(this.headers) === '{}' ? obj : this.headers
    },
    props() {
      const obj = { }
      Object.keys(this.$props).forEach(prop => {
        if (this.$props[prop] !== undefined && this.$props[prop] !== null) {
          obj[prop] = this.$props[prop]
        }
      })
      obj.headers = this.header
      console.log(obj)
      return obj
    }
  }
}
</script>
<style scoped>

</style>
