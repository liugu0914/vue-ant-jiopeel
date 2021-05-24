<template>
  <div class="standard-table">
    <!-- 高级搜索 -->
    <a-drawer
      title="高级搜索"
      :placement="placement"
      height="auto"
      width="400"
      :body-style="{ padding: '20px 0' }"
      :visible="advancedSearch"
      @close="openAdvancedSearch"
    >
      <search-area
        :format-conditions="true"
        :is-response="placement === 'top' || placement === 'bottom'"
        :columns="visibleColumns"
        @change="onSearchChange"
        @search="onSearchChange"
      >
        <template v-for="slot in Object.keys($slots)" :slot="slot">
          <slot :name="slot" />
        </template>
      </search-area>
    </a-drawer>
    <!-- 表头 -->
    <a-row v-if="isSearch" class="mb-2" type="flex" align="middle" :gutter="[0, 16]" justify="space-between">
      <a-col :md="12" :sm="24">
        <a-input
          v-if="showInput"
          v-model="inputSearch"
          style="width: 280px"
          :max-length="200"
          :placeholder="placeholder"
          allow-clear
          @change="onInputChange"
          @pressEnter="onInputSearch"
        >
          <a-tooltip v-cloak slot="suffix" title="点击或回车搜索">
            <a-icon :type="loading ? 'loading' : 'search'" @click="onInputSearch" />
          </a-tooltip>
        </a-input>
        <a-tooltip v-if="searchCols && searchCols.length > 0" v-cloak title="高级搜索">
          <a-button type="link" :class="{ filter: hasFilter }" @click="openAdvancedSearch">
            <a-icon type="filter" />
          </a-button>
        </a-tooltip>
      </a-col>
      <a-col :md="12" :sm="24">
        <action-size v-model="size">
          <slot slot="default" name="btns" />
          <a-tooltip v-cloak slot="setting" title="设置">
            <action-columns :columns="columns">
              <template v-for="slot in Object.keys($slots)" :slot="slot">
                <slot :name="slot" />
              </template>
            </action-columns>
          </a-tooltip>
        </action-size>
      </a-col>
    </a-row>
    <!-- 提示框 -->
    <div class="alert">
      <a-alert v-if="selectedRows" type="info" :show-icon="true" banner>
        <div slot="message" class="message">
          已选择&nbsp;<a>{{ selectedRows.length }}</a
          >&nbsp;项 <a class="clear" @click="onClear">清空</a>
        </div>
      </a-alert>
    </div>
    <!-- 表格 -->
    <a-table
      :size="size"
      :bordered="bordered"
      :loading="loading"
      :columns="visibleColumns"
      :data-source="dataSource"
      :row-key="rowKey"
      :pagination="initPagination"
      :expanded-row-keys="expandedRowKeys"
      :expanded-row-render="expandedRowRender"
      :row-selection="selectedRows ? { selectedRowKeys: selectedRowKeys, onChange: updateSelect } : undefined"
      :scroll="scroll"
      :row-class-name="(record, index) => (index % 2 === 1 ? 'active' : '')"
      @change="onChange"
    >
      <template
        v-for="slot in Object.keys($scopedSlots).filter(key => key !== 'expandedRowRender')"
        :slot="slot"
        slot-scope="text, record, index"
      >
        <slot :name="slot" v-bind="{ text, record, index }" />
      </template>
      <template v-for="slot in Object.keys($slots)" :slot="slot">
        <slot :name="slot" />
      </template>
      <template
        :slot="$scopedSlots.expandedRowRender ? 'expandedRowRender' : ''"
        slot-scope="record, index, indent, expanded"
      >
        <slot
          v-bind="{ record, index, indent, expanded }"
          :name="$scopedSlots.expandedRowRender ? 'expandedRowRender' : ''"
        />
      </template>
    </a-table>
  </div>
</template>

