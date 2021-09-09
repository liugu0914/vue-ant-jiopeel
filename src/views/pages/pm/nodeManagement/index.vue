<template>
  <a-card>
    <standard-table
      :columns="columns"
      :data-source="dataSource"
      :selected-rows.sync="selectedRows"
      :pagination="false"
      :is-search="false"
      :loading="loading">
      <template slot="btns">
        <a-button v-if="$hasp('projectNode-add')" type="primary" @click="addNode">
          新增
        </a-button>
        <a-popconfirm
          v-if="$hasp('projectNode-del')"
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
      <template slot="ops" slot-scope="{record}">
        <a-tooltip placement="top" title="添加子节点">
          <a-button v-if="record.level < 2 && $hasp('projectNode-add')" type="link" size="small" @click="addSubNode(record)">
            <a-icon type="plus" />
          </a-button>
        </a-tooltip>

        <a-tooltip v-if="$hasp('projectNode-edit')" placement="top" title="编辑">
          <a-button type="link" size="small" @click="edit(record)">
            <a-icon type="edit" />
          </a-button>
        </a-tooltip>

        <a-popconfirm v-if="$hasp('projectNode-del')" title="是否删除该数据?" @confirm="del(record.id)">
          <a-tooltip placement="top" title="删除">
            <a-button type="link" size="small">
              <a-icon type="delete" />
            </a-button>
          </a-tooltip>
        </a-popconfirm>
      </template>
    </standard-table>

    <!-- 新增、修改节点弹窗 -->
    <modal v-if="$hasp('projectNode-add') || $hasp('projectNode-edit')" :visible="visible" :title="title" @ok="handleOk" @cancel="visible = false">
      <a-form-model ref="ruleForm" :model="dataForm">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="节点名称" prop="name" :rules="{ required: true, message: '节点名称不能为空', trigger: 'blur'}">
              <a-input v-model="dataForm.name" :max-length="100" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="节点顺序">
              <a-input-number v-model="dataForm.orderNum" :max-length="100" class="w-100" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="是否审批" prop="process" :rules="{ required: true, message: '是否审批不能为空', trigger: 'blur'}">
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
          <a-col :span="24">
            <a-form-model-item label="超时预警" prop="overWarning" :rules="{ required: true, message: '超时预警不能为空', trigger: 'blur'}">
              <a-radio-group v-model="dataForm.overWarning">
                <a-radio :value="1">
                  是
                </a-radio>
                <a-radio :value="0">
                  否
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </modal>
  </a-card>
</template>

<script>
import { columns } from './const'
import { getFlowTree, saveNodeData, delNode } from '@/api/modules/pm/nodeManagement'
import StandardTable from '@/components/table/StandardTable'
import Modal from '@/components/modal/Modal'
import { cloneDeep } from '@/utils/tool'

export default {
  components: { StandardTable, Modal },
  data() {
    return {
      // 表格数据
      columns: columns.map(item => item.title == '操作' ? { ...item, visible: this.$hasp(['projectNode-add', 'projectNode-edit', 'projectNode-del'], 'some') } : item),
      dataSource: [],
      selectedRows: this.$hasp('projectNode-del') ? [] : undefined,
      loading: false,
      // 表单数据
      visible: false,
      title: '',
      dataForm: {}
    }
  },
  created() {
    this.getFlowTree()
  },
  methods: {
    setLevel(data, level = 1) {
      data.forEach(item => {
        item.level = level
        if (item.children && item.children.length) this.setLevel(item.children, level + 1)
      })
    },
    /**
     * 获取节点树
     */
    async getFlowTree() {
      this.loading = true
      try {
        const { data = [] } = await getFlowTree()
        this.dataSource = this.removeChildren(data)
        this.setLevel(this.dataSource)
        console.log(this.dataSource)
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },
    removeChildren(data) {
      data.forEach(item => {
        if (!item.children) return
        if (item.children && !item.children.length) return delete item.children
        this.removeChildren(item.children)
      })
      return data
    },
    /**
     * 新增一级节点
     */
    addNode() {
      this.title = '添加节点'
      this.dataForm = { superId: '0' }
      this.visible = true
    },
    /**
     * 新增子节点
     */
    addSubNode(row) {
      this.title = '添加子节点'
      this.dataForm = { superId: row.id }
      this.visible = true
    },
    /**
     * 确认添加、修改节点
     */
    handleOk() {
      this.$refs.ruleForm.validate(async val => {
        if (!val) return
        await this.saveNodeData().over()
        this.getFlowTree()
        this.visible = false
      })
    },
    /**
     * 修改节点
     */
    edit(row) {
      this.title = '修改节点'
      this.dataForm = cloneDeep(row)
      this.visible = true
    },
    /**
     * 删除节点
     */
    async del(id) {
      const nodeId = Array.isArray(id) ? id.map(item => item.id).join() : id
      await this.delNode(nodeId).over()
      this.getFlowTree()
    },
    /**
     * 发送请求新增、修改节点
     */
    async saveNodeData() {
      const { status } = await saveNodeData(this.dataForm)
      if (status == 200) this.$message.success(this.title.substring(0, 2) + '成功')
    },
    /**
     * 发送请求删除节点
     */
    async delNode(id) {
      const { status } = await delNode(id)
      if (status == 200) this.$message.success('删除成功')
    }
  }
}
</script>
<style scoped lang="less">
 /deep/.ant-table-thead > tr > th {
    text-align: center;
  }
</style>
