import VueI18nPlugin from './i18n-extend'
import AuthorityPlugin from './authority-plugin'
import TabsPagePlugin from './tabs-page-plugin'
import PromisePlugs from './promise-plugs'
import Tool from '@/utils/tool'
import Lockr from 'lockr'



const Plugins = {
  install: function(Vue) {
    Vue.use(VueI18nPlugin)
    Vue.use(AuthorityPlugin)
    Vue.use(TabsPagePlugin)
    Vue.use(PromisePlugs)
    // 工具类
    Vue.prototype.$tool = Tool
    // 本地存储
    Vue.prototype.$lockr = Lockr
  }
}
export default Plugins
