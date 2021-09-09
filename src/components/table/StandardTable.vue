<template>
  <div class="standard-table">
    <!-- 高级搜索 -->
    <a-drawer
      title="高级检索"
      :placement="placement"
      height="auto"
      width="30%"
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
    <a-row v-if="isSearch || $slots.btns" class="mb-2" type="flex" align="middle" :gutter="[0, 16]" justify="space-between">
      <!-- <a-col :md="12" :sm="24">
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
      </a-col> -->
      <a-col>{{ $route.meta.name }}</a-col>
      <a-col class="text-right">
        <!-- <action-size v-model="size">
          <slot slot="default" name="btns" />
          <a-tooltip v-cloak slot="setting" title="设置">
            <action-columns :columns="columns">
              <template v-for="slot in Object.keys($slots)" :slot="slot">
                <slot :name="slot" />
              </template>
            </action-columns>
          </a-tooltip>
        </action-size> -->
        <a-button v-if="searchCols && searchCols.length" @click="reset">
          重置
        </a-button>
        <a-button v-if="searchCols && searchCols.length" type="primary" @click="openAdvancedSearch">
          <a-icon type="search" />高级检索
        </a-button>
        <slot slot="default" name="btns" />
      </a-col>
    </a-row>
    <!-- 提示框 -->
    <div v-if="selectedRows" class="alert">
      <a-alert type="info" :show-icon="true" banner>
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
      :row-selection="rowSelection"
      :scroll="scroll"
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
      <!-- 表头筛选 -->
      <template v-for="(col, index) in searchCols">
        <div :slot="col.ref" :key="index" style="padding: 8px; max-width: 200px" class="filter">
          <a-switch v-if="col.dataType === 'boolean'" v-model="col.search.value" checked-children="是" un-checked-children="否" @change="onSwitchChange(col)" />
          <a-time-picker v-else-if="col.dataType === 'time'" v-model="col.search.value" :open="col.open" :format="col.search.format" placeholder="选择时间" class="w-100" @change="(time, timeStr) => onCalendarChange(time, timeStr, col)" @openChange="open => onCalendarOpenChange(open, col)" />
          <a-date-picker v-else-if="col.dataType === 'date'" v-model="col.search.value" :open="col.open" class="w-100" :format="col.search.format" @change="onDateChange(col)" @focus="col.open = true" />
          <a-month-picker v-else-if="col.dataType === 'month'" v-model="col.search.value" :open="col.open" class="w-100" :format="col.search.format" @change="onDateChange(col)" />
          <a-date-picker v-else-if="col.dataType === 'datetime'" v-model="col.search.value" :open="col.open" class="w-100" :format="col.search.format" show-time @change="(date, dateStr) => onCalendarChange(date, dateStr, col)" @openChange="open => onCalendarOpenChange(open, col)" />
          <a-range-picker v-else-if="col.dataType === 'range'" v-model="col.search.value" :open="col.open" class="w-100" :format="col.search.format" @change="onDateChange(col)" />
          <template v-else-if="col.dataType === 'tree'">
            <a-tree-select
              :ref="col.ref" v-model="col.search.value" :open="col.open" class="w-100" show-search allow-clear
              :placeholder="`请选择${col.title}`" :dropdown-style="{'max-height': '290px','max-width': '168px'}"
              :tree-data="col.search.options" :multiple="col.search && col.search.multiple" :filter-tree-node="treeFilterOption" @change="onHeadSelectChange(col)"
            />
          </template>
          <template v-else-if="col.dataType === 'select'">
            <a-select
              :ref="col.ref" v-model="col.search.value" :filter-option="filterOption" show-search class="w-100" :open="col.open"
              allow-clear :mode="col.search && col.search.multiple?'multiple':'default' " :placeholder="`请选择${col.title}`" @change="onHeadSelectChange(col)">
              <a-select-option v-for="(item,selectIndex) in col.search.options" :key="selectIndex" :value="item.value" :disabled="item.disabled">
                {{ item.label || item.title }}
              </a-select-option>
            </a-select>
          </template>
          <template v-else-if="col.dataType === 'checkbox'">
            <a-list>
              <a-list-item>
                <a-checkbox :checked="checked(col)" @change="e => checkAll(e, col)">
                  全选
                </a-checkbox>
              </a-list-item>
            </a-list>
            <a-checkbox-group v-model="col.search.value" @change="onHeadSelectChange(col)">
              <a-list v-for="item in col.search.options" :key="item.value" size="small">
                <a-list-item>
                  <a-checkbox :value="item.value">
                    {{ item.label || item.title }}
                  </a-checkbox>
                </a-list-item>
              </a-list>
            </a-checkbox-group>
          </template>

          <a-radio-group v-else-if="col.dataType === 'radio'" v-model="col.search.value" @change="()=>onHeadSelectChange(col)">
            <a-radio v-for="(item,radioIndex) in col.search.options" :key="radioIndex" :value="item.value">
              {{ item.label }}
            </a-radio>
          </a-radio-group>
          <a-input-group v-else-if="col.dataType === 'twiceNumber'" compact class="w-100" style="display: flex">
            <a-input v-model.number="col.search.value.minVal" type="number" :min="0" style=" width: 45%; text-align: center" placeholder="最小值" @change="onTwiceChange(col)" />
            <a-input class="disabled-placeholder" placeholder="~" disabled />
            <a-input v-model.number="col.search.value.maxVal" type="number" :min="col.search.value.minVal || 0" style="width: 45%; text-align: center; border-left: 0" placeholder="最大值" @change="onTwiceChange(col)" />
          </a-input-group>
          <a-input v-else :ref="col.ref" v-model="col.search.value" allow-clear :placeholder="`请输入${col.title}`" :max-length="100" @change="onConfirm(col)" />
          <div :style="{width: col.dataType == 'checkbox' ? 'auto' : '180px'}" />
        </div>
        <a-icon :slot="col.dataIndex + 'Icon'" :key="index" type="filter" theme="filled" />
      </template>
    </a-table>
  </div>
