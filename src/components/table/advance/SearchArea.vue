<template>
  <div ref="root" class="search-area">
    <div ref="selectRoot" class="select-root" />

    <a-form class="beauty-scroll" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
      <a-row :gutter="[16,0]">
        <a-col v-for="(col, index) in searchCols" :key="index" :xl="response.xl" :lg="response.lg" :md="response.md" :sm="response.sm">
          <a-form-item class="w-100" :colon="false" style="margin-bottom: 10px">
            <template slot="label">
              <template v-if="col.title">
                {{ col.search.title || col.title }}
              </template>
              <slot v-else-if="col.slots && col.slots.title" :name="col.slots.title" />
            </template>
            <template v-if="col.dataType === 'boolean'">
              <a-switch v-model="col.search.value" checked-children="是" un-checked-children="否" @change="onSwitchChange(col)" />
            </template>
            <template v-else-if="col.dataType === 'time'">
              <a-time-picker v-model="col.search.value" :format="col.search.format" placeholder="选择时间" class="w-100" @change="(time, timeStr) => onCalendarChange(time, timeStr, col)" @openChange="open => onCalendarOpenChange(open, col)" />
            </template>
            <template v-else-if="col.dataType === 'date'">
              <a-date-picker v-model="col.search.value" class="w-100" :format="col.search.format" @change="onDateChange(col)" />
            </template>
            <template v-else-if="col.dataType === 'month'">
              <a-month-picker v-model="col.search.value" class="w-100" :format="col.search.format" @change="onDateChange(col)" />
            </template>
            <template v-else-if="col.dataType === 'datetime'">
              <a-date-picker v-model="col.search.value" class="w-100" :format="col.search.format" show-time @change="(date, dateStr) => onCalendarChange(date, dateStr, col)" @openChange="open => onCalendarOpenChange(open, col)" />
            </template>
            <template v-else-if="col.dataType === 'range'">
              <a-range-picker v-model="col.search.value" class="w-100" :format="col.search.format" @change="onDateChange(col)" />
            </template>
            <template v-else-if="col.dataType === 'tree'">
              <a-tree-select
                v-model="col.search.value"
                class="w-100"
                show-search
                allow-clear
                :tree-data="col.search.options"
                :multiple="col.search && col.search.multiple"
                :filter-tree-node="treeFilterOption"
                placeholder="请选择"
                @focus="focus(col)"
                @change="onSelectChange(col)"
              />
            </template>
            <template v-else-if="col.dataType === 'select'">
              <a-select
                v-model="col.search.value" :filter-option="filterOption" show-search class="w-100" allow-clear :mode="col.search && col.search.multiple?'multiple':'default' "
                placeholder="请选择" @change="onSelectChange(col)" @focus="focus(col)">
                <a-select-option v-for="(item,selectIndex) in col.search.options" :key="selectIndex" :value="item.value" :disabled="item.disabled">
                  {{ item.label || item.title }}
                </a-select-option>
              </a-select>
            </template>
            <template v-else-if="col.dataType === 'checkbox'">
              <a-checkbox-group v-model="col.search.value" class="w-100" @change="onSelectChange(col)">
                <a-row :gutter="[0, 8]" class="w-100" :class="{center: col.search.options && col.search.options.length <= 3}">
                  <a-col v-for="item in col.search.options" :key="item.value" :span="8">
                    <a-checkbox :value="item.value">
                      {{ item.label || item.title }}
                    </a-checkbox>
                  </a-col>
                </a-row>
              </a-checkbox-group>
            </template>
            <template v-else-if="col.dataType === 'radio'">
              <a-radio-group v-model="col.search.value" @change="()=>onSelectChange(col)">
                <a-radio v-for="(item,radioIndex) in col.search.options" :key="radioIndex" :value="item.value">
                  {{ item.label }}
                </a-radio>
              </a-radio-group>
            </template>
            <template v-else-if="col.dataType === 'twiceNumber'">
              <a-input-group compact class="w-100">
                <a-input v-model.number="col.search.value.minVal" :min="0" type="number" style=" width: 45%; text-align: center" placeholder="最小值" @change="onTwiceChange(col)" />
                <a-input class="disabled-placeholder" placeholder="~" disabled />
                <a-input v-model.number="col.search.value.maxVal" :min="col.search.value.minVal || 0" type="number" style="width: 45%; text-align: center; border-left: 0" placeholder="最大值" @change="onTwiceChange(col)" />
              </a-input-group>
            </template>
            <template v-else>
              <a-input v-model="col.search.value" :placeholder="`请输入${col.title}`" :max-length="255" class="w-100" allow-clear @change="onConfirm(col)" />
            </template>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div
      :style="{
        textAlign: 'right',
        marginRight: '24px'
      }"
    >
      <a-button style="marginRight: 8px" @click="onClear">
        <!-- <a-icon type="undo" /> -->
        重置
      </a-button>
      <a-button type="primary" @click="onSearch">
        <!-- <a-icon type="search" /> -->
        查询
      </a-button>
    </div>
  </div>
