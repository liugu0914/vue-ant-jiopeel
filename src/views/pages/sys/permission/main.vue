<!--
  权限
  @date 2021年3月15日14:51:36
  @author lyc
 -->
<template>
  <div>
    <a-tabs v-model="activeKey" @change="callback">
      <a-tab-pane v-for="app in apps" :key="app.value" :tab="app.title">
        <!-- 系统配置 -->
        <a-collapse default-active-key="1" :bordered="false" class="collapse">
          <template #expandIcon="props">
            <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
          </template>
          <a-collapse-panel key="1" header="系统权限" class="collapse-panel">
            <a-row class="mb-2">
              <a-col>
                <a-button type="primary">
                  <a-icon type="plus" />添加权限
                </a-button>
              </a-col>
            </a-row>
            <a-row :gutter="[16,16]">
              <a-col v-for="(sys,index) in syses" :key="index" :xl="4" :lg="6" :md="12" :sm="24">
                <actionAlter :message="sys.name">
                  <a-tooltip title="编辑">
                    <a>
                      <a-icon type="edit" style="margin-right:4px" @click="edit" />
                    </a>
                  </a-tooltip>
                  <a-popconfirm title="是否确认删除?" @confirm="del">
                    <a-tooltip title="删除">
                      <a>
                        <a-icon type="delete" />
                      </a>
                    </a-tooltip>
                  </a-popconfirm>
                </actionAlter>
              </a-col>
            </a-row>
          </a-collapse-panel>
        </a-collapse>
        <!-- 菜单配置 -->
        <a-collapse default-active-key="1" :bordered="false" class="collapse">
          <template #expandIcon="props">
            <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
          </template>
          <a-collapse-panel key="1" header="菜单权限" class="collapse-panel">
            <a-row class="mb-2">
              <a-col>
                <a-button type="primary">
                  <a-icon type="plus" />添加菜单
                </a-button>
              </a-col>
            </a-row>
            <a-row :gutter="[16,16]">
              <a-col :xl="4" :lg="6" :md="12" :sm="24">
                <div class="box">
                  <a-tree
                    :replace-fields="{ title:'name', key:'id' }"
                    :expanded-keys="expandedKeys"
                    :selected-keys="selectedKeys"
                    :tree-data="menusTree"
                    @select="selectMenu"
                  />
                </div>
              </a-col>
              <a-col :xl="20" :lg="18" :md="12" :sm="24">
                <a-row class="mb-2" type="flex" justify="space-between">
                  <a-col>
                    <a-button type="link">
                      {{ selectNode.name }}
                    </a-button>
                  </a-col>
                  <a-col>
                    <a-button type="primary">
                      <a-icon type="plus" />添加权限
                    </a-button>
                  </a-col>
                </a-row>
                <a-row :gutter="[16,16]">
                  <a-col v-for="(fuc,index) in fucs" :key="index" :lg="6" :md="12" :sm="24">
                    <actionAlter :message="fuc.name">
                      <a-tooltip title="编辑">
                        <a>
                          <a-icon type="edit" style="margin-right:4px" @click="edit" />
                        </a>
                      </a-tooltip>
                      <a-popconfirm title="是否确认删除?" @confirm="del">
                        <a-tooltip title="删除">
                          <a>
                            <a-icon type="delete" />
                          </a>
                        </a-tooltip>
                      </a-popconfirm>
                    </actionAlter>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </a-collapse-panel>
        </a-collapse>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import ActionAlter from '@/components/alter/ActionAlert'
import { getSys, getMenu, getFuc } from '@/api/modules/sys/permission'
import { getAsyncApps } from '@/views/pages/sys/menu/async'
export default {
  components: {
    ActionAlter
  },
  data() {
    return {
      apps: [], // 应用
      menusTree: [], // 已配置的菜单树
      expandedKeys: [], // 需要展开的树节点
      selectedKeys: [], // 选中树节点
      selectNode: {}, // 选中的菜单数据
      syses: [], // 系统级别权限
      fucs: [], // 功能级别权限
      activeKey: 0 // 当前选中的应用
    }
  },
  created() {
    getAsyncApps().then(res => {
      this.apps = res
      if (this.apps && this.apps.length > 0) {
        this.activeKey = this.apps[0].value
      }
      return this.activeKey
    }).then((appId) => { // 查询权限数据
      getSys(appId).then((res) => {
        this.syses = res.data || []
      }).done()
      getMenu(appId).then((res) => {
        const data = res.data || []
        this.menusTree = this.disableParentTree(data)
        console.log(this.menusTree)
        if (data.length > 0) { // 选中第  一个子节点
          this.expandedKeys.push(data[0].id) // 展开父节点
          const fchildren = data[0].children[0]
          const menuId = fchildren.id // 选中子节点
          this.selectedKeys.push(menuId)
          this.selectNode = fchildren
          console.log(fchildren)
          this.getFucBymenuId(menuId)
        }
      }).done()
    }).done()
  },
  methods: {
    callback(key) {
      console.log(key)
    },
    /**
     * 选中菜单
     */
    selectMenu(selectedKeys, { node }) {
      this.selectNode = node.dataRef
      this.selectedKeys = selectedKeys
      if (selectedKeys.length > 0) {
        this.getFucBymenuId(selectedKeys[0])
      }
    },
    /**
     * 通过菜单Id查询权限
     */
    getFucBymenuId(menuId) {
      getFuc(menuId).then(res => {
        if (!res) {
          return
        }
        const data = res.data || []
        this.fucs = data
      }).done()
    },
    /**
     * 禁用父节点
     */
    disableParentTree(datas) {
      return datas.map(data => {
        const item = {
          ...data,
          disabled: data.parent === '1'
        }
        if (data.children && data.children.length > 0) {
          item.children = this.disableParentTree(data.children)
        }
        return item
      })
    },
    edit() {
      console.log('edit')
    },
    del() {
      console.log('del')
    }
  }
}
</script>
<style scoped lang="less">
  .collapse{
    border-radius: @border-radius-xl;
    .collapse-panel{
      background: @component-background;
      border-radius: @border-radius-xl;
      margin-bottom: 24px;
      border: 0;
    }
  }
  .box{
    border: 1px solid @gray-5;
    border-radius: @border-radius-md;
    display: inline-block;
    width: 100%;
    position: relative;
    margin: 0 0 16px;
    padding: 0 10px;
    transition: all .2s;
  }
</style>
