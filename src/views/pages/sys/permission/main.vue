<!--
  权限
  @date 2021年3月15日14:51:36
  @author lyc
 -->
<template>
  <div>
    <a-tabs v-if="apps.length>1" v-model="appId" @change="switchApp">
      <a-tab-pane v-for="app in apps" :key="app.value" :tab="app.title" />
    </a-tabs>
    <a-row>
      <!-- 系统配置 -->
      <a-collapse default-active-key="1" :bordered="false" class="collapse">
        <template #expandIcon="props">
          <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
        </template>
        <a-collapse-panel key="1" header="系统权限" class="collapse-panel">
          <a-row class="mb-2">
            <a-col>
              <a-button type="primary" @click="add('sys')">
                <a-icon type="plus" />添加权限
              </a-button>
            </a-col>
          </a-row>
          <a-row :gutter="[16,16]">
            <a-col v-for="(sys,index) in syses" :key="index" :xl="4" :lg="6" :md="12" :sm="24">
              <actionAlter :message="sys.name" :disabled="sys.enable==='0'">
                <a-tooltip title="编辑">
                  <a>
                    <a-icon type="edit" style="margin-right:4px" @click="edit(sys)" />
                  </a>
                </a-tooltip>
                <a-popconfirm title="是否确认删除?" @confirm="del('sys',sys.id)">
                  <a-tooltip title="删除">
                    <a>
                      <a-icon type="delete" />
                    </a>
                  </a-tooltip>
                </a-popconfirm>
              </actionAlter>
            </a-col>
          </a-row>
        </a-collapse-panel>
      </a-collapse>
      <!-- 菜单配置 -->
      <a-collapse default-active-key="1" :bordered="false" class="collapse">
        <template #expandIcon="props">
          <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
        </template>
        <a-collapse-panel key="1" header="菜单权限" class="collapse-panel">
          <a-row class="mb-2">
            <a-col>
              <a-button type="primary" @click="openMenuConfig">
                <a-icon type="setting" />配置菜单
              </a-button>
            </a-col>
          </a-row>
          <a-row v-if="menusTree.length>0" :gutter="[16,16]">
            <a-col :xl="4" :lg="6" :md="12" :sm="24">
              <div class="box">
                <a-tree
                  :expanded-keys="expandedKeys"
                  :selected-keys="selectedKeys"
                  :tree-data="menusTree"
                  @select="selectMenu"
                  @expand="expandNode"
                />
              </div>
            </a-col>
            <a-col :xl="20" :lg="18" :md="12" :sm="24">
              <a-row class="mb-2" type="flex" justify="space-between">
                <a-col>
                  <a-button type="link">
                    {{ selectNode.name }}
                  </a-button>
                </a-col>
                <a-col>
                  <a-button type="primary" @click="add('fuc')">
                    <a-icon type="plus" />添加权限
                  </a-button>
                </a-col>
              </a-row>
              <a-row :gutter="[16,16]">
                <a-col v-for="(fuc,index) in fucs" :key="index" :lg="6" :md="12" :sm="24">
                  <actionAlter :message="fuc.name" :disabled="fuc.enable==='0'">
                    <a-tooltip title="编辑">
                      <a>
                        <a-icon type="edit" style="margin-right:4px" @click="edit(fuc)" />
                      </a>
                    </a-tooltip>
                    <a-popconfirm title="是否确认删除?" @confirm="del('fuc',fuc.id)">
                      <a-tooltip title="删除">
                        <a>
                          <a-icon type="delete" />
                        </a>
                      </a-tooltip>
                    </a-popconfirm>
                  </actionAlter>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </a-collapse-panel>
      </a-collapse>
    </a-row>
    <!--菜单添加弹窗 -->
    <modal
      v-model="menuVisible"
      :confirm-loading="menuConfirmLoading"
      ok-text="确认" cancel-text="取消" title="配置菜单"
      @ok="menuHandleOk"
      @cancel="menuHandleCancel">
      <a-tree
        default-expand-all
        checkable
        :checked-keys="checkedKeys"
        :tree-data="menuConfigTrees"
        @check="checkNode"
      />
    </modal>
    <!--权限添加弹窗 -->
    <modal
      v-model="visible"
      :confirm-loading="confirmLoading"
      ok-text="确认" cancel-text="取消" :title="title"
      @ok="handleOk"
      @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="dataForm">
        <a-row>
          <a-col :sm="24">
            <a-form-model-item
              :rules=" { required: true, message: '权限名称不能为空', whitespace:true, trigger: ['change', 'blur'] }"
              label="权限名称" prop="name">
              <a-input v-model="dataForm.name" class="w-100" :max-length="100" autocomplete="off" allow-clear />
            </a-form-model-item>
          </a-col>
          <a-col :sm="24">
            <a-form-model-item
              :rules=" { required: true, message: '主地址/权限别称不能为空', whitespace:true, trigger: ['change', 'blur'] }"
              label="主地址/权限别称" prop="target">
              <a-input v-model="dataForm.target" class="w-100" :max-length="100" autocomplete="off" allow-clear @change="mainTarget2Charm" />
            </a-form-model-item>
          </a-col>
          <a-col :sm="24">
            <a-form-model-item
              :rules=" { required: true, message: '通配符不能为空', whitespace:true, trigger: ['change', 'blur'] }"
              label="通配符" prop="charm">
              <a-input v-model="dataForm.charm" class="w-100" :max-length="100" autocomplete="off" allow-clear disabled />
            </a-form-model-item>
          </a-col>
          <a-col :sm="24">
            <a-form-model-item
              v-for="(item,index) in dataForm.permissions" :key="item.key"
              ref="permissions"
              :prop="'permissions['+index+'].target'"
              :rules=" { required: false, message: '目标地址不能为空', whitespace:true, trigger: ['change', 'blur'] }"
              :label="index === 0? '目标地址':''">
              <a-input-group compact :style="{width: dataForm.permissions.length>1?'95%':'100%'}">
                <a-input
                  v-model="item.target"
                  class="w-50"
                  :max-length="100" autocomplete="off" allow-clear
                  @blur="() => {$refs['permissions'][index].onFieldBlur()}"
                  @change="(e)=>{
                    $refs['permissions'][index].onFieldChange();
                    target2Charm(e,item.key)
                  }" />
                <a-input v-model="item.charm" class="w-50" disabled />
              </a-input-group>
              <a-icon v-if="dataForm.permissions.length>1" style="width: 5%" class="pointer" type="minus-circle-o" @click="delPermissions(item.key)" />
            </a-form-model-item>
            <a-button type="dashed" class="w-100" @click="addPermissions">
              <a-icon type="plus" /> 添加权限
            </a-button>
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
  </div>
