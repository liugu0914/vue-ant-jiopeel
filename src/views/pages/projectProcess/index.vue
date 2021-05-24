<template>
  <div>
    <!-- table组件 -->
    <a-card>
      <standard-table
        :columns="columns"
        placeholder="搜索项目名称/项目编号"
        :data-source="dataSource"
        :loading="loading"
        @search="search"
        @change="pageChange"
      >
        <!-- 按钮 -->
        <template slot="btns">
          <!-- <a-button type="primary" @click="show">
            <a-icon type="plus" />添加
          </a-button> -->
        </template>
        <div slot="state" slot-scope="{ text }">
          <span v-if=" text == 0 "> <a-tag color="red">未开始</a-tag></span>
          <span v-if=" text == 1 "> <a-tag color="red">未办理</a-tag></span>
          <span v-if=" text == 2 "> <a-tag color="green">办理中</a-tag></span>
          <span v-if=" text == 3 "> <a-tag color="green">已完成</a-tag></span>
        </div>
        <div slot="date" slot-scope="{ record,text }">
          <template v-if="text">
            <span v-if=" record.overDay >5 "> <a-tag color="red">{{ text }}</a-tag></span>
            <span v-else-if=" record.overDay > 3 "> <a-tag color="orange">{{ text }}</a-tag></span>
            <span v-else> <a-tag color="green">{{ text }}</a-tag></span>
          </template>
        </div>
        <!-- 项目进度 -->
        <div slot="process" slot-scope="{ record }">
          <a-steps progress-dot :current="getCurrent(record.process)" size="small">
            <a-step v-for="item in record.process" :key="item.id" :title="item.name" />
          </a-steps>
        </div>
        <!-- 操作 -->
        <template slot="action" slot-scope="{ record }">
          <a-button type="link" size="small" @click="look(record)">
            查看
          </a-button>
          <a-button type="link" size="small" @click="edit(record)">
            上传
          </a-button>
          <a-button type="link" size="small" @click="showApply(record)">
            审核
          </a-button>
        </template>
      </standard-table>
    </a-card>
    <!-- 上传 -->
    <modal
      v-model="visible"
      :footer="null"
      width="80%"
      :confirm-loading="confirmLoading"
      ok-text="确认" cancel-text="取消" :title="title"
      @ok="handleOk"
      @cancel="handleCancel">
      <a-row class="mb-4">
        <a-col :span="24">
          <a-steps v-model="current" @change="changeStep">
            <a-step v-for="item in processes" :key="item.id" :title="item.name" />
          </a-steps>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="4">
          <a-tabs default-active-key="2" type="card" tab-position="left" :hide-add="true" @change="changeKid">
            <a-tab-pane v-for="item in kids" :key="item.id" :tab="item.name" />
          </a-tabs>
        </a-col>
        <a-col :span="20">
          <!-- <div style="text-align:right">
            <a-button-group>
              <a-button type="primary" @click="saveCurrentFiles">
                <a-icon type="save" />保存
              </a-button>
            </a-button-group>
          </div> -->
          <standard-table
            :columns="fileColumns"
            :data-source="kidFiles"
            :loading="fileLoading"
            :is-search="false"
            :pagination="false"
          >
            <div slot="fileName" slot-scope="{record}">
              <a-input
                v-model="record.name"
                class="w-100" :max-length="255" autocomplete="off"
                allow-clear
              />
            </div>
            <div slot="upload" slot-scope="{ record }">
              <upload :file-list="record.files" :show-upload-list="{ showPreviewIcon: true, showRemoveIcon: record.state !==2 && record.state!==3 }" :remove="(file) => { removeFile(file,record) }" />
            </div>
            <div slot="state" slot-scope="{ record }">
              <span v-if=" record.state == 0 "> <a-tag color="orange">未上传</a-tag></span>
              <span v-if=" record.state == 1 "> <a-tag color="orange">已上传</a-tag></span>
              <span v-if=" record.state == 2 "> <a-tag color="orange">已提交,等待审核</a-tag></span>
              <span v-else-if=" record.state == 3"><a-tag color="green">审核通过</a-tag><br><p>审核意见:{{ record.feedback || '无' }}</p></span>
              <span v-else-if=" record.state == 4"><a-tag color="red">被驳回</a-tag><br><p>审核意见:{{ record.feedback || '无' }}</p></span>
            </div>
            <div slot="action" slot-scope="{record}">
              <template v-if="record.state == 0 || record.state == 1 || record.state == 4">
                <upload :file-list="record.files" :multiple="true" :before-upload="beforeUpload" :show-upload-list="false" :action="action" @change="file => onChange(record, file)">
                  <a-button size="small" type="link">
                    上传
                  </a-button>
                </upload>
                <a-button size="small" type="link" @click="saveCurrentFile(record)">
                  保存
                </a-button>
                <a-button v-if="record.state != 0" size="small" type="link" @click="submitCurrentFile(record)">
                  提交
                </a-button>
              </template>
            </div>
          </standard-table>
        </a-col>
      </a-row>
    </modal>
    <!-- 审核 -->
    <modal
      v-model="applyVisible"
      :footer="null"
      width="80%"
      :confirm-loading="confirmLoading"
      ok-text="确认" cancel-text="取消" :title="title"
      @ok="handleOk"
      @cancel="handleCancel">
      <a-row class="mb-4">
        <a-col :span="24">
          <a-steps v-model="current" @change="changeStep">
            <a-step v-for="item in processes" :key="item.id" :title="item.name" />
          </a-steps>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="4">
          <a-tabs default-active-key="2" type="card" tab-position="left" :hide-add="true" @change="changeKid">
            <a-tab-pane v-for="item in kids" :key="item.id" :tab="item.name" />
          </a-tabs>
        </a-col>
        <a-col :span="20">
          <standard-table
            :columns="applyColumns"
            :data-source="kidFiles"
            :loading="fileLoading"
            :is-search="false"
            :pagination="false"
          >
            <div slot="upload" slot-scope="{ record }">
              <upload :file-list="record.files" :show-upload-list="{ showPreviewIcon: true, showRemoveIcon: false }" />
            </div>
            <div slot="state" slot-scope="{ text }">
              <a-tag v-if="text == 2" color="orange">
                已提交
              </a-tag>
              <a-tag v-else-if="text == 3" color="green">
                通过
              </a-tag>
              <a-tag v-else-if="text == 4" color="red">
                驳回
              </a-tag>
              <a-tag v-else color="orange">
                未办理
              </a-tag>
            </div>
            <div slot="action" slot-scope="{record}">
              <template v-if=" record.state ===2">
                <a-button size="small" type="link" @click="startApply(record,1)">
                  通过
                </a-button>
                <a-button size="small" type="link" @click="startApply(record,0)">
                  驳回
                </a-button>
              </template>
            </div>
          </standard-table>
        </a-col>
      </a-row>
    </modal>
    <!-- 审核确认 -->
    <modal
      v-model="sureVisible"
      :confirm-loading="sureConfirmLoading"
      ok-text="确认" cancel-text="取消"
      :title="sureTitle"
      @ok="applySure"
      @cancel="quitSure">
      <span>注意: 一旦通过，将不能驳回!</span>
      <a-textarea v-model="sureFeedback" placeholder="请输入审核意见" :max-length="500" :auto-size="{ minRows: 4, maxRows: 8}" allow-clear />
    </modal>
    <!-- 查看 -->
    <modal v-model="lookVisible" :footer="null" width="80%" :title="lookTitle" @cancel="quitLook">
      <flow :steps="steps" :look-visible="lookVisible" />
    </modal>
    <!-- 配置默认审批人 -->
    <modal v-model="lookVisible" :footer="null" width="80%" :title="lookTitle" @cancel="quitLook">
      <flow :steps="steps" :look-visible="lookVisible" />
    </modal>
  </div>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'
