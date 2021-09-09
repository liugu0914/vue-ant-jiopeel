<template>
  <div class="upload">
    <a-upload-dragger
      v-if="mode === 'drop'"
      v-bind="props"
      :before-upload="beforeUpload"
      @change="change"
      @preview="preview"
    >
      <slot />
    </a-upload-dragger>

    <a-upload
      v-else
      v-bind="props"
      :before-upload="beforeUpload"
      @change="change"
      @preview="preview"
    >
      <slot />
    </a-upload>

    <!-- 文件预览 -->
    <shade ref="shade" v-model="isPreview" width="100%" height="100%" :bgc="type !== 'pdf' ? '#fff' : ''" :close="!box">
      <viewer v-if="['jpg', 'png', 'jpeg'].includes(type) && box" ref="viewer" :images="[src]" class="viewer" @inited="inited">
        <template #default="scope">
          <img v-for="url in scope.images" :key="url" :src="url">
        </template>
      </viewer>
      <template v-if="type==='pdf'">
        <div class="pdf beauty-scroll">
          <iframe :src="src" frameborder="0" style="width: 100%; height: 100%;" />
        </div>
      </template>
      <div v-if="type==='html'" class="content" v-html="src" />
      <a-textarea v-if="type==='txt'" v-model="src" style="height: 100%; border:none;resize:none" read-only class="beauty-scroll" />
      <div slot="footer" class="downFile">
        <a-button type="primary" @click="downFile">
          下载原文件
        </a-button>
        <div v-show="hasTab" class="tab">
          <a href="javascript:;" class="left" @click.prevent="prev">
            <a-icon type="left" />
          </a>
          <div class="tab-item" :style="{transform: `translateX(${translate}px)`}" />
          <a href="javascript:;" class="right" @click="next">
            <a-icon type="right" />
          </a>
        </div>
      </div>
    </shade>
  </div>
</template>

<script>
import { uploadFileUrl, downloadUrl, toPdfFile } from '@/api/common/upload'
import shade from '@/components/shade'
import { urlTransition } from '@/utils/tool'
import 'viewerjs/dist/viewer.css'
import { component as Viewer } from 'v-viewer'

