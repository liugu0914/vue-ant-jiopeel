<template>
  <a-card>
    <standard-table
      :columns="columns"
      :data-source="dataSource"
      :pagination="false"
      :is-search="false"
      :loading="loading">
      <template slot="btns">
        <a-button v-if="$hasp('projectConfig-save')" type="primary" @click="saveConfig">
          保存
        </a-button>
      </template>
      <template slot="value" slot-scope="{record}">
        <a-input v-model="record.value" placeholder="请输入目标值" :max-length="50" allow-clear />
      </template>
    </standard-table>
  </a-card>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'
import { columns } from './const'
import { getList, save } from '@/api/modules/pm/projectConfig'

export default {
  components: { StandardTable },
  data() {
    return {
      columns: columns,
      dataSource: [],
      loading: false
    }
  },
  created() {
    this.getListData()
  },
  methods: {
    /**
     * 获取项目统计配置
     */
    async getListData() {
      this.loading = true
      try {
        const { data = [] } = await getList()
        this.dataSource = data
        console.log(data)
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },
    /**
     * 发送请求 新增、编辑项目统计配置
     */
    saveConfig() {
      if (!this.dataSource || this.dataSource.length == 0) { return }
      let flag = true
      this.dataSource.forEach(item => {
        if (flag && item.value.length === 0) {
          this.$message.warning('目标值不能为空')
          flag = false
        }
      })
      if (!flag) { return }
      this.loading = true
      save(this.dataSource).then(res => {
        this.$message.success(res.message)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="less">
</style>
