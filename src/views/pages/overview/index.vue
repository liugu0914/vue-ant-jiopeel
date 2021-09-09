<template>
  <div class="contract">
    <!-- 头部统计 -->
    <div class="gutter-example mb-2">
      <a-row :gutter="[16, 16]">
        <!-- 项目统计 -->
        <a-col class="gutter-row" style="display: flex">
          <a-card v-for="(item, index) in options" :key="item.name" style="flex: 1" :class="index ? 'ml-2' :''">
            <div class="gutter-box">
              <!-- 图表 -->
              <div class="echarts">
                <my-icon v-if="!index" type="icon-ziyuan1" style="font-size:65px" />
                <chart v-else :data="item.option" />
              </div>
              <!-- 描述 -->
              <div class="desc">
                <p class="ellipsis">
                  {{ item.name }}
                </p>
                <a href="javascript:;" class="count" @click="cardClick($event,item)">
                  {{ item.num }}
                </a>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
    <!-- table组件 -->
    <a-card>
      <standard-table
        :columns="columns"
        placeholder="搜索项目名称/项目编号"
        :data-source="dataSource"
        :loading="loading"
        :pagination.sync="params.page"
        @search="search"
        @change="pageChange"
      >
        <!-- 项目区属 -->
        <span slot="projectArea" slot-scope="{text}">
          {{ projectAreaArr[text -1] && projectAreaArr[text -1].name }}
        </span>
        <!-- 项目类型 -->
        <span slot="projectType" slot-scope="{text}">{{ projectTypeArr.find(item => item.id == text) &&projectTypeArr.find(item => item.id == text).name }}</span>
        <!-- 项目进度 -->
        <template slot="progress" slot-scope="{text,record}">
          <a-progress :percent="parseInt(text)" size="small" :stroke-color="parseInt(text) < 100 ? '#f79356' : '#40c679'" status="normal" class="pointer" @click="openGantModel(record)">
            <a slot="format" href="javascript:;">{{ parseInt(text) + '%' }}</a>
          </a-progress>
        </template>
      </standard-table>
    </a-card>
    <!-- 弹窗 -->
    <modal
      v-model="visible"
      :title="title"
      width="100%"
      top="110"
      :destroy="true"
      :footer="null"
      @cancel="closeGantt"
    >
      <a-row class="mb-2" type="flex" justify="space-around">
        <a-col :span="12">
          <a-badge class="pr-1" color="#448aff" text="计划进度" />
          <a-badge class="pr-1" color="#ff9900" text="实际进度" />
          <a-badge class="pr-1" color="#3eaf7c" text="计划已完成" />
        </a-col>
        <a-col :span="12" class="text-right">
          <a-radio-group :value="size" @change="handleSizeChange">
            <a-radio-button value="day">
              天
            </a-radio-button>
            <a-radio-button value="week">
              周
            </a-radio-button>
            <a-radio-button value="month">
              月
            </a-radio-button>
            <a-radio-button value="quarter">
              季度
            </a-radio-button>
            <a-radio-button value="year">
              年
            </a-radio-button>
          </a-radio-group>
        </a-col>
      </a-row>
      <!-- <a-spin v-show="gantLoading" /> -->
      <div ref="gantt" :style="{height}" />
    </modal>
    <!-- 节点详情 -->
    <node-details v-model="visible1" :node-id="nodeId" :task-type-list="taskTypeList" />
  </div>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'
import Chart from '@/components/chart'
import Modal from '@/components/modal/Modal'
import { columns, ganttColumns, zoomConfig, gantt } from './constant'
import { getTableData, getProjectStatistics, getListByShowId } from '@/api/modules/pm/projectInfo'
import { getSysConfigByAlias } from '@/api/modules/sys/dictionary'
import { getAllProjectType } from '@/api/modules/pm/projectType'
import { getGantData } from '@/api/modules/work/projectNode'
import { BoxPage } from '@/utils/tool'
import NodeDetails from '@/views/components/node-details.vue'

