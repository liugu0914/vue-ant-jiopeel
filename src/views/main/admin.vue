<template>
  <a-layout class="h-100">
    <div class="admin-side-parent">
      <a-layout-sider v-model="collapsed" class="admin-side" breakpoint="lg" :trigger="null" collapsible>
        <div class="logo" />
        <a-menu
          theme="dark" mode="inline"
          :default-selected-keys="['1']"
          :default-open-keys="['sub1']"
        >
          <a-sub-menu key="sub1">
            <span slot="title">
              <a-icon type="user" />
              <span>subnav 1</span>
            </span>
            <a-menu-item key="1">
              option1
            </a-menu-item>
            <a-menu-item key="2">
              option2
            </a-menu-item>
            <a-menu-item key="3">
              option3
            </a-menu-item>
            <a-menu-item key="4">
              option4
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <span slot="title"><a-icon type="laptop" /><span>subnav 2</span>
            </span>
            <a-menu-item key="5">
              option5
            </a-menu-item>
            <a-menu-item key="6">
              option6
            </a-menu-item>
            <a-menu-item key="7">
              option7
            </a-menu-item>
            <a-menu-item key="8">
              option8
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub3">
            <span slot="title"><a-icon type="notification" /><span>subnav 3</span>
            </span>
            <a-menu-item key="9">
              option9
            </a-menu-item>
            <a-menu-item key="10">
              option10
            </a-menu-item>
            <a-menu-item key="11">
              option11
            </a-menu-item>
            <a-menu-item key="12">
              option12
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
    </div>
    <a-layout>
      <a-layout-header class="admin-header-round">
        <div class="header-main">
          <div class="header-child float-left">
            <div class="header-child-item px-3" @click="() => (collapsed = !collapsed)">
              <a-icon
                class="icon-size"
                :type="collapsed ? 'menu-unfold' : 'menu-fold'"
              />
            </div>
          </div>
          <div class="header-child float-right">
            <div class="header-child-item">
              <a-icon class="icon-size" type="github" />
            </div>
            <div class="header-child-item">
              <a-badge count="5">
                <a-icon class="icon-size" type="bell" />
              </a-badge>
            </div>
            <a-dropdown>
              <div class="header-child-item">
                <a-avatar size="default" shape="circle" src="https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png" />
                <span class="ml-1 item-name">系统管理员</span>
              </div>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a-icon type="user" />
                  <span>个人中心</span>
                </a-menu-item>
                <a-menu-item>
                  <a-icon type="setting" />
                  <span>设置</span>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item>
                  <a-icon style="margin-right: 8px;" type="poweroff" />
                  <span>退出登录</span>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </div>
      </a-layout-header>
      <a-layout-content class="admin-content">
        <div class="admin-content-tab">
          <a-tabs :tab-bar-gutter="4" type="editable-card" hide-add closable>
            <a-tab-pane v-for="i in 10" :key="i">
              <span slot="tab"><a-icon v-if="i == 1" type="sync" />{{ `Tab-${i}` }}</span>
            </a-tab-pane>
          </a-tabs>
        </div>
        <div class="admin-content-body">
          <router-view />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
export default {
  data() {
    return {
      collapsed: false
    }
  }
}
</script>
<style lang="less">
.d-flex{
  display: flex;
}
.float-left {
    float: left !important;
}
.float-right {
    float: right !important;
}
.float-none {
    float: none !important;
}
.admin-side-parent{
  .admin-side{
    position: relative;
    height: calc(100% - 20px);
    overflow: auto;
    left: 0;
    top: 0;
    padding: 0;
    margin: 10px 10px;
    border-radius: 10px;
  }
}

.admin-content{
  margin:0 10px;
  min-height : 280px;
  .admin-content-tab{
    .ant-tabs-bar{
      border-bottom:none;
    }
    .ant-tabs.ant-tabs-card .ant-tabs-card-bar {
      margin-bottom: 5px;
      .ant-tabs-tab{
        border :none;
        border-radius :5px;
        background:#fff;
        height: 30px;
        padding: 0 10px;
        line-height: 30px;
        transition: all .2s;
        &:hover{
          box-shadow: 0 3px 8px -2px rgba(0,0,0,.12);
          transform: translateY(-4px);
        }
      }
      .ant-tabs-nav-container{
        // height: 30px;
        .ant-tabs-nav{
          margin-top: 5px;
          margin-bottom: 5px;
          .ant-tabs-tab .anticon{
            margin-right: 4px;
          }
        }
      }
    }
  }
  .admin-content-body{
    height: calc(100% - 45px);
    max-height: 100%;
    overflow: auto;
  }
}


.admin-header{
  background: #fff;
  padding: 0;
  margin: 0;
}

.admin-header-round{
  background: #fff;
  padding: 0;
  margin: 10px 10px 5px 10px;
  border-radius: 10px;
  box-shadow: 0 3px 10px -2px rgba(85,85,85,.08),
  0 2px 20px 0 rgba(85,85,85,.06),
   0 1px 30px 0 rgba(85,85,85,.03);
  .header-child.float-left .header-child-item:first-child{
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }
  .header-child.float-right .header-child-item:last-child{
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }
}


.header-main{

  .icon-size{
    font-size: 18px;
  }

  .header-child{
    display: flex;
    align-items: center;
    justify-content: center;
    &>*{
      cursor: pointer;
      height: 64px;
    }
    &>*:hover{
      background-color: rgba(0, 0, 0, 0.03);
    }

    .header-child-item{
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      padding-left: 14px;
      padding-right: 14px;
      .item-name{
        max-width:100px;
        text-overflow :ellipsis;
        white-space :nowrap;
        overflow : hidden;
        @media (max-width: 600px) {
          &{
            display: none;
          }
        }
      }
    }
  }
}


.logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>
