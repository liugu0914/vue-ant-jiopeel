<template>
  <a-card>
    <standard-table
      :columns="columns" placeholder="搜索任务名称/项目名称"
      :data-source="dataSource" :loading="loading" :pagination.sync="params.page"
      @search="search" @change="pageChange">
      <!-- 任务分类 -->
      <span v-if="taskTypeList.length" slot="type" slot-scope="{text}">
        {{ taskTypeList.find(item => item.value == text) && taskTypeList.find(item => item.value == text).name }}
      </span>
      <!-- 任务状态 -->
      <template slot="status" slot-scope="{text}">
        <a-tag :color="stateArr[text].color" style="width:52px" class="text-center">
          {{ stateArr[text].name }}
        </a-tag>
      </template>
      <!-- 成果文件 -->
      <upload
        slot="outcomeFile" slot-scope="{record}" style="max-width: 150px"
        :show-upload-list="{showPreviewIcon: true, showRemoveIcon: false}" :file-list="record.taskFiles" />
      <!-- 用时 -->
      <a-tag slot="timeCost" slot-scope="{text}" :color="parseInt(text) >= 3 && text.includes('天') ? 'red': 'green'">
        {{ text }}
      </a-tag>
      <!-- 审核意见 -->
      <template slot="taskFeedback" slot-scope="{text}">
        <div v-for="(item, index) in text" :key="index">
          {{ item.userName }}: {{ item.feedback }}
        </div>
      </template>
      <!-- 操作 -->
      <template slot="ops" slot-scope="{record}">
        <div class="ops">
          <a-space v-if="[4, 5].includes(record.state) && !record.apply" :size="0">
            <a-button v-if="record.competence.includes(1) && [0,3].includes(record.assignState) && $hasp('work-apply-apply')" type="link" size="small" @click="apply(record)">
              审核
            </a-button>
            <a-button v-if="record.competence.includes(3) && $hasp('work-apply-assign')" type="link" size="small" @click="assign(record)">
              {{ record.assignState ? '继续分派' : '分派' }}
            </a-button>
          </a-space>
          <a-popconfirm
            v-if="(record.apply || record.assignState) && record.withdraw !== 0 && $hasp('work-apply-recall')"
            placement="topRight" @confirm="withdrawReview(record)" @click.native="message(record)">
            <div slot="title" style="max-width: 180px">
              {{ title }}
            </div>
            <a-button type="link" size="small" class="withdraw">
              撤回
            </a-button>
          </a-popconfirm>
          <a-button type="link" size="small" @click="visible2 = true;taskId = record.projectNodeTaskId">
            详情
          </a-button>
          <upload :file-list="record.processFiles" style="display:inline-block" :show-upload-list="{ showPreviewIcon: false, showRemoveIcon: false}" />
        </div>
      </template>
    </standard-table>
    <!-- 审核弹窗 -->
    <modal :visible="visible" title="审核" @ok="handleOk" @cancel="visible = false">
      <a-form-model ref="ruleForm" :model="dataForm">
        <a-form-model-item label="审核处理" prop="applyType" :rules="{required: true, message:'审核处理不能为空', trigger: 'blur'}">
          <a-radio-group v-model="dataForm.applyType">
            <a-radio value="1">
              通过
            </a-radio>
            <a-radio value="0">
              驳回
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="审核意见" prop="feedback">
          <a-textarea v-model="dataForm.feedback" placeholder="请输入审核意见" :max-length="500" allow-clear :rows="8" />
        </a-form-model-item>
        <a-form-model-item v-if="+dataForm.applyType && dataForm.competence.includes(2) && dataForm.isLast" label="下一个审核人" prop="nextUserId">
          <cascader v-model="dataForm.nextUserId" :filter-user="dataForm.approverUsers" />
        </a-form-model-item>
        <upload :file-list="dataForm.files" :multiple="true" :remove="removeFile" @change="onChange">
          <a-button> <a-icon type="upload" /> 上传附件 </a-button>
        </upload>
      </a-form-model>
    </modal>
    <!-- 分派弹窗 -->
    <modal :visible="visible1" title="分派" @ok="assignUsers" @cancel="visible1 = false">
      <a-form-model ref="assignForm">
        <a-form-model-item label="分派用户">
          <cascader v-model="dataForm.assignUserId" mode="multiple" :filter-user="dataForm.assignUsers" />
        </a-form-model-item>
        <a-form-model-item label="意见" prop="feedback">
          <a-textarea v-model="dataForm.feedback" placeholder="请输入意见" :max-length="255" style="min-height: 150px" />
        </a-form-model-item>
      </a-form-model>
    </modal>
    <!-- 任务详情 -->
    <task-details :id="taskId" v-model="visible2" :task-list="taskTypeList" />
  </a-card>
</template>

