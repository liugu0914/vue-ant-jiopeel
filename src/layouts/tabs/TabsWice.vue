<template>
  <div :class="['admin-content-tab']">
    <a-tabs
      type="editable-card"
      :active-key="active"
      :hide-add="true"
    >
      <a-tooltip slot="tabBarExtraContent" placement="left" :title="lockTitle">
        <a-icon
          theme="filled"
          class="header-lock"
          :type=" 'lock' "
        />
      </a-tooltip>
      <a-tab-pane v-for="page in pageList" :key="page.key">
        <div slot="tab" class="tab">
          <a-icon :class="['icon-sync', {'hide': page.key !== active && !page.loading}]" :type="page.loading ? 'loading' : 'sync'" @click="onRefresh(page)" />
          <div class="title" @click="onTabClick(page)">
            {{ pageName(page) }}
          </div>
          <a-icon v-if="!page.unclose" class="icon-close" type="close" @click="onClose(page.key)" />
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>

export default {
  name: 'TabsWice',
  props: {
    fixed: Boolean,
    pageList: Array,
    active: String
  },
  computed: {
    lockTitle() {
      return '关闭'
    }
  },
  methods: {
    onTabClick(page) {
      if (this.active !== page.key) {
        this.$emit('change', page)
      }
    },
    onClose(key) {
      this.$emit('close', key)
    },
    onRefresh(page) {
      this.$emit('refresh', page)
    },
    // onContextmenu(pageKey, e) {
    //   this.$emit('contextmenu', pageKey, e)
    // },
    /**
     * 菜单名称
     */
    pageName(page) {
      return page.title
    }
  }
}
</script>

<style lang="less">
.admin-content-tab {
  margin: 0 10px;
  .header-lock{
    font-size: 18px;
    cursor: pointer;
    color : @primary-color;
  }
  .tab{
    margin: 0 -16px;
    padding: 0 16px;
    font-size: 14px;
    user-select: none;
    transition: all 0.2s;
    .title{
      display: inline-block;
      height: 100%;
    }
    .icon-close{
      font-size: 12px;
      margin-left: 6px;
      margin-right: -4px !important;
      color: @text-color-second;
      &:hover{
        color: @text-color;
      }
    }
    .icon-sync{
      margin-left: -4px;
      color: @primary-4;
      transition: all 0.3s ease-in-out;
      &:hover{
        color: @primary-color;
      }
      font-size: 14px;
      &.hide{
        font-size: 0;
      }
    }
  }

  .ant-tabs-bar {
    border-bottom: none;
  }

  .ant-tabs.ant-tabs-card .ant-tabs-card-bar {
    margin-bottom: 5px;

    .ant-tabs-tab {
      border: none;
      border-radius: @border-radius-md;
      background: #fff;
      height: 30px;
      padding: 0 10px;
      line-height: 30px;
      transition: all .2s;

      &:hover {
        box-shadow: 0 3px 8px -2px rgba(0, 0, 0, .12);
        transform: translateY(-4px);
      }
    }

    .ant-tabs-nav-container {

      // height: 30px;
      .ant-tabs-nav {
        margin-top: 5px;
        margin-bottom: 5px;

        .ant-tabs-tab {
          margin-right: 4px;
        }
      }
    }
  }
}

</style>
