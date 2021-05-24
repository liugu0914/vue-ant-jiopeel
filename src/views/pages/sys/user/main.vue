<!--
  用户
  @date 2021-2-26 10:23:26
  @author lyc
 -->
<template>
  <a-card>
    <!-- 表格 -->
    <standard-table
      :columns="columns"
      :data-source="dataSource"
      :selected-rows.sync="selectedRows"
      :loading="loading"
      :pagination="params.page"
      placeholder="搜索用户名称/账号"
      @change="onChange"
      @search="onSearch"
    >
      <template slot="btns">
        <a-button v-if="$hasp('sys-user-add')" type="primary" @click="add">
          <a-icon type="plus" />新建
        </a-button>
        <a-popconfirm v-if="$hasp('sys-user-del')" title="是否确认删除选中的数据?" :disabled="selectedRows && selectedRows.length===0" @confirm="delSelectedRows">
          <a-button>
            <a-icon type="delete" />删除
          </a-button>
        </a-popconfirm>
      </template>
      <a-avatar slot="imgUrl" slot-scope="{text}" :src="text" icon="user" />
      <div slot="action" slot-scope="{record}">
        <a-tooltip v-if="$hasp('sys-user-configRole')" title="分配角色">
          <a class="mr-1" @click="showRoles(record)">
            <a-icon type="apartment" />
          </a>
        </a-tooltip>
        <a-tooltip v-if="$hasp('sys-user-edit')" title="编辑">
          <a class="mr-1" @click="edit(record)">
            <a-icon type="edit" />
          </a>
        </a-tooltip>
        <a-popconfirm v-if="$hasp('sys-user-del')" title="是否确认删除?" @confirm="()=>deleteRecord(record.id)">
          <a-tooltip title="删除">
            <a>
              <a-icon type="delete" />
            </a>
          </a-tooltip>
        </a-popconfirm>
      </div>
    </standard-table>
    <!-- 弹窗 -->
    <modal
      v-model="visible"
      :confirm-loading="confirmLoading"
      ok-text="确认" cancel-text="取消" :title="title"
      @ok="handleOk"
      @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="dataForm" layout="vertical">
        <a-row>
          <a-col :sm="24">
            <div class="avatar">
              <upload :before-upload="beforeUpload" :show-upload-list="false" @change="handleChange">
                <a-avatar :size="150" :src="dataForm.imgUrl" icon="user" />
              </upload>
            </div>
          </a-col>
          <a-col :sm="24">
            <a-form-model-item
              :rules=" { required: true, message: '用户名称不能为空', trigger: 'blur' }"
              label="用户名称" prop="userName">
              <a-input v-model="dataForm.userName" class="w-100" :max-length="255" autocomplete="off" allow-clear />
            </a-form-model-item>
          </a-col>
          <a-col :sm="24">
            <a-form-model-item
              :rules=" { required: true, message: '账号不能为空', trigger: 'blur' }"
              label="账号" prop="account">
              <a-input v-model="dataForm.account" class="w-100" :max-length="255" autocomplete="off" allow-clear />
            </a-form-model-item>
          </a-col>
          <a-col :sm="24">
            <a-form-model-item
              :rules=" [{ required: true, message: '手机号不能为空',trigger: 'blur' },
                        { validator: checkPhone, trigger: 'blur' }]"
              label="手机号" prop="phone">
              <a-input v-model="dataForm.phone" class="w-100" :max-length="255" autocomplete="off" allow-clear />
            </a-form-model-item>
          </a-col>
          <a-col :sm="24">
            <a-form-model-item
              :rules=" [{ required: true, message: '身份证不能为空', trigger: 'blur' },
                        { validator: checkIdCard, trigger: 'blur' }]"
              label="身份证" prop="idCard">
              <a-input v-model="dataForm.idCard" class="w-100" :max-length="255" autocomplete="off" allow-clear />
            </a-form-model-item>
          </a-col>
          <a-col :sm="24">
            <a-form-model-item
              :rules=" { required: false, message: '部门不能为空', trigger: 'blur' }"
              label="部门" prop="deptId">
              <a-tree-select
                v-model="dataForm.deptId"
                class="w-100"
                allow-clear
                :tree-data="deptTree"
                :replace-fields="{ children: 'children', title: 'name', key: 'id', value: 'id' }"
              />
            </a-form-model-item>
          </a-col>
          <a-col :sm="24">
            <a-form-model-item
              :rules=" { required: false, message: '邮箱不能为空', trigger: 'blur' }"
              label="邮箱" prop="email">
              <a-input v-model="dataForm.email" class="w-100" :max-length="255" autocomplete="off" allow-clear />
            </a-form-model-item>
          </a-col>
          <a-col :sm="24">
            <a-form-model-item
              :rules=" { required: true}"
              label="是否可用" prop="enable">
              <a-switch checked-children="是" un-checked-children="否" :checked="dataForm.enable === '1'" @change="(checked)=>dataForm.enable =checked?'1':'0'" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </modal>
    <!-- 分配角色弹窗 -->
    <modal
      v-model="roleVisible"
      :confirm-loading="roleConfirmLoading"
      ok-text="确认" cancel-text="取消" title="分配角色"
      @ok="roleHandleOk"
      @cancel="roleHandleCancel">
      <a-list :data-source="roles">
        <a-list-item slot="renderItem" slot-scope="item" class="pointer" @click="chooseRole(item)">
          <div>
            <a-badge :status="role.roleId === item.id?'success':'default'" />
            <span class="mr-1">{{ item.name }}</span>
          </div>
          <span v-if="role.roleId === item.id" slot="extra" class="ant-tag ant-tag-has-color primary">
            当前
          </span>
        </a-list-item>
      </a-list>
    </modal>
  </a-card>