<script>
import { columns, stateArr } from './constant'
import StandardTable from '@/components/table/StandardTable'
import Upload from '@/components/upload'
import Modal from '@/components/modal/Modal'
import { getSysConfigByAlias } from '@/api/modules/sys/dictionary'
import { downloadUrl, delFile } from '@/api/common/upload'
import { cloneDeep, BoxPage } from '@/utils/tool'
import { getTaskList, reviewTask, withdrawReview, assignUsers } from '@/api/modules/work/apply'
import { getUsers } from '@/api/modules/sys/user'
import TaskDetails from '../components/taskDetails.vue'
import Cascader from '@/components/cascader'
export default {
  components: { StandardTable, Upload, Modal, TaskDetails, Cascader },
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
      taskTypeList: [], // 任务分类列表
      visible: false, // 审核意见开关
      dataForm: {}, // 审核数据
      users: [], // 用户列表
      stateArr, // 审核状态
      visible1: false, // 分派弹窗开关
      visible2: false, // 任务详情弹窗开关
      taskId: '', // 任务 Id
      title: ''
    }
  },
  created() {
    // 获取任务分类列表
    this.getTaskType()
    // 获取任务列表
    this.getTaskList()
    // 获取用户列表
    this.getUsers()
  },
  methods: {
    /**
     * 获取任务列表
     */
    async getTaskList() {
      this.loading = true
      try {
        const { data } = await getTaskList(this.params)
        data.result.forEach(item => {
          item.isLast = !item.nextUserId
          item.approverUsers = [item.userId]
          item.assignUsers = item.prevAssignUsers ? [...item.prevAssignUsers, item.userId] : [item.userId]
          // item.approverUsers = item.prevApplyUsers ? [...item.prevApplyUsers, item.userId] : [item.userId]
          if (item.taskFiles && item.taskFiles.length) item.taskFiles = item.taskFiles.map(file => ({ ...file, uid: file.id, name: file.filename, url: downloadUrl + file.url, status: 'done' }))
          if (item.processFiles.length) item.processFiles = item.processFiles.map(file => ({ ...file, uid: file.id, name: '流程图', url: downloadUrl + file.url, status: 'done' }))
        })
        this.dataSource = data.result
        this.params.page = BoxPage(data)
        console.log(this.dataSource)
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },
    /**
     * 获取任务分类数据字典
     */
    async getTaskType() {
      const { data = [] } = await getSysConfigByAlias('taskType')
      this.taskTypeList = data
    },
    /**
     * 搜索
    */
    search(query) {
      this.params.query = query
      this.getTaskList()
    },
    /**
     * 确认审核、驳回
    */
    handleOk() {
      this.$refs.ruleForm.validate(async val => {
        if (!val) return
        const { feedback, projectNodeId, projectNodeTaskId, id, applyType, nextUserId, orderNum, files, assignState } = this.dataForm
        const fileId = files.map(item => item.id).join()
        const params = { id, applyType, feedback, projectNodeId, projectNodeTaskId, nextUserId, orderNum, fileId, assignState }
        if (!+applyType) delete params.nextUserId
        const { status, message } = await reviewTask(params)
        if (status == 200) this.$message.success(message)
        this.getTaskList()
        this.visible = false
      })
    },
    /**
     * 审核、驳回
    */
    apply(row) {
      this.dataForm = { ...cloneDeep(row), feedback: '', files: [] }
      this.visible = true
    },
    /**
     * 撤回审核
    */
    async withdrawReview(data) {
      const { status, message } = await withdrawReview(data)
      if (status !== 200) return this.$message.error(message)
      this.$message.success('撤回成功')
      this.getTaskList()
    },
    /**
     * 表格分页
     */
    pageChange(pagination) {
      this.params.page = BoxPage(pagination)
      this.getTaskList()
    },
    /**
     * 分派按钮
     */
    assign(row) {
      this.dataForm = { ...cloneDeep(row), feedback: '' }
      this.visible1 = true
    },
    /**
     * 获取用户列表
     */
    async getUsers() {
      const { data = [] } = await getUsers()
      this.users = data
    },
    /**
     * 分派用户
     */
    async assignUsers() {
      const { id, projectNodeTaskId, assignUserId, projectNodeId, feedback } = this.dataForm
      const params = { id, projectNodeTaskId, assignUserId: assignUserId ? assignUserId.join() : '', projectNodeId, feedback }
      const { status } = await assignUsers(params)
      if (status == 200) this.$message.success('分派成功')
      this.getTaskList()
      this.visible1 = false
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
    },
    /**
     * 筛选用户
     */
    filterUser(input, option) {
      return (option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0)
    },
    /**
     * 提示信息
     */
    message(row) {
      if (row.apply || !row.assignState) return (this.title = '确定撤回审核？')
      const msg1 = '你已分派任务，若撤回，将取消分派，确定撤回？'
      const msg2 = '该任务已有用户处理，若撤回，则清除数据，确定撤回?'
      this.title = row.assignState == 1 ? msg1 : msg2
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
