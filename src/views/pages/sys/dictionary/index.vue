<template>
  <a-row :gutter="[16]">
    <a-col :span="6">
      <a-card>
        <a-row class="mb-4">
          <a-col :span="12">
            <a-button v-if="$hasp('sys-dictionary-add')" type="primary" @click="addSysConfig">
              <a-icon type="plus" />添加
            </a-button>
          </a-col>
        </a-row>
        <a-list
          :loading="listLoading"
          item-layout="horizontal"
          :data-source="data"
        >
          <a-list-item slot="renderItem" slot-scope="item">
            <a-list-item-meta>
              <a slot="title" :class="{'primary-title':sysConfigItem.id === item.id}" @click="getDetailList(item)">{{ item.name }}</a>
            </a-list-item-meta>
            <template slot="actions">
              <a-tooltip v-if="$hasp('sys-dictionary-edit')" title="编辑">
                <a type="link">
                  <a-icon type="edit" @click="edit(item)" />
                </a>
              </a-tooltip>
              <a-popconfirm v-if="$hasp('sys-dictionary-del')" title="是否确认删除?将会删除该项下所有内容" @confirm="()=>deleteSysConfigRecord(item.id)">
                <a-tooltip title="删除">
                  <a>
                    <a-icon type="delete" />
                  </a>
                </a-tooltip>
              </a-popconfirm>
            </template>
          </a-list-item>
        </a-list>
      </a-card>
    </a-col>
    <a-col :span="18">
      <a-card>
        <a-row>
          <a-col :span="12">
            <h3 class="primary-title">
              {{ sysConfigItem.name }}
            </h3>
          </a-col>
          <a-col class="text-right" :span="12">
            <a-button v-if="$hasp('sys-dictionary-add')" class="mr-1" type="primary" @click="addSysConfigDetail">
              <a-icon type="plus" />添加
            </a-button>
          </a-col>
        </a-row>
        <!-- 表格 -->
        <standard-table
          :columns="columns"
          :data-source="dataSource"
          :loading="loading"
          :pagination="false"
          :is-search="false"
        >
          <div slot="action" slot-scope="{ record }">
            <a-tooltip v-if="$hasp('sys-dictionary-edit')" title="编辑">
              <a class="mr-1" @click="deTailedit(record)">
                <a-icon type="edit" />
              </a>
            </a-tooltip>
            <a-popconfirm v-if="$hasp('sys-dictionary-del')" title="是否确认删除?" @confirm="() => deleteSysConfigDeatilRecord(record.id)">
              <a-tooltip title="删除">
                <a>
                  <a-icon type="delete" />
                </a>
              </a-tooltip>
            </a-popconfirm>
          </div>
        </standard-table>
      </a-card>
    </a-col>

    <!-- 主表弹窗 -->
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
              :rules=" { required: true, message: '名称不能为空', trigger:['change', 'blur'] }"
              label="名称" prop="name">
              <a-input v-model="dataForm.name" class="w-100" :max-length="100" autocomplete="off" allow-clear />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              :rules=" { required: true, message: '别称不能为空', trigger: ['change', 'blur'] }"
              label="别称" prop="alias">
              <a-input v-model="dataForm.alias" class="w-100" :max-length="100" autocomplete="off" allow-clear />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </modal>

    <!-- 子表弹窗 -->
    <modal
      v-model="deTailvisible"
      :confirm-loading="confirmLoading"
      ok-text="确认"
      cancel-text="取消"
      :title="deTailTitle"
      @ok="deTailHandleOk"
      @cancel="deTailHandleCancel"
    >
      <a-form-model ref="ruleForm" :model="deTailDataForm" layout="vertical">
        <a-row>
          <a-col :span="24">
            <a-form-model-item
              :rules=" { required: true, message: '名称不能为空', trigger:['change', 'blur'] }"
              label="名称" prop="name">
              <a-input v-model="deTailDataForm.name" class="w-100" :max-length="100" autocomplete="off" allow-clear />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              :rules=" { required: true, message: '值不能为空', trigger: ['change', 'blur'] }"
              label="值" prop="value">
              <a-input v-model="deTailDataForm.value" class="w-100" :max-length="100" autocomplete="off" allow-clear />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </modal>
  </a-row>
</template>

<script>
import { cloneDeep } from '@/utils/tool'
import { getList, getSysConfigById, delSysConfig, delSysConfigDetail, getDetailsById, saveSysConfig, saveSysConfigDetail, getDetailInfoById } from '@/api/modules/sys/dictionary'
import StandardTable from '@/components/table/StandardTable'
import Modal from '@/components/modal/Modal'
import { columns, defaultForm, deTailDefaultForm } from './constant'