</template>

<script>
import { BoxPage, cloneDeep } from '@/utils/tool'
import { getListPage, getOne, save, del } from '@/api/modules/sys/user'
import { getUserRole, getUseFulRoles, saveUserRole } from '@/api/modules/sys/role'
import { getAsyncDepts } from './async'
import { downloadUrl } from '@/api/common/upload'
import { chkPhone, chkIdCard } from '@/utils/tool'
import StandardTable from '@/components/table/StandardTable'
import Modal from '@/components/modal/Modal'
import Upload from '@/components/upload'
import { columns, defaultForm } from './constant'

export default {
  components: { StandardTable, Modal, Upload },
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
      deptTree: [], // 部门树

      role: {}, // 当前角色
      roles: [], // 可选角色
      roleVisible: false, // 分配角色弹窗控制
      roleConfirmLoading: false //  分配角色确认按钮控制
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
      }).over().finally(() => {
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
      console.log('conditions', conditions)
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
      this.dataForm.type = 'local'
      this.visible = true
      this.getDeptTree()
    },
    /**
     * 编辑
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    edit(record) {
      this.title = '编辑'
      getOne(record.id).then(res => {
        const { data = {}} = res
        data.imgUrl = data.imgUrl || undefined
        this.dataForm = data
        this.getDeptTree()
      }).over().finally(() => {
        this.visible = true
      })
    },

    /**
     * 获取部门树结构
     * @date 2021-5-21 09:19:53
     * @author lyc
     */
    getDeptTree() {
      getAsyncDepts().then(res => {
        this.deptTree = res
      }).over()
    },
    /**
     * 删除
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    deleteRecord(id) {
      del(id).then(() => {
        this.queryPage()
      }).over()
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
          this.$message.success('保存成功!')
          this.queryPage()
        }).over().finally(() => {
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
      this.deptTree = []
      this.resetForm('ruleForm')
    },
    /**
     * 显示角色分配
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    showRoles(record) {
      this.roleVisible = true
      getUseFulRoles().then((res) => {
        this.roles = res.data || []
        return getUserRole(record.id)
      }).then(res => {
        const data = res.data || {}
        this.role = { roleId: data.id, userId: record.id }
      }).over()
    },
    /**
     * 选择角色
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    chooseRole(item) {
      this.role.roleId = item.id
    },
    /**
     * 保存角色分配
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    roleHandleOk() {
      if (!this.role.roleId) {
        return this.$message.warn('请选择角色后进行保存')
      }
      saveUserRole(this.role).then(() => {
        this.$message.success('保存成功')
      }).over().finally(() => {
        this.roleHandleCancel()
      })
    },
    /**
     * 取消角色分配
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    roleHandleCancel() {
      this.roleVisible = false
      this.roleConfirmLoading = false
      this.roles = []
      this.role = {}
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
        'image/jpeg'
      ]
      const type = typeArr.includes(file.type)
      const size = file.size / 1024 / 1024
      if (!type) {
        this.$message.error('请选择图片上传！')
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
    handleChange({ file }) {
      if (file.status === 'done') {
        const response = file.response
        const { data = {}} = response
        this.dataForm.imgUrl = downloadUrl + data.url
        console.log(this.dataForm.imgUrl)
      }
    },
    /**
     * 检查手机号
     * @date 2021-5-21 12:10:43
     * @author lyc
     */
    checkPhone(rule, value, callback) {
      return chkPhone(value) ? callback() : callback(new Error('手机号格式不正确'))
    },
    /**
     * 检查身份证号
     * @date 2021-5-21 12:11:06
     * @author lyc
     */
    checkIdCard(rule, value, callback) {
      return chkIdCard(value) ? callback() : callback(new Error('身份证格式不正确'))
    }
  }
}
</script>
<style lang="less" scoped>
.primary{
  background-color:  @primary-color;
}
.text{
  color:  @text-color;
}
.pointer{
  cursor: pointer;
}
.avatar{
  text-align: center;
  margin-bottom: 16px;
}
</style>
