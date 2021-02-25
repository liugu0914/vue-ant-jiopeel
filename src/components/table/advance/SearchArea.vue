<template>
  <div ref="root" class="search-area">
    <div ref="selectRoot" class="select-root" />

    <a-form layout="vertical">
      <a-row :gutter="[16,0]">
        <a-col v-for="(col, index) in searchCols" :key="index" :xl="6" :lg="8" :md="12" :sm="24">
          <a-form-item v-if="col.dataType === 'boolean'">
            <template slot="label">
              <template v-if="col.title">
                {{ col.title }}
              </template>
              <slot v-else-if="col.slots && col.slots.title" :name="col.slots.title" />
            </template>
            <a-switch v-model="col.search.value" checked-children="是" un-checked-children="否" @change="onSwitchChange(col)" />
          </a-form-item>
          <a-form-item v-else-if="col.dataType === 'time'">
            <template slot="label">
              <template v-if="col.title">
                {{ col.title }}
              </template>
              <slot v-else-if="col.slots && col.slots.title" :name="col.slots.title" />
            </template>
            <a-time-picker v-model="col.search.value" :format="col.search.format" placeholder="选择时间" class="w-100" @change="(time, timeStr) => onCalendarChange(time, timeStr, col)" @openChange="open => onCalendarOpenChange(open, col)" />
          </a-form-item>
          <a-form-item v-else-if="col.dataType === 'date'">
            <template slot="label">
              <template v-if="col.title">
                {{ col.title }}
              </template>
              <slot v-else-if="col.slots && col.slots.title" :name="col.slots.title" />
            </template>
            <a-date-picker v-model="col.search.value" class="w-100" :format="col.search.format" @change="onDateChange(col)" />
          </a-form-item>
          <a-form-item v-else-if="col.dataType === 'month'">
            <template slot="label">
              <template v-if="col.title">
                {{ col.title }}
              </template>
              <slot v-else-if="col.slots && col.slots.title" :name="col.slots.title" />
            </template>
            <a-month-picker v-model="col.search.value" class="w-100" :format="col.search.format" @change="onDateChange(col)" />
          </a-form-item>
          <a-form-item v-else-if="col.dataType === 'range'">
            <template slot="label">
              <template v-if="col.title">
                {{ col.title }}
              </template>
              <slot v-else-if="col.slots && col.slots.title" :name="col.slots.title" />
            </template>
            <a-range-picker v-model="col.search.value" class="w-100" :format="col.search.format" @change="onDateChange(col)" />
          </a-form-item>
          <a-form-item v-else-if="col.dataType === 'datetime'">
            <template slot="label">
              <template v-if="col.title">
                {{ col.title }}
              </template>
              <slot v-else-if="col.slots && col.slots.title" :name="col.slots.title" />
            </template>
            <a-date-picker v-model="col.search.value" class="w-100" :format="col.search.format" show-time @change="(date, dateStr) => onCalendarChange(date, dateStr, col)" @openChange="open => onCalendarOpenChange(open, col)" />
          </a-form-item>
          <a-form-item v-else-if="col.dataType === 'select'">
            <template slot="label">
              <template v-if="col.title">
                {{ col.title }}
              </template>
              <slot v-else-if="col.slots && col.slots.title" :name="col.slots.title" />
            </template>
            <a-select v-model="col.search.value" class="w-100" allow-clear :mode="col.search && col.search.multiple?'multiple':'default' " placeholder="请选择" @change="onSelectChange(col)">
              <a-select-option v-for="(item,selectIndex) in col.search.options" :key="selectIndex" :value="item.value" :disabled="item.disabled">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item v-else-if="col.dataType === 'checkbox'">
            <template slot="label">
              <template v-if="col.title">
                {{ col.title }}
              </template>
              <slot v-else-if="col.slots && col.slots.title" :name="col.slots.title" />
            </template>
            <a-checkbox-group v-model="col.search.value" :options="col.search.options" @change="onSelectChange(col)" />
          </a-form-item>
          <a-form-item v-else-if="col.dataType === 'radio'">
            <template slot="label">
              <template v-if="col.title">
                {{ col.title }}
              </template>
              <slot v-else-if="col.slots && col.slots.title" :name="col.slots.title" />
            </template>
            <a-radio-group v-model="col.search.value" @change="()=>onSelectChange(col)">
              <a-radio v-for="(item,radioIndex) in col.search.options" :key="radioIndex" :value="item.value">
                {{ item.label }}
              </a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item v-else>
            <template slot="label">
              <template v-if="col.title">
                {{ col.title }}
              </template>
              <slot v-else-if="col.slots && col.slots.title" :name="col.slots.title" />
            </template>
            <a-input v-model="col.search.value" placeholder="请输入" class="w-100" allow-clear @change="onConfirm(col)" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div
      :style="{
        textAlign: 'right'
      }"
    >
      <a-button style="marginRight: 8px" @click="onClear">
        重置
      </a-button>
      <a-button type="primary" @click="onSearch">
        查询
      </a-button>
    </div>
  </div>
</template>

<script>
import fastEqual from 'fast-deep-equal'
import moment from 'moment'

