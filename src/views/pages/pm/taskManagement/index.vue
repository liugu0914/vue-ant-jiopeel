<template>
  <a-row :gutter="16" class="h-100">
    <a-col :span="6" class="h-100">
      <a-card class="h-100 scroll-y">
        <div class="title">
          <a-icon type="menu" /> 节点列表
        </div>
        <a-tree :selected-keys.sync="selectKey" :tree-data="treeData" :replace-fields="{title: 'name', key: 'id'}" @select="onSelect" />
      </a-card>
    </a-col>
    <a-col :span="18" class="h-100">
      <a-card class="h-100 scroll-y">
        <div class="title mb-2" style="display: flex; justify-content: space-between">
          <span>配置任务</span>
          <div>
            <a-button v-if="$hasp('projectTask-add')" type="primary" class="mr-2" @click="addTask">
              新增
            </a-button>
            <a-popconfirm
              v-if="$hasp('projectTask-del')"
              :disabled="selectedRows && !selectedRows.length"
              title="是否确认删除选中的数据?"
              @confirm="del(selectedRows)"
              @click.native="selectedRows && selectedRows.length ? '' : $message.warning('请选择要删除的数据')"
            >
              <a-button type="danger">
                删除
              </a-button>
            </a-popconfirm>
          </div>
        </div>
        <standard-table
          :columns="columns"
          :data-source="dataSource"
          :selected-rows.sync="selectedRows"
          :pagination="false"
          :is-search="false"
          :loading="loading">
          <template slot="competence" slot-scope="{text}">
            <a-tag v-if="text.includes('0')" color="orange">
              执行
            </a-tag>
            <a-tag v-if="text.includes('1')" color="cyan">
              审核
            </a-tag>
            <a-tag v-if="text.includes('2')" color="pink">
              流转
            </a-tag>
            <a-tag v-if="text.includes('3')" color="purple">
              分派
            </a-tag>
          </template>
          <template slot="ops" slot-scope="{record}">
            <a-tooltip v-if="$hasp('projectTask-edit')" placement="top" title="编辑">
              <a-button type="link" size="small" @click="editTask(record)">
                <a-icon type="edit" />
              </a-button>
            </a-tooltip>
            <a-popconfirm v-if="$hasp('projectTask-del')" title="是否删除该数据?" @confirm="del(record.id)">
              <a-tooltip placement="top" title="删除">
                <a-button type="link" size="small">
                  <a-icon type="delete" />
                </a-button>
              </a-tooltip>
            </a-popconfirm>
          </template>
          <!-- 任务分类 -->
          <span slot="type" slot-scope="{text}">{{ taskTypeArr[text - 1] && taskTypeArr[text - 1].name }}</span>
        </standard-table>
      </a-card>
    </a-col>
    <!-- 新增、编辑任务弹窗 -->
    <modal v-if="$hasp('projectTask-add') || $hasp('projectTask-edit')" :visible="visible" :title="title" @ok="handleOk" @cancel="visible = false">
      <a-form-model ref="ruleForm" :model="dataForm">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="所属节点" prop="processNodeId" :rules="{ required: true, message: '任务名称不能为空'}">
              <a-tree-select
                v-model="dataForm.processNodeId"
                :tree-data="treeData" :disabled="!!selectKey.length"
                :replace-fields="{title: 'name', key: 'id', value: 'id'}"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="任务名称" prop="name" :rules="{ required: true, message: '任务名称不能为空', trigger: 'blur'}">
              <a-input v-model="dataForm.name" :max-length="100" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="任务分类" prop="type" :rules="{ required: true, message: '任务分类不能为空', trigger: 'blur'}">
              <a-select v-model="dataForm.type">
                <a-select-option v-for="item in taskTypeArr" :key="item.vakye" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="任务顺序">
              <a-input-number v-model="dataForm.orderNum" class="w-100" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="权限管理" prop="competence" :rules="{ required: true, message: '权限管理不能为空', trigger: 'blur'}">
              <a-checkbox-group v-model="dataForm.competence">
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
                    <a-checkbox value="2" :disabled="dataForm.competence && !dataForm.competence.includes('1')">
                      流转
                    </a-checkbox>
                  </a-col>
                  <a-col :span="6">
                    <a-checkbox value="3" :disabled="dataForm.competence && !dataForm.competence.includes('1')">
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
            <standard-table :columns="expandColumns" :data-source="dataForm.processTaskExtras" :pagination="false" :is-search="false">
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
  </a-row>
</template>

<script>
import { getFlowTree } from '@/api/modules/pm/nodeManagement'
import { getTaskList, saveNodeTask, delNodeTask } from '@/api/modules/pm/taskManagenment'
import StandardTable from '@/components/table/StandardTable'
import Modal from '@/components/modal/Modal'
import { columns, expandColumns } from './const'
import { cloneDeep } from '@/utils/tool'
import { getSysConfigByAlias } from '@/api/modules/sys/dictionary'
import { getTaskConfigList } from '@/api/modules/pm/taskType'

