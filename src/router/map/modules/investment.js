/**
 *  投资管理模块
 */

// investment 路径
const path = 'views/pages/investment'

export default {
  // 可研报批
  keyan: {
    path: '/keyan',
    name: 'keyan',
    component: () => import(`@/${path}/keyan`)
  },
  // 初步设计
  initialDesign: {
    path: '/initialDesign',
    name: 'initialDesign',
    component: () => import(`@/${path}/initialDesign`)
  },
  // 工程变更审批
  projectChange: {
    path: '/projectChange',
    name: 'projectChange',
    component: () => import(`@/${path}/projectChange`)
  },
  // 设备材料采购
  materialPurchase: {
    path: '/materialPurchase',
    name: 'materialPurchase',
    component: () => import(`@/${path}/materialPurchase`)
  },
  // 询价认价
  inquiry: {
    path: '/inquiry',
    name: 'inquiry',
    component: () => import(`@/${path}/inquiry`)
  },
  // 竣工决算
  completion: {
    path: '/completion',
    name: 'completion',
    component: () => import(`@/${path}/completion`)
  }
}
