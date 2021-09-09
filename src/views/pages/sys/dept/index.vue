<template>
  <a-card>
    <a-spin tip="Loading..." :spinning="loading">
      <a-row :gutter="40">
        <a-col :span="6">
          <a-input v-model="params.search" :max-length="100" class="w-100" placeholder="请输入部门名称" @change="getSectionData">
            <a-icon slot="addonAfter" type="plus" style="cursor: pointer" @click="add" />
          </a-input>
          <a-tree
            class="draggable-tree"
            :draggable="$hasp('sys-dept-drag')"
            :tree-data="treeData"
            :replace-fields="{children:'children', title:'name', key:'id' }"
            @drop="onDrop"
            @select="onSelect"
          >
            <template v-for="san in slots" :slot="san.id" slot-scope="dep">
              <a-dropdown :key="san.key" :trigger="['contextmenu']">
                <span>
                  {{ dep.name }}
                </span>
                <a-menu slot="overlay">
                  <a-menu-item v-if="$hasp('sys-dept-add')" key="1" @click="addSon(dep.id)">
                    新增子部门
                  </a-menu-item>
                  <a-menu-item v-if="$hasp('sys-dept-del')" key="2" @click="del(dep.id)">
                    删除当前部门
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </template>
          </a-tree>
        </a-col>
        <a-col :span="18">
          <a-form-model ref="ruleForm" :model="dataForm" layout="vertical">
            <a-row :gutter="20">
              <a-col :span="20">
                <div class="title mb-2">
                  {{ title }}
                </div>
              </a-col>
              <a-col :span="4">
                <a-button v-if="$hasp('sys-dept-edit') && title == '查看'" style="float: right" @click="edit">
                  编辑
                </a-button>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  :rules="{ required: true, message: '部门名称不能为空', trigger: 'blur' }"
                  label="部门名称"
                  prop="name"
                >
                  <a-input v-model="dataForm.name" :disabled="!redact" class="w-100" :max-length="100" autocomplete="off" allow-clear />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item
                  :rules="{ required: true, message: '部门描述不能为空', trigger: 'blur' }"
                  label="部门描述"
                  prop="des"
                >
                  <a-input v-model="dataForm.des" :disabled="!redact" class="w-100" :max-length="100" autocomplete="off" allow-clear />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="是否可用" prop="enable">
                  <a-switch
                    class="mt-1"
                    checked-children="是"
                    un-checked-children="否"
                    :checked="dataForm.enable === '1'"
                    :disabled="!redact"
                    @change="checked => (dataForm.enable = checked ? '1' : '0')"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row v-if="title !== '查看'" type="flex" justify="end">
              <a-col :span="2">
                <a-button @click="dataForm = { enable: ''}">
                  重置
                </a-button>
              </a-col>
              <a-col :span="2">
                <a-button type="primary" @click="submit">
                  提交
                </a-button>
              </a-col>
            </a-row>
          </a-form-model>
        </a-col>
      </a-row>
    </a-spin>
  </a-card>
</template>

