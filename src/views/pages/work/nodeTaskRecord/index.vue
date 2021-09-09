<!--
  操作记录
  @date 2021-2-26 10:23:26
  @author lyc
 -->
<template>
  <a-card>
    <!-- 表格 -->
    <standard-table
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination.sync="params.page"
      placeholder="搜索项目名称/编号"
      @change="onChange"
      @search="onSearch"
    >
      <!-- 任务状态 -->
      <template slot="nodeState" slot-scope="{text}">
        <!-- 待审批,已审批 -->
        <a-tag v-if="text === 1" color="green">
          进行中
        </a-tag>
        <a-tag v-else-if="text === 2" color="#2db7f5">
          待审批
        </a-tag>
        <a-tag v-else-if="text === 3" color="#87d068">
          已审批
        </a-tag>
      </template>
      <!-- 任务状态 -->
      <template slot="taskState" slot-scope="{text}">
        <a-tag v-if="!text" color="red">
          待上传
        </a-tag>
        <a-tag v-else-if="text == 1 || text == 5" color="green">
          已上传
        </a-tag>
        <a-tag v-else-if="text == 2" color="#2db7f5">
          待审核
        </a-tag>
        <a-tag v-else-if="text == 3" color="#87d068" style="width:52px">
          通 过
        </a-tag>
        <a-tag v-else-if="text == 4" color="#f50" style="width:52px">
          驳 回
        </a-tag>
      </template>
      <!-- 任务文件 -->
      <upload
        slot="taskFiles" slot-scope="{record}" style="max-width: 200px"
        :show-upload-list="{showPreviewIcon: true, showRemoveIcon: false}" :file-list="record.taskFiles" />
      <!-- 成果文件 -->
      <upload
        slot="resultFiles" slot-scope="{record}" style="max-width: 200px"
        :show-upload-list="{showPreviewIcon: true, showRemoveIcon: false}" :file-list="record.resultFiles" />
    </standard-table>
  </a-card>
</template>

<script>
import { BoxPage } from '@/utils/tool'
import { getListPage } from '@/api/modules/work/nodeTaskRecord'
import StandardTable from '@/components/table/StandardTable'
import Upload from '@/components/upload'
import { columns } from './constant'
import { downloadUrl } from '@/api/common/upload'

export default {
  components: { StandardTable, Upload },
  data() {
    return {
      loading: false, // 表格加载
      columns: columns, // 表字段
      params: { // 分页查询
        page: {}, // 分页数据
        query: {} // 查询数据
      },
      dataSource: [] // 数据行
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
        result.forEach(item => {
          if (item.taskFiles && item.taskFiles.length > 0) {
            item.taskFiles = item.taskFiles.map(file => {
              file.uid = file.id
              file.name = file.filename
              file.status = 'done'
              file.url = downloadUrl + file.url
              return file
            })
          }
          if (item.resultFiles && item.resultFiles.length > 0) {
            item.resultFiles = item.resultFiles.map(file => {
              file.uid = file.id
              file.name = file.filename
              file.status = 'done'
              file.url = downloadUrl + file.url
              return file
            })
          }
        })
        this.params.page = BoxPage(data)
        this.dataSource = result
      }).over().finally(() => {
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
     * 分页变化
     * @date 2021-2-26 10:23:26
     * @author lyc
     */
    onChange(pagination) {
      this.params.page = BoxPage(pagination)
      this.queryPage()
    }
  }
}
</script>
