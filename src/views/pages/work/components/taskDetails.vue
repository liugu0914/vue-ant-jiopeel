<template>
  <modal :visible="visible" title="查看任务详情" :top="110" width="100%" :footer="null" @cancel="$emit('input', false)">
    <a-row style="height: 100%">
      <a-col :span="12" class="task-detail">
        <div class="title">
          <span>任务信息</span>
          <a-button class="export" type="primary" style="margin-right: 25%" size="small" @click="print">
            导出
          </a-button>
        </div>
        <div class="task-info">
          <a-col :span="12">
            <b class="mr-3">任务名称</b>
            <span class="pr-2">{{ taskData.name }}</span>
          </a-col>
          <a-col :span="12">
            <b class="mr-3">任务分类</b>
            <span>
              {{ taskList.find(item => item.value === taskData.type) && taskList.find(item => item.value === taskData.type).name }}
            </span>
          </a-col>
        </div>
        <div class="task-info">
          <a-col :span="12">
            <b class="mr-3">所属节点</b>
            <span>{{ taskData.nodeName }}</span>
          </a-col>
          <a-col :span="12">
            <b class="mr-3">所属项目</b>
            <span>{{ taskData.projectName }}</span>
          </a-col>
        </div>
        <div class="title mt-2">
          流程信息
        </div>
        <a-timeline class="pl-3 pt-3 flow-info">
          <!-- 历史日志 -->
          <a-timeline-item v-for="item in flowData" :key="item.id" color="green">
            <a-row>
              <a-col :span="14" class="pr-2">
                <b>{{ item.userName }}
                  {{ item.type == 2 && item.typeState == 2 ? '分派任务':
                    item.type == 2 && item.typeState == 6 ? '撤回分派':
                    item.type == 1 && item.typeState == 8 ? '撤回提交':
                    item.type == 2 && item.typeState == 5 ? '撤回审核' : typeMap[item.type] }}</b>
              </a-col>
              <a-col :span="10">
                <b class="mr-1">结果</b>
                <a-tag v-if="item.type !== 3" :color="obj[item.type][item.typeState].color" style="width:52px" class="text-center">
                  {{ obj[item.type][item.typeState].name }}
                </a-tag>
                <a-tag v-else :color="assignState[item.typeState].color" style="width:52px" class="text-center">
                  {{ assignState[item.typeState].name }}
                </a-tag>
              </a-col>
            </a-row>
            <a-row style="font-size:12px">
              <a-col :span="14" class="pr-2 pt-2">
                <!-- 上传文件 -->
                <upload :show-upload-list="{showPreviewIcon: true, showRemoveIcon: false}" :file-list="item.files" />
                <!-- 删除文件 -->
                <ul v-for="file in item.delFiles" :key="file.id" class="del-files">
                  <li class="mt-1">
                    <a-icon type="paper-clip" />
                    <s>{{ file.filename }}</s>
                  </li>
                </ul>
                <!-- 意见 -->
                <div v-if="item.feedback" class="feedback">
                  <div class="idea">
                    <b style="width:40px">意见：</b><span v-overflow style="flex:1">{{ item.feedback }}</span>
                  </div>
                  <!-- 显示全部意见 -->
                  <div class="view text-right pr-2">
                    <a href="javascript:;" class="seeAll" @click="show">查看全部</a>
                    <a href="javascript:;" class="pack" @click="show">收起</a>
                  </div>
                </div>

                <!-- 指派 -->
                <div v-if="item.nextUserName && item.typeState == 1">
                  <b>流转：</b>
                  <span>{{ item.nextUserName }}</span>
                </div>
                <!-- 分派 -->
                <div v-if="item.targetUserName" style="display:flex">
                  <b>分派：</b>
                  <div>
                    <p v-for="name in item.targetUserName.split(',')" :key="name" color="orange" style="margin: 0">
                      {{ name }}
                    </p>
                  </div>
                </div>
              </a-col>
              <a-col :span="10" class="pt-2">
                <span v-if="item.createTime"><b>时间：</b>{{ item.createTime }}</span><br>
                <span v-if="item.timeCost"><b>用时：</b>{{ item.timeCost }}</span>
              </a-col>
            </a-row>
          </a-timeline-item>
          <!-- 当前阶段 -->
          <a-timeline-item v-for="(item,index) in pendingList" :key="index">
            <a-icon slot="dot" type="clock-circle" />
            <a-row>
              <a-col :span="14" class="pr-2">
                <b>{{ item.userName }}
                  {{ item.type == 2 && item.typeState == 2 ? '分派任务':
                    item.type == 1 && item.typeState == 8 ? '撤回提交':
                    item.type == 2 && item.typeState == 5 ? '撤回审核' : typeMap[item.type] }}</b>
              </a-col>
              <a-col :span="10">
                <b class="mr-1">结果</b>
                <a-tag v-if="item.type !== 3" :color="obj[item.type][item.typeState].color" style="width:52px" class="text-center">
                  {{ obj[item.type][item.typeState].name }}
                </a-tag>
                <a-tag v-if="item.type == 3 && item.typeState" color="#008700">
                  已处理
                </a-tag>
                <a-tag v-if="item.type == 3 && !item.typeState" color="#2db7f5">
                  待处理
                </a-tag>
              </a-col>
            </a-row>
          </a-timeline-item>
          <!-- 任务完成 -->
          <a-timeline-item v-if="taskData.state == 6">
            <a-icon slot="dot" type="check-circle" style="color: green" />
            <b>任务完成</b>
          </a-timeline-item>
        </a-timeline>
      </a-col>
      <a-col :span="12" style="height: 100%">
        <div class="title">
          <span class="ml-3 file-name">{{ fileName }}</span>
          <div v-if="fileName" style="font-size:12px;font-weight:400">
            文件预览<a-icon type="fullscreen" style="cursor:pointer" class="ml-2" @click="fullscreen" />
          </div>
        </div>
        <div id="preivew" class="preivew">
          <a-icon type="fullscreen-exit" class="close" @click="fullscreen" />
        </div>
      </a-col>
    </a-row>
    <!-- 打印盒子 -->
    <div ref="print" class="print" />
  </modal>