export default {
  components: { StandardTable, Modal },
  data() {
    return {
      // 树形控件数据
      treeData: [],
      // 表格数据
      columns: columns.map(item => item.title == '操作' ? { ...item, visible: this.$hasp(['projectTask-edit', 'projectTask-del'], 'some') } : item),
      dataSource: [],
      selectedRows: this.$hasp('projectTask-del') ? [] : undefined,
      loading: false,
      // 弹窗数据
      visible: false,
      title: '',
      dataForm: { processTaskExtras: [] },
      taskTypeArr: [],
      selectKey: [],
      expandField: [], // 所有拓展项字段
      expandColumns,
      fields: [], // 选择的字段
      flag: false
    }
  },
  created() {
    this.getFlowTree()
    this.getSysConfigByAlias()
  },
  methods: {
    /**
     * 选中节点时触发
     */
    onSelect(selectedKeys) {
      this.dataForm.processNodeId = selectedKeys.length ? selectedKeys[0] : ''
      if (!selectedKeys.length) return
      this.getTaskList()
    },
    /**
     * 获取左侧节点列表
     */
    async getFlowTree() {
      const { data = [] } = await getFlowTree()
      this.treeData = data
      console.log(data)
    },
    /**
     * 获取右侧任务列表
     */
    async getTaskList() {
      this.loading = true
      try {
        const processNodeId = this.selectKey.length ? this.selectKey[0] : this.dataForm.processNodeId
        const { data } = await getTaskList(processNodeId)
        this.dataSource = data.map(item => ({ ...item, competence: item.competence.split(',') }))
        console.log(this.dataSource)
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },
    /**
     * 获取任务分类列表
     */
    async getSysConfigByAlias() {
      const { data = [] } = await getSysConfigByAlias('taskType')
      this.taskTypeArr = data
      console.log(data)
    },
    /**
     * 新增任务
     */
    addTask() {
      this.title = '新增任务'
      this.dataForm = { processNodeId: this.selectKey[0], competence: ['0'], processTaskExtras: [] }
      this.visible = true
    },
    /**
     * 修改任务
     */
    editTask(row) {
      const { id: taskId, type: taskType } = row
      this.title = '修改任务'
      this.dataForm = cloneDeep(row)
      this.getTaskConfigList({ taskId, taskType })
      this.visible = true
    },
    /**
     * 确认新增、修改任务
     */
    handleOk() {
      this.$refs.ruleForm.validate(async val => {
        if (!val) return
        const params = { ...this.dataForm, competence: this.dataForm.competence.join() }
        params.processTaskExtras = params.processTaskExtras.map(item => ({ extraId: item.extraId, orderNum: item.orderNum }))
        await this.saveNodeTask(params)
        this.getTaskList()
        this.visible = false
      })
    },
    /**
     * 发送请求保存节点任务
     */
    async saveNodeTask(params) {
      const { status } = await saveNodeTask(params)
      if (status == 200) this.$message.success(this.title.substring(0, 2) + '成功')
    },
    /**
     * 删除节点任务
     */
    async del(id) {
      const taskId = Array.isArray(id) ? id.map(item => item.id).join() : id
      await this.delNodeTask(taskId)
      this.getTaskList()
    },
    /**
     * 发送请求删除节点任务
     */
    async delNodeTask(id) {
      const { status } = await delNodeTask(id)
      if (status == 200) this.$message.success('删除成功')
    },
    /**
     * 获取任务类型对应拓展项配置
     */
    async getTaskConfigList(params) {
      if (this.flag) return
      this.flag = true
      const { data = [] } = await getTaskConfigList(params)
      const arr = cloneDeep(this.dataForm.processTaskExtras).map(item => ({ id: item.extraId, name: item.extraName }))
      this.expandField = [...arr, ...data]
      this.flag = false
    },
    /**
     * 添加拓展项
     */
    addField() {
      const fields = this.expandField.filter(item => this.fields.includes(item.id))
      fields.forEach(item => { item.orderNum = ''; item.extraName = item.name; item.extraId = item.id; item.extraValueType = item.valueType })
      this.dataForm.processTaskExtras.push(...fields)
      this.fields = []
      this.$refs.plus.$el.click()
    },
    /**
     * 删除拓展项
     */
    delField(item) {
      this.dataForm.processTaskExtras = this.dataForm.processTaskExtras.filter(field => field.id !== item.id)
    },
    /**
     * select 搜索
     */
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    }
  },
  watch: {
    'dataForm.competence'(val) {
      if (!val.includes('1') && val.length > 1) this.dataForm.competence = ['0']
    },
    'dataForm.type'(taskType) {
      if (!taskType) return (this.expandField = [])
      this.getTaskConfigList({ taskId: this.dataForm.id, taskType })
    }
  },
  computed: {
    selectFields() {
      const extraIds = this.dataForm.processTaskExtras.map(item => item.extraId)
      return this.expandField.filter(item => !extraIds.includes(item.id))
    }
  }
}
</script>
<style scoped lang="less">
.title {
  font-size: 16px;
  font-weight: 600;
  color: @primary-color;
}
.h-100 {
  height: 100%;
}
.scroll-y {
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
}
.space-between {
  display: flex;
  justify-content: space-between;
  align-content: center;
}
</style>
