<template>
  <div class="contract">
    <!-- table组件 -->
    <a-card>
      <standard-table
        :columns="columns"
        placeholder="搜索项目名称/项目编号"
        :data-source="dataSource"
        :loading="loading"
        :pagination.sync="params.page"
        :selected-rows.sync="selectedRows"
        @search="search"
        @change="pageChange"
      >
        <!-- 按钮 -->
        <template slot="btns">
          <a-button v-if="$hasp('projectInfo-imp')" type="primary" @click="visible2=true; excleImportUrl = projectInfoUrl">
            导入
          </a-button>
          <a-button v-if="$hasp('projectInfo-exp')" type="primary" @click="exportData">
            导出
          </a-button>
          <a-button v-if="$hasp('projectInfo-import-investmentPlan')" type="primary" @click="visible2=true; excleImportUrl = investmentPlanUrl">
            导入年投资计划
          </a-button>
          <a-button v-if="$hasp('projectInfo-add')" type="primary" @click="add">
            新增
          </a-button>
          <a-button v-if="$hasp('projectInfo-edit')" type="primary" @click="editBtn">
            修改
          </a-button>
          <a-popconfirm
            v-if="$hasp('projectInfo-del')"
            :disabled="selectedRows && !selectedRows.length"
            title="是否确认删除选中的数据?"
            @confirm="del(selectedRows)"
            @click.native="selectedRows && selectedRows.length ? '' : $message.warning('请选择要删除的数据')"
          >
            <a-button type="danger">
              删除
            </a-button>
          </a-popconfirm>
        </template>

        <!-- 项目区属 -->
        <span slot="projectArea" slot-scope="{text}">
          {{ projectArea[text -1] && projectArea[text -1].name }}
        </span>
        <!-- 项目类型 -->
        <span slot="projectType" slot-scope="{text}">{{ projectTypeArr.find(item => item.id == text) &&projectTypeArr.find(item => item.id == text).name }}</span>
        <!-- 项目进度 -->
        <template slot="progress" slot-scope="{text}">
          <a-progress :percent="parseInt(text)" size="small" :stroke-color="parseInt(text) < 100 ? '#f79356' : '#40c679'" status="normal" />
        </template>

        <!-- 操作 -->
        <template slot="action" slot-scope="{record}">
          <a-tooltip placement="top" title="设置">
            <a-button v-if="$hasp('projectInfo-setting')" type="link" size="small" @click="setting(record)">
              <a-icon type="setting" />
            </a-button>
          </a-tooltip>
          <a-tooltip v-if="$hasp('projectInfo-edit')" placement="top" title="修改">
            <a-button type="link" size="small" @click="edit(record)">
              <a-icon type="edit" />
            </a-button>
          </a-tooltip>
          <a-popconfirm v-if="$hasp('projectInfo-del')" title="是否删除该数据?" @confirm="del(record.id)">
            <a-tooltip placement="top" title="删除">
              <a-button type="link" size="small">
                <a-icon type="delete" />
              </a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </standard-table>
    </a-card>

    <!-- 添加、修改合同弹窗 -->
    <modal v-if="$hasp('projectInfo-add') || $hasp('projectInfo-edit')" v-model="visible" :title="title" width="700px" @ok="handleOk" @cancel="visible = false">
      <a-form-model ref="ruleForm" :model="dataForm" label-align="left">
        <a-row :gutter="[16, 0]">
          <a-col span="12">
            <a-form-model-item
              :rules="[{ required: true, message: '项目编号不能为空', trigger: 'blur', whitespace: true }, { validator: checkNumber, trigger: 'blur'}]"
              label="项目编号"
              prop="projectNum"
            >
              <a-input v-model="dataForm.projectNum" class="w-100" :max-length="100" autocomplete="off" allow-clear placeholder="请输入项目编号" />
            </a-form-model-item>
          </a-col>
          <a-col span="12">
            <a-form-model-item
              :rules="{ required: true, message: '项目名称不能为空', trigger: 'blur', whitespace: true }"
              label="项目名称"
              prop="projectName"
            >
              <a-input v-model="dataForm.projectName" class="w-100" :max-length="100" autocomplete="off" allow-clear placeholder="请输入项目名称" />
            </a-form-model-item>
          </a-col>

          <a-col span="12">
            <a-form-model-item
              :rules="[{ required: true, message: '项目区属不能为空', trigger: 'blur' }]"
              label="项目区属"
              prop="projectArea"
            >
              <a-select v-model="dataForm.projectArea" class="w-100" placeholder="请选择项目区属">
                <a-select-option v-for="item in projectArea" :key="item.id" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col span="12">
            <a-form-model-item
              :rules="[{ required: true, message: '项目类型不能为空', trigger: 'blur' }]"
              label="项目类型"
              prop="projectType"
            >
              <a-select v-model="dataForm.projectType" :disabled="title=='修改项目信息'" class="w-100" placeholder="请选择项目类型">
                <a-select-option v-for="item in projectTypeArr" :key="item.id" :value="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-col span="12">
            <a-form-model-item label="投资金额(万元)" prop="investmentMoney">
              <a-input-number v-model="dataForm.investmentMoney" :min="1" placeholder="请输入投资金额" class="w-100" />
            </a-form-model-item>
          </a-col>

          <a-col span="12">
            <a-form-model-item label="建设类型" prop="investmentMoney">
              <a-select v-model="dataForm.constructType" class="w-100" placeholder="请选择建设类型">
                <a-select-option v-for="item in constructionType" :key="item.id" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-col span="6">
            <a-form-model-item
              label="是否开工"
              prop="work"
            >
              <a-radio-group v-model="dataForm.work">
                <a-radio :value="1">
                  是
                </a-radio>
                <a-radio :value="0">
                  否
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>

          <a-col span="9">
            <a-form-model-item label="开工时间">
              <a-date-picker
                v-model="dataForm.startTime" :disabled-date="current => disabledDate(current, 0)"
                class="w-100" value-format="YYYY-MM-DD" placeholder="请选择开工时间" />
            </a-form-model-item>
          </a-col>

          <a-col span="9">
            <a-form-model-item
              label="完工时间"
              prop="overTime"
            >
              <a-date-picker
                v-model="dataForm.overTime" :disabled-date="current => disabledDate(current, 1)"
                class="w-100" value-format="YYYY-MM-DD" placeholder="请选择完工时间" />
            </a-form-model-item>
          </a-col>

          <a-col span="11">
            <a-form-model-item
              label="所在地"
              prop="longitude"
            >
              <a-input v-model="dataForm.longitude" class="w-100" :max-length="100" autocomplete="off" allow-clear placeholder="请输入经度" />
            </a-form-model-item>
          </a-col>
          <a-col span="11">
            <a-form-model-item
              label="纬度"
              prop="latitude"
              class="address"
            >
              <a-input v-model="dataForm.latitude" class="w-100" :max-length="100" autocomplete="off" allow-clear placeholder="请输入纬度" />
            </a-form-model-item>
          </a-col>
          <a-col span="2">
            <a-form-model-item
              label="定位"
              class="address"
            >
              <a-icon type="environment" class="ml-2" style="cursor: pointer; font-size: 20px" @click="isMask = true" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </modal>

    <!-- 导入文件弹窗 -->
    <modal
      v-if="$hasp('projectInfo-imp')"
      title="导入" type="IModal" :visible="visible2" centered :width="400" :footer="null" @ok="visible2 = false" @cancel="visible2 = false">
      <upload mode="drop" :action="excleImportUrl" file-type="excel" :show-upload-list="false" @change="importFile">
        <p class="ant-upload-drag-icon">
          <a-icon type="upload" />
        </p>
        <p class="ant-upload-text">
          将文件拖到此处，或点击上传
        </p>
        <p class="ant-upload-hint">
          只能上传xlsx/xls文件，且不超过20MB
        </p>
      </upload>
      <a-button type="primary" style="margin-top: 10px; width: 100%" @click="downloadTemplate">
        <a-icon type="download" style="vertical-align: bottom;" />
        下载模板
      </a-button>
    </modal>

    <!-- 地图选点 -->
    <map-select v-if="$hasp('projectInfo-add') || $hasp('projectInfo-edit')" v-model="isMask" @mapClick="mapClick" />

    <!-- 项目设置弹窗 -->
    <modal
      v-if="$hasp('projectInfo-setting')" :title="projectName" width="100%" top="110" class="setting"
      :visible="settingVisible" :footer="null" @cancel="settingVisible = false">
      <setting
        ref="setting" :task-type-data="taskType" :tree-data="treeData" :users="users"
        :apply-dept="applyDept" @addTask="addTask" @editTask="editTask" />
    </modal>

    <!-- 新增任务弹窗 -->
    <modal :title="taskTitle" :visible="taskVisible" @ok="addNodeTask" @cancel="taskVisible=false">
      <a-form-model ref="addTaskForm" :model="addTaskForm">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="所属节点" prop="projectNodeId">
              <a-tree-select
                v-model="addTaskForm.projectNodeId"
                :tree-data="treeData" disabled
                :replace-fields="{title: 'name', key: 'id', value: 'id'}"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="任务名称" prop="name" :rules="{ required: true, message: '任务名称不能为空', trigger: 'blur'}">
              <a-input v-model="addTaskForm.name" :max-length="100" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="任务分类" prop="type" :rules="{ required: true, message: '任务分类不能为空', trigger: 'blur'}">
              <a-select v-model="addTaskForm.type">
                <a-select-option v-for="item in taskType" :key="item.vakye" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="权限管理" prop="competence" :rules="{ required: true, message: '权限管理不能为空', trigger: 'blur'}">
              <a-checkbox-group v-model="addTaskForm.competence" :disabled="taskTitle == '修改任务'">
                <a-row>
                  <a-col :span="6">
                    <a-checkbox value="0" disabled>
                      执行
                    </a-checkbox>
                  </a-col>
                  <a-col :span="6">
                    <a-checkbox value="1">
                      审核
                    </a-checkbox>
                  </a-col>
                  <a-col :span="6">
                    <a-checkbox value="2" :disabled="addTaskForm.competence && !addTaskForm.competence.includes('1')">
                      流转
                    </a-checkbox>
                  </a-col>
                  <a-col :span="6">
                    <a-checkbox value="3" :disabled="addTaskForm.competence && !addTaskForm.competence.includes('1')">
                      分派
                    </a-checkbox>
                  </a-col>
                </a-row>
              </a-checkbox-group>
            </a-form-model-item>
          </a-col>
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
            <standard-table :columns="expandColumns" :data-source="addTaskForm.nodeTaskExtras" :pagination="false" :is-search="false">
              <a-input-number slot="sort" v-model="record.orderNum" slot-scope="{record}" :min="1" />
              <a-popconfirm slot="ops" slot-scope="{record}" title="确定删除该拓展项?" @confirm="delField(record)">
                <a-button type="link" size="small">
                  删除
                </a-button>
              </a-popconfirm>
            </standard-table>
          </a-col>
        </a-row>
      </a-form-model>
    </modal>
  </div>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'
