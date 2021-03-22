<!--
  角色
  @date 2021年3月17日14:42:17
  @author lyc
 -->
<template>
  <a-card>
    <a-tabs default-active-key="1">
      <a-tab-pane v-for="(role,index) in roles" :key="index" :tab="role.name" />
    </a-tabs>
    <a-row :gutter="[16,16]">
      <a-col :md="24" :lg="20">
        <a-card id="sys-per" class="mb-3" title="系统权限">
          <a slot="extra" href="#">全选</a>
          <a-checkbox-group :options="plainOptions" />
        </a-card>
        <a-card id="menu-per" title="菜单权限">
          <a slot="extra" href="#">全选</a>
          <a-divider id="menu-sys" orientation="left">
            系统配置
          </a-divider>

          <a-card id="menu-sys-menu" class="mb-2">
            <a slot="extra" href="#">全选</a>
            <a-checkbox slot="title">
              菜单管理
            </a-checkbox>
            <a-checkbox-group :options="plainOptions" />
          </a-card>
          <a-card id="menu-sys-app" class="mb-2">
            <a slot="extra" href="#">全选</a>
            <a-checkbox slot="title">
              应用管理
            </a-checkbox>
            <a-checkbox-group :options="plainOptions" />
          </a-card>
          <a-card id="menu-sys-per" class="mb-2">
            <a slot="extra" href="#">全选</a>
            <a-checkbox slot="title">
              权限管理
            </a-checkbox>
            <a-checkbox-group :options="plainOptions" />
          </a-card>
          <a-card id="menu-sys-user" class="mb-2">
            <a slot="extra" href="#">全选</a>
            <a-checkbox slot="title">
              用户管理
            </a-checkbox>
            <a-checkbox-group :options="plainOptions" />
          </a-card>
        </a-card>
      </a-col>
      <a-col :md="0" :lg="4">
        <!-- <a-anchor
          ref="anchor"
          :offset-top="16"
          :get-container="getAnchorContainer">
          <a-anchor-link href="#sys-per" title="系统权限" />
          <a-anchor-link href="#menu-per" title="菜单权限">
            <a-anchor-link href="#menu-sys" title="系统配置">
              <a-anchor-link href="#menu-sys-menu" title="菜单管理" />

              <a-anchor-link href="#menu-sys-app" title="应用管理" />
              <a-anchor-link href="#menu-sys-per" title="权限管理" />
              <a-anchor-link href="#menu-sys-user" title="用户管理" />
            </a-anchor-link>
          </a-anchor-link>
        </a-anchor> -->
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
import { getListPage, configDetail, getOne, save, del } from '@/api/modules/sys/role'
import Modal from '@/components/modal/Modal'
import { mapState } from 'vuex'
import { getAsyncApps } from '@/views/pages/sys/menu/async'
import { defaultForm } from './constant'

export default {
  inject: ['content'],
  components: { Modal },
  data() {
    return {
      title: '',
      loading: false, // 表格加载
      visible: false, // 弹窗控制
      confirmLoading: false, // 确认按钮控制
      dataForm: cloneDeep(defaultForm), // 单条数据显示
      roles: [], // 角色行
      apps: [], // 选择行
      // 权限分配
      pvisible: false,
      pconfirmLoading: false, // 确认按钮控制
      plainOptions: ['Apple', 'Pear', 'Orange'],
      targetOffset: undefined
    }
  },
  created() {
    this.queryPage()
    this.getApps()
    this.getConfigDetail()
  },
  mounted() {
    this.targetOffset = window.innerHeight / 2
    console.log(this.targetOffset)
    console.log(this.content)
  },
  /**
   * 当 keep-alive 包含的组件再次渲染的时候触发
   */
  activated() {
    const el = this.$refs.anchor.$el
    el.style.width = ''
    el.style.height = ''
  },
  computed: {
    ...mapState('setting', ['fixedHeader'])
  },
  methods: {
    /**
     * 获取应用集合
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    getApps() {
      getAsyncApps().then(res => {
        this.apps = res.data || []
      }).done()
    },
    /**
     * 获取配置信息集合
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    getConfigDetail() {
      configDetail('123', '123').then(res => {
        const data = res.data || []
        console.log(data)
      }).done()
    },
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
        this.roles = result
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
    },
    /**
     * 指定滚动的容器
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    getAnchorContainer() {
      return this.fixedHeader ? this.content.$refs.contentView : document.body.querySelector('.admin-content').parentElement
    }
  }
}
</script>
