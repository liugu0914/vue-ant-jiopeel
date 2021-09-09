<template>
  <div class="bigScreen">
    <div class="header">
      <div class="time">
        <span class="date">
          {{ times[0] }}
        </span>
        <span class="week ml-1 mr-1">
          {{ times[1] }}
        </span>
        <span class="hour">
          {{ times[2] }}
        </span>
        <span class="wendu ml-1">
          {{ weather.temp }}℃
        </span>
        <img :src="weather.icon && require(`@/assets/weather/${weather.icon}.png`)">
      </div>
      <a-icon v-if="!isFullscreen" type="fullscreen" @click="fullScreen" />
      <a-icon v-else type="fullscreen-exit" @click="exitFullscreen" />
    </div>
    <div class="row">
      <div class="col">
        <!-- 项目进度总览 -->
        <bg class="project-progress">
          <div class="title ellipsis">
            项目进度总览
          </div>
          <div class="main">
            <!-- 项目数量统计 -->
            <div class="count">
              <div v-for="item in projectProgress" :key="item.name" class="list">
                <span>{{ item.name }}</span>
                <div class="item ellipsis">
                  <span v-for="(count, index) in zeroize(item.value)" :key="index" class="box ml-1">{{ count }}</span>&nbsp;个
                </div>
              </div>
            </div>
            <!-- echarts 图表 -->
            <div class="echarts">
              <chart :data="option1" />
            </div>
          </div>
        </bg>
        <!-- 项目所在位置 -->
        <bg class="project-location">
          <Map ref="baidu-map" style-id="776bae562744cd6bc2ca5934fee9f961" scale="12" />
        </bg>
      </div>
      <div class="col">
        <!-- 年度计划投资 -->
        <bg class="investment-plan">
          <div class="total">
            <div class="invest" />
            <div class="mt-2 mb-2 w-100 ellipsis text-center" style="font-size: 12px">
              <span style="font-size: 26px; color:#00eeef">{{ investmentPlan.money }}</span>（万元）
            </div>
            <span class="w-100 ellipsis text-center">{{ investmentPlan.year }}年计划投资</span>
          </div>
          <div class="echarts">
            <chart :data="option2" />
          </div>
        </bg>
        <!-- 项目审批办理统计 -->
        <bg class="approval-statistics">
          <div class="heade">
            <div class="title ellipsis">
              项目审批办理统计
            </div>
            <div class="businessType">
              <a-tabs v-model="activeKey" size="small" :tab-bar-gutter="0" @change="getProjectApproval">
                <a-tab-pane v-for="item in businessTypeArr" :key="item.value" :tab="item.name" />
              </a-tabs>
            </div>
          </div>
          <div class="main">
            <swiper :key="approvalKey" move height="100%" width="90%" move-width="160">
              <div v-for="(item, index) in approvalStatistics" :key="index" style="display: flex">
                <div v-if="index" class="up-triangle" />
                <div class="node first">
                  <span>{{ item.value }}</span>
                  <span>{{ item.name }}</span>
                </div>
                <div class="triangle" />
              </div>
            </swiper>
          </div>
        </bg>
        <!-- 项目审批流程节点 -->
        <bg class="process-node">
          <div class="heade">
            <div class="title ellipsis">
              项目审批流程节点
            </div>
            <div class="select-project">
              <a-select v-model="selectKey" style="width: 194px" @change="getProjectApplyInfo" @dropdownVisibleChange="dropdownVisibleChange">
                <a-select-option v-for="item in projectInfo" :key="item.id" :value="item.id">
                  {{ item.projectName }}
                </a-select-option>
                <img slot="suffixIcon" src="~@/assets/img/down.png" alt="">
              </a-select>
            </div>
          </div>
          <div class="main">
            <swiper :key="flowKey" height="100%" move-width="80">
              <div v-for="item in projectProcess.projectNodes" :key="item.id" class="node">
                <div class="status" :class="item.state == 3 ? 'done' : !item.state ? 'wait' :'process'" />
                <span class="ellipsis">{{ item.name }}</span>
              </div>
            </swiper>
          </div>
          <div class="footer">
            <div class="project-info">
              <div>已施工 <span style="color: #06e6e8">{{ projectProcess.timeSpent }}</span> 天</div>
              <div>总工期 <span style="color: #06e6e8">{{ projectProcess.totalTime }}</span> 天</div>
            </div>
          </div>
        </bg>
      </div>
      <div class="col">
        <!-- 项目投资金额统计 -->
        <bg class="investment-amount">
          <div class="title ellipsis">
            项目投资金额统计
          </div>
          <div class="heade mt-2">
            <span class="text-center">项目名称</span>
            <span class="text-right pr-2">投资金额（万元）</span>
          </div>
          <div class="main">
            <div v-if="investMoney.length" :key="investMoneyKey" v-move="38">
              <div v-for="item in investMoney" :key="item.id" class="row mt-2">
                <div class="projectName">
                  <img src="~@/assets/img/project.png" alt="" style="margin-right:10px">{{ item.projectName }}
                </div>
                <div class="invest-money">
                  {{ item.investmentMoney }}
                </div>
              </div>
            </div>
          </div>
        </bg>
        <!-- 项目建设类型统计 -->
        <bg class="constructionType-count">
          <div class="title ellipsis">
            项目建设类型统计
          </div>
          <div class="echarts">
            <chart :data="option3" />
          </div>
        </bg>
      </div>
    </div>
    <!-- 视频播放弹窗 -->
    <shade v-model="mask" bgc="transparent" height="650">
      <!-- 视频盒子 -->
      <div class="container">
        <!-- 当前设备信息 -->
        <div class="title pl-2">
          <div>
            <span>设备名称：{{ deviceData.name }}</span>
            <span class="ml-2 mr-2">设备编号：{{ deviceData.monitorNum }}</span>
          </div>
          <span v-if="deviceData.projectName !== ' '" class="ellipsis">所属项目：{{ deviceData.projectName }}</span>
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
  </div>