export default {
  components: {
    StandardTable,
    Modal
  },
  data() {
    return {
      title: '',
      listLoading: false, // 表格加载
      loading: false,
      data: [], // 左侧主表数据显示
      dataSource: [], // 右侧子表数据
      columns: columns, // 表字段

      visible: false, // 弹窗控制
      confirmLoading: false, // 主表按钮加载
      dataForm: cloneDeep(defaultForm), // 单条数据显示
      sysConfigItem: {}, // 主表Id

      deTailvisible: false, // 子表弹框
      deTailTitle: '', // 子表标题
      deTailDataForm: cloneDeep(deTailDefaultForm) // 单条数据显示
    }
  },
  created() {
    this.getListData()
  },
  methods: {
    /**
     * 查询左侧主配置数据
     * @date 2021年6月8日14:54:48
     * @author lyc
     */
    getListData() {
      this.listLoading = true
      getList().then(res => {
        const { data = [] } = res
        this.data = data
        if (data.length > 0) {
          this.sysConfigItem = data[0]
          this.getDetailList(this.sysConfigItem)
        }
      }).over().finally(() => {
        this.listLoading = false
      })
    },
    /**
     * 添加主表数据
     * @date 2021年6月8日14:54:48
     * @author lyc
     */
    addSysConfig() {
      this.title = '添加'
      this.visible = true
    },
    /**
     * 重置数据
     * @date 2021年6月8日14:54:48
     * @author lyc
     */
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dataForm = cloneDeep(defaultForm)
      this.deTailDataForm = cloneDeep(deTailDefaultForm)
    },
    /**
     * 保存
     * @date 2021年6月8日14:54:48
     * @author lyc
     */
    handleOk() {
      this.$refs['ruleForm'].validate(valid => {
        if (!valid) return
        this.confirmLoading = true
        saveSysConfig(this.dataForm).then(res => {
          this.$message.success('保存成功!')
          this.getListData()
        }).over().finally(() => {
          this.visible = false
          this.confirmLoading = false
          this.resetForm('ruleForm')
        })
      })
    },
    /**
     * 取消
     * @date 2021年6月8日14:54:48
     * @author lyc
     */
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
      this.resetForm('ruleForm')
    },

    /**
     * 编辑
     * @date 2021年6月8日14:54:48
     * @author lyc
     */
    edit(record) {
      this.title = '编辑'
      getSysConfigById(record.id).then(res => {
        this.dataForm = res.data || {}
      }).over().finally(() => {
        this.visible = true
      })
    },

    /**
     * 删除
     * @date 2021年6月8日14:54:48
     * @author lyc
     */
    deleteSysConfigRecord(id) {
      delSysConfig(id).then(() => {
        this.$message.success('删除成功!')
        this.getListData()
      }).over()
    },
    /**
     * 查询右侧子配置数据
     * @date 2021年6月8日14:54:48
     * @author lyc
     */
    getDetailList(item) {
      this.loading = true
      this.sysConfigItem = item
      getDetailsById(item.id).then(res => {
        const { data = [] } = res
        this.dataSource = data
      }).over().finally(() => {
        this.loading = false
      })
    },


    /**
     * 添加主表数据
     * @date 2021年6月8日14:54:48
     * @author lyc
     */
    addSysConfigDetail() {
      this.deTailTitle = '添加'
      this.deTailvisible = true
      this.deTailDataForm.sysConfigId = this.sysConfigItem.id
    },

    /**
     * 保存子表
     * @date 2021年6月8日14:54:48
     * @author lyc
     */
    deTailHandleOk() {
      console.log(123)
      this.$refs['ruleForm'].validate(valid => {
        if (!valid) return
        this.confirmLoading = true
        saveSysConfigDetail(this.deTailDataForm).then(res => {
          this.$message.success('保存成功!')
          this.getDetailList(this.sysConfigItem)
        }).over().finally(() => {
          this.deTailvisible = false
          this.confirmLoading = false
          this.resetForm('ruleForm')
        })
      })
    },
    /**
     * 取消子表
     * @date 2021年6月8日14:54:48
     * @author lyc
     */
    deTailHandleCancel() {
      this.deTailvisible = false
      this.confirmLoading = false
      this.resetForm('ruleForm')
    },

    /**
     * 编辑子表
     * @date 2021年6月8日14:54:48
     * @author lyc
     */
    deTailedit(record) {
      this.deTailTitle = '编辑'
      getDetailInfoById(record.id).then(res => {
        this.deTailDataForm = res.data || {}
      }).over().finally(() => {
        this.deTailvisible = true
      })
    },
    /**
     * 删除子表
     * @date 2021年6月8日14:54:48
     * @author lyc
     */
    deleteSysConfigDeatilRecord(id) {
      delSysConfigDetail(id).then(() => {
        this.$message.success('删除成功!')
        this.getDetailList(this.sysConfigItem)
      }).over()
    }
  }
}
</script>
<style scoped lang="less">
  .primary-title{
    color:@primary-color;
    font-weight: 600;
  }
</style>
