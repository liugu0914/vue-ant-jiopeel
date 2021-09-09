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
        <a-button v-if="$hasp('projectStatistics-add')" type="primary" @click="addProjectType">
          新增
        </a-button>
        <a-popconfirm
          v-if="$hasp('projectStatistics-del')"
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
        <a-tooltip v-if="$hasp('projectStatistics-edit')" placement="top" title="编辑">
          <a-button type="link" size="small" @click="edit(record)">
            <a-icon type="edit" />
          </a-button>
        </a-tooltip>
        <a-popconfirm v-if="$hasp('projectStatistics-del')" title="是否删除该数据?" @confirm="del(record.id)">
          <a-tooltip placement="top" title="删除">
            <a-button type="link" size="small">
              <a-icon type="delete" />
            </a-button>
          </a-tooltip>
        </a-popconfirm>
      </template>
    </standard-table>

    <!-- 新增、修改项目类型弹窗 -->
    <modal v-if="$hasp('projectStatistics-add') || $hasp('projectStatistics-edit')" :title="title" :visible="visible" width="700" @ok="handleOk" @cancel="visible = false">
      <a-form-model ref="ruleForm" :model="dataForm">
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-model-item label="统计名称" prop="name" :rules="{required: true, message: '统计名称不能为空', trigger: 'blur'}">
              <a-input v-model="dataForm.name" :max-length="100" class="w-50" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="节点配置" prop="nodeList" :rules="{required: true, message: '节点配置不能为空', trigger: 'blur'}">
              <div class="node">
                <div class="tree">
                  <a-tree v-if="treeData.length" v-model="checked" :tree-data="treeData" :replace-fields="{title: 'name', key: 'id'}" checkable default-expand-all @check="check" />
                </div>
                <div class="ml-2 mr-2 text-center" style="width: 65px">
                  <a-button @click="getNodeTree">
                    生成
                  </a-button>
                  <a-button @click="clear">
                    清空
                  </a-button>
                </div>
                <div class="tree">
                  <a-tree :key="key" :tree-data="dataForm.nodeList" :replace-fields="{title: 'name', key: 'id'}" draggable default-expand-all @drop="drop" />
                </div>
              </div>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </modal>
  </a-card>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'
import Modal from '@/components/modal/Modal'
import { columns } from './const'
import { getFlowTree } from '@/api/modules/pm/nodeManagement'
import { getNodeTree } from '@/api/modules/pm/projectType'
import { cloneDeep } from '@/utils/tool'
import { getStatistics, saveStatistics, delStatistics } from '@/api/modules/pm/projectStatistics'

export default {
  components: { StandardTable, Modal },
  data() {
    return {
      // 表格数据
      selectedRows: this.$hasp('projectStatistics-del') ? [] : undefined,
      columns: columns.map(item => item.title == '操作' ? { ...item, visible: this.$hasp(['projectStatistics-edit', 'projectStatistics-del'], 'some') } : item),
      dataSource: [],
      loading: false,
      // 新增、修改弹窗数据
      visible: false,
      title: '',
      dataForm: {},
      treeData: [],
      checkedKeys: [],
      key: '',
      checked: []
    }
  },
  created() {
    this.getFlowTree()
    this.getStatistics()
  },
  methods: {
    /**
     * 新增、修改弹窗确认
     */
    handleOk() {
      this.$refs.ruleForm.validate(async val => {
        if (!val) return
        this.setOrderNum(this.dataForm.nodeList)
        await this.saveStatistics().over()
        this.getStatistics()
        this.visible = false
        this.clear()
      })
    },
    /**
     * 新增按钮
     */
    addProjectType() {
      this.title = '新增统计配置'
      this.clear()
      this.dataForm = {}
      this.visible = true
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
     * 选中节点时触发
     */
    check(keys, event) {
      // 获取选中节点的父级节点 key
      const { halfCheckedKeys } = event
      this.checkedKeys = keys.concat(halfCheckedKeys)
    },
    /**
     * 发送请求根据选择的节点生成新的节点树
     */
    async getNodeTree() {
      if (!this.checkedKeys.length) return this.$message.warning('请先勾选节点！')
      const { data = [] } = await getNodeTree(this.checkedKeys)
      this.$set(this.dataForm, 'nodeList', data)
      console.log(data)
    },
    /**
     * 清除已选节点
     */
    clear() {
      this.$set(this.dataForm, 'nodeList', [])
      this.checked = []
      this.checkedKeys = []
    },
    /**
     * 拖拽排序
     */
    drop(info) {
      console.log(info)
      // 拖拽节点
      const dragNode = info.dragNode
      // 目标节点
      const node = info.node
      // 是否同级
      const equal = dragNode.$parent == node.$parent
      if (!equal) return this.$message.warning('不能拖拽到其他节点')
      // 拖拽后的位置
      let position = info.dropPosition
      // 父节点对象
      const fatherNode = dragNode.$parent.dataRef
      // 当前节点对象
      const nodeObj = dragNode.dataRef
      // 目标节点位置
      const ops = node.pos.split('-')
      // 确定修改的数组
      const arr = fatherNode ? fatherNode.children : this.dataForm.nodeList
      // 找到该对象在数组中的索引
      const index = arr.findIndex(item => item == nodeObj)
      // 向下拖
      if (index < position) {
        position = position - ops[ops.length - 1] == -1 ? position : position - 1
      } else {
        // 向上拖
        position = position - ops[ops.length - 1] == -1 ? position + 1 : position
      }
      // 删除该对象
      arr.splice(index, 1)
      // 插入到指定位置
      arr.splice(position, 0, nodeObj)
    },
    /**
     * 设置 orderNum
     */
    setOrderNum(arr) {
      arr.forEach((item, index) => {
        item.orderNum = index + 1
        if (item.children && item.children.length) this.setOrderNum(item.children)
      })
    },
    /**
     * 发送请求 新增、编辑项目统计配置
     */
    async saveStatistics() {
      const { status } = await saveStatistics(this.dataForm)
      if (status == 200) this.$message.success(this.title.substring(0, 2) + '成功')
    },
    /**
     * 获取项目统计配置
     */
    async getStatistics() {
      this.loading = true
      try {
        const { data = [] } = await getStatistics()
        this.dataSource = data
        console.log(data)
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },
    /**
     * 编辑项目类型
     */
    edit(row) {
      this.title = '修改统计配置'
      this.dataForm = cloneDeep(row)
      const arr = row.nodeList
      this.checked = this.getNodeId(arr)
      this.visible = true
    },
    /**
     * 删除项目统计配置
     */
    async del(id) {
      const projectTypeId = Array.isArray(id) ? id.map(item => item.id).join() : id
      await this.delStatistics(projectTypeId)
      this.getStatistics()
    },
    /**
     * 发送请求删除统计配置
     */
    async delStatistics(id) {
      const { status } = await delStatistics(id)
      if (status == 200) this.$message.success('删除成功')
    },
    /**
     * 获取子节点 id
     */
    getNodeId(data) {
      return data.reduce((result, item) => {
        if (item.children && item.children.length) {
          return result.concat(this.getNodeId(item.children))
        } else {
          result.push(item.projectProcessNodeId)
        }
        return result
      }, [])
    }
  },
  watch: {
    // 监听数据发送变化重新渲染 tree 组件
    'dataForm.nodeList': {
      handler() {
        this.key = +new Date()
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="less">
.node {
  display: flex;
  align-items: center;
  .tree {
    width: 49%;
    height: 430px;
    overflow-y: auto;
    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
    background-color: @layout-body-background;
  }
}
</style>
