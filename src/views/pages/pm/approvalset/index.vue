<template>
  <a-card>
    <a-row>
      <a-col :span="4" class="mb-2">
        <a-select v-model="projectType" class="w-100" placeholder="请选择工程类型" @change="getSpSetting">
          <a-select-option v-for="item in projectTypeArr" :key="item.value" :value="item.value">
            {{ item.label }}
          </a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <a-table :columns="columns" :data-source="dataSource" :loading="loading" :pagination="false" row-key="id">
      <template slot="approver" slot-scope="record">
        <a-row>
          <a-col :span="$hasp('approvalset-edit') ? 20 : 24">
            <a-tag v-for="item in record.approver" :key="item.id" color="blue">
              {{ item.userName }}
            </a-tag>
          </a-col>
          <a-col v-if="$hasp('approvalset-edit')" :span="4">
            <a-button type="primary" shape="round" size="small" @click="changeBtn(record)">
              <my-icon type="icon-genghuanrenyuan" />更换
            </a-button>
          </a-col>
        </a-row>
      </template>
    </a-table>
    <!-- 选择审批人弹窗 -->
    <modal v-if="$hasp('approvalset-query')" title="选择审批人" :visible="visible" @cancel="visible = false" @ok="saveApprover">
      <a-form-model ref="ruleForm" :model="dataForm">
        <a-row>
          <a-col :span="24">
            <a-form-model-item :rules="{ validator: approverValidate, trigger: ['blur', 'change'] }" label="选择审批人" prop="userId">
              <a-tree-select
                v-model="dataForm.userId"
                class="w-100"
                show-search
                placeholder="请选择审批人"
                allow-clear
                multiple
                :tree-data="treeData"
                :replace-fields="{title: 'userName', value: 'id'}"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </modal>
  </a-card>
</template>

<script>
import { columns, projectTypeArr } from './constant'
import { getSpSetting, updateApproval } from '@/api/modules/pm/approvalset'
import { getUsers } from '@/api/modules/sys/user'
import Modal from '@/components/modal/Modal'
export default {
  components: {
    Modal
  },
  data() {
    return {
      columns, // 表格列数据
      dataSource: [], // 表格数据
      loading: false, // 表格加载状态
      projectTypeArr, // 工程类型数组
      projectType: 1, // 默认工程类型
      visible: false, // 选择审批人开关
      dataForm: {}, // 表单数据
      treeData: [] // 用户数据
    }
  },
  created() {
    this.getSpSetting()
  },
  methods: {
    /**
     * 获取审批设置
     * @date 2021-05-25 13:37:00
     * @author zxp
     */
    async getSpSetting() {
      this.loading = true
      try {
        const { data } = await getSpSetting(this.projectType)
        // this.dataSource = data
        const arr = []
        data.forEach(item => {
          item.child && item.child.forEach(child => {
            arr.push({ ...child, spName: item.name })
          })
        })
        this.dataSource = this.rowSpan(arr, 'spName')
        console.log(this.dataSource)
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },
    /**
     * 更换审批人按钮
     * @date 2021-05-26 11:23:00
     * @author zxp
     */
    changeBtn(row) {
      this.visible = true
      this.dataForm.applyId = row.id
      this.$set(this.dataForm, 'userId', row.approver.map(item => item.userId))
      this.getApprovalData()
    },
    /**
     * 获取审批人数据
     * @date 2021-05-26 11:36:00
     * @author zxp
     */
    async getApprovalData() {
      const { data } = await getUsers()
      this.treeData = data
      console.log(data)
    },
    /**
     * 保存审批人
     * @date 2021-05-26 11:10:00
     * @author zxp
     */
    saveApprover() {
      this.$refs.ruleForm.validate(async val => {
        if (!val) return
        await updateApproval(this.dataForm)
        this.getSpSetting()
        this.visible = false
        this.$message.success('更换审批人成功！')
      })
    },
    /**
     * 审批人校验
     * @date 2021-05-26 17:12:00
     * @author zxp
     */
    approverValidate(rule, value, callback) {
      if (!value.length) {
        callback(new Error('审批人不能为空'))
      } else {
        callback()
      }
    }
  }
}
</script>
