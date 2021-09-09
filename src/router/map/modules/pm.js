/**
 *  项目管理模块
 */

// pm 路径
const path = 'views/pages/pm'

export default {
  // 项目信息
  projectInfo: {
    path: '/projectInfo',
    name: 'projectInfo',
    component: () => import(`@/${path}/projectInfo`)
  },
  // 审批人设置
  approvalset: {
    path: '/approvalset',
    name: 'approvalset',
    component: () => import(`@/${path}/approvalset`)
  },
  // 节点管理
  nodeManagement: {
    path: '/nodeManagement',
    name: 'nodeManagement',
    component: () => import(`@/${path}/nodeManagement`)
  },
  // 项目类型
  projectType: {
    path: '/projectType',
    name: 'projectType',
    component: () => import(`@/${path}/projectType`)
  },
  // 任务管理
  taskManagement: {
    path: '/taskManagement',
    name: 'taskManagement',
    component: () => import(`@/${path}/taskManagement`)
  },
  // 任务类型
  taskType: {
    path: '/taskType',
    name: 'taskType',
    component: () => import(`@/${path}/taskType`)
  },
  // 项目统计配置
  projectStatistics: {
    path: '/projectStatistics',
    name: 'projectStatistics',
    component: () => import(`@/${path}/projectStatistics`)
  },
  // 项目配置
  projectConfig: {
    path: '/projectConfig',
    name: 'projectConfig',
    component: () => import(`@/${path}/projectConfig`)
  }
}
