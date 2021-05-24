/**
 *  合同管理模块
 */

// contract 路径
const path = 'views/pages/contract'

export default {
  contract: {
    path: '/contract',
    name: 'contract',
    component: () => import(`@/${path}/index.vue`)
  }
}
