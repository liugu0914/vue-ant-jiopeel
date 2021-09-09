<!--
  菜单
  @date 2021-2-26 10:23:26
  @author lyc
 -->
<template>
  <a-card>
    <a-tabs v-if="apps.length > 1" v-model="appId" class="mb-2" @change="switchApp">
      <a-tab-pane v-for="app in apps" :key="app.value" :tab="app.title" />
    </a-tabs>
    <!-- 表格 -->
    <standard-table
      :columns="columns"
      :data-source="dataSource"
      :selected-rows.sync="selectedRows"
      :loading="loading"
      :pagination="false"
      placeholder="搜索菜单名称/别称"
      @search="onSearch"
    >
      <template slot="btns">
        <a-button type="primary" @click="add()">
          <a-icon type="plus" />新建
        </a-button>
        <a-popconfirm
          title="是否确认删除选中的数据?"
          :disabled="selectedRows && selectedRows.length === 0"
          @confirm="delSelectedRows"
        >
          <a-button type="danger">
            <a-icon type="delete" />删除
          </a-button>
        </a-popconfirm>
      </template>
      <template slot="enable" slot-scope="{ text }">
        <a-switch checked-children="是" disabled un-checked-children="否" :checked="text === '1'" />
      </template>
      <div slot="action" slot-scope="{ record }">
        <a-tooltip v-if="record.parent === '1'" title="添加子菜单">
          <a class="mr-1" @click="add(record)">
            <a-icon type="plus" />
          </a>
        </a-tooltip>
        <a-tooltip title="编辑">
          <a class="mr-1" @click="edit(record)">
            <a-icon type="edit" />
          </a>
        </a-tooltip>
        <a-popconfirm title="是否确认删除?" @confirm="() => deleteRecord(record.id, record.appId)">
          <a-tooltip title="删除">
            <a>
              <a-icon type="delete" />
            </a>
          </a-tooltip>
        </a-popconfirm>
      </div>
      <my-icon slot="icon" slot-scope="{text}" :type="text" />
    </standard-table>
    <!-- 弹窗 -->
    <modal
      v-model="visible"
      :confirm-loading="confirmLoading"
      ok-text="确认"
      cancel-text="取消"
      :title="title"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model ref="ruleForm" :model="dataForm" layout="vertical">
        <a-row>
          <a-col :span="24">
            <a-form-model-item
              :rules="{ required: true, message: '菜单名称不能为空', trigger: 'blur' }"
              label="菜单名称"
              prop="name"
            >
              <a-input v-model="dataForm.name" class="w-100" :max-length="100" autocomplete="off" allow-clear />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              :rules="+dataForm.parent ? { required: true, message: '菜单图标不能为空', trigger: 'blur' } : {}"
              label="菜单图标"
              prop="icon"
            >
              <icon-select :icon-list="icons" @search="iconSearch" @select="iconSelect">
                <a-input v-model="dataForm.icon" class="w-100" :max-length="100" autocomplete="off" allow-clear />
              </icon-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              :rules="{ required: true, message: '是否为父级不能为空', trigger: 'blur' }"
              label="是否为父级"
              prop="parent"
            >
              <a-switch
                checked-children="是"
                un-checked-children="否"
                :checked="dataForm.parent === '1'"
                @change="checked => (dataForm.parent = checked ? '1' : '0')"
              />
            </a-form-model-item>
          </a-col>
          <a-col v-if="dataForm.parent === '0'" :span="24">
            <a-form-model-item
              :rules="{ required: true, message: '路由别称不能为空', trigger: 'blur' }"
              label="路由别称"
              prop="router"
            >
              <a-input v-model="dataForm.router" class="w-100" :max-length="100" autocomplete="off" allow-clear />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              :rules="{ required: false, message: '父级菜单不能为空', trigger: 'blur' }"
              label="父级菜单"
              prop="superId"
            >
              <a-tree-select
                v-model="dataForm.superId"
                class="w-100"
                allow-clear
                :tree-data="superMenus"
                tree-default-expand-all
                :replace-fields="{ children: 'children', title: 'name', key: 'id', value: 'id' }"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              :rules="{ required: true, message: '菜单顺序不能为空', trigger: 'blur' }"
              label="菜单顺序"
              prop="orderNum"
            >
              <a-input-number v-model="dataForm.orderNum" class="w-100" :min="1" :max="100000" allow-clear />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item :rules="{ required: true }" label="是否可用" prop="enable">
              <a-switch
                checked-children="是"
                un-checked-children="否"
                :checked="dataForm.enable === '1'"
                @change="checked => (dataForm.enable = checked ? '1' : '0')"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </modal>
  </a-card>
