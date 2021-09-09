<template>
  <a-card>
    <standard-table
      :columns="columns" placeholder="搜索任务名称/项目名称"
      :data-source="dataSource" :loading="loading" :pagination.sync="params.page"
      @search="search" @change="pageChange">
      <!-- 分派人 -->
      <span slot="dispatchUser" slot-scope="{text}">{{ users.find(item => item.id == text) && users.find(item => item.id == text).userName }}</span>
      <!-- 状态 -->
      <template slot="state" slot-scope="{text}" ,>
        <a-tag v-if="!text" color="orange">
          未处理
        </a-tag>
        <a-tag v-if="text == 1" color="green">
          已处理
        </a-tag>
        <a-tag v-if="text == 2" style="width:52px" color="red">
          撤 回
        </a-tag>
      </template>
      <!-- 成果文件 -->
      <upload
        slot="taskFiles" slot-scope="{text}" style="max-width: 150px"
        :show-upload-list="{showPreviewIcon: true, showRemoveIcon: false}" :file-list="text" />
      <!-- 上传附件 -->
      <upload
        slot="files" slot-scope="{text}" style="max-width: 150px"
        :show-upload-list="{showPreviewIcon: true, showRemoveIcon: false}" :file-list="text" />
      <!-- 用时 -->
      <a-tag slot="timeCost" slot-scope="{text}" :color="parseInt(text) < 3 ? 'green': 'red'">
        {{ text }}
      </a-tag>
      <template slot="ops" slot-scope="{record}">
        <div class="ops">
          <a-button v-if="[0,2].includes(record.state) && $hasp('work-assign-handleAssign')" type="link" size="small" @click="handleAssign(record)">
            分派处理
          </a-button>
          <a-popconfirm v-if="!record.apply && record.state == 1 && $hasp('work-assign-withdraw')" title="是否撤回处理？" @confirm="withdraw(record)">
            <a-button type="link" size="small">
              撤回
            </a-button>
          </a-popconfirm>
          <a-button type="link" size="small" @click="visible1 = true;taskId = record.projectNodeTaskId">
            详情
          </a-button>
          <upload :file-list="record.processFiles" style="display:inline-block" :show-upload-list="{ showPreviewIcon: false, showRemoveIcon: false}" />
        </div>
      </template>
    </standard-table>
    <!-- 分派处理弹窗 -->
    <modal :visible="visible" title="分派处理" @ok="handleOk" @cancel="visible = false">
      <a-form-model ref="ruleForm">
        <a-form-model-item label="分派意见">
          <a-textarea v-model="dataForm.feedback" placeholder="请输入分派意见" :max-length="500" allow-clear :rows="8" />
        </a-form-model-item>
        <upload :file-list="dataForm.files" :multiple="true" :remove="removeFile" @change="onChange">
          <a-button> <a-icon type="upload" /> 上传附件 </a-button>
        </upload>
      </a-form-model>
    </modal>
    <!-- 任务详情 -->
    <task-details :id="taskId" v-model="visible1" :task-list="taskTypeList" />
  </a-card>
</template>

<script>
import { columns } from './constant'
import { cloneDeep, BoxPage } from '@/utils/tool'
import StandardTable from '@/components/table/StandardTable'
import Upload from '@/components/upload'
import { getUsers } from '@/api/modules/sys/user'
import Modal from '@/components/modal/Modal'
import { downloadUrl, delFile } from '@/api/common/upload'
import { getAssignTask, handleAssign, withdraw } from '@/api/modules/work/assign'
import { getSysConfigByAlias } from '@/api/modules/sys/dictionary'
import TaskDetails from '../components/taskDetails.vue'

export default {
  components: { StandardTable, Modal, Upload, TaskDetails },
  data() {
    return {
      columns,
      dataSource: [],
      loading: false,
      params: {
        page: {
          total: 0
        },
        query: { }
      },
      users: [],
      dataForm: {},
      visible: false,
      visible1: false,
      taskTypeList: [],
      taskId: ''
    }
  },
  created() {
    this.getAssignTask()
    this.getUsers()
    this.getTaskType()
  },
  methods: {
    /**
     * 搜索
    */
    search(query) {
      this.params.query = query
      this.getAssignTask()
    },
    /**
     * 表格分页
     */
    pageChange(pagination) {
      this.params.page = BoxPage(pagination)
      this.getAssignTask()
    },
    /**
     * 获取分派任务列表
     */
    async getAssignTask() {
      this.loading = true
      try {
        const { data } = await getAssignTask(this.params)
        data.result.forEach(item => {
          if (item.taskFiles.length) item.taskFiles = item.taskFiles.map(file => ({ ...file, uid: file.id, name: file.filename, url: downloadUrl + file.url, status: 'done' }))
          if (item.files.length) item.files = item.files.map(file => ({ ...file, uid: file.id, name: file.filename, url: downloadUrl + file.url, status: 'done' }))
          if (item.processFiles.length) item.processFiles = item.processFiles.map(file => ({ ...file, uid: file.id, name: '流程图', url: downloadUrl + file.url, status: 'done' }))
        })
        this.dataSource = data.result
        this.params.page = BoxPage(data)
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },
    /**
     * 获取用户列表
     */
    async getUsers() {
      const { data = [] } = await getUsers()
      this.users = data
    },
    /**
     * 分派处理按钮
     */
    handleAssign(row) {
      this.dataForm = { ...cloneDeep(row), feedback: '' }
      this.visible = true
    },
    /**
     * 确认
     */
    async handleOk() {
      const { id, taskApplyId, feedback, files, state, projectNodeTaskId } = this.dataForm
      const params = { id, taskApplyId, feedback, fileId: files.map(item => item.id).join(), state, projectNodeTaskId }
      const { status } = await handleAssign(params)
      if (status == 200) this.$message.success('处理成功')
      this.getAssignTask()
      this.visible = false
    },
    /**
     * 文件上传
     */
    async onChange({ file, fileList }) {
      this.dataForm.files = fileList.filter(item => item.status).map(item => {
        if (item.status == 'done' && item.response) {
          const data = item.response.data
          return { ...data, url: downloadUrl + data.url, uid: data.id, name: data.filename, status: 'done' }
        }
        return item
      })
    },
    /**
     * 删除文件
     */
    async removeFile(file) {
      const id = file.id
      this.dataForm.files = this.dataForm.files.filter(item => item.id !== file.id) || []
      this.dataForm.fileId = this.dataForm.files.map(item => item.id).join()
      await delFile([id]) // 删除服务器中存储的文件
      this.$message.success('删除成功')
      this.getAssignTask()
    },
    /**
     * 获取任务分类数据字典
     */
    async getTaskType() {
      const { data = [] } = await getSysConfigByAlias('taskType')
      this.taskTypeList = data
    },
    /**
     * 撤回处理
     */
    async withdraw(row) {
      const { status, message } = await withdraw(row)
      if (status !== 200) return this.$message.err(message)
      this.$message.success(message)
      this.getAssignTask()
    }
  }
}
</script>
<style lang="less" scoped>
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
