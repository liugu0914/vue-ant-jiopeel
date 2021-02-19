/**
 *  为 ant 版本
 */
import Vue from 'vue'
import Antd from 'ant-design-vue'
import App from '@/App.vue'
import '@/theme/index.less'
import 'animate.css/source/animate.css'
import store from '@/store'
import { initRouter } from '@/router' // 路由器
import { initI18n } from '@/utils/i18n'
import Plugins from '@/plugins'
import bootstrap from '@/bootstrap'

Vue.config.productionTip = false

const router = initRouter()
const i18n = initI18n('CN', 'US')

Vue.use(Antd)
Vue.use(Plugins)

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
