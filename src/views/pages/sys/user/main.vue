<template>
  <a-card :bordered="false">
    <!-- 表格 -->
    <standard-table
      :columns="columns"
      :data-source="dataSource"
      :selected-rows.sync="selectedRows"
      :loading="loading"
      :pagination="params.page"
      @change="onChange"
      @search="onSearch"
    >
      <template slot="btns">
        <a-button type="primary" @click="visible = true">
          <a-icon type="plus" />新建
        </a-button>
        <a-button @click="visible = true">
          <a-icon type="edit" />编辑
        </a-button>
        <a-button>
          <a-icon type="delete" />删除
        </a-button>
      </template>
      <a-avatar slot="imgUrl" slot-scope="{text}" :src="text" icon="user" />
      <div slot="action" slot-scope="{record}">
        <a-tooltip>
          <template slot="title">
            编辑
          </template>
          <a class="mr-1" @click="edit(record)">
            <a-icon type="edit" />
          </a>
        </a-tooltip>
        <a-tooltip>
          <template slot="title">
            删除
          </template>
          <a @click="deleteRecord(record.key)">
            <a-icon type="delete" />
          </a>
        </a-tooltip>
      </div>
      <template slot="statusTitle">
        <a-icon type="info-circle" @click.native="onStatusTitleClick" />
      </template>
    </standard-table>
    <!-- 弹窗 -->
    <a-modal
      v-model="visible"
      :confirm-loading="confirmLoading"
      centered
      ok-text="确认" cancel-text="取消" title="新增"
      @ok="handleOk"
      @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="dataForm" layout="vertical">
        <a-row>
          <a-col :sm="24">
            <a-form-model-item
              :rules=" { required: true, message: '描述不能为空', trigger: 'blur' }"
              label="描述" prop="description">
              <a-input v-model="dataForm.description" class="w-100" :max-length="255" autocomplete="off" />
            </a-form-model-item>
          </a-col>
          <a-col :sm="24">
            <a-form-model-item
              :rules=" { required: true, message: '服务调用次数不能为空', trigger: 'blur' }"
              label="服务调用次数" prop="callNo">
              <a-input-number v-model.number="dataForm.callNo" class="w-100" :min="0" :max="1000000" autocomplete="off" />
            </a-form-model-item>
          </a-col>
          <a-col :sm="24">
            <a-form-model-item
              :rules=" { required: true, message: '更新时间不能为空', trigger: ['change', 'blur'] }"
              label="更新时间" prop="updatedAt">
              <a-date-picker v-model="dataForm.updatedAt" input-read-only value-format="YYYY-MM-DD" class="w-100" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
  </a-card>
</template>

<script>
import { getListPage } from '@/api/modules/sys/user'
import { BoxPage } from '@/utils/business'
import StandardTable from '@/components/table/StandardTable'
import { cloneDeep } from '@/utils/tool'
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    customRender: (text, record, index) => index + 1,
    searchAble: true,
    disableCheck: true
  },
  {
    title: '头像',
    dataIndex: 'imgUrl',
    scopedSlots: { customRender: 'imgUrl' },
    searchAble: true,
    disableCheck: true,
    dataType: 'radio',
    search: {
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ]
    }
  },
  {
    title: '用户名称',
    dataIndex: 'userName',
    searchAble: true,
    disableCheck: true,
    dataType: 'month'
  },
  {
    title: '账号',
    dataIndex: 'account',
    customRender: (text) => text,
    searchAble: true,
    dataType: 'date'
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    searchAble: true,
    dataType: 'range',
    search: {
      name: 'date'
    }
  },
  {
    title: '类型',
    dataIndex: 'type',
    searchAble: true,
    dataType: 'select',
    search: {
      options: [
        { label: '已下单', value: 1 },
        { label: '已付款', value: 2 },
        { label: '已审核', value: 3 },
        { label: '已发货', value: 4 }
      ],
      multiple: true
    }
  },
  {
    title: '操作',
    dataIndex: 'ops',
    scopedSlots: { customRender: 'action' },
    disableCheck: true
  }
]
const DefaultForm = {
  id: '',
  description: '',
  callNo: '',
  updatedAt: ''
}
const dataForm = cloneDeep(DefaultForm)
export default {
  name: 'QueryList',
  components: { StandardTable },
  data() {
    return {
      advanced: false,
      loading: false,
      visible: false,
      confirmLoading: false,
      advancedSearch: false,
      dataForm: dataForm,
      columns: columns,
      params: {
        page: {
          current: 1
        },
        query: {}
      },
      dataSource: [],
      selectedRows: []
    }
  },
  authorize: {
    deleteRecord: 'delete'
  },
  created() {
    this.queryPage()
  },
  methods: {
    /**
     * 分页查询
     */
    queryPage() {
      this.loading = true
      getListPage(this.params).then(res => {
        const { data } = res
        const result = data.result || []
        this.params.page = BoxPage(data)
        this.dataSource = result
      }).done().finally(() => {
        this.loading = false
      })
    },
    onSearch(conditions) {
      console.log('conditions', conditions)
      this.params.query = conditions
      console.log(this.params.query)
      this.queryPage()
    },
    onChange(pagination) {
      console.log(pagination)
      this.params.page = BoxPage(pagination)
      this.queryPage()
    },
    submitForm(formName, callback) {
      this.$refs[formName].validate(valid => {
        if (!valid) return
        console.log('error submit!!')
        return callback()
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dataForm = cloneDeep(DefaultForm)
      console.log(DefaultForm)
    },
    edit(record) {
      this.dataForm = cloneDeep(record)
      this.visible = true
    },
    handleOk(e) {
      this.$refs['ruleForm'].validate(valid => {
        if (!valid) return
        this.confirmLoading = true
        setTimeout(() => {
          this.visible = false
          this.confirmLoading = false
          this.resetForm('ruleForm')
        }, 2000)
      })
    },
    handleCancel(e) {
      console.log('Clicked cancel button')
      this.visible = false
      this.resetForm('ruleForm')
    },
    deleteRecord(key) {
      this.dataSource = this.dataSource.filter(item => item.key !== key)
      this.selectedRows = this.selectedRows.filter(item => item.key !== key)
    },
    toggleAdvanced() {
      this.advanced = !this.advanced
    },
    remove() {
      this.dataSource = this.dataSource.filter(item => this.selectedRows.findIndex(row => row.key === item.key) === -1)
      this.selectedRows = []
    },
    onClear() {
      this.$message.info('您清空了勾选的所有行')
    },
    onStatusTitleClick() {
      this.$message.info('你点击了状态栏表头')
    },

    onSelectChange(selectedRowKeys, selectedRows) {
      this.$message.info('选中行改变了')
    },
    addNew() {
      this.dataSource.unshift({
        key: this.dataSource.length,
        index: this.dataSource.length,
        description: '这是一段描述',
        callNo: Math.floor(Math.random() * 1000),
        status: Math.floor(Math.random() * 10) % 4,
        updatedAt: '2018-07-26'
      })
    },
    handleMenuClick(e) {
      if (e.key === 'delete') {
        this.remove()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search-advanced{
  height: @ant-form-item-bottom + 69px;
  overflow: hidden;
}
</style>
