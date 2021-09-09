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
      <template slot="status" slot-scope="{text, record}">
        <a-tag :color="stateArr[text].color" style="width:52px" class="text-center">
          {{ stateArr[text].name }}
        </a-tag>
        <a-popover v-if="[2,3,4].includes(record.state) && record.taskFeedback && record.taskFeedback.length" placement="right">
          <template slot="content">
            <div v-for="(item, index) in record.taskFeedback" :key="index">
              {{ item.userName }}：{{ item.feedback }}
            </div>
          </template>
          <a-icon type="question-circle" />
        </a-popover>
      </template>
      <!-- 成果文件 -->
      <upload slot="outcomeFile" slot-scope="{record}" :show-upload-list="{showPreviewIcon: true, showRemoveIcon: false}" :file-list="record.files" style="max-width: 300px" />
      <!-- 操作 -->
      <template slot="ops" slot-scope="{record}">
        <div class="ops">
          <a-button v-if="record.state < 3 || record.state == 7 || record.state == 8" type="link" size="small" @click="submitBtn(record)">
            提交
          </a-button>
          <a-button v-if="$hasp('work-uploading-extra')" type="link" size="small" @click="extra(record)">
            拓展
          </a-button>
          <a-popconfirm v-if="record.state == 4 && $hasp('work-uploading-recall')" title="确定撤回该任务？" @confirm="withdraw(record)">
            <a-button type="link" size="small">
              撤回
            </a-button>
          </a-popconfirm>
          <a-button type="link" size="small" @click="visible = true; taskId = record.id">
            详情
          </a-button>
          <upload :file-list="record.processFiles" style="display:inline-block" :show-upload-list="{ showPreviewIcon: false, showRemoveIcon: false}" />
        </div>
      </template>
    </standard-table>
    <!-- 任务提交弹窗 -->
    <modal title="提交任务" :visible="submitVisible" @ok="submit" @cancel="submitVisible = false">
      <a-form-model ref="ruleForm" :model="dataForm">
        <a-form-model-item label="备注" prop="feedback">
          <a-textarea v-model="dataForm.feedback" placeholder="请输入备注" :max-length="500" allow-clear :rows="8" />
        </a-form-model-item>
        <a-form-model-item label="上传文件" prop="files" :rules="{required: true,message: '文件不能为空！'}">
          <upload :file-list="dataForm.files" :multiple="true" :remove="removeFile" @change="onChange">
            <a-button> <a-icon type="upload" /> 上传附件 </a-button>
          </upload>
        </a-form-model-item>
      </a-form-model>
    </modal>
    <!-- 任务详情弹窗 -->
    <task-details :id="taskId" v-model="visible" :task-list="taskTypeList" />
    <!-- 修改拓展项弹窗 -->
    <modal width="50%" title="拓展配置" :visible="extraVisible" @ok="saveExtraData" @cancel="extraVisible = false">
      <a-row>
        <a-col :span="24">
          <div class="space-between mb-2">
            <span style="color: rgba(0, 0, 0, 0.85)">拓展项</span>
            <a-popover trigger="click" placement="left">
              <template slot="content">
                <a-select v-model="fields" mode="multiple" style="width: 200px" placeholder="请选择拓展项" class="mr-2" :filter-option="filterOption">
                  <a-select-option v-for="item in selectFields" :key="item.id" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
                <a-button type="primary" size="small" @click="addField">
                  确定
                </a-button>
              </template>
              <a-button v-if="selectFields && selectFields.length" ref="plus" size="small">
                <a-icon type="plus" />
              </a-button>
            </a-popover>
          </div>
          <standard-table :columns="expandColumns" :data-source="extraForm.nodeTaskExtras" :pagination="false" :is-search="false">
            <a-input v-if="record.extraValueType == 'text'" slot="sort" v-model="record.extraData" slot-scope="{record}" placeholder="请输入文本" />
            <a-input-number v-else slot="sort" v-model="record.extraData" slot-scope="{record}" :min="1" class="w-100" placeholder="请输入数字" />
            <a-popconfirm slot="ops" slot-scope="{record}" title="确定删除该拓展项?" @confirm="delField(record)">
              <a-button type="link" size="small">
                删除
              </a-button>
            </a-popconfirm>
          </standard-table>
        </a-col>
      </a-row>
    </modal>
  </a-card>
</template>

<script>
import { columns, stateArr, expandColumns } from './constant'
import StandardTable from '@/components/table/StandardTable'
import Upload from '@/components/upload'
import Modal from '@/components/modal/Modal'
import { getSysConfigByAlias } from '@/api/modules/sys/dictionary'
import { delFile, downloadUrl } from '@/api/common/upload'
import { getTaskList, saveFile, subMitTask, delFiles, withdrawTask } from '@/api/modules/work/upload'
import TaskDetails from '../components/taskDetails.vue'
import { BoxPage } from '@/utils/tool'
import cloneDeep from 'lodash.clonedeep'
import { getTaskConfigList } from '@/api/modules/pm/taskType'
import { saveExtraData } from '@/api/modules/work/base'