</template>

<script>
import bg from './bg.vue'
import Chart from '@/components/chart'
import Swiper from '@/components/swiper'
import Shade from '@/components/shade'
import Map from '@/components/map'
import { getProjectSchedule, getInvestmentPlan, getConstructType, getProjectBaseInfo,
  getProjectApproval, getProjectApplyInfo, getSysConfigByAlias, getWeather, getAccessToken,
  startControl, endControl
} from '@/api/modules/bigScreen'
import { option1, option2, option3 } from './constant'
import { dateFormat } from '@/utils/tool'
import EZUIKit from 'ezuikit-js'
export default {
  components: { bg, Chart, Swiper, Map, Shade },
  data() {
    return {
      // 项目进度总览
      projectProgress: [],
      option1,
      // 年度计划投资
      investmentPlan: {},
      option2,
      // 项目建设类型数量统计
      option3,
      // 项目信息统计
      projectInfo: [],
      // 项目投资金额统计
      investMoney: [],
      investMoneyKey: '',
      // 项目审批办理统计
      businessTypeArr: [],
      approvalStatistics: [],
      activeKey: '1',
      approvalKey: '',
      // 项目审批流程节点
      selectKey: '',
      projectProcess: {},
      flowKey: '',
      // 是否全屏
      isFullscreen: false,
      time: dateFormat(new Date(), 'YYYY-mm-dd W HH:MM:SS'), // 当前时间
      weather: {},
      mask: false, // 视频遮罩层
      deviceData: {}, // 当前播放设备信息
      isControl: false,
      player: {},
      accessToken: ''
    }
  },
  created() {
    // 获取项目进度总览
    this.getProjectSchedule()
    // 获取年度投资计划
    this.getInvestmentPlan()

    // 获取项目建设类型数量统计
    this.getConstructType()
    // 获取业务类型数据字典
    this.getSysConfigByAlias()
    // 获取项目审批办理统计
    this.getProjectApproval(this.activeKey)
    // 获取天气
    this.getWeather()
    // 获取 AccessToken
    this.getAccessToken()
  },
  methods: {
    /**
     * 补零函数
     */
    zeroize(num) {
      const arr = num.toString().split('')
      const fillNum = 3 - arr.length
      return fillNum > 0 ? num.toString().padStart(3, 0).split('') : arr
    },
    /**
     * 获取项目进度总览
     */
    async getProjectSchedule() {
      const { data = [] } = await getProjectSchedule()
      this.projectProgress = data
      option1.series[0].data = data.slice(1).map((item, index) => {
        return { ...item, itemStyle: { color: option1.color[index] }}
      })
    },
    /**
     * 获取年度投资计划
     */
    async getInvestmentPlan() {
      const { data = {}} = await getInvestmentPlan()
      this.investmentPlan = data
      const obj = { firstQuarter: '一季度', secondQuarter: '二季度', thirdQuarter: '三季度', fourthQuarter: '四季度' }
      const arr = []
      for (const key in obj) {
        arr.push({ name: obj[key], value: data[key] })
      }
      option2.series[0].data = arr
    },
    /**
     * 获取项目类型统计
     */
    async getConstructType() {
      const { data = [] } = await getConstructType()
      data.reverse()
      option3.yAxis[0].data = data.map(item => item.name)
      option3.series[0].data = data
    },
    /**
     * 获取项目基本信息
     */
    async getProjectBaseInfo() {
      const { data = [] } = await getProjectBaseInfo()
      this.projectInfo = data
      this.investMoney = data.filter(item => item.investmentMoney)
      this.selectKey = data[0].id
      // 获取项目审批流程节点
      this.getProjectApplyInfo(this.selectKey)
    },
    /**
     * 获取业务类型数据字典
     */
    async getSysConfigByAlias() {
      const { data = [] } = await getSysConfigByAlias('businessType')
      this.businessTypeArr = data
    },
    /**
     * 获取项目审批办理统计
     */
    async getProjectApproval(businessType) {
      const { data = [] } = await getProjectApproval(businessType)
      this.approvalStatistics = data
      this.approvalKey = +new Date()
    },
    /**
     * 获取项目审批流程节点
     */
    async getProjectApplyInfo(projectId) {
      const { data = {}} = await getProjectApplyInfo(projectId)
      data.timeSpent = data.timeSpent < 0 ? 0 : data.timeSpent
      data.totalTime = data.totalTime < 0 ? 0 : data.totalTime
      this.projectProcess = data
      this.flowKey = +new Date()
    },
    /**
     * 设置地图标注
     */
    setLabel() {
      // 过滤没有经纬度的项目
      const projectInfo = this.projectInfo.filter(item => item.latitude && item.longitude)
      console.log(this.projectInfo)
      projectInfo.forEach(item => {
        const { monitorDevice } = item
        if (monitorDevice && monitorDevice.length) {
          const find = monitorDevice.find(video => video.deviceStatus == 1)
          item.video = !!find
          item.name = find ? find.name : ''
          item.url = find ? find.urlPreview : ''
          item.monitorNum = find ? find.monitorNum : ''
        }
      })
      // 创建文本标注
      const labelArr = projectInfo.map(item =>
        ({
          label: new window.BMapGL.Label(`<div class="label">${item.projectName}</div>`, {
          // 标注所在位置
            position: new window.BMapGL.Point(item.longitude, item.latitude)
          // 偏移量
          // offset: new window.BMapGL.Size(-25, -50)
          }),
          projectInfo: item
        })
      )
      // 将标注添加到地图中
      labelArr.forEach(item => {
        const { video } = item.projectInfo
        // 修改标注样式
        item.label.setStyle({
          // padding: '5px 0 0 10px',
          width: '20px',
          height: '20px',
          cursor: 'pointer',
          borderRadius: '50%',
          background: 'url(' + require(`@/assets/img/map${video ? '2' : '1'}.png`) + ') no-repeat center',
          backgroundSize: '100% 100%',
          // background: '#00fcfd',
          border: 'none'
        })
        // 将标注添加到地图中
        this.$refs['baidu-map'] && this.$refs['baidu-map'].map.addOverlay(item.label)
        // item.label.setTitle(item.name)
        item.label.addEventListener('mouseover', (e) => {
          const label = e.target.domElement.querySelector('.label')
          label.style.display = 'block'
        })
        item.label.addEventListener('mouseout', (e) => {
          const label = e.target.domElement.querySelector('.label')
          label.style.display = 'none'
        })
        item.label.addEventListener('click', () => this.labelClick(item.projectInfo))
      })
    },
    /**
     * 点击定位
     */
    labelClick(data) {
      const { video, url } = data
      if (!video) return
      this.mask = true
      this.$nextTick(() => this.initVideo(url))
      this.deviceData = data
    },
    /**
     * 全屏
     */
    fullScreen() {
      const element = document.documentElement
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen()
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen()
      }
    },
    /**
     * 退出全屏
     */
    exitFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      }
    },
    /**
     * 重置
     */
    reset() {
      this.investMoneyKey = +new Date()
    },
    /**
     * 下拉选择器箭头动画
     */
    dropdownVisibleChange(open) {
      const arrow = document.querySelector('.ant-select-arrow')
      arrow.style.transform = `rotate(${open ? 180 : 0}deg)`
    },
    /**
     * 获取时间
     */
    getTime() {
      this.time = dateFormat(new Date(), 'YYYY-mm-dd W HH:MM:SS')
    },
    /**
     * 获取天气信息
     */
    async getWeather() {
      const { data } = await getWeather()
      this.weather = data.now
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
     * 获取 AccessToken
     */
    async getAccessToken() {
      const { data } = await getAccessToken()
      this.accessToken = data
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
    }
  },
  async mounted() {
    // 获取项目基本信息
    await this.getProjectBaseInfo()
    setTimeout(this.setLabel, 300)
    document.addEventListener('fullscreenchange', e => {
      // 监听到屏幕变化，在回调中判断是否已退出全屏
      this.isFullscreen = !this.isFullscreen
    })
    window.addEventListener('resize', this.reset)
    setInterval(this.getTime, 500)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.reset)
    clearInterval(this.getTime)
  },
  computed: {
    times() {
      return this.time.split(' ')
    }
  },
  watch: {
    mask(val) {
      if (!val) this.isControl = false
    }
  }
}
</script>
<style scoped lang="less">
.bigScreen {
  height: 100%;
  background-color: #03192b;
  .header {
    position: relative;
    margin-bottom: 20px;
    height: 86px;
    background: url('~@/assets/img/header.png') no-repeat center;
    i {
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      font-size: 20px;
      color: #fff;
      cursor: pointer;
    }
  }
  .row {
    display: flex;
    padding: 0 18px;
    height: calc(100% - 86px - 20px);
    color: #fff;
    .col {
      display: flex;
      flex-direction: column;
      flex: 1;
      margin-left: 20px;
      height: 100%;
      &:first-child {
        margin: 0;
      }
    }
  }
}

