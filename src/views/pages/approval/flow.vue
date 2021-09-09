<template>
  <a-row>
    <a-col :span="24" class="mt-3 mb-2 pr-3">
      <!-- 一级节点 -->
      <a-steps :current="current" label-placement="vertical">
        <a-step v-for="(item, index) in flows" :key="item.id" :title="item.name" :class="!item.state || !index ? 'disabled':''" @click="viewTask(item)" />
      </a-steps>
    </a-col>
    <!-- 流程图 -->
    <a-col v-if="steps.some(item => item.children && item.children.length)" :span="24" style="display: flex; padding: 0 50px 0 60px">
      <div v-for="(item, index) in steps" :key="item.id" class="flow" :class="index == steps.length - 1 ? 'last':''">
        <swiper :move-width="90">
          <div v-for="task in item.children" :key="task.id" class="childNode">
            <div :class="['task', ['wait', 'process', 'process', 'done'][task.state], task.id == currentId ? 'active' : '']" @click="viewTask(task)">
              <div v-move style="width: 16px">
                <div v-html="formatName(task.name)" />
              </div>
            </div>
            <div class="arrow">
              <i class="rectangle" />
              <a-icon type="caret-right" />
            </div>
          </div>
        </swiper>
      </div>
    </a-col>
    <a-col :span="24">
      <!-- 当前节点任务 -->
      <standard-table :columns="columnsTask" :data-source="dataSource" :loading="loading" :is-search="false" :pagination="false">
        <!-- 文件 -->
        <upload slot="files" slot-scope="{text}" :file-list="text" :show-upload-list="{showPreviewIcon: true, showRemoveIcon: false}" style="max-width:300px" />
        <!-- 处理结果 -->
        <template slot="state" slot-scope="{text}">
          <a-tag :color="stateArr[text].color" style="width:52px" class="text-center">
            {{ stateArr[text].name }}
          </a-tag>
        </template>
        <template slot="ops" slot-scope="{record}">
          <div class="ops">
            <a-button type="link" size="small" @click="$emit('detail', record.id) ">
              详情
            </a-button>
            <upload :file-list="record.processFiles" style="display:inline-block" :show-upload-list="{ showPreviewIcon: false, showRemoveIcon: false}" />
          </div>
        </template>
      </standard-table>
    </a-col>
  </a-row>
</template>

<script>
import { columnsTask, stateArr } from './constant'
import StandardTable from '@/components/table/StandardTable'
import { getTaskList } from '@/api/modules/approval'
import { downloadUrl } from '@/api/common/upload'
import Upload from '@/components/upload'
import Swiper from '@/components/swiper'

export default {
  components: {
    StandardTable,
    Upload,
    Swiper
  },
  props: ['steps'],
  data() {
    return {
      stateArr,
      columnsTask,
      dataSource: [],
      loading: false,
      current: 0,
      flows: [{ id: 1, name: '开始审批', state: 3 }],
      currentId: '' // 当前节点ID
    }
  },
  methods: {
    /**
     * 获取对应节点任务列表
    */
    async getTaskList(id) {
      if (this.currentId == id) return
      this.currentId = id
      this.loading = true
      try {
        const { data = [] } = await getTaskList(id)
        data.forEach(item => {
          if (item.files.length) item.files.forEach(file => { file.uid = file.id; file.url = downloadUrl + file.url; file.name = file.filename })
          if (item.processFiles.length) item.processFiles = item.processFiles.map(file => ({ ...file, uid: file.id, name: '流程图', url: downloadUrl + file.url, status: 'done' }))
        })
        this.dataSource = data
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },
    /**
     *  查看当前节点任务列表
    */
    viewTask(node) {
      if (!node.state || node.name == '开始审批') return
      this.getTaskList(node.id)
    },
    /**
     * 查找正在进行中的节点
    */
    findProcess(arr, data) {
      const find = data.find(item => arr.includes(item.state))
      return find && find.children && find.children.length ? this.findProcess(arr, find.children) : find
    },
    /**
     * 处理节点名称
     */
    formatName(params) {
      return params.includes('/') ? params.replace(/\//g, '<br/>&nbsp;/') : params
    }
  },
  watch: {
    steps(val) {
      const process = [1, 2]
      this.flows = this.flows.concat(val)
      this.current = this.flows.findIndex(item => process.includes(item.state))
      const find = this.findProcess(process, val)
      if (!find) return
      this.getTaskList(find.id)
    }
  }
}
</script>
<style scoped lang="less">
/deep/ .ant-steps-item-container{
  position: relative;
  .ant-steps-item-content {
    position: absolute;
    top: -40px;
  }
}

.flow {
  display: flex;
  justify-content: center;
  flex: 1;
  border-right: 1px dashed #aaaaaa;
  .childNode {
    display: flex;
    align-items: center;
    .task {
      overflow: hidden;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 200px;
      font-size: 16px;
      color: #fff;
      &:hover {
        .move {
          animation-play-state: paused;
        }
      }
    }
    .arrow {
      position: relative;
      padding-right: 10px;
      width: 50px;
      text-align: right;
      .rectangle {
        position: absolute;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        width: 20px;
        height: 8px;
        background-color: #595959;
      }
      i {
        font-size: 16px;
      }
    }
    &:last-child {
      .arrow {
        display: none;
      }
    }
  }
}

.last {
  border: none;
}

.done {
  background-color:  #67c23a;
  cursor: pointer;
  & + .arrow {
    color: #67c23a;
    .rectangle {
      background-color: #67c23a !important;
    }
  }
}

.done.active {
  background-color: #287801;
}

.process {
  background-color: #efa81f;
  cursor: pointer;
}

.process.active {
  background-color: #d38304;
}

.wait {
  background-color:  #aaaaaa;
}

/deep/ .ant-steps-item {
  .ant-steps-item-icon {
    cursor: pointer;
  }
}

@keyframes move {
  0% {
  }
  100% {
    transform: translateY(-50%);
  }
}

.move {
  animation: move 5s linear infinite;
  .last-child {
    margin-bottom: 20px;
  }
}

.ops {
  display: flex;
  justify-content: center;
  align-items: center;
  /deep/ .ant-upload-list-item-list-type-text {
    margin: 0;
  }
  /deep/ .ant-upload-list-item-info {
    padding: 0 7px;
     .anticon-paper-clip {
      display: none;
    }
    a {
      padding: 0;
    }
  }
}
</style>
