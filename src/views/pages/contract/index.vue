<template>
  <div class="contract">
    <!-- 头部统计 -->
    <div class="gutter-example mb-2">
      <a-row :gutter="[10, 10]">
        <a-col v-for="(item,index) in echartData" :key="item.name" class="gutter-row" v-bind="{ xs: 12, md: 6, lg: 3 }">
          <a-card>
            <div class="gutter-box">
              <!-- 图表 -->
              <div class="echarts">
                <my-icon v-if="!index" type="icon-ziyuan1" style="font-size:65px" />
                <chart v-else :data="item.options" />
              </div>
              <!-- 描述 -->
              <div class="desc">
                <p class="ellipsis">
                  {{ index ? item.name.substring(0,4) : '合同数量' }}
                </p>
                <a href="javascript:;" class="count" :class="{active: item.type == (params.query && params.query.type)}" @click="cardClick(item)">
                  {{ item.value }}
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
        placeholder="搜索合同名称/合同编号"
        :data-source="dataSource"
        :loading="loading"
        :pagination.sync="params.page"
        :selected-rows.sync="selectedRows"
        @search="search"
        @change="pageChange"
      >
        <!-- 按钮 -->
        <template slot="btns">
          <a-button v-if="$hasp('contract-imp')" type="primary" @click="visible2=true">
            导入
          </a-button>
          <a-button v-if="$hasp('contract-exp')" type="primary" @click="exportData">
            导出
          </a-button>
          <a-button v-if="$hasp('contract-add')" type="primary" @click="add">
            新增
          </a-button>
          <a-button v-if="$hasp('contract-edit')" type="primary" @click="edit">
            修改
          </a-button>
          <a-popconfirm
            v-if="$hasp('contract-del')"
            :disabled="selectedRows && !selectedRows.length"
            title="是否确认删除选中的数据?"
            @confirm="del(selectedRows)"
            @click.native="selectedRows && selectedRows.length ? '' : $message.warning('请选择要删除的数据')"
          >
            <a-button type="danger">
              删除
            </a-button>
          </a-popconfirm>
        </template>

        <!-- 合同类型 -->
        <span slot="contractType" slot-scope="{text}">
          {{ contractTypeArr.find(item => item.value == text) && contractTypeArr.find(item => item.value == text).name }}
        </span>

        <!-- 合同文件 -->
        <template slot="file" slot-scope="{record}">
          <upload :file-list="record.fileList" :show-upload-list="{showPreviewIcon: true, showRemoveIcon: false}" style="max-width: 200px" />
        </template>
      </standard-table>
    </a-card>

    <!-- 添加、修改合同弹窗 -->
    <modal v-if="$hasp('contract-add') || $hasp('contract-edit')" v-model="visible" :title="title" width="700px" @ok="handleOk" @cancel="visible = false">
      <a-form-model ref="ruleForm" :model="dataForm" label-align="left">
        <a-row :gutter="[16, 0]">
          <a-col span="12">
            <a-form-model-item
              :rules="[{ required: true, message: '合同编号不能为空', trigger: 'blur', whitespace: true }, { validator: checkNumber, trigger: 'change' }]"
              label="合同编号"
              prop="contractNum"
            >
              <a-input v-model="dataForm.contractNum" class="w-100" :max-length="100" autocomplete="off" allow-clear placeholder="请输入合同编号" />
            </a-form-model-item>
          </a-col>
          <a-col span="12">
            <a-form-model-item
              :rules="{ required: true, message: '合同名称不能为空', trigger: 'blur', whitespace: true }"
              label="合同名称"
              prop="name"
            >
              <a-input v-model="dataForm.name" class="w-100" :max-length="100" autocomplete="off" allow-clear placeholder="请输入合同名称" />
            </a-form-model-item>
          </a-col>

          <a-col span="12">
            <a-form-model-item
              :rules="[{ required: true, message: '合同类型不能为空', trigger: 'blur' }]"
              label="合同类型"
              prop="type"
            >
              <a-select v-model="dataForm.type" class="w-100" placeholder="请选择合同类型">
                <a-select-option v-for="item in contractTypeArr" :key="item.value" :value="item.value">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col span="12">
            <a-form-model-item
              :rules="[{ required: true, message: '合同金额不能为空', trigger: 'blur' },{ validator: checkMoney, trigger: 'change' }]"
              label="合同金额(万元)"
              prop="money"
            >
              <a-input-number v-model="dataForm.money" :min="1" class="w-100" autocomplete="off" placeholder="请输入合同金额" />
            </a-form-model-item>
          </a-col>

          <a-col span="12">
            <a-form-model-item
              :rules="{ required: true, message: '发包方不能为空', trigger: 'blur', whitespace: true }"
              label="发包方"
              prop="employee"
            >
              <a-input v-model="dataForm.employee" class="w-100" :max-length="100" autocomplete="off" placeholder="请输入发包方" />
            </a-form-model-item>
          </a-col>
          <a-col span="12">
            <a-form-model-item
              :rules="{ required: true, message: '承包方不能为空', trigger: 'blur', whitespace: true }"
              label="承包方"
              prop="contractor"
            >
              <a-input v-model="dataForm.contractor" class="w-100" :max-length="100" autocomplete="off" placeholder="请输入承包方" />
            </a-form-model-item>
          </a-col>

          <a-col span="12">
            <a-form-model-item
              :rules="{ required: true, message: '签订时间不能为空', trigger: 'change' }"
              label="签订时间"
              prop="signingTime"
            >
              <a-date-picker v-model="dataForm.signingTime" class="w-100" value-format="YYYY-MM-DD" />
            </a-form-model-item>
          </a-col>

          <a-col span="12">
            <a-form-model-item label="关联项目" prop="projectId">
              <a-select v-model="dataForm.projectId" class="w-100" placeholder="请选择项目" allow-clear>
                <a-select-option v-for="item in projectList" :key="item.id" :value="item.id">
                  {{ item.projectName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>

        <p class="title">
          <a-icon type="double-right" />上传合同文件材料
          <a-button style="float: right" @click="visible1 = true; fileForm = {}">
            <a-icon type="plus" />
          </a-button>
        </p>
      </a-form-model>

      <standard-table :columns="columns1" :data-source="dataSource1" :pagination="false" bordered :is-search="false">
        <div slot="fileName" slot-scope="{record}">
          <a-input v-model="record.name" :max-length="100" style="margin: -5px 0" allow-clear />
        </div>

        <div slot="upload" slot-scope="{ record }">
          <upload :file-list="record.files" :remove="file => remove(file, record)" style="max-width:270px" @change="file => onChange(record, file)">
            <a-button v-if="!record.files.length" type="link">
              点击上传文件
            </a-button>
          </upload>
        </div>

        <div slot="action" slot-scope="{record}">
          <a-popconfirm
            title="确定删除该文件？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="confirmDelFile(record.id)"
          >
            <a-button type="link" size="small">
              删除
            </a-button>
          </a-popconfirm>
        </div>
      </standard-table>
    </modal>

    <!-- 添加文件弹窗 -->
    <modal
      v-if="$hasp('contract-add') || $hasp('contract-edit')"
      title="添加文件" type="IModal" :visible="visible1" centered @ok="addFile" @cancel="visible1 = false">
      <a-form-model ref="fileForm" :model="fileForm">
        <a-form-model-item
          :rules="{ required: true, message: '文件名称不能为空', trigger: 'blur', whitespace: true }"
          label="文件名称"
          prop="fileName"
        >
          <a-input v-model="fileForm.fileName" class="w-100" :max-length="100" autocomplete="off" allow-clear />
        </a-form-model-item>
      </a-form-model>
    </modal>

    <!-- 导入文件弹窗 -->
    <modal
      v-if="$hasp('contract-imp')"
      title="导入" type="IModal" :visible="visible2" centered :width="400" :footer="null" @ok="visible2 = false" @cancel="visible2 = false">
      <upload mode="drop" file-type="excel" :show-upload-list="false" @change="importFile">
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
        <a-icon type="download" style="vertical-align: bottom;" />下载模板
      </a-button>
    </modal>
  </div>
</template>

<script>

import StandardTable from '@/components/table/StandardTable'
import Modal from '@/components/modal/Modal'
import Chart from '@/components/chart'
import Upload from '@/components/upload'
import { columns, defaultForm, columns1, data1 } from './constant'
import { cloneDeep, BoxPage } from '@/utils/tool'
import {
  getContractList, saveContractData, delContractData,
  importContractData, getContractCount, excleImportUrl, excleDownload
} from '@/api/modules/contract'
import { delFile, downloadUrl } from '@/api/common/upload'
import { getProjectList } from '@/api/modules/pm/projectInfo'
import { getSysConfigByAlias } from '@/api/modules/sys/dictionary'

export default {
  components: {
    StandardTable,
    Modal,
    Chart,
    Upload
  },
  data() {
    return {
      columns,
      columns1,
      dataSource: [], // 表格数据
      dataSource1: [],
      dataForm: cloneDeep(defaultForm), // 单条数据显示
      visible: false, // 添加合同弹窗开关
      contractTypeArr: [], // 合同类型数组
      // echarts 数据
      echartData: [],
      title: '', // 弹窗标题
      visible1: false, // 添加文件弹窗开关
      fileForm: {}, // 添加文件表单
      visible2: false,
      // 表格数据请求参数
      params: {
        page: {},
        query: {}
      },
      excleImportUrl, // excle 导出地址
      loading: false, // 表格加载状态
      selectedRows: this.$hasp('contract-del') || this.$hasp('contract-edit') ? [] : undefined, // 选中的数据
      projectList: [] // 项目列表
    }
  },
  created() {
    // 获取合同列表
    this.getContractList()
    // 获取图标统计信息
    this.getContractType()
    // 获取项目列表
    this.getProjectList()
    // 获取合同类型
    this.getSysConfigByAlias()
  },
  methods: {
    /**
     * 添加合同弹窗显示
     * @date 2021-05-11 11:40:00
     * @author zxp
     */
    add() {
      this.title = '新增合同信息'
      this.dataForm = {}
      this.dataSource1 = cloneDeep(data1)
      this.visible = true
    },
    /**
     * 确认添加、修改合同信息
     * @date 2021-05-11 11:40:00
     * @author zxp
     */
    handleOk() {
      // 判断文件名称是否有空的
      const isEmpty = this.dataSource1.some(item => !item.name.trim())
      if (isEmpty) return this.$message.warning('文件名称不能为空！')
      // 二次表单校验
      this.$refs.ruleForm.validate(async val => {
        if (!val) return
        const contractMaterials = cloneDeep(this.dataSource1).map(item => {
          if (item.files.length) {
            item.fileId = item.fileId ? item.fileId : item.files[0].id
            item.fileName = item.fileName ? item.fileName : item.files[0].name
            item.fileUrl = item.fileUrl ? item.fileUrl : item.files[0].url
          }
          return item
        })
        const params = { contractInfo: this.dataForm, contractMaterials }
        const { status } = await saveContractData(params)
        if (status !== 200) return
        this.getContractList()
        this.getContractType()
        this.visible = false
        if (this.title === '新增合同信息') return this.$message.success('添加成功！')
        this.$message.success('编辑成功！')
      })
    },
    /**
     * 修改合同信息
     * @date 2021-05-11 11:40:00
     * @author zxp
     */
    edit() {
      if (!this.selectedRows.length) return this.$message.warning('请选择一条数据进行修改')
      if (this.selectedRows.length > 1) return this.$message.warning('只能选择一条数据进行修改')
      this.title = '修改合同信息'
      const row = this.selectedRows[0]
      this.dataForm = cloneDeep(row)
      this.dataSource1 = this.dataForm.contractMaterials
      delete this.dataForm.contractMaterials
      delete this.dataForm.fileList
      this.visible = true
    },
    /**
     * 删除合同信息
     * @date 2021-05-11 11:40:00
     * @author zxp
     */
    async del(id) {
      id = typeof id === 'object' ? id.map(item => item.id).join() : id
      const isLast = id.split(',').length == this.dataSource.length && this.params.page.current > 1
      if (isLast) this.params.page.current -= 1
      const { status } = await delContractData(id)
      if (status !== 200) return
      this.getContractList()
      this.getContractType()
      this.$message.success('删除成功！')
    },
    /**
     * 上传文件状态改变
     * @date 2021-05-11 11:40:00
     * @author zxp
     */
    onChange(row, { file, fileList }) {
      row.files = fileList.filter(item => item.status).map(item => {
        if (item.status == 'done' && item.response) {
          const data = item.response.data
          return { ...data, url: downloadUrl + data.url, uid: data.id, name: data.filename, status: 'done' }
        }
        return item
      })
    },
    /**
     * 删除文件
     * @date 2021-05-11 11:40:00
     * @author zxp
     */
    async remove(file, row) {
      const id = file.id
      await delFile([id])
      this.$message.success('删除成功')
      delete row.fileId
      delete row.fileName
      delete row.fileUrl
    },
    /**
     * 添加文件弹窗显示
     * @date 2021-05-11 11:40:00
     * @author zxp
     */
    addFile() {
      this.$refs.fileForm.validate(val => {
        if (!val) return
        this.dataSource1.push({ id: Date.now(), name: this.fileForm.fileName, files: [] })
        this.visible1 = false
      })
    },
    /**
     * 删除一行文件
     * @date 2021-05-11 11:40:00
     * @author zxp
     */
    confirmDelFile(id) {
      this.dataSource1 = this.dataSource1.filter(item => item.id !== id)
    },
    /**
     * 搜索合同信息
     * @date 2021-05-11 11:40:00
     * @author zxp
     */
    search(query) {
      this.params.query = query
      this.getContractList()
    },
    /**
     * 获取表格数据
     * @date 2021-05-11 11:40:00
     * @author zxp
     */
    async getContractList() {
      this.loading = true
      try {
        const { data } = await getContractList(this.params)
        this.dataSource = data.result
        this.dataSource.forEach(item => {
          item.fileList = []
          item.contractMaterials && item.contractMaterials.forEach(file => {
            if (!file.files.length) {
              delete file.fileId
              delete file.fileName
              delete file.fileUrl
            } else {
              file.files.forEach(item => { item.uid = file.fileId; item.url = downloadUrl + item.url; item.name = file.fileName })
              item.fileList = item.fileList.concat(file.files)
            }
          })
        })
        this.params.page = BoxPage(data)
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },
    /**
     * 导入文件
     * @date 2021-05-11 11:40:00
     * @author zxp
     */
    importFile({ file }) {
      if (file.status === 'done') {
        const { response: data } = file
        if (data.status !== 200) return this.$message.error('导入失败！')
        this.$message.success('导入成功！')
        this.getContractList()
        this.getContractType()
      }
      if (file.status === 'error') this.$message.error('导入失败！')
      this.visible2 = false
    },
    /**
     * 导出合同信息
     * @date 2021-05-11 11:40:00
     * @author zxp
     */
    exportData() {
      importContractData(this.params.query)
    },
    /**
     * 下载 excle 模板
     * @date 2021-05-11 11:40:00
     * @author zxp
     */
    downloadTemplate() {
      excleDownload(this.params.query)
    },
    /**
     * 表格分页
     * @date 2021-05-11 11:40:00
     * @author zxp
     */
    pageChange(pagination) {
      this.params.page = BoxPage(pagination)
      this.getContractList()
    },
    /**
     * 合同金额校验
     * @date 2021-05-11 11:40:00
     * @author zxp
     */
    checkMoney: (rule, value, callback) => {
      if (value > 100000000) {
        return callback(new Error('合同金额不能超过1亿'))
      } else if (value < 0) {
        return callback(new Error('合同金额不能小于0'))
      } else {
        callback()
      }
    },
    /**
     * 合同编号校验
     * @date 2021-05-11 11:40:00
     * @author zxp
     */
    checkNumber: (rule, value, callback) => {
      const reg = /[\u4e00-\u9fa5]/
      if (reg.test(value)) {
        return callback(new Error('合同编号不能包含中文'))
      } else {
        callback()
      }
    },
    /**
     * 获取合同类型信息
     * @date 2021-05-11 11:40:00
     * @author zxp
     */
    async getContractType() {
      const { data = [] } = await getContractCount()
      this.echartData = data.map(item => ({ ...item, options: {
        color: ['#1e44f3', '#ccc'],
        series: [
          {
            type: 'pie',
            radius: ['60%', '90%'],
            label: {
              show: false
            },
            data: [
              {
                name: item.name,
                value: item.value,
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
     * 获取项目列表
     */
    async getProjectList() {
      const { data = [] } = await getProjectList()
      this.projectList = data
    },
    /**
     * 获取项目类型数据字典
     */
    async getSysConfigByAlias() {
      const { data = [] } = await getSysConfigByAlias('contractType')
      this.contractTypeArr = data
    },
    /**
     * 点击 card 筛选
     */
    cardClick({ type }) {
      this.params.query.type = type
      this.getContractList()
    }
  }
}
</script>
<style scoped lang="less">
.gutter-example {
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
</style>