.project-progress {
  display: flex;
  flex-direction: column;
  height: 35%;
  .main {
    display: flex;
    flex: 1;
    .count {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      width: 40%;
    }
    .echarts {
      flex: 1;
    }
  }
}

.project-location {
  flex: 1;
}

.investment-plan {
  display: flex;
  height: 35%;
  .total {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 30%;
    .invest {
      width: 43px;
      height: 34px;
      background:url('~@/assets/img/invest.png') no-repeat;
    }
  }
  .echarts {
    flex: 1;
  }
}

.approval-statistics, .process-node {
  flex: 1;
}

.approval-statistics {
  display: flex;
  flex-direction: column;
  .heade {
    display: flex;
    justify-content: space-between;
    /deep/ .ant-tabs-bar {
      margin: 0;
      border: 0;
    }
    /deep/ .ant-tabs-nav {
      color: #fff;
      .ant-tabs-tab {
        padding: 3px 5px;
        &:hover {
          color: #06e6e8;
        }
      }
      .ant-tabs-tab-active {
        color: #06e6e8;
        border-bottom: 2px solid #06e6e8;
      }
    }
    /deep/ .ant-tabs-ink-bar {
      bottom: 0;
    }
  }
  .main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    .node {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 140px;
      height: 76px;
      background-color: #088ca0;
    }
    .up-triangle, .triangle {
      border-width: 38px 0 38px 20px;
      border-style: solid;
      border-color: #052845 #052845 #052845 transparent;
    }
    .up-triangle {
      border-color:  transparent  transparent transparent #052845;
      & + .node {
        width: 120px;
      }
    }
    /deep/ .move {
      background-color: #088ca0;
    }
  }
}

