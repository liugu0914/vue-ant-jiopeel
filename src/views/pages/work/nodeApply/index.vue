<template>
  <a-card>
    <standard-table
      :columns="columns"
      placeholder="搜索项目名称/项目编号"
      :data-source="dataSource"
      :pagination.sync="params.page"
      :loading="loading"
      @change="onChange"
      @search="onSearch"
    >
      <!-- 任务状态 -->
      <template slot="state" slot-scope="{text}">
        <!-- 待审批,已审批 -->
        <a-tag v-if="text === 3" color="green">
          已审批
        </a-tag>
        <a-tag v-else color="red">
          待审批
        </a-tag>
      </template>
      <!-- 操作 -->
      <template slot="useTime" slot-scope="{text}">
        <a-tag v-if="text" color="green">
          {{ text }}
        </a-tag>
      </template>
      <!-- 操作 -->
      <template slot="ops" slot-scope="{record}">
        <a-button v-if="$hasp('work-nodeApply-apply') && record.state === 2" type="link" size="small" @click="openApply(record)">
          审批
        </a-button>
        <a-button type="link" size="small" @click="viewDetail(record)">
          详情
        </a-button>
      </template>
    </standard-table>
    <!-- 弹窗 -->
    <modal
      v-model="visible"
      width="80%"
      :confirm-loading="confirmLoading"
      ok-text="审批通过" cancel-text="取消" :title="title"
      @ok="handleOk"
      @cancel="handleCancel">
      <standard-table
        :is-search="false"
        :pagination="false"
        :columns="taskColumns"
        :data-source="taskData"
        :loading="taskLoading"
      >
        <!-- 文件 -->
        <template slot="files" slot-scope="{ record }">
          <upload :file-list="record.files" :show-upload-list="{ showPreviewIcon: true, showRemoveIcon: false}" />
        </template>
        <!-- 任务状态 -->
        <template slot="state" slot-scope="{text}">
          <!-- 待审批,已审批 -->
          <a-tag v-if="text === 6" color="green">
            通过
          </a-tag>
          <a-tag v-else color="red">
            未通过
          </a-tag>
        </template>
        <template slot="ops" slot-scope="{record}">
          <div class="ops">
            <a-button type="link" size="small" @click="visible1 = true;taskId = record.id">
              详情
            </a-button>
            <upload :file-list="record.processFiles" style="display:inline-block" :show-upload-list="{ showPreviewIcon: false, showRemoveIcon: false}" />
          </div>
        </template>
      </standard-table>
      <a-row :gutter="[16,16]" class="mt-2">
        <a-form-model ref="ruleForm" :model="dataForm" layout="vertical">
          <a-col :span="24">
            <a-form-model-item
              label="上传附件">
              <upload :file-list="files" class="upload-list-inline" list-type="picture" :multiple="true" @change="file => onFileChange(file)">
                <a-button>
                  <a-icon type="upload" />上传
                </a-button>
              </upload>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              :rules=" { required: false, message: '备注不能为空', trigger: 'blur' }"
              label="备注" prop="remark">
              <a-textarea v-model="dataForm.remark" placeholder="备注" :rows="5" :max-length="500" allow-clear />
            </a-form-model-item>
          </a-col>
          <a-col v-if="enableNextApplyUser==='1'" :span="24">
            <a-form-model-item
              :rules=" { required: true, message: '下个节点审批人不能为空', trigger: 'blur' }"
              label="下个节点审批人" prop="nextUserId">
              <cascader v-model="dataForm.nextUserId" mode="multiple" />
            </a-form-model-item>
          </a-col>
        </a-form-model>
      </a-row>
    </modal>
    <!-- 任务详情 -->
    <task-details :id="taskId" v-model="visible1" :task-list="taskTypeList" />
    <!-- 节点详情 -->
    <node-details v-model="visible2" :node-id="nodeId" :task-type-list="taskTypeList" />
  </a-card>
</template>

<script>
import { BoxPage, cloneDeep } from '@/utils/tool'
import StandardTable from '@/components/table/StandardTable'
import Modal from '@/components/modal/Modal'
import Upload from '@/components/upload'
import { getListPage, getTasks, nodeApply, getOneById } from '@/api/modules/work/projectNode'
import { columns, taskColumns, defaultForm } from './constant'
import { downloadUrl } from '@/api/common/upload'
import { getUsers } from '@/api/modules/sys/user'
import TaskDetails from '../components/taskDetails.vue'
import { getSysConfigByAlias } from '@/api/modules/sys/dictionary'
import Cascader from '@/components/cascader'
import NodeDetails from '@/views/components/node-details.vue'