import Modal from '@/components/modal/Modal'
import Upload from '@/components/upload'
import MapSelect from '@/components/map-select'
import { columns, expandColumns } from './constant'
import { cloneDeep, BoxPage } from '@/utils/tool'
import { getTableData, saveProjectData, delProjectData, exportProjectData, projectInfoUrl,
  investmentPlanUrl, getProjectTemplate, getInvestmentPlanTemplate, getSetting, saveTaskSetting } from '@/api/modules/pm/projectInfo'
import { getSysConfigByAlias } from '@/api/modules/sys/dictionary'
import { getAllProjectType } from '@/api/modules/pm/projectType'
import Setting from './setting'
import { getUsers } from '@/api/modules/sys/user'
import moment from 'moment'
import { getTaskConfigList } from '@/api/modules/pm/taskType'

export default {
  components: {
    StandardTable,
    Modal,
    Upload,
    MapSelect,
    Setting
  },
  data() {
    return {
      columns: columns.map(item => item.title == '操作' ? { ...item, visible: this.$hasp(['projectInfo-setting', 'projectInfo-edit', 'projectInfo-del'], 'some') } : item),
      dataSource: [], // 表格数据
      dataForm: {}, // 单条数据显示
      visible: false, // 添加合同弹窗开关
      projectTypeArr: [], // 项目类型数组
      projectArea: [], // 项目区属数组
      constructionType: [], // 建设类型数组
      title: '', // 弹窗标题
      // 表格数据请求参数
      params: {
        page: {
          current: 1,
          pageSize: 10,
          total: 0
        },
        query: {}
      },
      loading: false, // 表格加载状态
      visible2: false, // 上传文件弹窗开关
      excleImportUrl: '', // 导出 excle 地址
      selectedRows: this.$hasp('projectInfo-del') ? [] : undefined,
      isMask: false, // 地图选点
      settingVisible: false, // 项目设置弹窗开关
      projectName: '', // 当前项目名称
      taskType: [], // 任务分类数据
      treeData: [], // 项目节点树
      users: [], // 所有用户数据
      projectInfoUrl, // 导入项目信息地址
      investmentPlanUrl, // 导入年度投资计划地址
      taskTitle: '', // 新增任务弹窗标题
      taskVisible: false, // 新增任务弹窗开关
      addTaskForm: { competence: ['0'], nodeTaskExtras: [] }, // 新增任务表单
      expandField: [], // 任务拓展项
      expandColumns,
      fields: [], // 选择的字段
      applyDept: [], // 审批部门
      projectId: '',
      flag: false
    }
  },
  created() {
    // 获取项目数据列表
    this.getTableData()
    // 获取项目区属字典
    this.getSysConfigByAlias('projectArea')
    // 获取项目任务分类
    this.getSysConfigByAlias('taskType')
    // 获取建设类型
    this.getSysConfigByAlias('constructionType')
    // 获取审批部门
    this.getSysConfigByAlias('applyDept')
    // 获取项目类型
    this.getProjectType()
    // 获取用户列表
    this.getUsers()
  },
  methods: {
    /**
     * 添加项目信息弹窗显示
     * @date 2021-05-11 13:37:00
     * @author zxp
     */
    add() {
      this.title = '添加项目信息'
      this.dataForm = { }
      this.visible = true
    },
    /**
     * 确认添加、修改项目信息
     * @date 2021-05-11 13:37:00
     * @author zxp
     */
    handleOk() {
      // 二次表单校验
      this.$refs.ruleForm.validate(async val => {
        if (!val) return
        await saveProjectData(this.dataForm)
        this.getTableData()
        this.visible = false
        if (this.title === '添加项目信息') return this.$message.success('添加成功！')
        this.$message.success('编辑成功！')
      })
    },
    /**
     * 修改项目信息
     * @date 2021-05-11 13:37:00
     * @author zxp
     */
    edit(row) {
      this.title = '修改项目信息'
      this.dataForm = cloneDeep(row)
      this.visible = true
    },
    /**
     * 删除项目信息
     * @date 2021-05-11 13:38:00
     * @author zxp
     */
    async del(id) {
      id = typeof id === 'object' ? id.map(item => item.id).join() : id
      const isLast = id.split(',').length == this.dataSource.length && this.params.page.current > 1
      if (isLast) this.params.page.current -= 1
      await delProjectData(id)
      this.getTableData()
      this.$message.success('删除成功！')
    },
    /**
     * 搜索项目信息
     * @date 2021-05-11 13:38:00
     * @author zxp
     */
    search(query) {
      this.params.query = { ...query }
      this.getTableData()
    },
    /**
     * 导入文件
     * @date 2021-05-11 13:38:00
     * @author zxp
     */
    async importFile({ file }) {
      if (file.status === 'done') {
        await this.getTableData()
        this.$message.success('导入成功！')
      }
      this.visible2 = false
    },
    /**
     * 导出项目信息
     * @date 2021-05-11 13:38:00
     * @author zxp
     */
    exportData() {
      exportProjectData(this.params.query)
    },
    /**
     * 表格分页
     * @date 2021-05-11 13:39:00
     * @author zxp
     */
    pageChange(pagination, filters, sorter) {
      const { order } = sorter
      this.params.page = BoxPage(pagination)
      // columns.find(item => item.title == '项目编号').sortOrder = order || 'ascend'
      this.params.query.sortBy = order ? order.replace('end', '') : undefined
      this.getTableData()
    },
    /**
     * 工程编号校验
     * @date 2021-05-11 13:39:00
     * @author zxp
     */
    checkNumber: (rule, value, callback) => {
      const reg = /[\u4e00-\u9fa5]/
      if (reg.test(value)) {
        return callback(new Error('项目编号不能包含中文'))
      } else {
        callback()
      }
    },
    /**
     * 获取表格数据
     * @date 2021-05-11 13:39:00
     * @author zxp
     */
    async getTableData() {
      this.loading = true
      try {
        const { data = {}} = await getTableData(this.params)
        this.dataSource = data.result
        this.params.page = BoxPage(data)
        console.log(data)
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },
    /**
     * 下载 excle 模板
     * @date 2021-05-11 13:39:00
     * @author zxp
     */
    downloadTemplate() {
      this.excleImportUrl == this.projectInfoUrl ? getProjectTemplate() : getInvestmentPlanTemplate()
    },
    /**
     * 地图选点
     * @date 2021-05-25 15:25:00
     * @author zxp
     */
    mapClick(argus) {
      this.$set(this.dataForm, 'longitude', argus[0])
      this.$set(this.dataForm, 'latitude', argus[1])
      this.isMask = false
    },
    /**
     * 项目设置按钮
     * @date 2021-05-25 09:07:00
     * @author zxp
     */
    setting(row) {
      console.log(row)
      this.projectName = row.projectName
      this.projectId = row.id
      this.getNodeTree(row.id)
      this.settingVisible = true
    },
    /**
     * 获取项目区属字典
     */
    async getSysConfigByAlias(alias) {
      const { data = [] } = await getSysConfigByAlias(alias)
      this[alias] = data
    },
    /**
     * 获取项目类型
     */
    async getProjectType() {
      const { data = [] } = await getAllProjectType()
      this.projectTypeArr = data
    },
    /**
     * 发送请求获取项目节点树
     */
    async getNodeTree(id) {
      const { data = [] } = await getSetting(id)
      this.treeData = data
    },
    /**
     * 获取用户列表
     */
    async getUsers() {
      const { data = [] } = await getUsers()
      this.users = data
    },
    /**
     * 禁止选择日期
     */
    disabledDate(current, isEnd) {
      const { startTime, overTime } = this.dataForm
      if (current && isEnd && startTime) return current < moment(startTime).subtract(0, 'days')
      if (current && !isEnd && overTime) return current > moment(overTime).subtract(0, 'days')
    },
    /**
     * 新增任务
     */
    addTask({ projectNodeId }) {
      this.taskTitle = '新增任务'
      this.addTaskForm = { projectNodeId: projectNodeId.join(), competence: ['0'], nodeTaskExtras: [] }
      this.taskVisible = true
    },
    /**
     * 确认添加、修改任务
     */
    addNodeTask() {
      this.$refs.addTaskForm.validate(async val => {
        if (!val) return
        const params = cloneDeep(this.addTaskForm)
        params.projectId = this.projectId
        params.competence = params.competence.join()
        params.nodeTaskExtras = params.nodeTaskExtras.map(item => {
          const { extraId, orderNum, extraName, extraValueType, extraData } = item
          return { orderNum, extraName, extraId, extraValueType, extraData }
        })
        await this.saveTaskSetting(params)
        this.$refs.setting.getTasksById()
        this.taskVisible = false
      })
    },
    /**
     * 发送请求添加任务
     */
    async saveTaskSetting(params) {
      const { status, message } = await saveTaskSetting(params)
      if (status == 200) this.$message.success(message)
    },
    /**
     * 修改任务
     */
    editTask(arr) {
      if (!arr || !arr.length) return this.$message.warning('请选择一条数据进行修改')
      if (arr.length > 1) return this.$message.warning('只能选择一条数据进行修改')
      this.taskTitle = '修改任务'
      const data = cloneDeep(arr[0])
      const { id, projectNodeId, name, type, competence, state, nodeTaskExtras } = data
      this.addTaskForm = { id, projectNodeId, name, type, state, competence: competence.split(','), nodeTaskExtras: nodeTaskExtras || [] }
      this.getTaskConfigList({ projectId: this.projectId, taskType: type })
      this.taskVisible = true
    },
    /**
     * 修改项目按钮
     */
    editBtn() {
      const { selectedRows } = this
      if (!selectedRows || !selectedRows.length) return this.$message.warning('请选择一条数据进行修改')
      if (selectedRows.length > 1) return this.$message.warning('只能选择一条数据进行修改')
      this.edit(selectedRows[0])
    },
    /**
     * 获取任务类型对应拓展项配置
     */
    async getTaskConfigList(params) {
      if (this.flag) return
      this.flag = true
      this.fields = []
      const { data = {}} = await getTaskConfigList(params)
      const arr = cloneDeep(this.addTaskForm.nodeTaskExtras).map(item => ({ id: item.extraId, name: item.extraName }))
      this.expandField = [...arr, ... data]
      this.flag = false
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
      fields.forEach(item => { item.orderNum = ''; item.extraName = item.name; item.extraId = item.id; item.extraValueType = item.valueType })
      this.addTaskForm.nodeTaskExtras.push(...fields)
      this.fields = []
      this.$refs.plus.$el.click()
    },
    /**
     * 删除拓展项
     */
    delField(item) {
      this.addTaskForm.nodeTaskExtras = this.addTaskForm.nodeTaskExtras.filter(field => field.id !== item.id)
    }
  },
  watch: {
    'addTaskForm.competence'(val) {
      if (!val.includes('1') && val.length > 1) this.addTaskForm.competence = ['0']
    },
    'addTaskForm.type'(taskType) {
      if (!taskType) return (this.expandField = [])
      this.getTaskConfigList({ projectId: this.projectId, taskType })
    }
  },
  computed: {
    selectFields() {
      const extraIds = this.addTaskForm.nodeTaskExtras.map(item => item.extraId)
      return this.expandField.filter(item => !extraIds.includes(item.id))
    }
  }
}
</script>
<style scoped lang="less">
.close {
  float: right;
  line-height: 21px;
  cursor: pointer;
}

.address {
  /deep/
  label {
    visibility: hidden;
  }
}

.setting /deep/ .ant-drawer-body {
  background-color: @layout-body-background;
}

.space-between {
  display: flex;
  justify-content: space-between;
  align-content: center;
}
</style>