.process-node {
  position: relative;
  display: flex;
  flex-direction: column;
  .heade {
    display: flex;
    justify-content: space-between;
    /deep/ .ant-select-selection {
      color: #fff;
      border-color:  #026473;
      background-color: #087484;
    }
  }
  .main {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    .node {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-left: 20px;
      width: 60px;
      .status {
        position: relative;
        margin-bottom: 10px;
        width: 38px;
        height: 38px;
        background-size: 100%;
        &::before {
          position: absolute;
          top: 50%;
          left: -46px;
          transform: translateY(-50%);
          content: '';
          width: 46px;
          height: 8px;
          background-color: #29d285;
          opacity: 0.2;
        }
        &.done {
          background: url(~@/assets/img/done.png);
          &::before {
            opacity: 1;
          }
        }
        &.process {
          background: url(~@/assets/img/process.png);
        }
        &.wait {
          background: url(~@/assets/img/wait.png);
        }
      }
      &:first-child {
        margin: 0;
        .status {
          &::before {
            width: 0;
          }
        }
      }
    }
  }
  .footer {
    position: absolute;
    width: calc(100% - 40px);
    bottom: 10px;
  }
  .project-info {
    display: flex;
    justify-content: space-around;
    div {
      position: relative;
      padding-left: 10px;
      &::before {
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        content: '';
        width: 5px;
        height: 16px;
        background-color: #06e6e8;
        border-radius: 3px;
      }
    }
  }
}

