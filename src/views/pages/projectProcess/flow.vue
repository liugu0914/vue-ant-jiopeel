<template>
  <div class="approve-flow" style="padding: 0 20px">
    <div v-if="steps && steps.length>0">
      <a-row>
        <!-- 头部审批步骤 -->
        <a-col v-for="item in steps" :key="item.name" :span="24 / steps.length">
          <div style="text-align: center; font-weight: 700; font-size: 18px;" class="pb-1">
            {{ item.name }}
          </div>
        </a-col>
        <!-- 步骤箭头 -->
        <a-col :span="24">
          <div class="arrows" :class="{finish: progress.every(item => item == 100)}">
            <a-col v-for="(item, index) in steps" :key="item.name" :span="24 / steps.length" style="height: 100%">
              <div class="active" :style="{width: progress[index] + '%'}" />
            </a-col>
          </div>
        </a-col>
        <!-- 审批流程图 -->
        <a-col v-for="(i, index) in steps" :key="index" :span="24 / steps.length" class="pt-4 pl-4 flow">
          <a-col v-for="(n, m) in i.kids" :key="m" :span="24 / i.kids.length" style="display: flex;" :style="{'justify-content': i.kids.length == 1 ? 'center' : ''}">
            <div :class="['step',n.status != 'wait'?'pointer':'', activeId == n.id ? 'active':'']" :style="{background: n.status == 'done' ? '#548235' : n.status == 'progress' ? '#f4b183' : '#afabab'}" @click="stepClick(n, i.kids)">
              <span>{{ n.name }}</span>
            </div>
            <a-icon v-if="m < i.kids.length - 1" type="caret-right" theme="filled" class="arrow" />
          </a-col>
        </a-col>
      </a-row>
      <!-- 提示 -->
      <a-row type="flex" justify="center" class="hint mt-4">
        <a-col :span="3" v-bind="{lg: 3, md: 4, xs: 5}">
          <i class="label mr-2" />
          <span>已审批</span>
        </a-col>
        <a-col :span="3" v-bind="{lg: 3, md: 4, xs: 5}">
          <i class="label mr-2" style="background-color: #f4b183" />
          <span>审批中</span>
        </a-col>
        <a-col :span="3" v-bind="{lg: 3, md: 4, xs: 5}">
          <i class="label mr-2" style="background-color: #afabab" />
          <span>未审批</span>
        </a-col>
      </a-row>
    </div>

    <standard-table
      :columns="columns"
      :data-source="records"
      :loading="loading"
      :is-search="false"
      :pagination="false"
    >
      <div slot="state" slot-scope="{ text }">
        <span v-if=" text == 0 "> <a-tag color="red">未上传</a-tag></span>
        <span v-if=" text == 1 "> <a-tag color="orange">已上传</a-tag></span>
        <span v-if=" text == 2 "> <a-tag color="orange">已提交</a-tag></span>
        <span v-if=" text == 3 "> <a-tag color="green">通过</a-tag></span>
        <span v-if=" text == 4 "> <a-tag color="red">驳回</a-tag></span>
      </div>
      <!-- 文件 -->
      <div slot="files" slot-scope="{ record }">
        <upload :file-list="record.files" :show-upload-list="{ showPreviewIcon: true, showRemoveIcon: false}" />
      </div>
    </standard-table>
  </div>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'
import Upload from '@/components/upload'
import { logColumns } from './constant'
import { downloadUrl } from '@/api/common/upload'
import { getLogs } from '@/api/modules/projectProcess'
export default {
  components: {
    StandardTable,
    Upload
  },
  data: () => ({
    columns: logColumns,
    loading: false,
    records: [], // 审批记录
    activeId: '' // 选中的子流程
  }),
  props: {
    steps: {
      type: Array,
      default: () => []
    },
    lookVisible: {
      type: Boolean
    }
  },
  created() {
    let record = {}
    this.steps.forEach(item => {
      item.kids.forEach(kid => {
        if (kid.state === 1) {
          record = kid
        }
      })
    })
    if (!record) {
      record = this.steps[0].kids[0]
    }
    this.activeId = record.id
    if (this.activeId) {
      this.getKidDetail()
    }
  },
  methods: {
    /**
     * 点击审批流程触发
     */
    stepClick(step) {
      if (step.state == 0) {
        return
      }
      this.activeId = step.id
      this.getKidDetail()
    },
    /**
     * 获取子流程日志
     * @date 2021-5-19 16:34:37
     * @author lyc
     */
    getKidDetail() {
      this.loading = true
      getLogs(this.activeId).then(res => {
        const data = res.data || []
        data.forEach(item => {
          item.files.map(file => {
            file.uid = file.id
            file.name = file.filename
            file.status = 'done'
            file.url = downloadUrl + file.url
            return file
          })
        })
        this.records = data
      }).over().finally(() => {
        this.loading = false
      })
    }
  },
  watch: {
    lookVisible(val) {
      if (!val) {
        this.records = [] // 审批记录
        this.activeId = '' // 选中的子流程
      }
    }
  },
  computed: {
    /**
     * 任务进度
     */
    progress({ steps }) {
      return steps.map(item => item.kids.filter(item => item.status == 'done').length / item.kids.length * 100)
    }
  }
}
</script>
<style scoped lang="less">
.arrows {
  position: relative;
  width: 100%;
  height: 20px;
  background-color: #767171;
  &::after {
    position: absolute;
    top: -10px;
    right: -33px;
    content: '';
    border-width: 20px;
    border-style: solid;
    border-color: transparent transparent transparent #767171;
  }
  .active {
    position: absolute;
    height: 100%;
    background-color: #67c23a;
    transition: width .15s ease-out
  }
}

.finish {
    &::after {
      border-color: transparent transparent transparent  #67c23a;
    }
}

.flow {
  display: flex;
  border-right: 2px dashed #86a4d8;
  &:last-child {
    border: none;
  }
  .step {
    width: 50%;
    max-width: 42px;
    height: 200px;
    font-size: 16px;
    border-radius: 5px;
    color: rgba(255,255,255,.99);
    &.active{
      border: @primary-color dashed 4px;
    }
    span {
      display: flex;
      padding: 0 25%;
      height: 100%;
      justify-content: center;
      align-items: center;
    }
  }
  .arrow {
    display: flex;
    position: relative;
    margin-left: 16%;
    justify-content: center;
    align-items: center;
    flex: 1;
    font-size: 20px;
    &::after {
      position: absolute;
      left: 0;
      content: '';
      width: 45%;
      height: 10px;
      background-color: #595959;
    }
  }
}

.hint {
  .label {
    display: inline-block;
    width: 30px;
    height: 16px;
    background-color: #548235;
    vertical-align: middle;
  }
  span {
    vertical-align: middle;
  }
}


</style>