<script>
import ActionSize from '@/components/table/advance/ActionSize'
import ActionColumns from '@/components/table/advance/ActionColumns'
import SearchArea from '@/components/table/advance/SearchArea'
import { cloneDeep } from '@/utils/tool'
export default {
  name: 'StandardTable',
  components: {
    ActionSize,
    ActionColumns,
    SearchArea
  },
  props: {
    bordered: {
      type: [Boolean],
      default: false
    },
    loading: {
      type: [Boolean, Object]
    },
    columns: Array,
    dataSource: Array,
    rowKey: {
      type: [String, Function],
      default: 'id'
    },
    pagination: {
      type: [Object, Boolean],
      default: () => ({})
    },
    showInput: {
      type: [Boolean],
      default: true
    },
    placeholder: {
      type: [String],
      default: '搜索...'
    },
    inputName: {
      type: [String],
      default: 'search'
    },
    selectedRows: Array,
    expandedRowKeys: Array,
    expandedRowRender: Function,
    scroll: Object,
    isSearch: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      placement: 'top',
      conditions: {},
      inputSearch: '',
      size: 'default',
      advancedSearch: false,
      newSelectedRows: []
    }
  },
  watch: {
    dataSource(datas) {
      const key = this.getRowKey()
      const rows = []
      const keys = []
      if (!this.selectedRows) return
      this.selectedRows.forEach(row => {
        const rowKey = row[key]
        const index = datas.findIndex(item => item[key] === rowKey)
        if (index > -1) {
          rows.push(datas[index])
          keys.push(rowKey)
        }
      })
      this.updateSelect(keys, rows)
    }
  },
  methods: {
    openAdvancedSearch() {
      this.advancedSearch = !this.advancedSearch
    },
    onInputChange() {
      const inputName = this.inputName
      if (this.inputSearch) {
        this.conditions[inputName] = this.inputSearch
      } else {
        delete this.conditions[inputName]
        this.onInputSearch()
      }
    },
    onInputSearch() {
      if (this.loading) {
        return
      }
      this.$emit('search', this.conditions)
    },
    onSearchChange(conditions) {
      const inputName = this.inputName
      this.conditions = conditions
      if (this.inputSearch) {
        this.conditions[inputName] = this.inputSearch
      }
      console.log(this.conditions)
      this.$emit('search', this.conditions)
    },
    onSelect(record, selected) {
      const key = this.getRowKey()
      const index = this.newSelectedRows.findIndex(item => item[key] === record[key])
      if (selected && index == -1) {
        this.newSelectedRows.push(record)
      } else {
        this.newSelectedRows.splice(index, 1)
      }
      const selectedRowKeys = this.newSelectedRows.map(record => {
        return record[this.getRowKey()]
      })
      this.updateSelect(selectedRowKeys, this.newSelectedRows)
    },
    onSelectAll(selected, selectedRows, changeRows) {
      const key = this.getRowKey()
      changeRows.forEach(record => {
        const index = this.newSelectedRows.findIndex(item => {
          return item[key] === record[key]
        })
        if (selected && index == -1) {
          this.newSelectedRows.push(record)
        } else {
          this.newSelectedRows.splice(index, 1)
        }
      })
      const selectedRowKeys = this.newSelectedRows.map(record => {
        return record[this.getRowKey()]
      })
      this.updateSelect(selectedRowKeys, this.newSelectedRows)
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log('onSelectChange')
      console.log(selectedRowKeys, selectedRows)
      this.updateSelect(selectedRowKeys, this.newSelectedRows)
    },
    updateSelect(selectedRowKeys, selectedRows) {
      this.$emit('update:selectedRows', selectedRows)
      this.$emit('selectedRowChange', selectedRowKeys, selectedRows)
    },
    getRowKey() {
      return typeof this.rowKey === 'function' ? this.rowKey() : this.rowKey
    },
    onClear() {
      this.newSelectedRows = []
      this.updateSelect([], [])
      this.$emit('clearSelect')
    },
    onChange(pagination, filters, sorter, { currentDataSource }) {
      this.$emit('change', pagination, filters, sorter, { currentDataSource })
    }
  },
  computed: {
    hasFilter() {
      const conditions = cloneDeep(this.conditions)
      delete conditions[this.inputName]
      return Object.values(conditions).length === 0
    },
    visibleColumns() {
      const visibleColumns = this.columns.filter(col => col.visible === true || col.visible === undefined)
      return visibleColumns
    },
    selectedRowKeys() {
      return this.selectedRows.map(record => {
        return record[this.getRowKey()]
      })
    },
    searchCols() {
      return this.visibleColumns.filter(item => item.searchAble)
    },
    initPagination() {
      const page = {
        pageSizeOptions: ['10', '20', '30', '40', '50'],
        showSizeChanger: true,
        defaultPageSize: 10,
        showTotal: (total, range) => `共 ${total} 条`
        // hideOnSinglePage: true
      }
      return typeof this.pagination === 'boolean' ? this.pagination : { ...page, ...this.pagination }
    }
  }
}
</script>

<style scoped lang="less">
.standard-table {
  .alert {
    margin-bottom: 16px;
    .message {
      a {
        font-weight: 600;
      }
    }
    .clear {
      float: right;
    }
  }
  .filter {
    color: @gray-7;
  }
}
</style>