</template>

<script>
// import ActionSize from '@/components/table/advance/ActionSize'
// import ActionColumns from '@/components/table/advance/ActionColumns'
import SearchArea from '@/components/table/advance/SearchArea'
import { cloneDeep } from '@/utils/tool'
import fastEqual from 'fast-deep-equal'
import moment from 'moment'

export default {
  name: 'StandardTable',
  components: {
    // ActionSize,
    // ActionColumns,
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
    columns: {
      type: Array,
      default: () => []
    },
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
    },
    getCheckboxProps: Function
  },
  data() {
    return {
      placement: 'right',
      conditions: {},
      searchOptions: [],
      inputSearch: '',
      size: 'default',
      advancedSearch: false,
      newSelectedRows: []
    }
  },
  created() {
    // 初始化 columns
    this.initColumn()
  },
  watch: {
    dataSource(datas) {
      const { current, pageSize } = this.pagination
      this.visibleColumns[0].customRender = (text, record, index) => current > 1 ? ((current - 1) * pageSize) + index + 1 : index + 1
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
    },
    searchCols(newVal, oldVal) {
      if (newVal.length != oldVal.length) {
        const newConditions = this.getConditions(newVal)
        const newSearchOptions = this.getSearchOptions(newVal)
        if (!fastEqual(newConditions, this.conditions)) {
          this.conditions = newConditions
          this.searchOptions = newSearchOptions
          this.onSearchChange(this.conditions, this.searchOptions)
        }
      }
    },
    columns() {
      this.initColumn()
    }
  },
  methods: {
    /**
     * 初始化 column
     */
    initColumn() {
      this.columns.forEach(item => {
        if (!item.searchAble) return
        item.scopedSlots = { ... item.scopedSlots, filterDropdown: item.dataIndex + 'Filter', filterIcon: item.dataIndex + 'Icon' }
        item.ref = item.dataIndex + 'Filter'
        item.search = item.search || {}
        item.filtered = false
        this.$set(item, 'open', false)
        const value = item.dataType === 'twiceNumber' ? { minVal: undefined, maxVal: undefined } : undefined
        this.$set(item, 'search', { ...item.search, value, format: this.getFormat(item) })
        item.onFilterDropdownVisibleChange = visible => this.onFilterDropdownVisibleChange(item, visible)
      })
    },
    /**
     * 监听filter插槽显隐
     */
    async onFilterDropdownVisibleChange(col, visible) {
      const { async = false, options = [] } = col.search
      if (async && async instanceof Function && options.length === 0) {
        const res = await async()
        options.push(...res)
        col.search.options = options
      }
      this.$set(col, 'open', visible)
      if (visible) {
        setTimeout(() => {
          this.$refs[col.ref] && this.$refs[col.ref][0].focus()
        }, 0)
      }
    },
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
      this.$emit('update:pagination', { ...this.pagination, current: 1 })
      this.$emit('search', this.conditions)
    },
    onSearchChange(conditions) {
      const inputName = this.inputName
      this.conditions = conditions
      if (this.inputSearch) {
        this.conditions[inputName] = this.inputSearch
      }
      console.log(this.conditions)
      this.$emit('update:pagination', { ...this.pagination, current: 1 })
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
    },
    /**
     * select搜索
     */
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    /**
     *tree select搜索
     */
    treeFilterOption(searchVal, treeNode) {
      return treeNode.data.props.name.includes(searchVal)
    },
    getFormat(col) {
      if (col.search && col.search.format) {
        return col.search.format
      }
      const dataType = col.dataType
      switch (dataType) {
        case 'time': return 'HH:mm:ss'
        case 'date': return 'YYYY-MM-DD'
        case 'month': return 'YYYY-MM'
        case 'year': return 'YYYY'
        case 'datetime': return 'YYYY-MM-DD HH:mm:ss'
        case 'range': return 'YYYY-MM-DD'
        default: return undefined
      }
    },
    getConditions(columns) {
      const conditions = {}
      columns.filter(item => item.search.value !== undefined && item.search.value !== '' && item.search.value !== null)
        .forEach(col => {
          const { value, format, name, twice = {}} = col.search
          const dataIndex = name || col.dataIndex
          let searchVal
          if (format) {
            if (typeof format === 'function') {
              searchVal = format(col.search.value)
            } else if (typeof format === 'string' && (value.constructor.name === 'Moment' || value.constructor.name === 'Array')) {
              if (Array.isArray(value)) {
                const rangeStr = []
                value.forEach((moment) => {
                  rangeStr.push(moment.format(format))
                })
                searchVal = rangeStr
              } else {
                searchVal = value.format(format)
              }
            } else {
              searchVal = value
            }
          } else {
            searchVal = value
          }
          if (col.dataType === 'twiceNumber') { // 双input框
            const { minVal, maxVal } = value
            if (minVal !== null && minVal !== undefined && minVal !== '') {
              conditions[twice.minName] = minVal
            }
            if (maxVal !== null && maxVal !== undefined && maxVal !== '') {
              conditions[twice.maxName] = maxVal
            }
            return
          }
          const isArr = Array.isArray(searchVal)
          if ((!isArr && searchVal !== undefined) || (isArr && searchVal.length > 0)) {
            conditions[dataIndex] = searchVal
          }
        })
      console.log('conditions', conditions)
      return conditions
    },
    getSearchOptions(columns) {
      return columns.filter(item => item.search.value !== undefined && item.search.value !== '' && item.search.value !== null)
        .map(({ dataIndex, search }) => ({ field: search.name || dataIndex, value: search.value, format: search.format }))
    },
    backupAndEmitChange(col, backValue = col.search.value) {
      const { getConditions, getSearchOptions } = this
      col.search.backup = cloneDeep(backValue)
      this.conditions = getConditions(this.searchCols)
      this.searchOptions = getSearchOptions(this.searchCols)
      this.onSearchChange(this.conditions, this.searchOptions)
    },
    onConfirm(col) {
      const { backup, value } = col.search
      col.filtered = Boolean(Array.isArray(value) ? value.length : value)
      if (backup !== value) {
        this.backupAndEmitChange(col)
      }
    },
    onHeadSelectChange(col) {
      const { value } = col.search
      col.filtered = Boolean(Array.isArray(value) ? value.length : value !== undefined)
      this.backupAndEmitChange(col)
    },
    onTwiceChange(col) {
      const { backup, value } = col.search
      const { minVal, maxVal } = value
      if (minVal > maxVal) col.search.value.maxVal = minVal
      col.filtered = Boolean(minVal || maxVal)
      if (!fastEqual(backup, value)) {
        this.backupAndEmitChange(col)
      }
    },
    onSwitchChange(col) {
      const { backup, value } = col.search
      col.filtered = Boolean(Array.isArray(value) ? value.length : value)
      if (backup !== value) {
        this.backupAndEmitChange(col)
      }
    },
    onCalendarChange(date, dateStr, col) {
      const { momentEqual, backupAndEmitChange } = this
      const { value, backup, format } = col.search
      col.filtered = Boolean(Array.isArray(value) ? value.length : value)
      if (!momentEqual(value, backup, format)) {
        let monentVal
        if (Array.isArray(value)) {
          if (value.length !== 0) {
            monentVal = moment(value)
          } else {
            col.search.value = undefined
          }
        } else {
          monentVal = moment(value)
        }
        backupAndEmitChange(col, monentVal)
      }
    },
    momentEqual(target, source, format) {
      const isArr = Array.isArray(target)
      if (isArr) {
        if (target && source) {
          let flag = true
          target.forEach((moment, index) => {
            flag = flag && target[index].format(format) === source._i[index].format(format)
          })
          return flag
        }
        return false
      }
      if (target === source) {
        return true
      } else if (target && source && target.format(format) === source.format(format)) {
        return true
      }
      return false
    },
    onDateChange(col) {
      col.open = false
      const { momentEqual, backupAndEmitChange } = this
      const { value, backup, format } = col.search
      col.filtered = Boolean(Array.isArray(value) ? value.length : value)
      if (!momentEqual(value, backup, format)) {
        let monentVal
        if (Array.isArray(value)) {
          if (value.length !== 0) {
            monentVal = moment(value)
          } else {
            col.search.value = undefined
          }
        } else {
          monentVal = moment(value)
        }
        backupAndEmitChange(col, monentVal)
      }
    },
    reset() {
      this.searchCols.filter(item => item.search.value !== undefined && item.search.value !== '' && item.search.value !== null)
        .forEach(col => {
          col.filtered = false
          if (col.dataType === 'twiceNumber') { // 双input框
            col.search.value = {
              minVal: undefined,
              maxVal: undefined
            }
          } else {
            col.search.value = undefined
          }
        })
      this.onSearchChange({})
    },
    checkAll(e, col) {
      const { options } = col.search
      col.search.value = e.target.checked ? options.map(item => item.value) : []
      col.filtered = !!e.target.checked
      this.backupAndEmitChange(col)
    },
    checked(col) {
      const { value = [], options = [] } = col.search
      return value.length == options.length
    }
  },
  computed: {
    hasFilter() {
      const conditions = cloneDeep(this.conditions)
      delete conditions[this.inputName]
      return Object.values(conditions).length === 0
    },
    visibleColumns() {
      const obj = { title: '序号', dataIndex: 'index', width: 80, disable: true, align: 'center', customRender: (text, record, index) => index + 1 }
      const columns = [obj, ...this.columns]
      const visibleColumns = columns.filter(col => col.visible === true || col.visible === undefined)
      return visibleColumns
    },
    selectedRowKeys() {
      return this.selectedRows && this.selectedRows.map(record => {
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
    },
    rowSelection({ selectedRows, selectedRowKeys, updateSelect, getCheckboxProps }) {
      const rowSelection = { selectedRowKeys: selectedRowKeys, onChange: updateSelect }
      if (getCheckboxProps) rowSelection.getCheckboxProps = getCheckboxProps
      return selectedRows ? rowSelection : undefined
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
/deep/ .text-right {
  button {
    margin-left: 10px;
  }
}

.disabled-placeholder{
  padding: 0;
  width: 10%;
  border-left: 0;
  text-align: center;
  pointer-events: none;
  background-color: @component-background;
}
</style>
