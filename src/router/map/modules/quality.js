/**
 *  质量管理模块
 */

// quality 路径
const path = 'views/pages/quality'

export default {
  // 设计方案报批
  designScheme: {
    path: '/designScheme',
    name: 'designScheme',
    component: () => import(`@/${path}/designScheme`)
  },
  // 施工图审查
  workingDrawing: {
    path: '/workingDrawing',
    name: 'workingDrawing',
    component: () => import(`@/${path}/workingDrawing`)
  },
  // 质量安全监督
  qualitySafety: {
    path: '/qualitySafety',
    name: 'qualitySafety',
    component: () => import(`@/${path}/qualitySafety`)
  },
  // 专项方案认证
  specialProgram: {
    path: '/specialProgram',
    name: 'specialProgram',
    component: () => import(`@/${path}/specialProgram`)
  },
  // 工程监理
  projectSupervision: {
    path: '/projectSupervision',
    name: 'projectSupervision',
    component: () => import(`@/${path}/projectSupervision`)
  },
  // 工程验收
  acceptanceWorks: {
    path: '/acceptanceWorks ',
    name: 'acceptanceWorks ',
    component: () => import(`@/${path}/acceptanceWorks`)
  }
}
