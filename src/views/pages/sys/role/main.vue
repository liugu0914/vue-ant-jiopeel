<!--
  角色
  @date 2021年3月17日14:42:17
  @author lyc
 -->
<template>
  <a-card>
    <a-tabs v-if="apps.length>1" v-model="appId" class="mb-2" @change="changeTab">
      <a-tab-pane v-for="app in apps" :key="app.value" :tab="app.title" />
    </a-tabs>
    <!-- 表格 -->
    <standard-table
      :columns="columns"
      :data-source="dataSource"
      :selected-rows.sync="selectedRows"
      :loading="loading"
      :pagination="params.page"
      placeholder="搜索角色名称/标识/描述"
      @change="onChange"
      @search="onSearch"
    >
      <template slot="btns">
        <a-button type="primary" @click="add">
          <a-icon type="plus" />新建
        </a-button>
        <a-popconfirm title="是否确认删除选中的数据?" :disabled="selectedRows && selectedRows.length===0" @confirm="delSelectedRows">
          <a-button type="danger">
            <a-icon type="delete" />删除
          </a-button>
        </a-popconfirm>
      </template>
      <template slot="enable" slot-scope="{text}">
        <a-switch checked-children="是" disabled un-checked-children="否" :checked="text === '1'" />
      </template>
      <div slot="action" slot-scope="{record}">
        <a-tooltip title="分配权限">
          <a class="mr-1" @click="setPermission(record)">
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
    </standard-table>
    <!-- 权限分配 -->
    <modal
      v-model="pesVisible"
      :confirm-loading="pesConfirmLoading"
      width="80%"
      ok-text="确认"
      cancel-text="取消"
      title="权限分配"
      @ok="pesHandleOk" @cancel="pesHandleCancel">
      <a-row :gutter="[16,16]">
        <a-col :md="24" :lg="20">
          <a-card id="sys-per" class="mb-3" title="系统权限">
            <a slot="extra" @click="checkAllSysPes">全选</a>
            <a-checkbox-group v-if="config.sys.length>0" v-model="config.sysPes" :options="config.sys" @change="addSysPes" />
          </a-card>

          <a-card id="menu-per" title="菜单权限">
            <a slot="extra" @click="checkAllMenuPes">全选</a>
            <menuRoleCheck v-if="config.menus.length>0" :menus="config.menus" :fucs="config.fucs" :pes.sync="config.menuPes" />
          </a-card>
        </a-col>
        <a-col :md="0" :lg="4">
          <menuRoleAnchor :menus="config.menus" />
        </a-col>
      </a-row>
    </modal>
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
              <a-input v-model="dataForm.name" class="w-100" :max-length="100" autocomplete="off" allow-clear />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              :rules=" { required: false, message: '角色权重不能为空', trigger: 'blur' }"
              label="角色权重" prop="weight">
              <a-input v-model="dataForm.weight" class="w-100" :max-length="100" autocomplete="off" allow-clear />
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
  </a-card>
</template>

<script>
import { BoxPage, cloneDeep } from '@/utils/tool'
import { getListPage, configDetail, getOne, save, savePes, del } from '@/api/modules/sys/role'
import StandardTable from '@/components/table/StandardTable'
import Modal from '@/components/modal/Modal'
import { getAsyncApps } from '@/views/pages/sys/menu/async'
import { columns, defaultForm } from './constant'


