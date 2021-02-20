<template>
  <a-card :bordered="false">
    <!-- 搜索 -->
    <a-row class="mb-2" type="flex" align="middle" :gutter="[0,16]" justify="space-between">
      <a-col :md="12" :sm="24">
        <a-input-search
          style="width: 300px"
          :max-length="200"
          placeholder="搜索名称/用户">
          <a-button slot="enterButton" type="primary">
            <a-icon type="search" />
          </a-button>
        </a-input-search>
        <a-tooltip title="高级搜索">
          <a-button type="link" style="border:none;box-shadow: none;background-color: transparent;" @click="openAdvancedSearch">
            <a-icon type="filter" />
          </a-button>
        </a-tooltip>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-button-group class="float-right">
          <a-button type="primary" @click="visible = true">
            <a-icon type="plus" />新建
          </a-button>
          <a-button @click="visible = true">
            <a-icon type="edit" />编辑
          </a-button>
          <a-button>
            <a-icon type="delete" />删除
          </a-button>
          <a-dropdown>
            <a-menu slot="overlay" @click="handleMenuClick">
              <a-menu-item key="delete">
                删除
              </a-menu-item>
              <a-menu-item key="audit">
                审批
              </a-menu-item>
            </a-menu>
            <a-button>
              更多<a-icon type="down" />
            </a-button>
          </a-dropdown>
        </a-button-group>
      </a-col>
    </a-row>
    <!-- 表格 -->
    <standard-table
      :columns="columns"
      :data-source="dataSource"
      :selected-rows.sync="selectedRows"
      @clear="onClear"
      @change="onChange"
      @selectedRowChange="onSelectChange"
    >
      <div slot="description" slot-scope="{text}">
        {{ text }}
      </div>
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
    <!-- 高级搜索 -->
    <a-drawer
      title="高级搜索"
      placement="top"
      :visible="advancedSearch"
      @close="openAdvancedSearch"
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-drawer>
  </a-card>
</template>

<script>
// import { test } from '@/api/modules/sys/main'
import StandardTable from '@/components/table/StandardTable'
import _ from 'lodash'
const columns = [
  {
    title: '序号',
    dataIndex: 'index'
  },
  {
    title: '描述',
    dataIndex: 'description',
    scopedSlots: { customRender: 'description' }
  },
  {
    title: '服务调用次数',
    dataIndex: 'callNo',
    sorter: true,
    needTotal: true,
    customRender: (text) => text + ' 次'
  },
  {
    dataIndex: 'status',
    needTotal: true,
    slots: { title: 'statusTitle' }
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'ops',
    scopedSlots: { customRender: 'action' }
  }
]
const dataSource = []

for (let i = 0; i < 95; i++) {
  dataSource.push({
    key: i,
    id: i,
    index: i + 1,
    description: '这是一段描述',
    callNo: Math.floor(Math.random() * 1000),
    status: Math.floor(Math.random() * 10) % 4,
    updatedAt: '2018-07-26'
  })
}
const DefaultForm = {
  id: '',
  description: '',
  callNo: '',
  updatedAt: ''
}
const dataForm = _.cloneDeep(DefaultForm)
export default {
  name: 'QueryList',
  components: { StandardTable },
  data() {
    return {
      advanced: true,
      visible: false,
      confirmLoading: false,
      advancedSearch: false,
      dataForm: dataForm,
      columns: columns,
      dataSource: dataSource,
      selectedRows: []
    }
  },
  authorize: {
    deleteRecord: 'delete'
  },
  created() {
    // test().over()
  },
  methods: {
    openAdvancedSearch() {
      this.advancedSearch = !this.advancedSearch
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
      this.dataForm = _.cloneDeep(DefaultForm)
      console.log(DefaultForm)
    },
    edit(record) {
      this.dataForm = _.cloneDeep(record)
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
    onChange() {
      this.$message.info('表格状态改变了')
    },
    onSelectChange() {
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
