<template>
  <div class="contract">
    <!-- 头部统计 -->
    <div class="gutter-example">
      <a-row :gutter="[10, 10]">
        <!-- 合同数量 -->
        <a-col class="gutter-row" v-bind="{ xs: 12, md: 6, lg: 3 }">
          <a-card>
            <div class="gutter-box">
              <!-- 图表 -->
              <div class="echarts">
                <a-icon type="bar-chart" />
              </div>
              <!-- 描述 -->
              <div class="desc pt-2">
                <p>合同数量</p>
                <span class="count">
                  {{ echartData.length && echartData[0].value }}
                </span>
              </div>
            </div>
          </a-card>
        </a-col>
        <!-- 合同信息 -->
        <a-col v-for="item in echartData.slice(1)" :key="item.name" class="gutter-row" v-bind="{ xs: 12, md: 6, lg: 3 }">
          <a-card>
            <div class="gutter-box">
              <!-- 图表 -->
              <div class="echarts">
                <chart :data="item.options" />
              </div>
              <!-- 描述 -->
              <div class="desc pt-2">
                <p>{{ item.name.substring(0,4) }}</p>
                <span class="count">
                  {{ item.value }}
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
        placeholder="搜索合同名称/合同编号"
        :data-source="dataSource"
        :scroll="{ x: 1500 }"
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
              :rules="[{ required: true, message: '合同编号不能为空', trigger: 'blur' }, { validator: checkNumber, trigger: 'change' }]"
              label="合同编号"
              prop="contractId"
            >
              <a-input v-model="dataForm.contractId" class="w-100" :max-length="255" autocomplete="off" allow-clear placeholder="请输入合同编号" />
            </a-form-model-item>
          </a-col>
          <a-col span="12">
            <a-form-model-item
              :rules="{ required: true, message: '合同名称不能为空', trigger: 'blur' }"
              label="合同名称"
              prop="name"
            >
              <a-input v-model="dataForm.name" class="w-100" :max-length="255" autocomplete="off" allow-clear placeholder="请输入合同名称" />
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
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col span="12">
            <a-form-model-item
              :rules="[{ required: true, message: '合同金额不能为空', trigger: 'blur' },{ validator: checkMoney, trigger: 'change' }]"
              label="合同金额"
              prop="money"
            >
              <a-input v-model="dataForm.money" type="number" class="w-100" autocomplete="off" placeholder="请输入合同金额" />
            </a-form-model-item>
          </a-col>

          <a-col span="12">
            <a-form-model-item
              :rules="{ required: true, message: '发包方不能为空', trigger: 'blur' }"
              label="发包方"
              prop="employee"
            >
              <a-input v-model="dataForm.employee" class="w-100" autocomplete="off" placeholder="请输入发包方" />
            </a-form-model-item>
          </a-col>
          <a-col span="12">
            <a-form-model-item
              :rules="{ required: true, message: '承包方不能为空', trigger: 'blur' }"
              label="承包方"
              prop="contractor"
            >
              <a-input v-model="dataForm.contractor" class="w-100" autocomplete="off" placeholder="请输入承包方" />
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
        </a-row>

        <p class="title">
          <a-icon type="double-right" />上传合同文件材料
          <a-button style="float: right" @click="visible1 = true">
            <a-icon type="plus" />
          </a-button>
        </p>
      </a-form-model>

      <standard-table :columns="columns1" :data-source="dataSource1" :pagination="false" bordered :is-search="false">
        <div slot="fileName" slot-scope="{record}">
          <a-input
            v-model="record.name"
            style="margin: -5px 0"
            allow-clear
          />
        </div>

        <div slot="upload" slot-scope="{ record }">
          <upload :file-list="record.fileList" :before-upload="file => beforeUpload(file, false)" :action="action" :remove="() => { remove(record) }" @change="file => onChange(record, file)">
            <a-button v-if="!record.fileList.length" type="link">
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
      title="添加文件" type="IModal" :visible="visible1" centered @ok="addFile" @cancel="visible1 = false">
      <a-form-model-item
        label="文件名称"
      >
        <a-input v-model="fileName" class="w-100" :max-length="255" autocomplete="off" allow-clear />
      </a-form-model-item>
    </modal>

    <!-- 导入文件弹窗 -->
    <modal
      title="导入" type="IModal" :visible="visible2" centered :width="400" :footer="null" @ok="visible2 = false" @cancel="visible2 = false">
      <upload type="drop" :action="excleImportUrl" :before-upload="(file) => beforeUpload(file, true)" :show-upload-list="false" @change="importFile">
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
import { columns, defaultForm, contractTypeArr, columns1, data1 } from './constant'
import { cloneDeep } from '@/utils/tool'
import {
  getContractList,
  saveContractData,
  delContractData,
  importContractData,
  getContractCount,
  delFile,
  downloadurl,
  excleImportUrl,
  excleDownload
} from '@/api/modules/contract'
import { uploadFileUrl } from '@/api/common/upload'
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
      contractTypeArr, // 合同类型数组
      // echarts 数据
      echartData: [],
      title: '', // 弹窗标题
      action: uploadFileUrl, // 文件上传地址
      visible1: false, // 添加文件弹窗开关
      fileName: '', // 文件名称
      visible2: false,
      // 表格数据请求参数
      params: {
        page: {
          current: 1,
          pageSize: 10,
          total: 0
        },
        query: {
          contractor: '',
          employee: '',
          money: '',
          search: '',
          signingTime: '',
          type: ''
        }
      },
      excleImportUrl,
      // 表格加载状态
      loading: false,
      selectedRows: []
    }
  },
  created() {
    this.getContractList()
    this.getContractType()
  },
  methods: {
    /**
     * 添加合同弹窗显示
     * @date 2021-05-11 11:40:00
     * @author zxp
     */
    add() {
      this.title = '添加合同信息'
      this.dataForm = {}
      this.dataSource1 = data1
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
          if (item.fileList.length) {
            item.fileId = item.fileId ? item.fileId : item.fileList[0].response.data.id
            item.fileName = item.fileName ? item.fileName : item.fileList[0].name
            item.fileUrl = item.fileUrl ? item.fileUrl : item.fileList[0].response.data.url
          }
          delete item.fileList
          delete item.editable
          return item
        })
        const params = { contractInfo: this.dataForm, contractMaterials }
        await saveContractData(params)
        this.getContractList()
        this.getContractType()
        this.visible = false
      })
    },
    /**
     * 修改合同信息
     * @date 2021-05-11 11:40:00
     * @author zxp
     */
    edit(row) {
      this.title = '修改合同信息'
      this.dataForm = cloneDeep(row)
      this.dataSource1 = row.contractMaterials
      if (row.contractMaterials.length) {
        this.dataSource1 = row.contractMaterials.map(item => ({ ...item, fileList: item.fileName ? [
          {
            name: item.fileName,
            uid: item.fileId,
            url: downloadurl + item.fileUrl
          }] : [] }))
      }
      this.visible = true
    },
    /**
     * 删除合同信息
     * @date 2021-05-11 11:40:00
     * @author zxp
     */
    async del(id) {
      id = typeof id === 'object' ? id.map(item => item.id).join() : id
      await delContractData(id)
      this.getContractList()
      this.getContractType()
    },
    /**
     * 文件上传前的回调
     * @date 2021-05-11 11:40:00
     * @author zxp
     */
    beforeUpload(file, mode) {
      console.log(file, mode)
      return new Promise((resolve, reject) => {
        const typeArr = [
          'image/png',
          'image/jpeg',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ]
        const type = typeArr.includes(file.type)
        const size = file.size / 1024 / 1024
        const isExcel = ['xlsx', 'xls'].some(item => file.name.indexOf(item) !== -1)
        if (!type && !mode) {
          this.$message.error('请选择 png、xlsx、docx、pdf 文件上传！')
          return reject(false)
        }
        if (mode && !isExcel) {
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
     * 上传文件状态改变
     * @date 2021-05-11 11:40:00
     * @author zxp
     */
    onChange(row, { file, fileList }) {
      row.fileList = [...fileList]
      if (file.status === 'done') row.fileList[0].url = downloadurl + row.fileList[0].response.data.url
    },
    /**
     * 删除文件
     * @date 2021-05-11 11:40:00
     * @author zxp
     */
    remove(file) {
      if (!file.fileList.length) return
      const id = file.fileId ? file.fileId : file.fileList[0].response.data.id
      delFile([id])
    },
    /**
     * 添加文件弹窗显示
     * @date 2021-05-11 11:40:00
     * @author zxp
     */
    addFile() {
      if (!this.fileName.trim()) return this.$message.warning('请输入文件名称！')
      this.dataSource1.push({ id: Date.now(), name: this.fileName, fileList: [], editable: false })
      this.visible1 = false
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
        this.dataSource = data.result.map(item => ({ ...item, type: +item.type }))
        this.dataSource.forEach(item => item.contractMaterials.map(item => { item.editable = false }))
        this.params.page.total = data.total
        console.log(data)
      } catch (err) {
        this.dataSource = []
        this.params.page.total = 0
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
      const { current, pageSize } = pagination
      this.params.page = { current, pageSize }
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
            avoidLabelOverlap: false,
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
    }
  },
  watch: {
    visible1() {
      this.fileName = ''
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
</style>
