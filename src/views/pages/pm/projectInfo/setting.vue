<template>
  <div class="setting">
    <a-row :gutter="16" type="flex">
      <a-col style="min-width: 20%">
        <a-card>
          <div class="title mb-2">
            <a-icon type="menu" /> 节点列表
          </div>
          <a-tree
            v-if="visible"
            :selected-keys.sync="selectKey"
            :tree-data="treeData" default-expand-all
            :replace-fields="{title: 'name', key: 'id'}" @select="onSelect" />
        </a-card>
      </a-col>
      <a-col flex="1">
        <a-card>
          <a-row class="mb-2" type="flex" align="middle" justify="space-between">
            <a-col>
              <div class="title">
                <a-icon type="setting" class="mr-1" />节点设置
              </div>
            </a-col>
            <a-col>
              <a-space>
                <a-button v-if="$hasp('projectInfo-add-task')" type="primary" @click="$emit('addTask', {projectNodeId: selectKey})">
                  新增
                </a-button>
                <a-button v-if="selectedRows && $hasp('projectInfo-edit-task')" type="primary" @click="$emit('editTask', selectedRows)">
                  修改
                </a-button>
                <a-popconfirm
                  v-if="selectedRows && $hasp('projectInfo-del-task')" :disabled="!selectedRows || !selectedRows.length" title="确认删除选中的数据?"
                  @confirm="delTaskSetting" @click.native="selectedRows && selectedRows.length ? '' : $message.warning('请选择要删除的数据')"
                >
                  <a-button type="danger">
                    删除
                  </a-button>
                </a-popconfirm>
              </a-space>
            </a-col>
          </a-row>
          <a-form-model ref="ruleForm" :model="dataForm">
            <a-row :gutter="16">
              <a-col :span="6">
                <a-form-model-item label="节点审批时间" prop="startDate">
                  <a-range-picker v-model="dataForm.date" value-format="YYYY-MM-DD HH:mm:ss" class="w-100" />
                </a-form-model-item>
              </a-col>
              <a-col v-if="dataForm.warn" :span="6">
                <a-form-model-item label="提前预警时间(天)" prop="warnDay">
                  <a-input-number v-model="dataForm.warnDay" :min="0" class="w-100" />
                </a-form-model-item>
              </a-col>
              <a-col v-if="$hasp('projectInfo-isApply')" :span="4">
                <a-form-model-item label="是否审批" prop="startDate">
                  <a-radio-group v-model="dataForm.process">
                    <a-radio :value="1">
                      是
                    </a-radio>
                    <a-radio :value="0">
                      否
                    </a-radio>
                  </a-radio-group>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item v-if="dataForm.process" label="节点审批人" prop="userId">
                  <cascader v-model="dataForm.userId" mode="multiple" />
                </a-form-model-item>
                <a-form-model-item v-else label="审批部门" prop="deptName">
                  <a-select v-model="dataForm.deptName" show-search allow-clear class="w-100" :filter-option="filterUser">
                    <a-select-option v-for="item in applyDept" :key="item.id" :value="item.name">
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
          <standard-table
            :is-search="false"
            :columns="columns"
            :data-source="dataSource"
            :loading="loading"
            :pagination="false"
            :selected-rows.sync="selectedRows"
          >
            <!-- 执行人 表头 -->
            <template slot="executor">
              <div>
                <span>执行人</span>
                <a-popover :visible="visible1" title="批量选择执行人">
                  <template slot="content">
                    <a-select v-model="selectedExecutor" show-search style="width: 200px;" :filter-option="filterUser" allow-clear>
                      <a-select-option v-for="item in users" :key="item.userName" :value="item.id">
                        {{ item.userName }}
                      </a-select-option>
                    </a-select>
                    <div class="text-right mt-2">
                      <a-space>
                        <a-button size="small" @click="visible1 = false">
                          取消
                        </a-button>
                        <a-button type="primary" size="small" @click="selectExecutor">
                          确认
                        </a-button>
                      </a-space>
                    </div>
                  </template>
                  <a-button type="link" class="px-1" @click="visible1 = true;selectedExecutor=[]">
                    <a-icon type="user-add" size="small" />
                  </a-button>
                </a-popover>
              </div>
            </template>
            <!-- 审核人 表头 -->
            <template slot="auditor">
              <div>
                <span>审核人</span>
                <a-popover :visible="visible2" title="批量选择审核人">
                  <template slot="content">
                    <a-select v-model="selectedAuditor" style="width: 200px;" mode="multiple" :filter-option="filterUser" allow-clear>
                      <a-select-option v-for="item in users" :key="item.userName" :value="item.id">
                        {{ item.userName }}
                      </a-select-option>
                    </a-select>
                    <div class="text-right mt-2">
                      <a-space>
                        <a-button size="small" @click="visible2 = false">
                          取消
                        </a-button>
                        <a-button type="primary" size="small" @click="selectAuditor">
                          确认
                        </a-button>
                      </a-space>
                    </div>
                  </template>
                  <a-button type="link" class="px-1" @click="visible2 = true;selectedAuditor=[]">
                    <a-icon type="user-add" size="small" />
                  </a-button>
                </a-popover>
              </div>
            </template>
            <!-- 任务分类 -->
            <span slot="type" slot-scope="{text}">
              {{ taskTypeData.find(item => item.value == text) && taskTypeData.find(item => item.value == text).name }}
            </span>
            <!-- 上传人 -->
            <a-select
              v-if="record.competence.indexOf('0') > -1" slot="update" v-model="record.uploadUserId"
              slot-scope="{record}" show-search allow-clear class="w-100" :filter-option="filterUser">
              <a-select-option v-for="item in users" :key="item.id" :value="item.id">
                {{ item.userName }}
              </a-select-option>
            </a-select>
            <!-- 审核人 -->
            <a-select
              v-if="record.competence.indexOf('1') > -1" slot="audit"
              v-model="record.applyUserId" slot-scope="{record}" allow-clear mode="multiple" class="w-100" :filter-option="filterUser">
              <a-select-option v-for="item in users" :key="item.id" :value="item.id">
                {{ item.userName }}
              </a-select-option>
            </a-select>
            <!-- 流程图 -->
            <template slot="processFiles" slot-scope="{text, record}">
              <upload v-show="text && text.length" :file-list="text" style="max-width: 240px" :remove="file => remove(file, record)" />
              <upload v-show="!text || !text.length" :file-list="text" style="max-width: 240px" @change="file => onChange(record, file)">
                <a-button type="link" size="small">
                  上传
                </a-button>
              </upload>
            </template>
          </standard-table>
        </a-card>
        <div class="text-right mt-3">
          <a-button type="primary" @click="save">
            保存
          </a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { settingColumns } from './constant'
