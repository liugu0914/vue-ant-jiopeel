<template>
  <div class="contract">
    <!-- 头部统计 -->
    <div class="gutter-example">
      <a-row :gutter="[16, 16]">
        <!-- 项目总数 -->
        <a-col class="gutter-row" v-bind="{ xs: 24, md: 12, lg: 6 }">
          <a-card>
            <div class="gutter-box">
              <!-- 图表 -->
              <div class="echarts">
                <a-icon type="bar-chart" />
              </div>
              <!-- 描述 -->
              <div class="desc pt-2">
                <p>项目总数</p>
                <span class="count">
                  20
                </span>
              </div>
            </div>
          </a-card>
        </a-col>
        <!-- 已办理 -->
        <a-col class="gutter-row" v-bind="{ xs: 24, md: 12, lg: 6 }">
          <a-card>
            <div class="gutter-box">
              <!-- 图表 -->
              <div class="echarts">
                <chart :data="options1" />
              </div>
              <!-- 描述 -->
              <div class="desc pt-2">
                <p>已办理</p>
                <span class="count">
                  10
                </span>
              </div>
            </div>
          </a-card>
        </a-col>
        <!-- 办理中 -->
        <a-col class="gutter-row" v-bind="{ xs: 24, md: 12, lg: 6 }">
          <a-card>
            <div class="gutter-box">
              <!-- 图表 -->
              <div class="echarts">
                <chart :data="options2" />
              </div>
              <!-- 描述 -->
              <div class="desc pt-2">
                <p>办理中</p>
                <span class="count">
                  6
                </span>
              </div>
            </div>
          </a-card>
        </a-col>
        <!-- 未办理 -->
        <a-col class="gutter-row" v-bind="{ xs: 24, md: 12, lg: 6 }">
          <a-card>
            <div class="gutter-box">
              <!-- 图表 -->
              <div class="echarts">
                <chart :data="options3" />
              </div>
              <!-- 描述 -->
              <div class="desc pt-2">
                <p>未办理</p>
                <span class="count">
                  4
                </span>
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
        :pagination="params.page"
        :selected-rows.sync="selectedRows"
        @search="search"
        @change="pageChange"
      >
        <!-- 按钮 -->
        <template slot="btns">
          <a-button type="primary" @click="add">
            <a-icon type="plus" />添加
          </a-button>
          <a-popconfirm
            :disabled="!selectedRows.length"
            title="是否确认删除选中的数据?"
            @confirm="del(selectedRows)"
            @click.native="selectedRows.length ? '' : $message.warning('请选择要删除的数据')"
          >
            <a-button type="danger">
              <a-icon type="delete" />删除
            </a-button>
          </a-popconfirm>
          <a-button @click="visible2=true">
            <a-icon type="cloud-upload" />导入
          </a-button>
          <a-button @click="exportData">
            <a-icon type="cloud-download" />导出
          </a-button>
          <!-- <a-button>
            同步OA系统
          </a-button> -->
        </template>

        <!-- 合同文件 -->
        <template slot="file" slot-scope="{record}">
          <div v-if="record.contractMaterials.length">
            <p v-for="item in record.contractMaterials" :key="item.id">
              {{ item.fileName }}
            </p>
          </div>
          <span v-else />
        </template>

        <!-- 操作 -->
        <template slot="action" slot-scope="{ record }">
          <a-button type="link" size="small" @click="edit(record)">
            修改
          </a-button>
          <a-popconfirm
            title="确定删除该合同？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="del(record.id)"
          >
            <a-button type="link" size="small">
              删除
            </a-button>
          </a-popconfirm>
        </template>
      </standard-table>
    </a-card>

    <!-- 添加、修改合同弹窗 -->
    <modal v-model="visible" type="IModal" :title="title" width="700px" @ok="handleOk" @cancel="visible = false">
      <a-form-model ref="ruleForm" :model="dataForm" label-align="left">
        <a-row :gutter="[16, 0]">
          <a-col span="12">
            <a-form-model-item
              :rules="[{ required: true, message: '工程编号不能为空', trigger: 'blur' }, { validator: checkNumber, trigger: 'change' }]"
              label="工程编号"
              prop="projectNum"
            >
              <a-input v-model="dataForm.projectNum" class="w-100" :max-length="255" autocomplete="off" allow-clear placeholder="请输入工程编号" />
            </a-form-model-item>
          </a-col>
          <a-col span="12">
            <a-form-model-item
              :rules="{ required: true, message: '工程名称不能为空', trigger: 'blur' }"
              label="工程名称"
              prop="projectName"
            >
              <a-input v-model="dataForm.projectName" class="w-100" :max-length="255" autocomplete="off" allow-clear placeholder="请输入工程名称" />
            </a-form-model-item>
          </a-col>

          <a-col span="12">
            <a-form-model-item
              :rules="[{ required: true, message: '工程区属不能为空', trigger: 'blur' }]"
              label="工程区属"
              prop="projectArea"
            >
              <a-select v-model="dataForm.projectArea" class="w-100" placeholder="请选择工程区属">
                <a-select-option v-for="item in projectAreaArr" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col span="12">
            <a-form-model-item
              :rules="[{ required: true, message: '工程类型不能为空', trigger: 'blur' }]"
              label="工程类型"
              prop="projectType"
            >
              <a-select v-model="dataForm.projectType" class="w-100" placeholder="请选择工程类型">
                <a-select-option v-for="item in projectTypeArr" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-col span="6">
            <a-form-model-item
              :rules="{ required: true, message: '是否开工不能为空', trigger: 'blur' }"
              label="是否开工"
              prop="work"
            >
              <a-radio-group v-model="dataForm.work">
                <a-radio :value="1">
                  是
                </a-radio>
                <a-radio :value="0">
                  否
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>

          <a-col span="9">
            <a-form-model-item
              :rules="dataForm.work ? { required: true, message: '开工时间不能为空', trigger: 'change' } : {}"
              label="开工时间"
              prop="startTime"
            >
              <a-date-picker v-model="dataForm.startTime" class="w-100" value-format="YYYY-MM-DD" placeholder="请选择开工时间" />
            </a-form-model-item>
          </a-col>

          <a-col span="9">
            <a-form-model-item
              :rules="dataForm.work ? { required: true, message: '完工时间不能为空', trigger: 'change' } : {}"
              label="完工时间"
              prop="overTime"
            >
              <a-date-picker v-model="dataForm.overTime" class="w-100" value-format="YYYY-MM-DD" placeholder="请选择完工时间" />
            </a-form-model-item>
          </a-col>

          <a-col span="10">
            <a-form-model-item
              :rules="{ required: true, message: '经度不能为空', trigger: 'blur' }"
              label="所在地"
              prop="longitude"
            >
              <a-input v-model="dataForm.longitude" class="w-100" :max-length="255" autocomplete="off" allow-clear placeholder="请输入经度" />
            </a-form-model-item>
          </a-col>
          <a-col span="10">
            <a-form-model-item
              :rules="{ required: true, message: '纬度不能为空', trigger: 'blur' }"
              label="纬度"
              prop="latitude"
              class="address"
            >
              <a-input v-model="dataForm.latitude" class="w-100" :max-length="255" autocomplete="off" allow-clear placeholder="请输入纬度" />
            </a-form-model-item>
          </a-col>
          <a-col span="4">
            <a-form-model-item
              label="定位"
              class="address"
            >
              <a-icon type="environment" class="ml-2" style="cursor: pointer; font-size: 20px" @click="isMask = true" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </modal>

    <!-- 导入文件弹窗 -->
    <modal
      title="导入" type="IModal" :visible="visible2" centered :width="400" :footer="null" @ok="visible2 = false" @cancel="visible2 = false">
      <upload type="drop" :action="excleImportUrl" :before-upload="beforeUpload" :show-upload-list="false" @change="importFile">
        <p class="ant-upload-drag-icon">
          <a-icon type="upload" />
        </p>
        <p class="ant-upload-text">
          将文件拖到此处，或点击上传
        </p>
        <p class="ant-upload-hint">
          只能上传xlsx/xls文件，且不超过20MB
        </p>
      </upload>
      <a-button type="primary" style="margin-top: 10px; width: 100%" @click="downloadTemplate">
        <a-icon type="download" style="vertical-align: bottom;" />
        下载模板
      </a-button>
    </modal>

    <!-- 地图选点 -->
    <map-select :visible="isMask" @mapClick="mapClick" />
  </div>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'
