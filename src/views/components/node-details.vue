<template>
  <div class="node-detail">
    <!-- 弹窗 -->
    <modal v-model="visible" title="节点信息" width="100%" top="110" :footer="null" class="node-info" @cancel="closeTask">
      <!-- 节点信息 -->
      <div class="node-data mb-2">
        <a-col>
          <div>节点名称</div>
          <div>{{ nodeInfo.name }}</div>
        </a-col>
        <a-col>
          <div>所属项目</div>
          <div>{{ nodeInfo.projectName }}</div>
        </a-col>
      </div>
      <div class="title mb-2">
        流程信息
      </div>
      <!-- 节点详情 -->
      <a-row :gutter="[0, 16]" class="mb-2" type="flex">
        <a-col :span="12" class="px-3">
          <b>审批人：</b>
          <div v-if="nodeInfo.userName" class="node-userName">
            <span>{{ nodeInfo.userName.join('、 ') }}</span>
          </div>
        </a-col>
        <a-col :span="12" class="px-3">
          <b>状态：</b>
          <a-tag :color="nodeState[nodeInfo.state] && nodeState[nodeInfo.state].color">
            {{ nodeState[nodeInfo.state] && nodeState[nodeInfo.state].name }}
          </a-tag>
        </a-col>
        <a-col :span="12" class="px-3 rmbd">
          <b>成果文件：</b>
          <upload
            :show-upload-list="{showPreviewIcon: true, showRemoveIcon: false}"
            :file-list="nodeInfo.files" />
        </a-col>
        <a-col :span="12" class="px-3 rmbd">
          <b>时间：</b>
          <span>{{ nodeInfo.time }}</span>
        </a-col>
        <a-col :span="24" class="px-3">
          <b>意见：</b>
          <div class="feedback">
            <div v-for="(item, index) in nodeInfo.feedback" :key="index">
              {{ item }}
            </div>
          </div>
        </a-col>
      </a-row>
      <div class="title mb-2">
        当前节点任务情况
      </div>
      <!-- 当前节点任务 -->
      <standard-table :columns="columns" :data-source="dataSource" :loading="loading" :is-search="false" :pagination="false" bordered>
        <!-- 文件 -->
        <upload slot="files" slot-scope="{text}" :file-list="text" :show-upload-list="{showPreviewIcon: true, showRemoveIcon: false}" />
        <!-- 处理结果 -->
        <template slot="state" slot-scope="{text}">
          <a-tag :color="stateArr[text].color" style="width:52px" class="text-center">
            {{ stateArr[text].name }}
          </a-tag>
        </template>
        <template slot="ops" slot-scope="{record}">
          <div class="ops">
            <a-button type="link" size="small" @click="taskVisible = true;taskId = record.id">
              详情
            </a-button>
            <upload :file-list="record.processFiles" style="display:inline-block" :show-upload-list="{ showPreviewIcon: false, showRemoveIcon: false}" />
          </div>
        </template>
      </standard-table>
    </modal>
    <!-- 任务详情 -->
    <task-details :id="taskId" v-model="taskVisible" :task-list="taskTypeList" />
  </div>
</template>

<script>
import TaskDetails from '@/views/pages/work/components/taskDetails.vue'
import StandardTable from '@/components/table/StandardTable'
import Modal from '@/components/modal/Modal.vue'
import Upload from '@/components/upload'
import { columns, stateArr, nodeState } from './constant'
import { getNodeDetail } from '@/api/modules/work/base'
import { downloadUrl } from '@/api/common/upload'
import { getTaskList } from '@/api/modules/approval'

export default {
  components: {
    TaskDetails, StandardTable, Modal, Upload
  },
  model: {
    prop: 'visible'
  },
  props: ['visible', 'nodeId', 'taskTypeList'],
  data() {
    return {
      taskVisible: false,
      columns, stateArr, nodeState,
      loading: false,
      dataSource: [],
      taskId: '',
      nodeInfo: {}
    }
  },
  methods: {
    /**
     * 关闭任务详情
     */
    closeTask() {
      this.$emit('input', false)
      this.taskDataSource = []
    },
    /**
     * 获取节点信息
     */
    async getNodeDetail() {
      const { data = {}} = await getNodeDetail(this.nodeId)
      data.files = data.files.map(file => ({ ...file, uid: file.id, name: file.filename, url: downloadUrl + file.url, status: 'done' }))
      this.nodeInfo = data
    },
    /**
     * 获取节点对应任务列表
     */
    async getTaskList() {
      this.loading = true
      try {
        const { data } = await getTaskList(this.nodeId)
        data.forEach(item => {
          if (item.files.length) item.files.forEach(file => { file.uid = file.id; file.url = downloadUrl + file.url; file.name = file.filename })
          if (item.processFiles.length) item.processFiles = item.processFiles.map(file => ({ ...file, uid: file.id, name: '流程图', url: downloadUrl + file.url, status: 'done' }))
        })
        this.dataSource = data
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    }
  },
  watch: {
    visible(val) {
      if (!val) return
      this.getNodeDetail()
      this.getTaskList()
    }
  }
}
</script>
<style scoped lang="less">
.px-3 {
  display: flex;
  align-items: center;
  & > div {
    flex: 1;
  }
  /deep/ .ant-upload-list-item {
    margin-top: 0;
  }
  .upload {
    overflow: hidden;
  }
}

.title, /deep/ .ant-drawer-title {
  font-size: 18px;
  color: black;
}

.node-info /deep/ .ant-col {
  border: 1px solid #edf0f6;
}

.rmbd {
  border-top: none !important;
  border-bottom: none !important;
}

.node-data {
  display: flex;
  justify-content: space-between;
  .ant-col {
    display: flex;
    width: 49%;
    div {
      display: flex;
      flex: 5;
      justify-content: center;
      align-items: center;
    }
    div:first-child {
      flex: 2;
      padding: 8px 0;
      height: 100%;
      background-color: #fafafa;
      border-right: 1px solid #edf0f6;
    }
  }
}

.ops {
  display: flex;
  justify-content: center;
  align-items: center;
  /deep/ .ant-upload-list-item-list-type-text {
    margin: 0;
  }
  /deep/ .ant-upload-list-item-info {
    padding: 0 7px;
     .anticon-paper-clip {
      display: none;
    }
    a {
      padding: 0;
    }
  }
}
</style>
