/**
 *  实时监控模块
 */

// monitoring 路径
const path = 'views/pages/monitoring'

export default {
  // 视频监控
  videoMonitoring: {
    path: '/videoMonitoring',
    name: 'videoMonitoring',
    component: () => import(`@/${path}/videoMonitoring`)
  },
  // 实名制管理
  realName: {
    path: '/realName',
    name: 'realName',
    component: () => import(`@/${path}/realName`)
  }
}