import Modal from '@/components/modal/Modal'
import Chart from '@/components/chart'
import Upload from '@/components/upload'
import MapSelect from '@/components/map-select'
import { columns, defaultForm, projectTypeArr, projectAreaArr, options1, options2, options3 } from './constant'
import { cloneDeep } from '@/utils/tool'
import { getProjectList, saveProjectData, delProjectData, exportProjectData, excleImportUrl, excleDownload } from '@/api/modules/pm'
export default {
  components: {
    StandardTable,
    Modal,
    Chart,
    Upload,
    MapSelect
  },
  data() {
    return {
      columns,
      dataSource: [], // 表格数据
      dataForm: cloneDeep(defaultForm), // 单条数据显示
      visible: false, // 添加合同弹窗开关
      projectTypeArr, // 项目类型数组
      projectAreaArr, // 项目区属数组
      // echarts 数据
      options1,
      options2,
      options3,
      title: '', // 弹窗标题
      // 表格数据请求参数
      params: {
        page: {
          current: 1,
          pageSize: 10,
          total: 0
        },
        query: {
          search: '',
          projectArea: '',
          projectType: '',
          startTime: '',
          overTime: ''
        }
      },
      // 表格加载状态
      loading: false,
      visible2: false,
      excleImportUrl,
      selectedRows: [],
      // 地图选点
      isMask: false
    }
  },
  created() {
    this.getProjectList()
  },
  methods: {
    /**
     * 添加项目信息弹窗显示
     * @date 2021-05-11 13:37:00
     * @author zxp
     */
    add() {
      this.title = '添加工程信息'
      this.dataForm = {}
      this.visible = true
    },
    /**
     * 确认添加、修改项目信息
     * @date 2021-05-11 13:37:00
     * @author zxp
     */
    handleOk() {
      // 二次表单校验
      this.$refs.ruleForm.validate(async val => {
        if (!val) return
        await saveProjectData(this.dataForm)
        this.getProjectList()
        this.visible = false
      })
    },
    /**
     * 修改项目信息
     * @date 2021-05-11 13:37:00
     * @author zxp
     */
    edit(row) {
      this.title = '修改工程信息'
      this.dataForm = cloneDeep(row)
      this.visible = true
    },
    /**
     * 删除项目信息
     * @date 2021-05-11 13:38:00
     * @author zxp
     */
    async del(id) {
      id = typeof id === 'object' ? id.map(item => item.id).join() : id
      await delProjectData(id)
      this.getProjectList()
    },
    /**
     * 文件上传前的回调
     * @date 2021-05-11 13:38:00
     * @author zxp
     */
    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        const size = file.size / 1024 / 1024
        const isExcel = ['xlsx', 'xls'].some(item => file.name.indexOf(item) !== -1)
        if (!isExcel) {
          this.$message.error('请选择 xlsx、xls 文件上传！')
          return reject(false)
        }
        if (size > 20) {
          this.$message.error('上传的文件不能超过20MB!')
          return reject(false)
        }

        return resolve(true)
      })
    },
    /**
     * 搜索项目信息
     * @date 2021-05-11 13:38:00
     * @author zxp
     */
    search(query) {
      this.params.query = query
      this.getProjectList()
    },
    /**
     * 导入文件
     * @date 2021-05-11 13:38:00
     * @author zxp
     */
    importFile({ file }) {
      if (file.status === 'done') {
        const { response: data } = file
        if (data.status !== 200) return this.$message.error('导入失败！')
        this.$message.success('导入成功！')
        this.getProjectList()
      }
      if (file.status === 'error') this.$message.error('导入失败！')
      this.visible2 = false
    },
    /**
     * 导出项目信息
     * @date 2021-05-11 13:38:00
     * @author zxp
     */
    exportData() {
      exportProjectData(this.params.query)
    },
    /**
     * 表格分页
     * @date 2021-05-11 13:39:00
     * @author zxp
     */
    pageChange(pagination) {
      const { current, pageSize } = pagination
      this.params.page = { current, pageSize }
      this.getProjectList()
    },
    /**
     * 工程编号校验
     * @date 2021-05-11 13:39:00
     * @author zxp
     */
    checkNumber: (rule, value, callback) => {
      const reg = /[\u4e00-\u9fa5]/
      if (reg.test(value)) {
        return callback(new Error('工程编号不能包含中文'))
      } else {
        callback()
      }
    },
    /**
     * 获取表格数据
     * @date 2021-05-11 13:39:00
     * @author zxp
     */
    async getProjectList() {
      this.loading = true
      try {
        const { data = {}} = await getProjectList(this.params)
        this.dataSource = data.result.map(item => ({ ...item, projectArea: +item.projectArea, projectType: +item.projectType }))
        this.params.page.total = data.total
        console.log(data)
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },
    /**
     * 下载 excle 模板
     * @date 2021-05-11 13:39:00
     * @author zxp
     */
    downloadTemplate() {
      excleDownload(this.params.query)
    },
    /**
     * 地图选点
     * @date 2021-05-25 15:25:00
     * @author zxp
     */
    mapClick(argus) {
      this.dataForm.longitude = argus[0]
      this.dataForm.latitude = argus[1]
      this.isMask = false
    }
  }
}
</script>
<style scoped lang="less">
.gutter-example {
  .gutter-box {
    display: flex;
    height: 92px;
    div {
      flex: 1;
      text-align: center;
      .anticon-bar-chart {
        font-size: 60px;
        line-height: 92px;
      }
    }
    .desc {
      font-weight: 700;
      p {
        margin-bottom: 0;
      }
      .count {
        font-size: 24px;
      }
    }
  }
  margin-bottom: 20px;
  /deep/ .ant-card-body {
    padding: 5%;
  }
}

.title {
  font-size: 18px;
  font-weight: 700;
  color: @primary-color;
  margin-bottom: 20px;
}

.close {
  float: right;
  line-height: 21px;
  cursor: pointer;
}

.address {
  /deep/
  label {
    visibility: hidden;
  }
}
</style>
