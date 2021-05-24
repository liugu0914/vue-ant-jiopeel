<template>
  <a-card>
    <a-button class="management" @click="management">
      监控设备管理
    </a-button>
    <!-- 百度地图容器 -->
    <div class="map-box" style="width: 100%; height: calc(100vh - 200px)">
      <Map ref="baidu-map" />
    </div>
    <!-- 监控设备列表弹窗 -->
    <modal v-model="visible" title="监控设备管理" style="transform: translateX(0)" width="100%" top="130" :footer="null" @cancel="visible = false">
      <StandardTable
        :columns="columns"
        placeholder="搜索设备名称/设备编号"
        :data-source="dataSource"
        :loading="loading"
        :pagination="params.page"
        :selected-rows.sync="selectedRows"
        @search="search"
        @change="pageChange"
      >
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
        </template>
        <template slot="action" slot-scope="{record}">
          <a-button type="link" @click="edit(record)">
            修改
          </a-button>
          <a-popconfirm
            title="确定删除该设备？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="del(record.id)"
          >
            <a-button type="link">
              删除
            </a-button>
          </a-popconfirm>
        </template>
      </StandardTable>
    </modal>
    <!-- 新增、修改监控设备弹窗 -->
    <modal v-model="visible1" :title="title" width="400px" @ok="handleOk" @cancel="visible1 = false">
      <a-form-model ref="ruleForm" :model="dataForm" label-align="left">
        <a-row :gutter="[16, 0]">
          <a-col span="24">
            <a-form-model-item
              label="项目名称"
              prop="projectId"
              :rules="{ required: true, message: '项目名称不能为空', trigger: 'blur' }"
            >
              <a-select v-model="dataForm.projectId" class="w-100" placeholder="请选择项目名称">
                <a-select-option v-for="item in projectList" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col span="24">
            <a-form-model-item
              label="设备名称"
              prop="name"
              :rules="{ required: true, message: '设备名称不能为空', trigger: 'blur' }"
            >
              <a-input v-model="dataForm.name" class="w-100" :max-length="255" autocomplete="off" allow-clear placeholder="请输入工设备名称" />
            </a-form-model-item>
          </a-col>
          <a-col span="24">
            <a-form-model-item
              :rules="{ required: true, message: '设备编号不能为空', trigger: 'blur' }"
              label="设备编号"
              prop="monitorNum"
            >
              <a-input v-model="dataForm.monitorNum" class="w-100" :max-length="255" autocomplete="off" allow-clear placeholder="请输入设备编号" />
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
              <a-icon type="environment" class="ml-2" style="cursor: pointer; font-size: 20px" @click="isSelect = true" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </modal>
    <!-- 视频播放弹窗 -->
    <shade :visible.sync="mask" bgc="transparent">
      <!-- 视频盒子 -->
      <div class="container">
        <!-- 当前设备信息 -->
        <div class="title pl-2">
          <span>设备名称：{{ deviceData.name }}</span>
          <span class="ml-2 mr-2">设备编号：{{ deviceData.monitorNum }}</span>
          <span v-if="deviceData.projectName !== ' '">所属项目：{{ deviceData.projectName }}</span>
        </div>

        <!-- 视频播放器 -->
        <div id="video-container" />

        <!-- 摄像头方向控制 -->
        <div v-if="isControl" class="control mt-4">
          <div class="top">
            <a-button @click="control(0)">
              <a-icon type="caret-up" />
            </a-button>
          </div>
          <div class="conter">
            <a-button class="mr-5" @click="control(2)">
              <a-icon type="caret-left" />
            </a-button>
            <a-button @click="control(3)">
              <a-icon type="caret-right" />
            </a-button>
          </div>
          <div class="down">
            <a-button @click="control(1)">
              <a-icon type="caret-down" />
            </a-button>
          </div>
        </div>
      </div>
    </shade>
    <!-- 选择坐标地图 -->
    <map-select :visible="isSelect" @mapClick="mapClick" />
  </a-card>
</template>