export default {
  name: 'SearchArea',
  props: ['columns', 'formatConditions'],
  created() {
    this.columns.forEach(item => {
      this.$set(item, 'search', { ...item.search, value: undefined, format: this.getFormat(item) })
    })
  },
  watch: {
    searchCols(newVal, oldVal) {
      if (newVal.length != oldVal.length) {
        const newConditions = this.getConditions(newVal)
        const newSearchOptions = this.getSearchOptions(newVal)
        if (!fastEqual(newConditions, this.conditions)) {
          this.conditions = newConditions
          this.searchOptions = newSearchOptions
          this.$emit('change', this.conditions, this.searchOptions)
        }
      }
    }
  },
  data() {
    return {
      conditions: {},
      searchOptions: []
    }
  },
  computed: {
    searchCols() {
      return this.columns.filter(item => item.searchAble)
    }
  },
  methods: {
    onCloseClick(e, col) {
      e.preventDefault()
      e.stopPropagation()
      col.search.value = undefined
      const { backup, value } = col.search
      if (backup !== value) {
        this.backupAndEmitChange(col)
      }
    },
    onConfirm(col) {
      const { backup, value } = col.search
      if (backup !== value) {
        this.backupAndEmitChange(col)
      }
    },
    onSwitchChange(col) {
      const { backup, value } = col.search
      if (backup !== value) {
        this.backupAndEmitChange(col)
      }
    },
    onSelectChange(col) {
      this.backupAndEmitChange(col)
    },
    onCalendarOpenChange(open, col) {
      const { momentEqual, backupAndEmitChange } = this
      const { value, backup, format } = col.search
      if (!open && !momentEqual(value, backup, format)) {
        backupAndEmitChange(col, moment(value))
      }
    },
    onCalendarChange(date, dateStr, col) {
      const { momentEqual, backupAndEmitChange } = this
      const { value, backup, format } = col.search
      if (!momentEqual(value, backup, format)) {
        backupAndEmitChange(col, moment(value))
      }
    },
    onDateChange(col) {
      const { momentEqual, backupAndEmitChange } = this
      const { value, backup, format } = col.search
      if (!momentEqual(value, backup, format)) {
        backupAndEmitChange(col, moment(value))
      }
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
    backupAndEmitChange(col, backValue = col.search.value) {
      const { getConditions, getSearchOptions } = this
      col.search.backup = backValue
      this.conditions = getConditions(this.searchCols)
      this.searchOptions = getSearchOptions(this.searchCols)
      this.$emit('change', this.conditions, this.searchOptions)
    },
    getConditions(columns) {
      const conditions = {}
      columns.filter(item => item.search.value !== undefined && item.search.value !== '' && item.search.value !== null)
        .forEach(col => {
          const { value, format, name } = col.search
          const dataIndex = name || col.dataIndex
          let searchVal
          if (this.formatConditions && format) {
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
          const isArr = Array.isArray(searchVal)
          if ((!isArr && searchVal) || (isArr && searchVal.length > 0)) {
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
    onClear() {
      this.searchCols.filter(item => item.search.value !== undefined && item.search.value !== '' && item.search.value !== null)
        .forEach(col => {
          col.search.value = undefined
        })
      this.$emit('clear', {})
    },
    onSearch() {
      this.$emit('search', this.getConditions(this.searchCols))
    },
    momentEqual(target, source, format) {
      const isArr = Array.isArray(target)
      if (isArr) {
        if (target && source) {
          let flag = false
          target.forEach((moment, index) => {
            flag = target[index].format(format) === source._i[index].format(format)
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
    }
  }
}
</script>

<style scoped lang="less">
.search-area{
  .select-root{
    text-align: left;
  }
  margin: -4px 0;
  .search-item{
    margin: 4px 4px;
    display: inline-block;
    .title{
      padding: 4px 8px;
      cursor: pointer;
      border-radius: 4px;
      user-select: none;
      display: inline-flex;
      align-items: center;
      .close{
        color: @text-color-second;
        margin-left: 4px;
        font-size: 12px;
        vertical-align: middle;
        :hover{
          color: @text-color;
        }
      }
      .switch{
        margin-left: 4px;
      }
      .time-picker{
        margin-left: 4px;
        width: 96px;
      }
      .date-picker{
        margin-left: 4px;
        width: 120px;
      }
      .datetime-picker{
        margin-left: 4px;
        width: 195px;
      }
      .value{
        display: inline-block;
        overflow: hidden;
        flex:1;
        vertical-align: middle;
        max-width: 144px;
        text-overflow: ellipsis;
        word-break: break-all;
        white-space: nowrap;
      }
      &.active{
        background-color: @layout-bg-color;
      }
    }
    .icon-down{
      vertical-align: middle;
      font-size: 12px;
    }
  }
  .search-overlay{
    padding: 8px 0px;
    text-align: center;
  }
  .select{
    margin-left: 4px;
    max-width: 144px;
    min-width: 96px;
    text-align: left;
  }
  .operations{
    display: flex;
    margin: -6px 0;
    justify-content: space-between;
    .btn{
    }
  }
}
</style>