export default {
  components: {
    StandardTable,
    Modal,
    Chart,
    NodeDetails
  },
  data() {
    return {
      columns,
      dataSource: [], // 表格数据
      dataForm: {}, // 单条数据显示
      projectTypeArr: [], // 项目类型数组
      projectAreaArr: [], // 项目区属数组
      // echarts 数据
      options: [],
      // 表格数据请求参数
      params: {
        page: {
          total: 0
        },
        query: {}
      },
      loading: false, // 表格加载状态
      isMask: false, // 地图选点
      title: '', // 项目甘特图名称
      visible: false, // 添加合同弹窗开关
      gantLoading: false,
      tasks: { // 甘特图数据
        data: []
      },
      events: [], // 甘特图事件
      size: 'day', // 时间范围
      height: 'calc(100% - 50px)',
      taskTypeList: [],
      showId: '',
      nodeId: '',
      visible1: false
    }
  },
  created() {
    // 获取项目统计信息
    this.getProjectStatistics()
    // 获取项目数据列表
    this.getTableData()
    // 获取项目区属字典
    this.getSysConfigByAlias('projectArea')
    // 获取项目类型
    this.getProjectType()
    // 获取任务分类字典
    this.getTaskType()
  },
  methods: {
    /**
     * 搜索项目信息
     * @date 2021-05-11 13:38:00
     * @author zxp
     */
    search(query) {
      this.params.query = { ...query }
      this.getTableData()
    },
    /**
     * 表格分页
     * @date 2021-05-11 13:39:00
     * @author zxp
     */
    pageChange(pagination, filters, sorter) {
      const { order } = sorter
      this.params.page = BoxPage(pagination)
      this.params.query.sortBy = order ? order.replace('end', '') : undefined
      if (this.showId) return this.getListByShowId({ showId: this.showId, params: this.params.page })
      this.getTableData()
    },
    /**
     * 获取表格数据
     * @date 2021-05-11 13:39:00
     * @author zxp
     */
    async getTableData() {
      this.showId = ''
      this.loading = true
      try {
        const { data = {}} = await getTableData(this.params)
        this.dataSource = data.result
        this.params.page = BoxPage(data)
        console.log(data)
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },
    /**
     * 获取项目区属字典
     */
    async getSysConfigByAlias(alias) {
      const { data = [] } = await getSysConfigByAlias(alias)
      if (alias === 'projectArea') this.projectAreaArr = data
      if (alias === 'taskType') this.taskTypeData = data
    },
    /**
     * 获取项目类型
     */
    async getProjectType() {
      const { data = [] } = await getAllProjectType()
      this.projectTypeArr = data
    },
    /**
   * 获取项目统计信息
   */
    async getProjectStatistics() {
      const { data = [] } = await getProjectStatistics()
      this.setOptions(data)
    },
    /**
     * 设置 echarts 数据
     */
    setOptions(data) {
      this.options = data.map(item => ({ ...item, option: {
        color: ['#6dcee6', '#eee'],
        series: [
          {
            type: 'pie',
            radius: ['50%', '90%'],
            label: {
              show: false
            },
            data: [
              {
                name: item.name,
                value: item.num,
                label: {
                  show: true,
                  position: 'center',
                  formatter: '{d}%'
                }
              },
              {
                name: '其他',
                value: item.surplus
              }
            ]
          }
        ]
      }}))
    },
    /**
     * 打开甘特图模块
     */
    openGantModel(record) {
      this.title = record.projectName
      this.visible = true
      this.initGanttData(record.id)
    },
    /**
     * 打开甘特图模块
     */
    closeGantt() {
      // 关闭甘特图提示
      if (gantt.ext.tooltips && gantt.ext.tooltips.tooltip) {
        gantt.ext.tooltips.tooltip.hide()
      }
      this.tasks.data = []
      this.title = ''
      this.visible = false
      this.size = 'day'
    },
    /**
     * 初始化甘特图数据
     */
    initGanttData(projectId) {
      getGantData(projectId).then(res => {
        const { data = [] } = res
        data.forEach(item => {
          item.type = 'task'
          item.text = item.name // 名称
          item.parent = item.superId
          item.open = true // 默认展开
          item.start_date = item.startDate || undefined // 开始时间
          item.end_date = item.endDate || undefined // 结束时间
          if (!item.startDate || !item.endDate) {
            item.hide_bar = true
          }
        })
        console.log(data)
        this.tasks.data = data
        this.initGantt()
      }).over()
    },
    /**
     * 初始化甘特图
     */
    initGantt() {
      gantt.clearAll()
      gantt.resetLayout()
      if (this.events.length > 0) {
        while (this.events.length) { gantt.detachEvent(this.events.pop()) }
      }
      const that = this
      this.events.push(gantt.attachEvent('onGanttReady', function() {
        var tooltips = gantt.ext.tooltips
        tooltips.tooltip.setViewport(gantt.$task_data)
        // 实际开始时间 提示
        tooltips.tooltipFor({
          selector: '.baseline',
          html: function(event, node) {
            const data = node.dataset
            const actStartDate = gantt.date.parseDate(data.actStartDate, '%Y-%m-%d %H:%i:%s')
            const actEndDate = data.actEndDate ? gantt.date.parseDate(data.actEndDate, '%Y-%m-%d %H:%i:%s') : new Date()

            const timelong = actEndDate.getTime() - actStartDate.getTime()
            const day = Math.ceil(timelong / (1000 * 60 * 60 * 24))

            return [
              '<b>节点名称: </b> ' + data.name + `(${day}天)`,
              '<b>实际开始时间: </b> ' + data.actStartDate,
              '<b>实际结束时间: </b> ' + (data.actEndDate || '')
            ].join('<br>')
          }
        }
        )
      })
      )
      this.events.push(gantt.attachEvent('onTaskClick', (id, e) => {
        const classNames = ['gantt_task_content', 'gantt-task-num']
        if (classNames.includes(e.target.className)) {
          gantt.ext.tooltips.tooltip.hide()
          that.openTask(id)
        }
        return true
      }))
      gantt.plugins({
        tooltip: true
      })
      gantt.ext.zoom.init(zoomConfig)
      gantt.ext.zoom.setLevel(this.size)

      console.log(ganttColumns)
      gantt.config.columns = ganttColumns
      // 自适应甘特图的尺寸大小, 使得在不出现滚动条的情况下, 显示全部任务
      // gantt.config.autosize = true
      // // 不显示错误
      gantt.config.show_errors = false
      // // 只读模式
      gantt.config.readonly = true

      gantt.config.date_format = '%Y-%m-%d %H:%i:%s'
      gantt.config.bar_height = 16
      gantt.config.row_height = 40
      // 任务条显示内容
      gantt.templates.task_text = function(start, end, task) {
        return task.text + '(' + task.duration + '天)'
      }
      // 悬浮
      gantt.templates.tooltip_text = function(start, end, task) {
        const show = [
          '<b>节点名称: </b> ' + task.text + '(' + task.duration + '天)',
          '<b>计划开始时间: </b> ' + (task.startDate || ''),
          '<b>计划结束时间: </b> ' + (task.endDate || '')
        ].join('<br>')
        return '<span style=\'font-size: 14px\'>' + show + '</span>'
      }
      // 任务样式
      gantt.templates.task_class = function(start, end, task) {
        if (task.rate == 100) {
          return 'gantt-finish'
        }
      }
      gantt.i18n.setLocale('cn')
      // 初始化
      gantt.init(this.$refs.gantt)
      // adding baseline display
      gantt.addTaskLayer({
        renderer: {
          render: (task) => {
            if (task.actStartDate) {
              task.actEndDate = task.overTime
              if (!task.actEndDate) {
                task.actEndDate = new Date()
              } else {
                task.actEndDate = gantt.date.parseDate(task.actEndDate, '%Y-%m-%d %H:%i:%s')
              }
              var sizes = gantt.getTaskPosition(task, gantt.date.parseDate(task.actStartDate, '%Y-%m-%d %H:%i:%s'), task.actEndDate)
              var el = document.createElement('div')
              el.className = 'baseline'
              el.style.left = sizes.left + 'px'
              el.style.width = sizes.width + 'px'
              el.style.top = sizes.top + gantt.config.bar_height + 13 + 'px'
              const datas = {
                id: task.id,
                name: task.name,
                'act-start-date': task.actStartDate, // 实际开始时间
                'act-end-date': task.overTime // 实际结束时间
              }
              Object.keys(datas).forEach(key => {
                if (datas[key]) {
                  el.setAttribute(`data-${key}`, datas[key])
                }
              })
              return el
            }
            return false
          },
          // define getRectangle in order to hook layer with the smart rendering
          getRectangle: (task, view) => {
            if (task.actStartDate) {
              task.actEndDate = task.overTime
              if (!task.actEndDate) {
                task.actEndDate = new Date()
              } else {
                task.actEndDate = gantt.date.parseDate(task.actEndDate, '%Y-%m-%d %H:%i:%s')
              }
              return gantt.getTaskPosition(task, gantt.date.parseDate(task.actStartDate, '%Y-%m-%d %H:%i:%s'), task.actEndDate)
            }
            return null
          }
        }
      })

      // 数据解析
      gantt.parse(this.tasks)
    },
    /**
     * 改变时间范围
     */
    handleSizeChange(event) {
      this.size = event.target.value
      gantt.ext.zoom.setLevel(this.size)
    },
    /**
     * 打开j节点详情
     */
    openTask(id) {
      this.nodeId = id
      this.visible1 = true
    },
    /**
     * 获取任务分类数据字典
     */
    async getTaskType() {
      const { data = [] } = await getSysConfigByAlias('taskType')
      this.taskTypeList = data
    },
    /**
     * 点击 card 筛选
     */
    cardClick(e, { work, showId }) {
      const counts = document.querySelectorAll('.count')
      counts.forEach(item => (item.className = 'count'))
      e.target.className = 'count active'
      if (showId) return this.getListByShowId({ showId })
      this.params.query.work = work
      this.params.page.current = 1
      this.getTableData()
    },
    /**
     * 根据统计配置获取项目信息
     */
    async getListByShowId({ showId, params }) {
      this.showId = showId
      this.params.query = {}
      this.loading = true
      try {
        const { data = {}} = await getListByShowId({ showId, params })
        this.dataSource = data.result
        this.params.page = BoxPage(data)
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
<style scoped lang="less">
@import '~@/assets/css/dhtmlxgantt_material.css';
.gutter-example .gutter-row {
  /deep/ .ant-card-body {
    padding: 10px !important;
  }
  .gutter-box {
    display: flex;
    height: 92px;
    div {
      flex: 1;
      text-align: center;
    }
    .echarts {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .desc {
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: 16px;
      font-weight: 700;
      p {
        margin-bottom: 0;
      }
      .count {
        font-weight: 400;
        font-size: 20px;
        &.active {
          text-decoration: underline;
        }
      }
    }
  }
  /deep/ .ant-card-body {
    padding: 5%;
  }
}
</style>