</template>

<script>
import fastEqual from 'fast-deep-equal'
import { cloneDeep } from '@/utils/tool'
import moment from 'moment'

export default {
  name: 'SearchArea',
  props: ['columns', 'formatConditions', 'isResponse'],
  created() {
    this.columns.forEach(item => {
      item.search = item.search || {}
      item.search.options = item.search.options || []
      const searchValue = item.search.value
      const value = searchValue !== undefined ? searchValue : item.dataType === 'twiceNumber' ? { minVal: undefined, maxVal: undefined } : undefined
      this.$set(item, 'search', { ...item.search, value, format: this.getFormat(item) })
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
    },
    response() {
      return this.isResponse === true ? { xl: 6, lg: 8, md: 12, sm: 24 } : { xl: 24, lg: 24, md: 24, sm: 24 }
    }
  },
  methods: {
    /**
     *tree select搜索
     */
    treeFilterOption(searchVal, treeNode) {
      return treeNode.data.props.name.includes(searchVal)
    },
    /**
     * select搜索
     */
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    onCloseClick(e, col) {
      e.preventDefault()
      e.stopPropagation()
      col.search.value = undefined
      const { backup, value } = col.search
      if (backup !== value) {
        this.backupAndEmitChange(col)
      }
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
    onConfirm(col) {
      const { backup, value } = col.search
      col.filtered = Boolean(Array.isArray(value) ? value.length : value)
      if (backup !== value) {
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
    onSelectChange(col) {
      const { value } = col.search
      col.filtered = Boolean(Array.isArray(value) ? value.length : value !== undefined)
      this.backupAndEmitChange(col)
    },
    focus(col) {
      const { async = false, options = [] } = col.search
      if (async && async instanceof Function && options.length === 0) {
        async().then(res => {
          options.push(...res)
        })
      }
    },
    onCalendarOpenChange(open, col) {
      const { momentEqual, backupAndEmitChange } = this
      const { value, backup, format } = col.search
      if (!open && !momentEqual(value, backup, format)) {
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
    onDateChange(col) {
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
      col.search.backup = cloneDeep(backValue)
      this.conditions = getConditions(this.searchCols)
      this.searchOptions = getSearchOptions(this.searchCols)
      this.$emit('change', this.conditions, this.searchOptions)
    },
    getConditions(columns) {
      const conditions = {}
      columns.filter(item => item.search.value !== undefined && item.search.value !== '' && item.search.value !== null)
        .forEach(col => {
          const { value, format, name, twice = {}} = col.search
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
    onClear() {
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
      // this.$emit('clear', {})
      this.$emit('search', {})
    },
    onSearch() {
      this.$emit('search', this.getConditions(this.searchCols))
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
    }
  }
}
</script>

<style scoped lang="less">
.ant-form {
  padding: 0 24px;
  margin-bottom: 10px;
  // max-height: 186px;
  height: calc(100vh - 137px);
  overflow-y: auto;
  overflow-x: hidden;
}
.disabled-placeholder{
  width: 10%;
  border-left: 0;
  text-align: center;
  pointer-events: none;
  background-color: @component-background;
}
.ant-checkbox-wrapper {
  margin: 0;
}
.center {
  display:flex;
  align-items: baseline;
  flex-wrap: wrap;
}
</style>