import Modal from '@/components/modal/Modal'
import Upload from '@/components/upload'
import Flow from './flow'
import { columns, fileColumns, applyColumns } from './constant'
import { uploadFileUrl, downloadUrl } from '@/api/common/upload'
import { getListPage, getProcessByProjectId, getProcessKidByProcessId, getFiles, saveFiles, saveCurrent, submitFile, applyFile, getInfo } from '@/api/modules/projectProcess'
export default {
  components: {
    StandardTable,
    Modal,
    Upload,
    Flow
  },
  data() {
    return {
      columns,
      dataSource: [], // 表格数据
      // 表格数据请求参数
      params: {
        page: {},
        query: {}
      },
      // 表格加载状态
      loading: false,

      action: uploadFileUrl, // 上传文件地址
      // 弹窗
      visible: false, // 添加合同弹窗开关
      confirmLoading: false,
      title: '',
      fileColumns, // 文件列表表头
      current: 0, // 当前步骤
      processes: [], // 主流程
      kids: [], // 子流程
      kidFiles: [], // 文件
      processId: '', // 主流程Id
      processKidId: '', // 子流程id
      fileLoading: false, // 表格加载状态

      // 审核界面
      applyVisible: false,
      applyColumns, // 审核字段

      sureTitle: '审核意见',
      sureVisible: false, // 确认界面
      sureConfirmLoading: false, // 加载
      sureRecord: {}, // 审批记录
      sureFeedback: '', // 审批意见
      applyType: undefined, // 审批类型

      // 查看弹窗
      lookVisible: false,
      lookTitle: '', // 查看弹窗标题
      steps: [] // 审批数据
    }
  },
  created() {
    this.getProjectList()
  },
  methods: {
    /**
     * 获取项目数据
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    async getProjectList() {
      this.loading = true
      try {
        const { data = {}} = await getListPage(this.params)
        this.dataSource = data.result.map(item => ({ ...item, projectArea: +item.projectArea, projectType: +item.projectType }))
        console.log(data)
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },
    // 搜索项目信息
    search(query) {
      this.params.query = query
      this.getProjectList()
    },
    // 表格分页
    pageChange(pagination) {
      const { current, pageSize } = pagination
      this.params.page = { current, pageSize }
      this.getProjectList()
    },

    /**
     * 获取当前流程
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    getCurrent(process = []) {
      let current = 0

      if (process.length === 0) {
        return current
      }

      process.some((item, index) => {
        if (item.state === 1) { // 办理中
          current = index
          return true
        }
      })
      return current
    },
    /**
     * 上传文件/编辑
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    show(record) {
      this.title = '查看'
      this.visible = true
    },
    /**
     * 切换主流程
     * @date 2021-5-14 09:29:36
     * @author lyc
     */
    changeStep(current) {
      this.fileLoading = true
      const index = this.processes.findIndex((item, index) => index === current)
      this.processId = this.processes[index].id
      this.getProcessKid().over().finally(() => {
        this.fileLoading = false
      })
    },

    /**
     * 切换子流程
     * @date 2021-5-14 09:29:36
     * @author lyc
     */
    changeKid(activeKey) {
      this.fileLoading = true
      this.processKidId = activeKey
      this.queryFiles().over().finally(() => {
        this.fileLoading = false
      })
    },

    /**
     * 公共逻辑处理查询文件列表
     * @date 2021-5-14 09:34:58
     * @author lyc
     */
    queryFiles() {
      return getFiles(this.processKidId).then(res => {
        const { data = [] } = res
        data.map(item => {
          item.files.map(file => {
            file.uid = file.id
            file.name = file.filename
            file.status = 'done'
            file.url = downloadUrl + file.url
            return file
          })
          return item
        })
        this.kidFiles = data
      })
    },


    /**
     * 公共逻辑处理 查询子流程
     * @date 2021-5-14 09:34:58
     * @author lyc
     */
    getProcessKid() {
      return getProcessKidByProcessId(this.processId).then(res => {
        const { data = [] } = res
        this.kids = data
        if (data.length > 0) {
          const processKidId = data[0].id
          this.processKidId = processKidId
          return this.queryFiles()
        }
      })
    },
    /**
     * 查询流程数据
     * @date  2021-5-17 09:39:22
     * @author lyc
     */
    queryProcess(projectId) {
      return getProcessByProjectId(projectId).then(res => {
        const { data = [] } = res
        this.processes = data
        if (data.length > 0) {
          this.current = this.getCurrent(data)
          const index = this.processes.findIndex((item, index) => index === this.current)
          this.processId = this.processes[index].id
          return this.getProcessKid()
        }
      }).over().finally(() => {
        this.fileLoading = false
      })
    },

    /**
     * 上传文件/编辑
     * @date 2021-5-17 09:39:22
     * @author lyc
     */
    edit(record) {
      this.title = '上传文件'
      this.visible = true
      this.fileLoading = true
      this.queryProcess(record.id).over().finally(() => {
        this.fileLoading = false
      })
    },
    /**
     * 审核
     * @date 2021-5-17 09:39:22
     * @author lyc
     */
    showApply(record) {
      this.title = '审核'
      this.applyVisible = true
      this.fileLoading = true
      this.queryProcess(record.id).over().finally(() => {
        this.fileLoading = false
      })
    },
    /**
     * 文件上传前的回调
     * @date 2021-5-17 09:39:22
     * @author lyc
     */
    beforeUpload(file) {
      console.log(file)
      const typeArr = [
        'image/png',
        'image/jpeg',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ]
      const type = typeArr.includes(file.type)
      const size = file.size / 1024 / 1024
      if (!type) {
        this.$message.error('请选择图片,xls,xlsx,docx,pdf 文件上传！')
        return false
      }
      if (size > 20) {
        this.$message.error('上传的文件不能超过20MB!')
        return false
      }

      return true
    },
    /**
     * 上传文件改变时的状态
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    onChange(row, { file, fileList }) {
      row.files = fileList
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
     * 删除文件
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    removeFile(file, record) {
      console.log(file)
      record.files = record.files.filter(item => item.id !== file.id) || []
    },
    /**
     * 保存当前选中的文件列表
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    saveCurrentFiles() {
      const tmpfiles = [...this.kidFiles]
      tmpfiles.map(item => {
        let fileId = ''
        if (item.files && item.files.length > 0) {
          fileId = item.files.map(item => item.id).join(',')
        }
        item.fileId = fileId
        delete item.files
      })
      const params = {
        files: tmpfiles,
        processKidId: this.processKidId
      }
      saveFiles(params).then(() => {
        this.$message.success('保存成功')
        this.fileLoading = true
        this.queryFiles().over().finally(() => {
          this.fileLoading = false
        })
      }).over()
      console.log(tmpfiles)
    },
    /**
     * 保存当前文件 单个
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    saveCurrentFile(record) {
      const params = {
        ...record
      }
      if (params.files && params.files.length > 0) {
        params.fileId = params.files.map(item => item.id).join(',')
        delete params.files
      } else {
        params.fileId = ''
      }
      saveCurrent(params).then(() => {
        this.$message.success('保存成功')
        this.fileLoading = true
        this.queryFiles().over().finally(() => {
          this.fileLoading = false
        })
      }).over()
      console.log(params)
    },
    /**
     * 提交
     * @date  2021-5-14 17:30:07
     * @author lyc
     */
    submitCurrentFile(record) {
      console.log(record)
      submitFile(record.id).then(() => {
        this.fileLoading = true
        this.queryFiles().over().finally(() => {
          this.fileLoading = false
        })
      }).over()
    },
    /**
     * 审批文件
     * @date 2021-5-17 10:14:01
     * @author lyc
     */
    startApply(record, applyType) {
      this.sureTitle = applyType === 1 ? '通过' : '驳回'
      this.sureVisible = true
      this.sureRecord = record
      this.applyType = applyType
    },
    /**
     * 确认审核
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    applySure() {
      this.sureConfirmLoading = true
      console.log(this.sureRecord)
      const params = {
        ...this.sureRecord,
        applyType: this.applyType,
        feedback: this.sureFeedback
      }
      applyFile(params).then(() => {
        this.fileLoading = true
        this.queryFiles().over().finally(() => {
          this.fileLoading = false
        })
      }).finally(() => {
        this.quitSure()
      })
    },
    /**
     * 取消审核
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    quitSure() {
      this.sureConfirmLoading = false
      this.sureVisible = false
      this.sureRecord = {}
      this.sureFeedback = ''
      this.applyType = undefined
    },
    /**
     * 确认
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    handleOk() {

    },
    /**
     * 取消
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    handleCancel() {
      this.visible = false
      this.applyVisible = false
      this.confirmLoading = false
      this.current = 0
      this.processes = []
      this.kids = []
      this.kidFiles = []
      this.getProjectList()
    },
    /**
     * 查看按钮
     * @date 2021-5-19 11:29:00
     * @author zxp
     */
    look(row) {
      getInfo(row.id).then(res => {
        const data = res.data || []
        data.forEach(item => {
          if (item.kids && item.kids.length > 0) {
            item.kids.forEach(kid => {
              if (kid.state === 1) {
                kid.status = 'progress'
              } else if (kid.state === 2) {
                kid.status = 'done'
              } else {
                kid.status = 'wait'
              }
            })
          }
        })
        console.log(data)
        this.steps = data
      }).finally(() => {
        this.lookTitle = row.projectName
        this.lookVisible = true
      })
    },
    /**
     * 取消查看
     * @date 2021-5-19 11:29:00
     * @author zxp
     */
    quitLook() {
      this.lookVisible = false
      this.steps = []
    }
  }
}
</script>