export default {
  components: { StandardTable, Upload, TaskDetails, Modal },
  data() {
    return {
      columns,
      dataSource: [],
      loading: false,
      params: {
        page: {},
        query: {}
      },
      taskTypeList: [], // 任务分类列表
      nodeTree: [], // 节点树
      stateArr, // 任务状态
      visible: false,
      taskId: '',
      submitVisible: false,
      dataForm: {},
      extraForm: { nodeTaskExtras: [] }, // 拓展项表单数据
      extraVisible: false, // 拓展表单开关
      expandField: [], // 拓展项数据
      expandColumns,
      fields: [] // 选择的拓展项
    }
  },
  created() {
    // 获取任务分类列表
    this.getTaskType()
    // 获取任务列表
    this.getTaskList()
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
          if (item.files && item.files.length) item.files = item.files.map(file => ({ ...file, uid: file.id, name: file.filename, url: downloadUrl + file.url, status: 'done' }))
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
     * 文件上传
     */
    async onChange({ file, fileList }) {
      const row = this.dataForm
      row.files = fileList.filter(item => item.status).map(item => {
        if (item.status == 'done' && item.response) {
          const data = item.response.data
          return { ...data, url: downloadUrl + data.url, uid: data.id, name: data.filename, status: 'done' }
        }
        return item
      })
      if (file.status === 'done') {
        row.fileId = row.files.map(item => item.id).join()
        const { status } = await saveFile(row)
        if (status !== 200) {
          const id = file.id
          row.files = row.files.filter(item => item.id !== file.id) || []
          delFile([id])
          return this.$message.error('上传失败')
        }
        this.$message.success('上传成功')
        this.getTaskList()
      }
    },
    /**
     * 删除文件
     */
    async removeFile(file) {
      const row = this.dataForm
      const id = file.id
      row.files = row.files.filter(item => item.id !== file.id) || []
      row.fileId = row.files.map(item => item.id).join()
      const { status, message } = await delFiles(row)
      if (status !== 200) return this.$message.error(message)
      this.$message.success('删除成功')
      delFile([id]) // 删除服务器中存储的文件
      this.getTaskList()
    },
    /**
     * 提交任务
    */
    submit() {
      this.$refs.ruleForm.validate(async val => {
        if (!val) return
        const fileId = this.dataForm.files.map(item => item.id).join()
        const params = { ...this.dataForm, fileId }
        const { status, message } = await subMitTask(params)
        if (status !== 200) return this.$message.error(message)
        this.$message.success('提交成功')
        this.getTaskList()
        this.submitVisible = false
      })
    },
    /**
     * 撤回任务
    */
    async withdraw(row) {
      const { status, message } = await withdrawTask(row)
      if (status !== 200) return this.$message.error(message)
      this.$message.success('撤回成功')
      this.getTaskList()
    },
    /**
     * 搜索
    */
    search(query) {
      this.params.query = query
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
     * 提交任务按钮
     */
    submitBtn(row) {
      this.dataForm = cloneDeep(row)
      this.submitVisible = true
    },
    /**
     * select 搜索
     */
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    /**
     * 添加拓展项
     */
    addField() {
      const fields = this.expandField.filter(item => this.fields.includes(item.id))
      fields.forEach(item => { item.orderNum = ''; item.extraName = item.name; item.extraId = item.id; item.extraValueType = item.valueType; item.id = 'del' + Math.random() })
      this.extraForm.nodeTaskExtras.push(...fields)
      this.fields = []
      this.$refs.plus.$el.click()
    },
    /**
     * 删除拓展项
     */
    delField(item) {
      this.extraForm.nodeTaskExtras = this.extraForm.nodeTaskExtras.filter(field => field.id !== item.id)
    },
    /**
     * 获取任务类型对应拓展项配置
     */
    async getTaskConfigList(params) {
      this.fields = []
      const { data = {}} = await getTaskConfigList(params)
      const arr = cloneDeep(this.extraForm.nodeTaskExtras).map(item => ({ id: item.extraId, name: item.extraName }))
      this.expandField = [...arr, ...data]
    },
    /**
     * 保存拓展配置
     */
    async saveExtraData() {
      const data = cloneDeep(this.extraForm)
      const { id, projectNodeId, nodeTaskExtras, taskId, projectId } = data
      nodeTaskExtras.forEach(item => { if (item.id.includes('del')) delete item.id })
      const params = { id, projectNodeId, nodeTaskExtras, taskId, projectId }
      const { status, message } = await saveExtraData(params)
      if (status == 200) this.$message.success(message)
      this.getTaskList()
      this.extraVisible = false
    },
    extra(row) {
      const { projectId, type: taskType } = row
      this.getTaskConfigList({ projectId, taskType })
      this.extraForm = cloneDeep(row)
      this.extraVisible = true
    }
  },
  computed: {
    selectFields() {
      const extraIds = this.extraForm.nodeTaskExtras.map(item => item.extraId)
      return this.expandField.filter(item => !extraIds.includes(item.id))
    }
  }
}
</script>

<style lang="less" scoped>
.space-between {
  display: flex;
  justify-content: space-between;
  align-content: center;
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