export default {
  components: {
    StandardTable,
    Modal,
    MenuRoleCheck: () => import('./menuRoleCheck'),
    MenuRoleAnchor: () => import('./menuRoleAnchor')
  },
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
      apps: [], // 应用
      appId: '', // 选中的应用

      // 权限分配
      pesVisible: false, // 弹窗控制
      pesConfirmLoading: false, // 确认按钮控制
      activeRoleKey: '', // 选中的角色
      config: {
        sys: [], // 系统权限
        menus: [], // 菜单权限
        fucs: {}, // 功能权限
        sysPes: [], // 已配置的权限
        menuPes: [] // 已配置的权限
      }
    }
  },
  created() {
    this.getApps().then(() => {
      this.queryPage()
    })
  },
  methods: {
    /**
     * 获取应用集合
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    getApps() {
      return getAsyncApps().then(res => {
        this.apps = res
        if (res.length > 0) {
          this.appId = res[0].value
        }
      }).over()
    },
    /**
     * 获取配置信息集合
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    getConfigDetail() {
      return configDetail(this.appId, this.activeRoleKey).then(res => {
        const data = res.data || {}
        const { sys, menus, fucs, pes } = data
        this.config.sys = sys.map(item => ({ label: item.name, value: item.id }))
        this.config.menus = menus
        this.config.fucs = fucs
        this.config.sysPes = sys.filter(item => pes.includes(item.id)).map(item => item.id)
        this.config.menuPes = this.getHasPermission(menus, pes)
        console.log(this.config)
      }).over()
    },
    /**
     * 分页查询
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    queryPage() {
      this.loading = true
      this.params.query.appId = this.appId
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
      }).over().finally(() => {
        this.visible = true
      })
    },
    /**
     * 打开分配权限
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    setPermission(record) {
      this.pesVisible = true // 打开弹窗
      this.activeRoleKey = record.id // 角色Id
      this.getConfigDetail()
    },
    /**
     * 切换应用权限
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    changeTab(activeKey) {
      this.appId = activeKey
      this.queryPage()
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
        this.dataForm.appId = this.appId
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
      this.resetForm('ruleForm')
    },

    /**
     * 权限保存
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    pesHandleOk() {
      const params = {
        roleId: this.activeRoleKey,
        appId: this.appId,
        sysPes: this.config.sysPes,
        menuPes: this.config.menuPes
      }
      console.log('params : ', params)
      savePes(params).then(() => {
        this.$message.success('保存成功!')
      }).over().finally(() => {
        this.pesHandleCancel()
      })
    },

    /**
     * 权限取消
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    pesHandleCancel() {
      this.pesVisible = false
      this.pesConfirmLoading = false
      this.config.sysPes = []
      this.config.menuPes = []
    },
    /**
     * 点击系统权限checkBox
     * @param 选中的值
     * @date 2021年3月23日11:18:50
     * @author lyc
     */
    addSysPes(checkedValue) {
      this.config.sysPes = checkedValue
    },
    /**
     *全选系统权限
     * @date 2021年3月23日11:18:50
     * @author lyc
     */
    checkAllSysPes() {
      this.config.sysPes = this.config.sys.map(item => item.value)
    },
    /**
     *全选菜单权限
     * @date 2021年3月23日11:18:50
     * @author lyc
     */
    checkAllMenuPes() {
      this.config.menuPes = this.dGetPermission(this.config.menus)
    },
    /**
     *全选菜单权限
     * @param menus 菜单树
     * @date 2021年3月23日11:18:50
     * @author lyc
     */
    dGetPermission(menus) {
      const newArr = []
      menus.forEach(menu => {
        if (menu.parent === '1' && menu.children) {
          newArr.push(...this.dGetPermission(menu.children))
        } else {
          newArr.push(menu.permissionId) // 权限ID
          const menuFucs = this.config.fucs[menu.id] || []// 根据菜单ID
          newArr.push(...menuFucs.map(fuc => fuc.id))
        }
      })
      return newArr
    },
    /**
     *获取已存在的菜单权限
     * @param menus 菜单树
     * @date 2021年3月23日11:18:50
     * @author lyc
     */
    getHasPermission(menus, pes) {
      const newArr = []
      menus.forEach(menu => {
        if (menu.parent === '1' && menu.children) {
          newArr.push(...this.getHasPermission(menu.children, pes))
        } else {
          const menuId = menu.id // 菜单ID
          const permissionId = menu.permissionId // 权限ID
          if (pes.includes(permissionId)) {
            newArr.push(permissionId)
          }
          const menuFucs = this.config.fucs[menuId] || [] // 菜单下权限
          menuFucs.forEach(item => {
            if (pes.includes(item.id)) {
              newArr.push(item.id)
            }
          })
        }
      })
      return newArr
    }
  }
}
</script>
