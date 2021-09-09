<template>
  <a-row :gutter="16" class="h-100">
    <a-col :span="4" class="h-100">
      <a-card class="h-100">
        <div class="title">
          <a-icon type="menu" /> 任务类型
        </div>
        <a-list :split="false" size="small" class="mt-2" :data-source="taskTypeList">
          <a-list-item slot="renderItem" slot-scope="item">
            <a-list-item-meta>
              <a slot="title" href="javascript:;" class="ml-3" :style="{color: activeIndex == item.value ? '#1492ff' : ''}" @click="activeIndex = item.value">
                {{ item.name }}
              </a>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </a-card>
    </a-col>
    <a-col :span="20" class="h-100">
      <a-card class="h-100 scroll-y">
        <div class="title mb-2" style="display: flex; justify-content: space-between">
          <span>表单配置</span>
          <a-space>
            <a-space v-if="editable">
              <a-button type="primary" @click="editable = false">
                返回
              </a-button>
              <a-button v-if="$hasp('taskType-add')" type="primary" @click="addField">
                新增
              </a-button>
              <a-popconfirm
                v-if="selectedRows && $hasp('taskType-del')" :disabled="!selectedRows || !selectedRows.length" title="确认删除选中的数据?"
                @confirm="delField" @click.native="selectedRows && selectedRows.length ? '' : $message.warning('请选择要删除的数据')"
              >
                <a-button type="danger">
                  删除
                </a-button>
              </a-popconfirm>
            </a-space>
            <a-button v-if="!editable && $hasp('taskType-edit')" type="primary" @click="editable = true">
              拓展配置
            </a-button>
            <a-button v-if="$hasp('taskType-edit')" type="primary" @click="save">
              保存
            </a-button>
          </a-space>
        </div>
        <div class="pl-3">
          <div v-if="!editable" class="caption mb-2">
            可选字段
          </div>
          <a-row v-if="!editable" :gutter="[0,10]">
            <a-col :span="24" class="selectField mb-1">
              <span>主表字段</span>
              <a-row :gutter="[0,16]">
                <a-col v-for="item in mainField" :key="item.id" :span="4">
                  <a-checkbox :default-checked="!!item.enable" :disabled="!$hasp('taskType-edit')" @change="checkChange($event, item)">
                    {{ item.name }}
                  </a-checkbox>
                </a-col>
              </a-row>
            </a-col>
            <a-col v-if="expandField && expandField.length" :span="24" class="selectField">
              <span>拓展项字段</span>
              <a-row :gutter="[0,16]">
                <a-col v-for="item in expandField" :key="item.id" :span="4">
                  <a-checkbox :default-checked="!!item.enable" :disabled="!$hasp('taskType-edit')" @change="checkChange($event, item)">
                    {{ item.name }}
                  </a-checkbox>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
          <div v-if="!editable" class="caption mt-2 mb-2">
            <span>当前选定的字段</span>
          </div>
          <standard-table
            :columns="columns" :data-source="dataSource" :pagination="false" :is-search="false" :loading="loading"
            :selected-rows.sync="selectedRows" :get-checkbox-props="getCheckboxProps"
          >
            <!-- 列名 -->
            <a-input v-if="record.extra && editable" slot="name" v-model="record.name" slot-scope="{record}" placeholder="请输入列名（必填）" :max-length="100" />
            <span v-else slot="name" slot-scope="{record}">{{ record.name }}</span>
            <!-- 类型 -->
            <a-select v-if="record.extra && editable" slot="type" v-model="record.valueType" slot-scope="{record}" class="w-100">
              <a-select-option value="text">
                文本
              </a-select-option>
              <a-select-option value="number">
                数字
              </a-select-option>
            </a-select>
            <span v-else slot="type" slot-scope="{record}">{{ !record.extra ? '默认配置' : record.valueType == 'text' ? '文本' : '数字' }}</span>
            <!-- 是否启用 -->
            <a-switch v-if="editable" slot="enable" slot-scope="{record}" :checked="!!record.enable" @change="checked => record.enable = +checked" />
            <!-- 排序 -->
            <a-input-number v-if="$hasp('taskType-edit')" slot="sort" v-model="record.orderNum" slot-scope="{record}" :min="1" />
            <span v-else slot="sort" slot-scope="{record}">{{ record.orderNum }}</span>
          </standard-table>
        </div>
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
import { getSysConfigByAlias } from '@/api/modules/sys/dictionary'
import StandardTable from '@/components/table/StandardTable'
import { columns } from './const'
import { getList, delField, save, saveExtra } from '@/api/modules/pm/taskType'
import { cloneDeep } from '@/utils/tool'
export default {
  components: {
    StandardTable
  },
  data() {
    return {
      taskTypeList: [], // 任务类型数组
      activeIndex: '',
      loading: false,
      columns,
      mainField: [], // 主表字段
      expandField: [], // 拓展项字段
      enableField: [], // 启用的字段
      dataSource: [], // 表格数据
      selectedRows: undefined,
      editable: false // 是否编辑
    }
  },
  created() {
    this.getTaskTypeList()
  },
  methods: {
    /**
     * 获取任务分类数据字典
     */
    async getTaskTypeList() {
      const { data } = await getSysConfigByAlias('taskType')
      this.taskTypeList = data
      this.activeIndex = data[0].value
    },
    /**
     * 获取任务类型对应表单配置
     */
    async getList() {
      this.loading = true
      try {
        const { data = {}} = await getList(this.activeIndex)
        this.mainField = data.default
        this.expandField = data.extra
        this.enableField = data.enable
        this.dataSource = this.editable ? cloneDeep(data.extra) : cloneDeep(data.enable)
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },
    /**
     * 添加拓展项字段
     */
    addField() {
      this.dataSource.push({ id: 'add' + Math.random(), name: '', valueType: 'text', enable: 0, sort: '', extra: 1 })
    },
    /**
     * 勾选字段
     */
    checkChange(e, item) {
      const checked = e.target.checked
      if (!checked) return (this.dataSource = this.dataSource.filter(field => (field.id !== item.id)))
      this.dataSource.push({ ...item, orderNum: '', enable: 1 })
    },
    /**
     * 禁止选择主表字段
     */
    getCheckboxProps(record) {
      return { props: { disabled: !record.extra }}
    },
    /**
     * 删除字段
     */
    async delField() {
      const { selectedRows } = this
      const delIds = selectedRows.map(item => item.id)
      const ids = selectedRows.filter(item => !item.id.includes('add')).map(item => item.id).join()
      if (ids) {
        const { status, message } = await delField(ids)
        if (status == 200) this.$message.success(message)
        this.getList()
      } else {
        this.dataSource = this.dataSource.filter(item => !delIds.includes(item.id))
        this.$message.success('删除成功')
      }
    },
    /**
     * 保存配置
     */
    async save() {
      if (this.dataSource.some(item => !item.name || !item.name.trim())) return this.$message.warning('列名不能为空')
      const params = this.dataSource.map(item => item)
      params.forEach(item => { item.id.includes('add') ? delete item.id : null })
      this.editable ? await this.saveExtra(params) : await this.saveEnable(params)
      this.getList()
      this.editable = false
    },
    /**
     * 保存已选字段
     */
    async saveEnable(params) {
      const { status, message } = await save({ taskType: this.activeIndex, list: params })
      if (status == 200) this.$message.success(message)
    },
    /**
     * 保存拓展项字段
     */
    async saveExtra(params) {
      const { status, message } = await saveExtra({ taskType: this.activeIndex, list: params })
      if (status == 200) this.$message.success(message)
    }
  },
  watch: {
    activeIndex() {
      this.getList()
    },
    editable(val) {
      this.selectedRows = val ? [] : undefined
      this.dataSource = val ? cloneDeep(this.expandField) : cloneDeep(this.enableField)
      const enable = this.columns.find(item => item.title == '是否启用')
      const sort = this.columns.find(item => item.title == '排序')
      enable.visible = val
      sort.visible = !val
    }
  }
}
</script>
<style scoped lang="less">
.title {
  font-size: 16px;
  font-weight: 600;
  color: @primary-color;
}
.h-100 {
  height: 100%;
}
.scroll-y {
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
}
.selectField {
  display: flex;
  span {
    width: 90px;
  }
  .ant-row {
    flex: 1;
  }
}
.caption {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 3px;
  color: #aaaaaa;
  border-bottom: 2px solid #cecece;
}
</style>