<script>
import { cloneDeep } from '@/utils/tool'
import { getSectionData, getOneSection, saveSectionData, delSectionData, dragSection } from '@/api/modules/sys/dept'
export default {
  data() {
    return {
      treeData: [], // 树形数据
      loading: false, // 数据加载
      params: {}, // 请求参数
      title: '查看', // 标题
      // 表单数据
      dataForm: {
      }, // 表单数据
      redact: false, // 是否是编辑状态
      slots: [] // 插槽数组
    }
  },
  async created() {
    await this.getSectionData()
    if (this.treeData.length) this.dataForm = this.treeData[0]
  },
  methods: {
    /**
     * 获取树形数据
     * @date 2021-5-19 14:23:00
     * @author zxp
     */
    async getSectionData() {
      this.loading = true
      try {
        const { data } = await getSectionData(this.params)
        this.treeData = data
        this.slots = this.getCheckedNode(data)
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },
    /**
     * 新增主部门
     * @date 2021-5-19 14:31:00
     * @author zxp
     */
    add() {
      this.title = '新增主部门'
      this.redact = true
      this.dataForm = { parent: '1', superId: '0', enable: '1' }
    },
    /**
     * 删除部门
     * @date 2021-5-19 14:31:00
     * @author zxp
     */
    async del(id) {
      await delSectionData(id).over()
      this.getSectionData()
      if (this.treeData.length) this.dataForm = this.treeData[0]
    },
    /**
     * 修改部门
     * @date 2021-5-19 14:31:00
     * @author zxp
     */
    edit() {
      this.title = '编辑部门'
      this.redact = true
    },
    /**
     * 树形组件拖拽
     * @date 2021-5-19 09:11:00
     * @author zxp
     */
    async onDrop(info) {
      console.log(info)
      // 拖拽节点
      const dragNode = info.dragNode
      // 目标节点
      const node = info.node
      // 目标节点位置
      const ops = info.node.pos.split('-')
      // 拖拽后的位置
      const position = info.dropPosition == -1 ? 0 : info.dropPosition
      // 拖拽对象
      const source = dragNode.dataRef
      // 目标对象
      const target = info.dropToGap && ops.length > 2 ? node.$parent.dataRef : node.dataRef
      // 当info.dropToGap为true, 说明只是同级或者跨级排序
      if (info.dropToGap) {
        // 当拖拽节点位置和目标节点的父级对象相同时，表所同级排序，当拖拽节点最后一位小于拖拽后的位置时表示向下拖拽排序
        if (dragNode.$parent.dataRef === node.$parent.dataRef && ops[ops.length - 1] < position) {
          // 同级排序向下排序，拖拽后的位置 - 1
          source.orderNum = position ? position - 1 : 0
        } else {
          // 跨级排序、或者同级向上排序, 拖动后的位置减去目标位置等于-1表示拖到目标位置的上面，等于 1 表示拖到目标位置的下面
          source.orderNum = position - ops[ops.length - 1] === -1 ? position + 1 : position
        }
      } else {
        // 当info.dropToGap为false,说明拖拽节点成为了目标节点的子节点，删除拖拽对象的 orderNum 属性
        delete source.orderNum
      }
      const params = [source, target]
      // 拖拽到一级
      if (info.dropToGap && ops.length === 2) params.pop()
      await dragSection(params).over()
      this.getSectionData()
    },
    /**
     * 获取部门信息
     * @date 2021-5-19 17:10:00
     * @author zxp
     */
    async onSelect(key) {
      if (!key.length) return
      // 移除表单校验
      this.$refs['ruleForm'].clearValidate()
      this.title = '查看'
      this.redact = false
      const { data = {}} = await getOneSection(...key)
      this.dataForm = data
    },
    /**
     * 保存部门信息
     * @date 2021-5-19 17:11:00
     * @author zxp
     */
    submit() {
      this.$refs['ruleForm'].validate(async valid => {
        if (!valid) return
        let params = cloneDeep(this.dataForm)
        const { id, name, des, enable, superId } = params
        if (this.title === '编辑部门') params = { id, name, des, enable }
        if (this.title === '新增子部门') params = { name, des, enable, superId, parent: '0' }
        await saveSectionData(params)
        this.getSectionData()
        this.redact = false
        this.title = '查看'
      })
    },
    /**
     * 生成 slot 数组
     * @date 2021年3月17日10:21:04
     * @author lyc
     */
    getCheckedNode(datas, slots = []) {
      datas.forEach(item => {
        item.scopedSlots = { title: item.id }
        slots.push(item)
        if (item.children && item.children.length > 0) {
          this.getCheckedNode(item.children, slots)
        }
      })
      return slots
    },
    /**
     * 添加子部门
     * @date 2021年5月20日15:42:00
     * @author zxp
     */
    addSon(id) {
      this.redact = true
      this.title = '新增子部门'
      this.dataForm = { superId: id, enable: '1' }
    }
  }
}
</script>
<style scoped lang="less">
.title {
  font-size: 20px;
  font-weight: 500;
  color: @primary-color;
}
</style>
