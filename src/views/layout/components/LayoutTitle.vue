<template>
  <div class="title">
    <!-- 切换按钮 -->
    <div class="trigger" @click="setCollapsed">
      <img :src="collapsed ? require('@/assets/img/toggle2.png') : require('@/assets/img/toggle1.png')" alt="">
    </div>
    <!-- 二级菜单 -->
    <subMenu :key="$route.path" />
    <!-- 待办 -->
    <a-popover placement="leftTop" arrow-point-at-center :mouse-leave-delay="1">
      <template slot="content">
        <a-list class="tab-pane beauty-scroll">
          <a-list-item v-for="({message, action, id},index) in todoList" :key="index" style="cursor: pointer" @click="goWork(action)">
            <a-list-item-meta class="w-100">
              <div slot="title" class="list-title">
                <span style="font-size:14px" class="ellipsis mr-2">{{ message.projectName }}</span>
                <a-tag :color="stateArr[action].color">
                  {{ stateArr[action].name }}
                </a-tag>
              </div>
              <div slot="description" style="display: flex; justify-content: space-between">
                <div class="ellipsis" style="font-size:12px">
                  <span>{{ message.nodeName }}</span><br>
                  <span>{{ message.taskName }}</span>
                </div>
                <a-popconfirm v-if="$hasp('todo-del')" title="确定删除该待办?" @confirm="confirm(id)" @click.native="$event.stopPropagation()">
                  <a-button type="link" class="delete">
                    <a-icon type="delete" />
                  </a-button>
                </a-popconfirm>
              </div>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </template>
      <div class="remind">
        <img :src="require('@/assets/img/remind.png')" alt="">
        待办事项 ({{ todoList.length }})
      </div>
    </a-popover>

    <!-- 刷新按钮 -->
    <a-tooltip placement="bottom" title="刷新">
      <a-button type="link" class="mr-2 reload" @click="reload">
        <a-icon type="sync" />
      </a-button>
    </a-tooltip>
  </div>
</template>

<script>
import subMenu from './subMenu'
import { mapMutations, mapGetters } from 'vuex'
import { isJSON } from '@/utils/tool'
import { deleteTodo } from '@/api/common/ws'

export default {
  components: {
    subMenu
  },
  data() {
    return {
      rotate: 0,
      headers: {},
      todoList: [], // 待办列表
      stateArr: [{ name: '待提交', color: 'orange' }, { name: '待提交', color: 'orange' }, { name: '待审核', color: 'cyan' }, { name: '待处理', color: 'purple' }, { name: '待审批', color: 'blue' }]
    }
  },
  methods: {
    ...mapMutations('account', ['setCollapsed']),
    reload() {
      const reloadBtn = document.querySelector('.reload')
      this.rotate += 180
      reloadBtn.style.transform = `rotate(${this.rotate}deg)`
      this.$emit('reload')
    },
    /**
     * 点击待办跳转到对应页面
     */
    goWork(action) {
      const pathArr = ['uploading', 'uploading', 'apply', 'assign', 'nodeApply']
      const path = pathArr[action]
      if (this.$route.path.includes(path)) return this.reload()
      this.$router.push(path)
    },
    /**
     * 删除待办
     */
    confirm(id) {
      this.todoList = this.todoList.filter(item => item.id !== id)
      deleteTodo(id)
    }
  },
  mounted() {
    try {
      // const socket = new SockJS(`${wsUrl}/stomp?userId=${this.user.id}`)
      // // 获取STOMP子协议的客户端对象
      // this.stompClient = Stomp.over(socket)
      this.headers = {
        userId: this.user.id,
        [process.env.VUE_APP_ACCESS_TOKEN_KEY]: this.token
      }
      this.stompClient.connect(this.headers, () => {
        this.stompClient.send('/app/openTodo')
        this.stompClient.subscribe(`/user/queue/openTodo`, (msg) => {
          if (!isJSON(msg)) {
            return
          }
          const data = JSON.parse(msg.body)
          data.forEach(item => (item.message = JSON.parse(item.message)))
          this.todoList = data
          console.log(data)
        })
        this.stompClient.subscribe(`/user/queue/todo`, (msg) => {
          if (!isJSON(msg)) {
            return
          }
          const data = JSON.parse(msg.body)
          data.message = JSON.parse(data.message)
          console.log(data)
          const { action, targetId, userId, over } = data
          const index = this.todoList.findIndex(item => item.userId == userId && item.action == action && item.targetId == targetId)
          if (over !== '0' && index !== -1) return this.todoList.splice(index, 1)
          if (over === '0' && index === -1) {
            this.$notification.info({
              message: '您有新的待办事项',
              top: '110px',
              duration: 3
            })
            this.todoList.push(data)
          }
        })
        // this.stompClient.send('/app/todo', this.headers)
      }, (error) => console.error(error))
    } catch (e) {
      console.error(e)
    }
  },
  computed: {
    ...mapGetters(['collapsed', 'token', 'user']),
    ...mapGetters('setting', ['stompClient'])
  }
}
</script>
<style scoped lang="less">
.title {
  display: flex;
  height: 46px;
  align-items: center;
  // overflow: hidden;
  background-color: @body-background;
  border-bottom: 2px solid #e4e8f1;
  .trigger {
    width: 82px;
    transition: color 0.3s;
    text-align: center;
    cursor: pointer;
    // 禁止选中文字
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    &:hover {
      color: @primary-color;
    }
  }
  .subMenu {
    flex: 1;
  }
  .reload {
    transition: all .5s;
  }
  /deep/ .ant-menu {
    box-shadow: none;
  }
  .remind {
    cursor: pointer;
  }
}

.tab-pane {
  width: 300px;
  max-height: 291px;
  overflow-y: auto;
  overflow-x: hidden;
}

/deep/ .ant-popover-inner-content, .ant-list {
  padding-right: 10px;
}

.delete {
  padding-left: 0;
}

.list-title {
  display: flex;
  justify-content: space-between;
  align-content: center;
}

/deep/ .ant-list-item-meta,
/deep/ .ant-list-item-meta-content {
  width: 100%;
}
</style>