.investment-amount {
  display: flex;
  flex-direction: column;
  height: 50%;
  font-size: 16px;
  .heade {
    display: flex;
    height: 36px;
    line-height: 32px;
    background-color: #087484;
    border: 2px solid #1395ac;
    border-left-color: transparent;
    border-right-color: transparent;
    span {
      flex: 1;
    }
  }
  .main {
    height: calc(100% - 75px);
    overflow: hidden;
    .row {
      display: flex;
      justify-content: space-between;
      padding: 0 24px;
      height: 26px;
      line-height: 26px;
      font-size: 14px;
      img {
        width: 18px;
        height: 18px;
      }
      .invest-money {
        color: #00eeef;
      }
    }
    &:hover {
      .move {
        animation-play-state: paused;
      }
    }
  }
}

.constructionType-count {
  display: flex;
  flex-direction: column;
  flex: 1;
  .echarts {
    flex: 1;
  }
}

.title {
  font-size: 18px;
  color: #9af4f5;
}

.list {
  display: flex;
  align-items: center;
  .item {
    text-align: center;
    flex: 1;
  }
}

.box {
  display: inline-block;
  max-width: 28px;
	width: 20%;
	height: 32px;
  text-align: center;
  line-height: 30px;
  font-size: 16px;
  font-weight: 700;
	box-shadow: inset 0px 2px 5px #0f2e52, inset 2px 0px 5px #0f2e52,inset 0px -2px 5px #0f2e52,inset 2px 0px 5px #0f2e52;
	border: 1px solid #1c3583;
  border-radius: 4px;
}

@keyframes move {
  0% {
    transform: translateY(6px);
  }
  100% {
    transform: translateY(-50%);
  }
}

.move {
  animation: move 0s linear infinite;
}

/deep/ .ant-select-arrow {
  margin-top: -4px;
  transition: transform .3s;
}

.time {
  position: absolute;
  top: 3px;
  left: 1.2%;
  color: #2dc4bb;
  img {
    margin-top: -3px;
    width: 20px;
  }
}

/deep/ .label {
  display: none;
  position: absolute;
  top: -20px;
  transform: translateX(-45%);
}

.container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  .title {
    display: flex;
    height: 48px;
    line-height: 48px;
    color: #fff;
    background-color: #333333;
    > span {
      flex: 1;
    }
  }
  #video-container {
    width: 100%;
    height: 450px;
  }
}

.control {
 text-align: center;
 div {
   margin-top: 10px;
 }
}

</style>
