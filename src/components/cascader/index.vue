<template>
  <div>
    <a-select id="select" :value="value" allow-clear mode="multiple" :open="false" @search="filter" @click.native="show" @blur="resize" @change="onChange">
      <a-select-option v-for="item in users" :key="item.id" :value="item.id">
        {{ item.userName }}
      </a-select-option>
    </a-select>
    <a-tree-select
      v-show="false" v-model="deptId" :open="open" :tree-data="filterDept" :get-popup-container="dom" :replace-fields="{title: 'name', key: 'id', value: 'id'}"
      allow-clear dropdown-class-name="treeSelect" @select="deptSelect" />
    <a-select v-show="false" :value="value" allow-clear :mode="mode" :open="open" :get-popup-container="dom" dropdown-class-name="select" @change="onChange">
      <a-select-option v-for="item in deptApprover" :key="item.id" :value="item.id" :disabled="filterUser.includes(item.id)">
        {{ item.userName }}
      </a-select-option>
    </a-select>
  </div>
</template>

<script>
import { getSectionData } from '@/api/modules/sys/dept'
import { getUsers } from '@/api/modules/sys/user'
export default {
  props: {
    value: [String, Array],
    mode: String,
    filterUser: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      deptTreeData: [], // 部门树
      filterDept: [], // 过滤出来的部门
      deptApprover: [], // 部门对应的人员
      users: [], // 所有用户列表
      deptId: '',
      open: false,
      inputValue: '',
      timer: null
    }
  },
  created() {
    this.getSectionData()
    this.getUsers()
  },
  methods: {
    /**
     * 获取部门信息
     */
    async getSectionData() {
      const { data = [] } = await getSectionData({ search: this.inputValue })
      this.filterDept = data
      this.deptTreeData = this.inputValue ? this.deptTreeData : data
    },
    /**
     * 发送请求获取用户列表
     */
    async getUsers(id) {
      const { data = [] } = await getUsers(id)
      id ? this.deptApprover = data : this.users = data
    },
    /**
     * 下拉绑定 dom
     */
    dom() {
      return document.getElementById('select')
    },
    /**
     * 窗口缩放时隐藏下拉框
     */
    resize() {
      this.open = false
    },
    /**
     * 选择部门
     */
    deptSelect(selectKeys) {
      this.getUsers(selectKeys)
    },
    /**
     * 选择人员
     */
    onChange(value) {
      this.$emit('input', value)
    },
    /**
     * 显示级联选择器
     */
    show(e) {
      if (e.target.className !== 'ant-select-selection__rendered') return
      this.open = !this.open
    },
    /**
     * 过滤部门、用户
     */
    filter(value) {
      this.open = true
      this.inputValue = value
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.deptApprover = this.users.filter(item => item.userName.indexOf(value) > -1)
        this.getSectionData()
      }, 300)
    }
  },
  watch: {
    open() {
      this.deptId = ''
      this.inputValue = ''
      this.filterDept = this.deptTreeData
      this.deptApprover = this.users
    }
  }
}
</script>
<style scoped lang="less">
/deep/ #select > div {
  top: 100% !important;
}

/deep/ #select .treeSelect {
  width: 50% !important;
  top: calc(100% + 5px) !important;
  left: 0 !important;
  max-height: 250px !important;
}

/deep/ #select .select {
  width: 49% !important;
  top: calc(100% + 5px) !important;
  left: 51% !important;
  max-height: 250px !important;
}
</style>