</template>

<script>
import { cloneDeep } from '@/utils/tool'
import { getListPage, getSuperMenus, getOne, save, del, getIconfonts } from '@/api/modules/sys/menu'
import StandardTable from '@/components/table/StandardTable'
import Modal from '@/components/modal/Modal'
import { columns, defaultForm } from './constant'
import { getAsyncApps } from './async'
import IconSelect from '@/components/icon-select'

export default {
  components: { StandardTable, Modal, IconSelect },
  data() {
    return {
      title: '',
      loading: false, // 表格加载
      visible: false, // 弹窗控制
      confirmLoading: false, // 确认按钮控制
      dataForm: cloneDeep(defaultForm), // 单条数据显示
      columns: columns, // 表字段
      params: {}, // 查询
      dataSource: [], // 数据行
      selectedRows: [], // 选择行
      apps: [], // 应用数据
      appId: '', // 应用Id
      superMenus: [], // 父级菜单
      icons: [], // 遍历的字体图标数组
      iconArr: [] // 请求的字体图标数组
    }
  },
  created() {
    getAsyncApps().then(apps => {
      if (apps.length > 0) {
        this.appId = apps[0].value
      }
      this.apps = apps
      this.queryPage()
    })
    this.getIconfonts()
  },
  watch: {
    visible(flag) {
      // 弹窗显示需要加载的数据
      if (!flag) {
        return
      }
      if (this.superMenus && this.superMenus.length === 0) {
        this.getMenus()
      }
    },
    dataForm: {
      handler(val) {
        if (val.parent === '1') this.$set(val, 'router', undefined)
      },
      deep: true
    }
  },
  methods: {
    /**
     * 切换应用
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    switchApp(activeKey) {
      this.appId = activeKey
      this.queryPage()
    },
    /**
     * 分页查询
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    queryPage() {
      this.loading = true
      getListPage({ appId: this.appId, ...this.params })
        .then(res => {
          const { data } = res
          this.dataSource = data || []
        })
        .over()
        .finally(() => {
          setTimeout(() => {
            this.loading = false
          }, 0)
        })
    },
    /**
     * 获取父级菜单列表数据
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    async getMenus() {
      this.superMenus = await getSuperMenus()
        .then(res => res.data || [])
        .over()
    },
    /**
     * 搜索
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    onSearch(conditions) {
      this.params = conditions
      console.log(conditions)
      this.queryPage()
    },
    /**
     * 新增
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    add(record) {
      this.title = '新增'
      this.visible = true
      if (record) {
        // 添加子菜单
        this.dataForm.parent = '0'
        this.dataForm.superId = record.id
      }
    },
    /**
     * 编辑
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    edit(record) {
      this.title = '编辑'
      getOne(record.id)
        .then(res => {
          const { data } = res
          data.superId = data.superId === '0' ? undefined : data.superId
          this.dataForm = data
        })
        .over()
        .finally(() => {
          this.visible = true
        })
    },
    /**
     * 删除
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    deleteRecord(id, appId) {
      del(id, appId)
        .then(() => {
          this.queryPage()
        })
        .over()
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
        save(this.dataForm)
          .then(() => {
            this.$message.success('保存成功!')
            this.queryPage()
            this.visible = false
            this.resetForm('ruleForm')
          })
          .over()
          .finally(() => {
            this.confirmLoading = false
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
     * 获取字体图标数据
     * @date 2021-6-7 17:36:00
     * @author zxp
     */
    async getIconfonts() {
      const { data } = await getIconfonts()
      const arr = data.match(/\id=".*?\"/g)
      this.iconArr = arr.map(item => item.replace('id=\"', '').replace('\"', ''))
      this.icons = cloneDeep(this.iconArr)
    },
    /**
     * 搜索字体图标
     * @date 2021-6-7 9:40:00
     * @author zxp
     */
    iconSearch(val) {
      this.icons = this.iconArr.filter(item => item.includes(val))
    },
    /**
     * 选择字体图标
     * @date 2021-6-7 9:41:00
     * @author zxp
     */
    iconSelect(icon) {
      this.$set(this.dataForm, 'icon', icon)
    }
  }
}
</script>