import { getUsers } from '@/api/modules/sys/user'
import StandardTable from '@/components/table/StandardTable'
import Upload from '@/components/upload'
import { getTasksById, getProjectNodeById, saveSetting, delTaskSetting } from '@/api/modules/pm/projectInfo'
import Cascader from '@/components/cascader'
import { delFile, downloadUrl } from '@/api/common/upload'

export default {
  components: {
    StandardTable,
    Cascader,
    Upload
  },
  props: ['taskTypeData', 'treeData', 'users', 'applyDept'],
  data() {
    return {
      columns: settingColumns, // 表格列数据
      dataSource: [], // 表格数据
      dataForm: {}, // 节点任务设置表单
      loading: false, // 表格加载状态
      deptApprover: [], // 当前部门对应的人员数据
      requiredKeys: [], // 必须设置审批人的节点id
      selectKey: [], // 当前选中的节点
      visible: false, // 左侧节点树显隐
      visible1: false, // 选择执行人显隐
      visible2: false, // 先择审核人显隐
      selectedExecutor: [], // 批量选择的执行人
      selectedAuditor: [], // 批量选择的审核人
      selectedRows: [],
      treeOpen: false,
      selectOpen: false
    }
  },
  methods: {
    /**
     * 选择节点
     */
    onSelect(selectedKeys) {
      if (!selectedKeys.length) return (this.selectKey = [this.dataForm.id])
      // 获取上方节点审批设置
      this.getProjectNodeById()
      // 获取下方任务数据
      this.getTasksById()
      this.$refs.ruleForm.clearValidate()
    },
    /**
     * 发送请求获取用户列表
     */
    async getUsers(id) {
      const { data = [] } = await getUsers(id)
      this.deptApprover = data
    },
    /**
     * 根据节点id获取对应任务
     */
    async getTasksById() {
      this.loading = true
      try {
        const { data = [] } = await getTasksById(...this.selectKey)
        this.dataSource = data.map(item => {
          return {
            ...item,
            applyUserId: item.applyUserId ? this.filterDelUser(item.applyUserId) : [],
            uploadUserId: item.uploadUserId ? this.filterDelUser(item.uploadUserId) : [],
            processFiles: item.processFiles.length ? item.processFiles.map(file => ({ ...file, uid: file.id, name: file.filename, url: downloadUrl + file.url, status: 'done' })) : []
          }
        })
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },
    /**
     * 根据节点id获取设置信息
     */
    async getProjectNodeById() {
      const { data = {}} = await getProjectNodeById(...this.selectKey)
      const { userId, deptId, startDate, endDate, process = 0 } = data
      this.dataForm = { ...data, userId: userId ? this.filterDelUser(userId) : [], date: startDate && endDate ? [startDate, endDate] : [], process }
      if (deptId) this.getUsers(deptId)
    },
    /**
     * 保存节点任务配置信息
     */
    save() {
      this.$refs.ruleForm.validate(val => {
        if (!val) return
        this.dataForm.startDate = this.dataForm.date.length ? this.dataForm.date[0] : ''
        this.dataForm.endDate = this.dataForm.date.length ? this.dataForm.date[1] : ''
        const { userId } = this.dataForm
        if (this.dataForm.deptId) delete this.dataForm.deptId
        const node = { ...this.dataForm, userId: this.arrToStr(userId) }
        const tasks = this.dataSource.map(item => {
          return { ...item,
            applyUserId: this.arrToStr(item.applyUserId),
            uploadUserId: this.arrToStr(item.uploadUserId),
            processFileId: item.processFiles.map(item => item.id).join()
          }
        }
        )
        const params = { node, tasks }
        this.saveSetting(params)
      })
    },
    /**
     * 发送请求保存节点任务配置
     */
    async saveSetting(params) {
      const { status } = await saveSetting(params)
      if (status == 200) this.$message.success('保存成功')
    },
    /**
     * 将数组转换为字符串
     */
    arrToStr(arr) {
      return Array.isArray(arr) ? arr.join() : arr
    },
    /**
     * 批量选择执行人
     */
    selectExecutor() {
      this.dataSource.forEach(item => (item.uploadUserId = this.selectedExecutor))
      this.visible1 = false
    },
    /**
     * 批量选择审批人
     */
    selectAuditor() {
      this.dataSource.forEach(item => {
        if (item.competence.includes(1)) item.applyUserId = this.selectedAuditor
      })
      this.visible2 = false
    },
    /**
     * 删除新增的任务
     */
    async delTaskSetting() {
      const defaultTasks = this.selectedRows.filter(item => !item.additional)
      const taskMessage = defaultTasks.map(item => item.name).join('、')
      if (taskMessage) return this.$message.warning(`${taskMessage}为系统配置的任务，不可进行删除！`)
      const ids = this.selectedRows.map(item => item.id).join()
      const { status, message } = await delTaskSetting(ids)
      if (status !== 200) return this.$message.success(message)
      this.$message.success(message)
      this.getTasksById()
    },
    /**
     * 筛选用户
     */
    filterUser(input, option) {
      return (option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0)
    },
    /**
     * 下拉绑定 dom
     */
    dom() {
      return document.getElementById('select')
    },
    /**
     * 窗口缩放时隐藏下拉框
     */
    resize() {
      this.treeOpen = false
      this.selectOpen = false
      this.dataForm.deptId = ''
    },
    /**
     * 上传文件状态改变
     */
    onChange(row, { file, fileList }) {
      row.processFiles = fileList.filter(item => item.status).map(item => {
        if (item.status == 'done' && item.response) {
          const data = item.response.data
          return { ...data, url: downloadUrl + data.url, uid: data.id, name: data.filename, status: 'done' }
        }
        return item
      })
      console.log(row.processFiles)
    },
    /**
     * 删除文件
     */
    async remove(file, row) {
      const id = file.id
      row.processFiles = row.processFiles.filter(item => item.id !== id)
      await delFile([id])
      this.$message.success('删除成功')
    },
    /**
     * 过滤删除的用户
     */
    filterDelUser(userId) {
      const users = this.users.map(item => item.id)
      return userId.split(',').filter(item => users.includes(item))
    }

  },
  watch: {
    treeData(val) {
      const parentId = val[0].id
      this.selectKey = [parentId]
      this.getTasksById()
      this.getProjectNodeById()
      this.requiredKeys = val[0].children && val[0].children.length ? [parentId, val[0].children[0].id] : [parentId]
      this.visible = true
    }
  },
  mounted() {
    window.addEventListener('resize', this.resize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
  }
}
</script>
<style scoped lang="less">
.title {
  font-size: 16px;
  font-weight: 600;
  color: @primary-color;
}
</style>