export default {
  components: {
    shade,
    Viewer
    // pdf
  },
  props: {
    mode: {
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
    fileList: {
      type: Array
    },
    fileType: {
      type: [String, Array],
      default: 'all'
    },
    showUploadList: {
      type: [Boolean, Object],
      default: true
    },
    remove: {
      type: Function
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
  data() {
    return {
      isPreview: false, // 弹窗开关
      src: '', // 文件路径或html字符串
      type: '', // 文件类型
      pageCount: 1, // pdf总页数
      file: '', // 文件下载地址
      flag: false, // 节流阀
      box: null, // dom 挂载盒子
      translate: 0, // 移动距离
      hasTab: false
    }
  },
  methods: {
    change(file) {
      if (file.file.status === 'error') {
        const { response } = file.file
        this.$message.error(response.message)
      }
      this.$emit('change', file)
    },
    /**
     * 文件预览
     * @date 2021-6-2 11:00:00
     * @author zxp
     */
    preview(file) {
      this.$emit('preview', file)
      const { type, url, id, status } = file
      if (status == 'error' || status == 'removed') return
      const isImg = ['jpg', 'png', 'jpeg'].includes(type)
      const typeArr = ['xlsx', 'xls', 'docx', 'doc', 'pptx', 'ppt']
      this.file = file
      this.type = type
      this.box = document.querySelector('#preivew')
      this.domMount() // dom挂载
      if (typeArr.includes(type)) return this.toPdfFile(id)
      if (isImg && !this.box) return this.$viewerApi({ images: [url] })
      if (isImg) this.src = url
      if (type === 'pdf') this.src = url
      if (type === 'txt') urlTransition(url, 'text', res => (this.src = res))
      this.isPreview = true
    },
    /**
     * 文件上传前的回调
     * @date 2021-05-31 14:40:00
     * @author zxp
     */
    beforeUpload(file) {
      const checkObj = {
        'all': ['jpg', 'jpeg', 'png', 'xls', 'xlsx', 'doc', 'docx', 'pdf', 'pptx', 'txt'],
        'excel': ['xls', 'xlsx'],
        'word': ['doc', 'docx'],
        'img': ['jpg', 'jpeg', 'png']
      }
      const size = file.size / 1024 / 1024
      const fileType = this.fileType
      const typeArr = typeof fileType === 'string' ? checkObj[fileType] : fileType.reduce((arr, curr) => {
        arr = arr.concat(checkObj[curr])
        return arr
      }, [])
      const message = typeArr.join('、')
      if (!typeArr.some(item => file.name.indexOf(item) !== -1)) {
        this.$message.error(`请选择 ${message} 文件进行上传！`)
        return false
      }
      if (size > 150) {
        this.$message.error('上传的文件不能超过150MB!')
        return false
      }
      return true
    },
    /**
     * word、excel、ppt 文件转pdf
     * @date 2021-6-4 9:00:00
     * @author zxp
     */
    async toPdfFile(id) {
      if (this.flag) return this.$message.warning('正在加载文件请勿重复点击')
      this.flag = true
      this.src = ''
      try {
        const { data } = await toPdfFile(id)
        const url = downloadUrl + data.url
        this.type = data.type
        // if (data.type === 'pdf') await this.initPdf(url)
        if (data.type === 'pdf') (this.src = url)
        if (data.type === 'html') {
          urlTransition(url, 'document', res => {
            this.src = res.body.innerHTML
            const tab = document.querySelector('.tab-item')
            const center = res.body.querySelector('center')
            if (!center) return
            this.hasTab = true
            const tabItems = center.querySelectorAll('a')
            tabItems.forEach((item, index) => {
              item.className = index ? '' : 'active'
              item.onclick = e => {
                tabItems.forEach(item => (item.className = ''))
                e.target.className = 'active'
              }
              tab.appendChild(item)
            })
          })
        }
        this.isPreview = true
      } catch (err) {
        this.$message.error('文件预览失败！请稍后再试')
        console.log(err)
      } finally {
        this.flag = false
      }
    },
    /**
     * 文件下载
     * @date 2021-6-4 15:00:00
     * @author zxp
     */
    downFile() {
      const a = document.createElement('a')
      urlTransition(this.file.url, 'blob', blob => {
        a.href = URL.createObjectURL(blob)
        document.body.appendChild(a)
        a.download = this.file.name
        a.click()
        URL.revokeObjectURL(a.href) // 释放URL 对象
        a.remove()
      })
    },
    /**
     *  viewer 组件初始化
     */
    inited(viewer) {
      this.$viewer = viewer
    },
    /**
     * dom 挂载页面预览
     */
    domMount() {
      if (!this.box) return
      // 删除前一个 shade 盒子
      const shade = this.box.querySelector('.Shade')
      shade && this.box.removeChild(shade)
      this.isPreview = true
      // 挂载新的 shade 盒子
      setTimeout(() => {
        const shade = this.$refs.shade.$el
        shade.style.position = 'absolute'
        this.box.appendChild(shade)
      })
    },
    /**
   * 左滑
   */
    prev() {
      const tab = document.querySelector('.tab')
      const move = tab.clientWidth - 60
      this.translate = (this.translate + move) >= 0 ? 0 : this.translate + move
    },
    next() {
      const tab = document.querySelector('.tab')
      const tabItem = document.querySelector('.tab .tab-item')
      const move = tab.clientWidth - 60
      const width = tabItem.clientWidth - move
      const lastmove = width % move
      if (Math.abs(this.translate) >= width) return
      this.translate = Math.abs((this.translate - move)) > width ? this.translate - lastmove : this.translate - move
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
      return obj
    }
  }
}
</script>
<style scoped lang="less">
.downFile {
  position: absolute;
  width: 100%;
  bottom: 0;
  background: #e6e6e6;
  /deep/ .tab {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 30px;
    height: 40px;
    overflow: hidden;
    a {
      display: flex;
      align-items: center;
      padding: 0 12px;
      height: 100%;
      color: #000;
    }
    .active {
      color: #217346;
      background-color: #e6f7ff;
    }
    .tab-item {
      display: flex;
      align-items: center;
      height: 100%;
      white-space: nowrap;
      transition: transform .8s;
    }
    .left, .right {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;
      top: 0;
      width: 30px;
      height: 100%;
      background-color: #e6e6e6;
      z-index: 1;
    }
    .left {
      left: 0;
    }
    .right {
      right: 0;
    }
  }
  button {
    position: absolute;
    right: 20px;
    bottom: calc(100% + 10px);
  }
}
.tools {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 56px;
  color: #fff;
  background-color: #323639;
  .title {
    position: absolute;
    left: 0;
  }
  .btns {
    display: flex;
    align-items: center;
    i {
      cursor: pointer;
    }
  }
}
.pdf {
  // height: calc(100% - 56px);
  height: 100%;
  // overflow-y: auto;
  background-color: #525659;
  .box {
    margin: 0 auto;
  }
}

/deep/ .content {
  padding-bottom: 60px;
  // overflow: hidden;
  center, hr {
    display: none;
  }
  table {
      width: auto;
      margin: auto;
      border: 1px solid #000;
    td {
      text-align: center;
      width: auto;
      border: 1px solid #000;
      min-width: 80px;
      max-width: 220px;
    }
  }
  img {
    display: none;
  }
}

.viewer {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
}

/deep/ .ant-spin-nested-loading {
  height: 100%;
  .ant-spin-container {
    height: 100%;
  }
}
</style>
