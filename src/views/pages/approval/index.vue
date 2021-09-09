<template>
  <a-card>
    <standard-table
      :columns="columns" :data-source="dataSource"
      :loading="loading" :pagination.sync="params.page" @search="search" @change="pageChange">
      <!-- 右侧按钮 -->
      <a-button v-if="$hasp(`${$route.meta.rights}-exp`)" slot="btns" type="primary" @click="exportExcel">
        导出
      </a-button>
      <!-- 项目区属 -->
      <span slot="projectArea" slot-scope="{text}">{{ projectArea.find(item => item.value == text) && projectArea.find(item => item.value == text).name }}</span>
      <!-- 任务总数 -->
      <a-button slot="taskNum" slot-scope="{text, record}" type="link" @click="viewFlow(record)">
        {{ text }}
      </a-button>
      <!-- 完成率 -->
      <a-progress slot="completionRate" slot-scope="{text}" :percent="parseInt(text)" :stroke-color="parseInt(text)==100 ? '#008000' : '#ff9900'" status="normal" />
    </standard-table>
    <!-- 查看项目详情 -->
    <modal :title="title" :visible="visible" width="100%" top="110" :footer="null" @cancel="visible = false">
      <flow :steps="steps" @detail="visible1 = true;taskId = $event" />
    </modal>
    <!-- 任务详情 -->
    <task-details :id="taskId" v-model="visible1" :task-list="taskTypeList" />
    <!-- 节点详情 -->
    <node-details v-model="visible2" :node-id="nodeId" :task-type-list="taskTypeList" />
  </a-card>
</template>

<script>
import { columns } from './constant'
import StandardTable from '@/components/table/StandardTable'
import Modal from '@/components/modal/Modal'
import Flow from './flow'
import { getSysConfigByAlias } from '@/api/modules/sys/dictionary'
import { getProjectData, getProjectFlow, excelPage, getNodeByTaskType } from '@/api/modules/approval'
import TaskDetails from '@/views/pages/work/components/taskDetails.vue'
import { BoxPage } from '@/utils/tool'
import { formatObj } from '@/utils/tool'
import { getTitle } from '@/api/modules/pm/taskType'
import NodeDetails from '@/views/components/node-details.vue'

export default {
  components: {
    StandardTable,
    Modal,
    Flow,
    TaskDetails,
    NodeDetails
  },
  data() {
    return {
      columns,
      dataSource: [], // 表格数据
      loading: false, // 表格 loading
      title: '标题', // modal 标题
      visible: false, // modal 显示
      // 表格分页查询
      params: {
        page: { total: 0 },
        query: { taskType: this.$route.meta.taskType }
      },
      projectArea: [], // 项目区属
      steps: [], // 项目流程
      visible1: false,
      taskId: '',
      taskTypeList: [],
      nodeId: '',
      visible2: false
    }
  },
  created() {
    // 获取表格标题
    this.getTitle()
    // 获取任务分类对应节点树
    this.getNodeList()
    // 获取项目区属
    this.getSysConfigByAlias('projectArea')
    // 获取项目信息
    this.getProjectData()
    // 获取任务分类
    this.getTaskType()
  },
  methods: {
    /**
     * 获取项目信息
    */
    async getProjectData() {
      this.loading = true
      try {
        const { data } = await getProjectData(this.params)
        this.dataSource = data.result
        this.params.page = BoxPage(data)
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },
    /**
     * 获取数据字典
    */
    async getSysConfigByAlias(alias) {
      const { data = [] } = await getSysConfigByAlias(alias)
      this[alias] = data
    },
    /**
     * 查看项目流程
    */
    viewFlow(row) {
      const id = row.id.split(',')[0]
      this.title = row.projectNum
      this.getProjectFlow(id)
      this.visible = true
    },
    /**
     * 获取项目流程信息
    */
    async getProjectFlow(projectId) {
      const { data = [] } = await getProjectFlow({ projectId, taskType: this.taskType })
      this.steps = data
    },
    /**
     * 搜索
    */
    search(query) {
      this.params.query = { ...query, taskType: this.taskType }
      this.getProjectData()
    },
    /**
     * 表格分页
     */
    pageChange(pagination) {
      this.params.page = BoxPage(pagination)
      this.getProjectData()
    },
    /**
     * 导出Excel
     */
    exportExcel() {
      excelPage(this.params.query).then(() => {
        this.$message.success('导出成功')
      }).over()
    },
    /**
     * 获取任务分类数据字典
     */
    async getTaskType() {
      const { data = [] } = await getSysConfigByAlias('taskType')
      this.taskTypeList = data
    },
    /**
     * 根据任务类型获取表格标题
     */
    async getTitle() {
      const { data = [] } = await getTitle(this.taskType)
      this.columns = data.map(item => {
        if (item.extra) {
          item.align = 'center'
          item.customRender = text => <a href='javascript:;' onclick={() => this.viewTaskDetail(text)}>{text && text.extraData}</a>
        }
        const find = this.columns.find(col => col.title == item.title)
        return { ...item, ...find }
      })
    },
    /**
     * 查看任务详情
     */
    viewTaskDetail(data) {
      this.nodeId = data.projectNodeId
      this.visible2 = true
    },
    // 获取当前阶段
    async getNodeList() {
      const { data = [] } = await getNodeByTaskType(this.taskType)
      formatObj(data, { value: 'id' })
      const find = this.columns.find(item => item.title == '当前阶段')
      if (find && find.search) find.search.options = data
    }
  },
  computed: {
    taskType() {
      return this.$route.meta.taskType
    }
  }
}
</script>
