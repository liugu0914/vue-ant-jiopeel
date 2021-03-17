<!--
  角色
  @date 2021年3月17日14:42:17
  @author lyc
 -->
<template>
  <a-card>
    <!-- 表格 -->
    <!-- <standard-table
      :columns="columns"
      :data-source="dataSource"
      :selected-rows.sync="selectedRows"
      :loading="loading"
      :pagination="params.page"
      placeholder="搜索角色名称/描述"
      @change="onChange"
      @search="onSearch"
    >
      <template slot="btns">
        <a-button type="primary" @click="add">
          <a-icon type="plus" />新建
        </a-button>
        <a-popconfirm title="是否确认删除选中的数据?" :disabled="selectedRows && selectedRows.length===0" @confirm="delSelectedRows">
          <a-button>
            <a-icon type="delete" />删除
          </a-button>
        </a-popconfirm>
      </template>
      <template slot="enable" slot-scope="{text}">
        <a-switch checked-children="是" disabled un-checked-children="否" :checked="text === '1'" />
      </template>
      <div slot="action" slot-scope="{record}">
        <a-tooltip title="分配权限">
          <a class="mr-1" @click="edit(record)">
            <a-icon type="share-alt" />
          </a>
        </a-tooltip>
        <a-tooltip title="编辑">
          <a class="mr-1" @click="edit(record)">
            <a-icon type="edit" />
          </a>
        </a-tooltip>
        <a-popconfirm title="是否确认删除?" @confirm="()=>deleteRecord(record.id)">
          <a-tooltip title="删除">
            <a>
              <a-icon type="delete" />
            </a>
          </a-tooltip>
        </a-popconfirm>
      </div>
    </standard-table> -->
    <a-tabs default-active-key="1" tab-position="left">
      <a-tab-pane v-for="(role,index) in dataSource" :key="index" :tab="role.name">
        Content of Tab 1
      </a-tab-pane>
    </a-tabs>

    <!-- 弹窗 -->
    <modal
      v-model="visible"
      :confirm-loading="confirmLoading"
      ok-text="确认" cancel-text="取消" :title="title"
      @ok="handleOk"
      @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="dataForm" layout="vertical">
        <a-row>
          <a-col :span="24">
            <a-form-model-item
              :rules=" { required: true, message: '角色名称不能为空', trigger: 'blur' }"
              label="角色名称" prop="name">
              <a-input v-model="dataForm.name" class="w-100" :max-length="255" autocomplete="off" allow-clear />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              :rules=" { required: true, message: '角色权重不能为空', trigger: 'blur' }"
              label="角色权重" prop="weight">
              <a-input v-model="dataForm.weight" class="w-100" :max-length="255" autocomplete="off" allow-clear />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              :rules=" { required: false, message: '角色描述不能为空', trigger: 'blur' }"
              label="角色描述" prop="remark">
              <a-textarea v-model="dataForm.remark" class="w-100" :max-length="255" allow-clear />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              :rules=" { required: true}"
              label="是否可用" prop="enable">
              <a-switch checked-children="是" un-checked-children="否" :checked="dataForm.enable === '1'" @change="(checked)=>dataForm.enable =checked?'1':'0'" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </modal>
    <!-- 权限分配 -->
    <modal
      v-model="pvisible"
      :confirm-loading="pconfirmLoading"
      ok-text="确认" cancel-text="取消" title="配置菜单"
      @ok="pHandleOk"
      @cancel="pHandleCancel">
      <a-tree
        default-expand-all
        checkable
        :checked-keys="checkedKeys"
        :tree-data="menuConfigTrees"
        @check="checkNode"
      />
    </modal>
  </a-card>
</template>

<script>
import { BoxPage, cloneDeep } from '@/utils/tool'
import { getListPage, getOne, save, del } from '@/api/modules/sys/role'
import Modal from '@/components/modal/Modal'
import { columns, defaultForm } from './constant'

export default {
  components: { Modal },
  data() {
    return {
      title: '',
      loading: false, // 表格加载
      visible: false, // 弹窗控制
      confirmLoading: false, // 确认按钮控制
      dataForm: cloneDeep(defaultForm), // 单条数据显示
      columns: columns, // 表字段
      params: { // 分页查询
        page: {}, // 分页数据
        query: {} // 查询数据
      },
      dataSource: [], // 数据行
      selectedRows: [], // 选择行
      // 权限分配
      pvisible: false,
      pconfirmLoading: false // 确认按钮控制

    }
  },
  created() {
    this.queryPage()
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
      }).done().finally(() => {
        setTimeout(() => {
          this.loading = false
        }, 0)
      })
    },
    /**
     * 搜索
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    onSearch(conditions) {
      this.params.query = conditions
      console.log(this.params.query)
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
     * 新增
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    add() {
      this.title = '新增'
      this.visible = true
    },
    /**
     * 编辑
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    edit(record) {
      this.title = '编辑'
      getOne(record.id).then(res => {
        this.dataForm = res.data
      }).done().finally(() => {
        this.visible = true
      })
    },
    /**
     * 删除
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    deleteRecord(id) {
      del(id).then(() => {
        this.queryPage()
      }).done()
    },
    /**
     * 删除选择行
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    delSelectedRows() {
      const id = this.selectedRows.map(item => item.id).join(',')
      if (id) {
        this.deleteRecord(id)
      }
    },
    /**
     * 重置数据
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dataForm = cloneDeep(defaultForm)
    },
    /**
     * 保存
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    handleOk() {
      this.$refs['ruleForm'].validate(valid => {
        if (!valid) return
        this.confirmLoading = true
        save(this.dataForm).then(res => {
          this.queryPage()
        }).done().finally(() => {
          this.visible = false
          this.confirmLoading = false
          this.resetForm('ruleForm')
        })
      })
    },
    /**
     * 取消
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
      this.resetForm('ruleForm')
    },
    pHandleOk() {
      this.pvisible = true
    },
    /**
     * 取消
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    phandleCancel() {
      this.pvisible = false
      this.pconfirmLoading = false
    }
  }
}
</script>
