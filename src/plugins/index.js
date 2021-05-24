import VueI18nPlugin from './i18n-extend'
import AuthorityPlugin from './authority-plugin'
import TabsPagePlugin from './tabs-page-plugin'
import PromisePlugs from './promise-plugs'
import Echart from './echart'
import SlideVerify from 'vue-monoplasty-slide-verify'

const Plugins = {
  install: function(Vue) {
    Vue.use(VueI18nPlugin)
    Vue.use(AuthorityPlugin)
    Vue.use(TabsPagePlugin)
    Vue.use(PromisePlugs)
    Vue.use(Echart)
    Vue.use(SlideVerify)
  }
}
export default Plugins
