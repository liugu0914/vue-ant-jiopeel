/**
 *  为 ant 版本
 */
import Vue from 'vue'
import Antd from 'ant-design-vue'
// import Lockr from 'lockr'
import App from '@/App.vue'
import '@/theme/index.less'
import store from '@/store'
import router from '@/router' // 路由器
// import Tool from './utils/tool'
// import './permission' // permission control
import { initI18n } from '@/utils/i18n'
import bootstrap from '@/bootstrap'

Vue.config.productionTip = false
// 工具类
// Vue.prototype.$tool = Tool
// // 本地存储
// Vue.prototype.$lockr = Lockr

const i18n = initI18n('CN', 'US')

Vue.use(Antd)

console.log('api ：' + process.env.VUE_APP_BASE_API)
console.log('app start')

bootstrap({ router, store, i18n, message: Vue.prototype.$message })

/**
 *  入口函数 vue 创建 App 组件 挂载在id为app上
 */
new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App)
}).$mount('#app')