</template>
<script>
import ActionAlter from '@/components/alter/ActionAlert'
import Modal from '@/components/modal/Modal'
import { getSys, getMenu, getFuc, getConfigMenu, saveMenu, getOne, save, del } from '@/api/modules/sys/permission'
import { getAsyncApps } from '@/views/pages/sys/menu/async'
import { cloneDeep } from '@/utils/tool'
import { defaultForm } from './constant'
export default {
  components: {
    ActionAlter,
    Modal
  },
  data() {
    return {
      apps: [], // 应用
      menusTree: [], // 已配置的菜单树
      expandedKeys: [], // 需要展开的树节点
      selectedKeys: [], // 选中树节点
      selectNode: {}, // 选中的菜单数据
      syses: [], // 系统级别权限
      fucs: [], // 功能级别权限
      appId: 0, // 当前选中的应用
      menuId: 0, // 选中的菜单Id
      // 菜单弹窗
      menuVisible: false,
      menuConfirmLoading: false,
      menuConfigTrees: [], // 菜单配置数据
      checkedKeys: [], // 选中的节点
      // 权限弹窗
      visible: false,
      confirmLoading: false,
      title: '新增',
      dataForm: cloneDeep(defaultForm) // 单条数据显示
    }
  },
  created() {
    getAsyncApps().then(res => {
      this.apps = res
      if (this.apps && this.apps.length > 0) {
        this.appId = this.apps[0].value
      }
    }).then(() => {
      // 查询权限数据
      this.loadSys()
      this.loadMenu()
    }).over()
  },
  methods: {
    switchApp(key) {
      // 切换应用
      this.appId = key
      this.loadSys()
      this.loadMenu()
    },
    /**
     * 选中菜单
     * @date 2021年3月17日10:21:04
     * @author lyc
     */
    selectMenu(selectedKeys, { node }) {
      this.selectNode = node.dataRef
      this.selectedKeys = [node.dataRef.id]
      if (selectedKeys.length > 0) {
        this.menuId = selectedKeys[0]
        this.getFucBymenuId()
      }
    },
    /**
     * 展开节点
     * @date 2021年3月17日10:21:04
     * @author lyc
     */
    expandNode(expandedKeys) {
      this.expandedKeys = expandedKeys
    },
    /**
     * 通过菜单Id查询权限
     * @date 2021年3月17日10:21:04
     * @author lyc
     */
    getFucBymenuId() {
      getFuc(this.menuId).then(res => {
        const data = res.data || []
        this.fucs = data
      }).over()
    },
    /**
     * 禁用父节点，组装tree需要的数据
     * @date 2021年3月17日10:21:04
     * @author lyc
     */
    boxTree(datas) {
      return datas.map(data => {
        const item = {
          ...data,
          title: data.name,
          key: data.id,
          disabled: data.parent === '1'
        }
        if (data.children && data.children.length > 0) {
          item.children = this.boxTree(data.children)
        }
        return item
      })
    },
    /**
     * 加载已配置的系统权限
     * @date 2021年3月17日10:21:04
     * @author lyc
     */
    loadSys() {
      getSys(this.appId).then((res) => {
        this.syses = res.data || []
      }).over()
    },
    /**
     * 加载已配置的菜单
     * @date 2021年3月17日10:21:04
     * @author lyc
     */
    loadMenu() {
      getMenu(this.appId).then((res) => {
        const data = res.data || []
        this.menusTree = this.boxTree(data)
        console.log(this.menusTree)
        if (data.length > 0) { // 选中第  一个子节点
          let fchildren
          if (data[0].children && data[0].children.length > 0) {
            fchildren = data[0].children[0]
          } else {
            fchildren = data[0]
          }
          const menuId = fchildren.id // 选中子节点
          this.menuId = menuId
          this.expandedKeys.push(data[0].id) // 展开父节点
          this.selectedKeys.push(menuId)
          this.selectNode = fchildren
          this.getFucBymenuId()
        } else {
          // 为空赋值操作
          this.expandedKeys = [] // 需要展开的树节点
          this.selectedKeys = [] // 选中树节点
          this.selectNode = {} // 选中的菜单数据
          this.fucs = [] // 功能级别权限
          this.menuId = 0 // 选中的菜单Id
        }
      }).over()
    },
    /**
     * 打开菜单配置
     * @date 2021年3月17日10:21:04
     * @author lyc
     */
    openMenuConfig() {
      getConfigMenu(this.appId).then(res => {
        const menus = res.data || []
        this.menuConfigTrees = menus
        this.checkedKeys = this.getCheckedNode(menus)
        console.log(this.checkedKeys)
      }).over().finally(() => {
        this.menuVisible = true
      })
    },
    /**
     * 获取选中的节点
     * @date 2021年3月17日10:21:04
     * @author lyc
     */
    getCheckedNode(datas, checkedNodes = []) {
      datas.forEach(item => {
        if (item.checked) {
          checkedNodes.push(item.key)
        }
        if (item.children && item.children.length > 0) {
          this.getCheckedNode(item.children, checkedNodes)
        }
      })
      return checkedNodes
    },
    /**
     * 点击复选框触发
     * @date 2021年3月17日10:21:04
     * @author lyc
     */
    checkNode(checkedKeys, e) {
      this.checkedKeys = checkedKeys
    },
    /**
     * 保存选中的菜单树
     * @date 2021年3月17日10:21:04
     * @author lyc
     */
    menuHandleOk() {
      this.menuConfirmLoading = true
      saveMenu(this.appId, this.checkedKeys).then(res => {
        this.$message.success('保存成功!')
        // 刷新菜单
        this.loadMenu()
      }).over().finally(() => {
        this.menuVisible = false
        this.menuConfirmLoading = false
      })
    },
    /**
     * 取消菜单模态窗口
     * @date 2021年3月17日10:21:04
     * @author lyc
     */
    menuHandleCancel() {
      this.menuVisible = false
      console.log('menuHandleCancel')
    },
    /**
     * 添加权限操作
     * @param {String} type 类型  fuc 功能 sys 系统
     * @date 2021年3月17日10:21:04
     * @author lyc
     */
    add(type) {
      this.title = '新增'
      this.dataForm.appId = this.appId
      this.dataForm.type = type
      if (type === 'fuc') { // 功能权限需要指定菜单Id
        this.dataForm.menuId = this.menuId
      }
      this.visible = true
    },
    /**
     * 添加权限行操作
     * @date 2021年3月17日10:21:04
     * @author lyc
     */
    addPermissions() {
      this.dataForm.permissions.push({
        key: new Date().getTime(),
        target: undefined,
        charm: undefined
      })
    },
    /**
     * 删除权限行操作
     * @date 2021年3月17日10:21:04
     * @author lyc
     */
    delPermissions(key) {
      const index = this.dataForm.permissions.findIndex((item) => item.key === key)
      this.dataForm.permissions.splice(index, 1)
    },
    /**
     * 编辑权限操作
     * @date 2021年3月17日10:21:04
     * @author lyc
     */
    edit(record) {
      this.title = '编辑'
      getOne(record.id).then(res => {
        const data = res.data || {}
        if (!data.permissions || data.permissions.length === 0) {
          data.permissions = [
            {
              target: undefined,
              charm: undefined
            }
          ]
        }
        this.dataForm = data
        this.dataForm.permissions.map(item => {
          item.key = item.id || new Date().getTime()
        })
      }).over().finally(() => {
        this.visible = true
      })
    },
    /**
     * 删除权限操作
     * @date 2021年3月17日10:21:04
     * @param {String} type 类型  fuc 功能 sys 系统
     * @param {String} id 权限Id
     * @author lyc
     */
    del(type, id) {
      del(id).then(() => {
        if (type === 'sys') {
          this.loadSys()
        }
        if (type === 'fuc') {
          this.getFucBymenuId()
        }
      }).over()
    },
    /**
     * 保存
     * @date 2021年3月17日10:33:38
     * @author lyc
     */
    handleOk() {
      this.$refs['ruleForm'].validate(valid => {
        if (!valid) return
        const dataForm = cloneDeep(this.dataForm)
        this.confirmLoading = true
        const type = dataForm.type
        dataForm.permissions = dataForm.permissions.slice().filter(item => {
          return item.target && item.charm
        })
        save(dataForm).then(() => {
          this.$message.success('保存成功!')
          if (type === 'sys') {
            this.loadSys()
          }
          if (type === 'fuc') {
            this.getFucBymenuId()
          }
        }).over().finally(() => {
          this.visible = false
          this.confirmLoading = false
          this.resetForm('ruleForm')
        })
      })
    },
    /**
     * 取消模态窗口
     * @date 2021年3月17日10:21:04
     * @author lyc
     */
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
      this.resetForm('ruleForm')
    },
    /**
     * 重置数据
     * @date 2021年3月17日10:21:04
     * @author lyc
     */
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dataForm = cloneDeep(defaultForm)
    },
    /**
     * 将target转成通配符
     * @date 2021年3月17日10:21:04
     * @author lyc
     */
    mainTarget2Charm() {
      let uri = cloneDeep(this.dataForm.target)
      if (!uri) {
        uri = ''
      }
      if (uri.startsWith('/')) {
        uri = uri.substring(1)
      }
      this.dataForm.charm = uri.replace(/\//g, ':')
    },
    /**
     * 将target转成通配符
     * @date 2021年3月17日10:21:04
     * @author lyc
     */
    target2Charm(e, key) {
      const value = e.target.value
      let uri = cloneDeep(value)
      if (!uri) {
        uri = ''
      }
      if (uri.startsWith('/')) {
        uri = uri.substring(1)
      }
      const index = this.dataForm.permissions.findIndex((item) => item.key === key)
      this.dataForm.permissions[index].charm = uri.replace(/\//g, ':')
    }
  }
}
</script>
<style scoped lang="less">
  .collapse{
    border-radius: @border-radius-xl;
    .collapse-panel{
      background: @component-background;
      border-radius: @border-radius-xl;
      margin-bottom: 24px;
      border: 0;
    }
  }
  .box{
    border: 1px solid #f0f0f0;
    border-radius: @border-radius-md;
    display: inline-block;
    width: 100%;
    position: relative;
    margin: 0 0 16px;
    padding: 0 10px;
    transition: all .2s;
  }
</style>
