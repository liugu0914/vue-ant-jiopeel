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
      @change="onChange"
      @search="onSearch"
    >
      <template slot="btns">
        <a-button type="primary" @click="visible = true">
          <a-icon type="plus" />新建
        </a-button>
        <a-button>
          <a-icon type="delete" />删除
        </a-button>
      </template>
      <a-avatar slot="imgUrl" slot-scope="{text}" :src="text" icon="user" />
      <div slot="action" slot-scope="{record}">
        <a-tooltip title="编辑">
          <a class="mr-1" @click="edit(record)">
            <a-icon type="edit" />
          </a>
        </a-tooltip>
        <a-tooltip title="删除">
          <a @click="deleteRecord(record.key)">
            <a-icon type="delete" />
          </a>
        </a-tooltip>
      </div>
    </standard-table>
    <!-- 弹窗 -->
    <modal
      v-model="visible"
      :confirm-loading="confirmLoading"
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
    </modal>
  </a-card>
</template>

<script>
import { BoxPage, cloneDeep } from '@/utils/tool'
import { getListPage } from '@/api/modules/sys/user'
import StandardTable from '@/components/table/StandardTable'
import Modal from '@/components/modal/Modal'
import { columns, defaultForm } from './constant'

const dataForm = cloneDeep(defaultForm)
export default {
  components: { StandardTable, Modal },
  data() {
    return {
      loading: false,
      visible: false,
      confirmLoading: false,
      dataForm: dataForm,
      columns: columns,
      params: {
        page: {},
        query: {}
      },
      dataSource: [],
      selectedRows: []
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
        }, 300)
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
      console.log(pagination)
      this.params.page = BoxPage(pagination)
      this.queryPage()
    },
    /**
     * 提交表单
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    submitForm(formName, callback) {
      this.$refs[formName].validate(valid => {
        if (!valid) return
        console.log('error submit!!')
        return callback()
      })
    },
    /**
     * 重置数据
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dataForm = cloneDeep(defaultForm)
      console.log(defaultForm)
    },
    /**
     * 编辑
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    edit(record) {
      this.dataForm = cloneDeep(record)
      this.visible = true
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
        setTimeout(() => {
          this.visible = false
          this.confirmLoading = false
          this.resetForm('ruleForm')
        }, 2000)
      })
    },
    /**
     * 取消
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    handleCancel() {
      console.log('Clicked cancel button')
      this.visible = false
      this.resetForm('ruleForm')
    }
  }
}
</script>