<script>
import Modal from '@/components/modal/Modal'
import StandardTable from '@/components/table/StandardTable'
import EZUIKit from 'ezuikit-js'
import Shade from '@/components/shade'
import Map from '@/components/map'
import MapSelect from '@/components/map-select'
import { columns } from './constant'
import { getProjectList, getMonitorList, saveMonitroData, delMonitorData, getAccessToken, startControl, endControl } from '@/api/modules/monitoring/videoMonitoring'
import Lockr from 'lockr'
import { cloneDeep } from '@/utils/tool'
export default {
  components: {
    Modal,
    StandardTable,
    Shade,
    Map,
    MapSelect
  },
  data() {
    return {
      visible: false, // 设备管理抽屉开关
      player: null, // 播放器实例
      mask: false, // 视频遮罩层
      dataForm: {}, // 表单数据
      title: '',
      visible1: false, // 添加、修改设备弹窗开关
      params: { // 分页查询参数
        page: {
          current: 1,
          pageSize: 10,
          total: 0
        },
        query: {
          search: '',
          projectId: ''
        }
      },
      loading: false, // 表格加载状态
      columns, // 表头数据
      dataSource: [], // 表格数据
      selectedRows: [], // 选择的数据
      isSelect: false, // 选择位置地图是否显示
      projectList: [], // 项目列表
      accessToken: Lockr.get('ysyAccessToken') || '',
      deviceData: {}, // 当前播放设备信息
      timer: null, // 定时器标识
      flag: false, // 节流阀
      isControl: false
    }
  },
  async created() {
    try {
      const { data } = await getAccessToken()
      Lockr.set('ysyAccessToken', data)
      console.log(data)
    } catch (err) {
      console.log(err)
    }
  },
  async mounted() {
    await this.getMonitorList()
    this.setLabel()
  },
  methods: {
    /**
     * 设置地图标注
     * @date 2021-05-11 14:07:00
     * @author zxp
     */
    setLabel() {
      // 在线的设备数组
      const onlineDevices = this.dataSource.filter(item => +item.deviceStatus)
      // 创建文本标注
      const labelArr = onlineDevices.map(item => ({
        label: new window.BMapGL.Label('', {
          // 标注所在位置
          position: new window.BMapGL.Point(item.longitude, item.latitude),
          // 偏移量
          offset: new window.BMapGL.Size(-25, -50)
        }),
        device: item
      }))
      // 将标注添加到地图中
      labelArr.forEach(item => {
        // 将标注添加到地图中
        this.$refs['baidu-map'].map.addOverlay(item.label)
        // 修改标注样式
        item.label.setStyle({
          width: '50px',
          height: '70px',
          textAlign: 'center',
          lineHeight: '45px',
          cursor: 'pointer',
          borderRadius: '50%',
          background: 'url(' + require('@/assets/img/shexiangtou.png') + ')',
          backgroundSize: '100% 100%',
          border: 'none',
          color: '#fff'
        })
        item.label.addEventListener('click', () => this.labelClick(item.device))
      })
    },
    /**
     * 标注点击事件
     * @date 2021-05-11 14:07:00
     * @author zxp
     */
    labelClick(item) {
      this.mask = true
      this.$nextTick(() => this.initVideo(item.urlPreview))
      this.deviceData = item
    },
    /**
     * 播放器初始化
     * @date 2021-05-11 14:07:00
     * @author zxp
     */
    initVideo(url) {
      this.player = new EZUIKit.EZUIKitPlayer({
        id: 'video-container', // 视频容器ID
        accessToken: this.accessToken,
        url,
        autoplay: true,
        height: '450px',
        handleSuccess: () => {
          this.isControl = true
        },
        fullScreenCallBack() {
          window.focus()
        }
      })
    },
    /**
     * 表格搜索
     * @date 2021-05-12 08:56:00
     * @author zxp
     */
    search(query) {
      this.params.query = query
      this.getMonitorList()
    },
    /**
     * 分页查询
     * @date 2021-05-11 08:57:00
     * @author zxp
     */
    pageChange(pagination) {
      const { current, pageSize } = pagination
      this.params.page = { current, pageSize }
      this.getMonitorList()
    },
    /**
     * 新增监控设备
     * @date 2021-05-12 9:15:00
     * @author zxp
     */
    add() {
      this.title = '新增监控设备'
      this.dataForm = {}
      this.visible1 = true
    },
    /**
     * 删除监控设备
     * @date 2021-05-12 09:15:00
     * @author zxp
     */
    async del(id) {
      id = typeof id === 'object' ? id.map(item => item.id).join() : id
      await delMonitorData(id)
      await this.getMonitorList()
      this.resetLabel()
    },
    /**
     * 修改监控设备
     * @date 2021-05-12 09:15:00
     * @author zxp
     */
    edit(row) {
      this.title = '修改监控设备'
      this.dataForm = cloneDeep(row)
      this.visible1 = true
    },
    /**
     * 选择地理坐标
     * @date 2021-05-12 10:46:00
     * @author zxp
     */
    mapClick(argus) {
      this.dataForm.longitude = argus[0]
      this.dataForm.latitude = argus[1]
      this.isSelect = false
    },
    /**
     * 获取项目类型
     * @date 2021-05-12 13:50:00
     * @author zxp
     */
    async getProjectList() {
      const { data = [] } = await getProjectList()
      this.projectList = data.map(item => ({ label: item.projectName, value: item.id }))
      columns.find(item => item.dataIndex == 'projectId').search.options = this.projectList
      console.log(this.projectList)
    },
    /**
     * 获取监控设备列表
     * @date 2021-05-12 14:02:00
     * @author zxp
     */
    async getMonitorList() {
      this.loading = true
      try {
        const { data } = await getMonitorList(this.params)
        this.dataSource = data.result
        this.params.page.total = data.total
        console.log(data)
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },
    /**
     * 点击监控设备管理按钮
     * @date 2021-05-12 14:02:00
     * @author zxp
     */
    management() {
      this.visible = true
      this.getProjectList()
    },
    /**
     * 新增、修改监控设备信息
     * @date 2021-05-12 14:22:00
     * @author zxp
     */
    handleOk() {
      // 二次表单校验
      this.$refs.ruleForm.validate(async val => {
        if (!val) return
        await saveMonitroData(this.dataForm)
        await this.getMonitorList()
        this.resetLabel()
        this.visible1 = false
      })
    },
    /**
     * 重置覆盖物
     * @date 2021-05-13 16:10:00
     * @author zxp
     */
    resetLabel() {
      this.$refs['baidu-map'].map.clearOverlays()
      this.setLabel()
    },
    /**
     * 控制摄像头
     * @date 2021-05-14 10:23:00
     * @author zxp
     */
    async control(direction) {
      // 获取accessToken
      const accessToken = this.accessToken
      // 获取当前设备序列号
      const deviceSerial = this.deviceData.monitorNum
      // 清除定时器
      clearTimeout(this.timer)
      // 如果当前正在控制设备就停止当前控制
      if (this.flag) await endControl({ accessToken, deviceSerial, channelNo: 1 }).over()
      // 打开节流阀，表示开始控制设备
      this.flag = true
      // 发送请求控制监控设备
      await startControl({ accessToken, deviceSerial, channelNo: 1, direction, speed: 1 }).then(res => {
        const { data: { code, msg }} = res
        if (code != 200) this.$message.warning(msg)
      }).over()
      // 700 毫秒后自动停止当前控制
      this.timer = setTimeout(() => {
        endControl({ accessToken: this.accessToken, deviceSerial, channelNo: 1 }).over()
        this.flag = false
      }, 700)
    },
    /**
     * 键盘控制摄像头
     * @date 2021-05-14 14:40:00
     * @author zxp
     */
    keyboard(e) {
      if (!this.isControl) return
      switch (e.keyCode) {
        case 38: this.control(0); break
        case 40: this.control(1); break
        case 37: this.control(2); break
        case 39: this.control(3); break
      }
    }
  },
  watch: {
    mask(val) {
      if (val) {
        window.addEventListener('keyup', this.keyboard)
      } else {
        window.removeEventListener('keyup', this.keyboard)
        this.player = null
        this.isControl = false
      }
    }
  }
}
</script>
<style scoped lang="less">
.control {
 text-align: center;
 div {
   margin-top: 10px;
 }
}

.management {
  position: absolute;
  top: 40px;
  right: 40px;
  z-index: 6;
}

.container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  .title {
    height: 48px;
    line-height: 48px;
    color: #fff;
    background-color: #333333;
  }
  #video-container {
    width: 100%;
    height: 450px;
  }
}

.address {
  /deep/
  label {
    visibility: hidden;
  }
}
</style>
