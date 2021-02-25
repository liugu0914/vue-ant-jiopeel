<template>
  <a-popover v-model="visible" class="action-columns" placement="bottomRight" trigger="click">
    <a-button>
      <a-icon class="action" type="setting" />
    </a-button>
    <div slot="title">
      列展示
      <a-button style="float: right" type="link" size="small" @click="resetColumns">
        重置
      </a-button>
    </div>
    <a-list v-for="(col, i) in columns" :key="i" slot="content" style="width: 100%" size="small">
      <a-list-item>
        <a-checkbox v-model="col.visible" :disabled="col.disableCheck" @change="e => onCheckChange(e, col)" />
        <span class="float-right px-1">
          <template v-if="col.title">
            {{ col.title }}
          </template>
          <slot v-else-if="col.slots && col.slots.title" :name="col.slots.title" />
        </span>
        <!-- <template slot="actions">
            <a-tooltip title="固定在列头" :mouse-enter-delay="0.5" :get-popup-container="() => $refs.root">
              <a-icon :class="['left', {active: col.fixed === 'left'}]" type="vertical-align-top" @click="fixColumn('left', col)" />
            </a-tooltip>
            <a-tooltip title="固定在列尾" :mouse-enter-delay="0.5" :get-popup-container="() => $refs.root">
              <a-icon :class="['right', {active: col.fixed === 'right'}]" type="vertical-align-bottom" @click="fixColumn('right', col)" />
            </a-tooltip>
            <a-tooltip title="添加搜索" :mouse-enter-delay="0.5" :get-popup-container="() => $refs.root">
              <a-icon :class="{active: col.searchAble}" type="search" @click="setSearch(col)" />
            </a-tooltip>
          </template> -->
      </a-list-item>
    </a-list>
  </a-popover>
</template>

<script>
import { cloneDeep } from '@/utils/tool'

export default {
  name: 'ActionColumns',
  props: ['columns', 'visibleColumns'],
  data() {
    return {
      visible: false,
      indeterminate: false,
      checkAll: true,
      checkedCounts: this.columns.length,
      backColumns: cloneDeep(this.columns)
    }
  },
  watch: {
    checkedCounts(val) {
      this.checkAll = val === this.columns.length
      this.indeterminate = val > 0 && val < this.columns.length
    }
  },
  created() {
    this.$emit('update:visibleColumns', [...this.columns])
    for (const col of this.columns) {
      if (col.visible === undefined) {
        this.$set(col, 'visible', true)
      }
      if (!col.visible) {
        this.checkedCounts -= 1
      }
    }
  },
  methods: {
    onCheckChange(e, col) {
      const { columns } = this
      if (!col.visible) {
        this.resetSearch(columns.find(item => item.dataIndex === col.dataIndex))
        this.checkedCounts -= 1
      } else {
        this.checkedCounts += 1
      }
    },
    fixColumn(fixed, col) {
      if (fixed !== col.fixed) {
        this.$set(col, 'fixed', fixed)
      } else {
        this.$set(col, 'fixed', undefined)
      }
    },
    setSearch(col) {
      this.$set(col, 'searchAble', !col.searchAble)
      if (!col.searchAble && col.search) {
        this.resetSearch(col)
      }
    },
    resetSearch(col) {
      // col.search.value = col.dataType === 'boolean' ? false : undefined
      const { search } = col
      if (!search) { return }
      if (search.value) {
        search.value = undefined
      }
      if (search.value) {
        col.search.backup = undefined
      }
    },
    resetColumns() {
      const { columns, backColumns } = this
      let counts = columns.length
      backColumns.forEach((back, index) => {
        const column = columns[index]
        const flag = (column.visible === undefined || column.visible) ^ (back.visible === undefined || back.visible)
        column.visible = back.visible === undefined || back.visible
        if (!column.visible) {
          counts -= 1
        }
        if (back.fixed !== undefined) {
          column.fixed = back.fixed
        } else {
          this.$set(column, 'fixed', undefined)
        }
        if (column.searchAble && flag) {
          this.resetSearch(column)
        }
      })
      this.checkedCounts = counts
      this.visible = false
      this.$emit('reset')
    },
    onCheckAllChange(e) {
      if (e.target.checked) {
        this.checkedCounts = this.columns.length
        this.columns.forEach(col => { col.visible = true })
      } else {
        this.checkedCounts = 0
        this.columns.forEach(col => { col.visible = false })
      }
    }
  }
}
</script>

<style scoped lang="less">
.action-columns{
  display: inline-block;
  .check-all{
    margin-right: 8px;
  }
  .left,.right{
    transform: rotate(-90deg);
  }
  .active{
    color: @primary-color;
  }
}
</style>