</template>

<script>
import Modal from '@/components/modal/Modal.vue'
import { getTaskDetail } from '@/api/modules/work/base'
import { typeMap, obj, assignState } from './constant'
import { downloadUrl } from '@/api/common/upload'
import Upload from '@/components/upload'

export default {
  components: { Modal, Upload },
  model: {
    prop: 'visible'
  },
  props: {
    visible: Boolean,
    id: String,
    taskList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      taskData: {},
      flowData: [],
      pendingList: [],
      typeMap,
      obj,
      fileName: '',
      assignState
    }
  },
  methods: {
    /**
     * 获取任务详情
     */
    async getTaskDetail() {
      const { data = {}} = await getTaskDetail(this.id)
      if (!data.taskLog || !data.taskLog.length) data.taskLog = []
      data.taskLog.forEach(item => {
        if (item.files && item.files.length) {
          item.delFiles = item.files.filter(file => file.del == '1')
          item.files = item.files.filter(item => item.del !== '1').map(file => ({ ...file, uid: file.id, name: file.filename, url: downloadUrl + file.url }))
        }
      })
      this.taskData = data.taskInfo
      this.flowData = data.taskLog
      this.pendingList = data.pendingList
    },
    /**
     * 全屏预览
     */
    fullscreen() {
      const preivew = document.querySelector('#preivew')
      const shade = document.querySelectorAll('.Shade')[document.querySelectorAll('.Shade').length - 1]
      if (!shade) return
      const viewer = shade.querySelector('.viewer')
      const isImg = viewer && viewer.querySelector('img')
      if (isImg) return isImg.click()
      preivew.className = preivew.className == 'preivew' ? 'fullscreen' : 'preivew'
    },
    /**
     * 打印pdf
     */
    print() {
      const print = document.querySelector('.print')
      document.body.appendChild(print)
      const box = document.querySelector('.task-detail').cloneNode(true)
      const btn = box.querySelector('.export')
      const shows = box.querySelectorAll('.feedback')
      const views = box.querySelectorAll('.view')
      shows && shows.forEach(item => (item.className = 'feedback'))
      views && views.forEach(item => (item.style.display = 'none'))
      print.style.position = 'static'
      box.style.height = 'auto'
      btn.style.display = 'none'
      print.style.display = 'block'
      box.style.width = '100%'
      print.appendChild(box)
      this.$print(this.$refs.print)
      print.style.display = 'none'
      print.removeChild(box)
    },
    /**
     * 查看全部
     */
    show(e) {
      const parent = e.target.parentNode.parentNode
      parent.className = parent.className.includes('show') ? 'feedback packUp' : 'feedback show'
    }
  },
  watch: {
    async visible(val) {
      if (val) {
        await this.getTaskDetail()
        this.$nextTick(() => {
          const a = document.querySelectorAll('.flow-info .upload a')
          a.forEach(a => (a.onclick = () => (this.fileName = a.innerHTML)))
          a[0] && a[0].click()
        })
      } else {
        this.taskData = {}
        this.flowData = []
        this.pendingList = []
        this.fileName = ''
      }
    }
  },
  directives: {
    overflow: {
      inserted(el) {
        const height = el.clientHeight
        const parent = el.parentNode.parentNode
        if (height > 54) parent.classList.add('show')
      }
    }
  }
}
</script>
<style scoped lang="less">
/deep/ .ant-drawer-title {
  font-size: 18px;
  font-weight: 700;
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 700;
}

.task-info {
  display: flex;
  align-items: center;
  padding: 0 30px;
  min-height: 40px;
  .ant-col {
    display: flex;
    align-items: center;
    span {
      flex: 1;
    }
  }
}

.task-detail {
  display: flex;
  flex-direction: column;
  height: 100%;
  .ant-timeline-item {
    padding: 0 0 15px;
  }
}

.flow-info {
  flex: 1;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
}

#preivew {
  position: relative;
  height: calc(100% - 34px);
  z-index: 10;
  .close {
    position: absolute;
    display: none;
    top: 20px;
    right: 10px;
    cursor: pointer;
    font-size: 16px;
    color: @primary-color;
    z-index: 2000;
  }
  &.fullscreen {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    .close {
      display: block;
    }
  }
}

.del-files {
  padding: 0;
  li {
    position: relative;
    padding-left: 26px;
    height: 21px;
    line-height: 21px;
    list-style: none;
    i {
      position: absolute;
      top: 5px;
      left: 4px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
    }
  }
}

.print {
  position: fixed;
  display: none;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 20;
}

.file-name {
  font-size:14px;
  color: @primary-color;
  font-weight:400
}

/deep/ .ant-upload-list-item {
  margin-top: 0;
  font-size: 12px;
}

.feedback {
  .seeAll {
    display: none;
  }
  .pack {
    display: none;
  }
}

.show {
  .seeAll {
    display: block;
  }
  .pack {
    display: none;
  }
  span {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.packUp {
  .seeAll {
    display: none;
  }
  .pack {
    display: block;
  }
}

.idea {
  display: flex;
}
</style>
