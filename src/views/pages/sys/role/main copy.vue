<!--
  角色
  @date 2021年3月17日14:42:17
  @author lyc
 -->
<template>
  <a-card>
    <a-tabs v-model="activeRoleKey" hide-add type="editable-card">
      <a-tab-pane v-for="role in roles" :key="role.id">
        <span slot="tab">
          {{ role.name }}
          <a-icon type="edit" />

        </span>
      </a-tab-pane>
      <a-button slot="tabBarExtraContent" type="primary" @click="add()">
        <a-icon type="plus" />添加角色
      </a-button>
    </a-tabs>
    <a-tabs v-model="activeAppKey">
      <a-tab-pane v-for="app in apps" :key="app.value" :tab="app.title" />
    </a-tabs>
    <a-button @click="sysout">
      asd
    </a-button>
    <a-row :gutter="[16,16]">
      <a-col :md="24" :lg="20">
        <a-card id="sys-per" class="mb-3" title="系统权限">
          <a slot="extra" @click="checkAllSysPes">全选</a>
          <a-checkbox-group v-model="config.sysPes" :options="config.sys" @change="addSysPes" />
        </a-card>

        <a-card id="menu-per" title="菜单权限">
          <a slot="extra" @click="checkAllMenuPes">全选</a>
          <menuRoleCheck :menus="config.menus" :fucs="config.fucs" :pes.sync="config.menuPes" />
        </a-card>
      </a-col>
      <a-col :md="0" :lg="4">
        <menuRoleAnchor :menus="config.menus" />
      </a-col>
    </a-row>


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
  </a-card>
</template>

<script>
import { cloneDeep } from '@/utils/tool'
import { getList, configDetail, getOne, save, del } from '@/api/modules/sys/role'
import Modal from '@/components/modal/Modal'
import MenuRoleCheck from './menuRoleCheck'
import MenuRoleAnchor from './menuRoleAnchor'
import { getAsyncApps } from '@/views/pages/sys/menu/async'
import { defaultForm } from './constant'


export default {
  inject: ['content'],
  components: { Modal, MenuRoleCheck, MenuRoleAnchor },
  data() {
    return {
      title: '',
      visible: false, // 弹窗控制
      confirmLoading: false, // 确认按钮控制
      dataForm: cloneDeep(defaultForm), // 单条数据显示
      roles: [], // 角色行
      activeRoleKey: '', // 选中的角色
      apps: [], // 选择行
      activeAppKey: '', // 选中的应用
      // 权限分配
      plainOptions: ['Apple', 'Pear', 'Orange'],
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
      this.getRoles().then(() => {
        this.getConfigDetail()
      })
    })
  },
  computed: {
    /**
     * 判断该权限是否被选中
     * @date 2021年3月23日11:18:50
     * @author lyc
     */
    isChecked(id) {
      console.log(this.config.pes.includes(id))
      return this.config.pes.includes(id)
    }
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
          this.activeAppKey = res[0].value
        }
      }).done()
    },
    /**
     * 获取配置信息集合
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    getConfigDetail() {
      return configDetail(this.activeAppKey, this.activeRoleKey).then(res => {
        const data = res.data || {}
        const { sys, menus, fucs, pes } = data
        this.config.sys = sys.map(item => ({ label: item.name, value: item.id }))
        this.config.menus = menus
        this.config.fucs = fucs
        this.config.sysPes = sys.filter(item => pes.includes(item.id)).map(item => item.id)
        this.config.menuPes = this.getHasPermission(menus, pes)
        console.log(this.config)
      }).done()
    },
    /**
     * 获取角色列表
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    getRoles() {
      return getList().then(res => {
        const { data = [] } = res
        this.roles = data
        if (data.length > 0) {
          this.activeRoleKey = data[0].id
        }
      }).done()
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
          newArr.push(menu.id)
          const menuFucs = this.config.fucs[menu.id] || []
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
          const menuId = menu.id
          if (pes.includes(menuId)) {
            newArr.push(menuId)
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
    },
    sysout() {
      console.log('config.pes : ', this.config.sysPes.concat(this.config.menuPes))
    }
  }
}
</script>