export default {
  components: { StandardTable, Modal, Upload, TaskDetails, Cascader, NodeDetails },
  data() {
    return {
      loading: false, // 表格加载
      columns, // 表字段
      params: { // 分页查询
        page: {}, // 分页数据
        query: { nodeState: ['2'] } // 查询数据
      },
      dataSource: [], // 数据行

      title: '审批',
      files: [], // 文件
      users: [], // 用户
      enableNextApplyUser: '0', // 是否设置下个审批人
      dataForm: cloneDeep(defaultForm), // 单条数据显示
      visible: false, // 弹窗控制
      confirmLoading: false, // 确认按钮控制
      taskLoading: false, // 任务加载
      taskData: [], // 任务行
      taskColumns, // 任务字段
      visible1: false,
      taskId: '',
      taskTypeList: [],
      nodeId: '',
      visible2: false
    }
  },
  created() {
    this.queryPage()
    this.getUsers()
    this.getTaskType()
  },
  methods: {
    /**
     * 分页查询
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    queryPage() {
      this.loading = true
      getListPage(this.params).then(res => {
        const { data } = res
        const result = data.result || []
        this.params.page = BoxPage(data)
        this.dataSource = result
      }).over().finally(() => {
        setTimeout(() => {
          this.loading = false
        }, 0)
      })
    },
    /**
     * 获取用户
     * @date 2021-6-18 10:08:30
     * @author lyc
     */
    getUsers() {
      getUsers().then(res => {
        const { data = [] } = res
        this.users = data
        console.log(this.users)
      }).over()
    },
    /**
     * 选择用户
     * @date 2021-6-18 10:08:30
     * @author lyc
     */
    userChange(value) {
      const nextUserId = value.join(',')
      if (nextUserId) {
        this.dataForm.nextUserId = nextUserId
      }
    },
    /**
     * 搜索
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    onSearch(conditions) {
      this.params.query = conditions
      this.queryPage()
    },
    /**
     * 分页变化
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    onChange(pagination) {
      this.params.page = BoxPage(pagination)
      this.queryPage()
    },
    /**
     * 打开审批
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    openApply(record) {
      this.taskLoading = true
      const Id = record.id
      getOneById(Id).then(res => {
        const { data = {}} = res
        this.dataForm.remark = data.remark
        this.dataForm.resultFileId = data.resultFileId
        this.dataForm.projectNodeId = Id
        this.dataForm.id = data.nodeApplyId
        this.dataForm.nextProjectNodeId = data.nextProjectNodeId
        this.enableNextApplyUser = data.enableNextApplyUser
        if (data.resultFiles) {
          this.files = data.resultFiles.map(file => {
            file.uid = file.id
            file.name = file.filename
            file.status = 'done'
            file.url = downloadUrl + file.url
            return file
          })
        }
        return getTasks(Id)
      }).then(res => {
        const { data = [] } = res
        data.forEach(item => {
          item.files.map(file => {
            file.uid = file.id
            file.name = file.filename
            file.status = 'done'
            file.url = downloadUrl + file.url
            return file
          })
        })
        data.forEach(item => {
          if (item.processFiles.length) item.processFiles = item.processFiles.map(file => ({ ...file, uid: file.id, name: '流程图', url: downloadUrl + file.url, status: 'done' }))
        })
        this.taskData = data
        this.visible = true
      }).over().finally(() => {
        this.taskLoading = false
      })
    },
    /**
     * 文件上传改变
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    onFileChange({ file, fileList }) {
      this.files = fileList
        .filter(item => item.status != null)
        .map(item => {
          const response = item.response
          let fileInfo = {}
          if (response) {
            const { data = {}} = response
            fileInfo.status = 'done'
            fileInfo.url = downloadUrl + data.url
            fileInfo = {
              ...data,
              ...fileInfo
            }
          }
          return {
            ...item,
            ...fileInfo
          }
        })
    },
    /**
     * 审批通过
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    handleOk() {
      console.log(this.dataForm)
      this.$refs['ruleForm'].validate(valid => {
        if (!valid) return
        this.confirmLoading = true
        if (this.files.length > 0) {
          this.dataForm.resultFileId = this.files.map(item => item.id).join(',')
        }
        if (this.dataForm.nextUserId && this.dataForm.nextUserId.length > 0) {
          this.dataForm.nextUserId = this.dataForm.nextUserId.join(',')
        }
        console.log(this.dataForm)
        nodeApply(this.dataForm).then(() => {
          this.$message.success('操作成功')
          this.queryPage()
        }).over().finally(() => {
          this.handleCancel()
        })
      })
    },
    /**
     * 关闭
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
      this.taskData = []
      this.files = []
      this.$refs['ruleForm'].resetFields()
      this.dataForm = cloneDeep(defaultForm)
    },
    /**
     * 获取任务分类数据字典
     */
    async getTaskType() {
      const { data = [] } = await getSysConfigByAlias('taskType')
      this.taskTypeList = data
    },
    /**
     * 查看节点详情
     */
    viewDetail(row) {
      this.nodeId = row.id
      this.visible2 = true
    }
  }
}
</script>
<style scoped lang="less">
/* tile uploaded pictures */
.upload-list-inline{
  width: 100%;
}

.upload-list-inline /deep/ .ant-upload-list-item {
  float: left;
  width: 25%;
  margin-right: 8px;
}
.upload-list-inline /deep/ .ant-upload-animate-enter {
  animation-name: uploadAnimateInlineIn;
}
.upload-list-inline /deep/ .ant-upload-animate-leave {
  animation-name: uploadAnimateInlineOut;
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
