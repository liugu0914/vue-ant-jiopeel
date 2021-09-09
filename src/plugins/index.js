import VueI18nPlugin from './i18n-extend'
import AuthorityPlugin from './authority-plugin'
import TabsPagePlugin from './tabs-page-plugin'
import PromisePlugs from './promise-plugs'
import Echart from './echart'
import SlideVerify from 'vue-monoplasty-slide-verify'
import IconFont from './icon-font'
import Mixins from './mixin'
import Viewer from './viewer'
import Directive from './directive'
import MyPlugin from './print'

const Plugins = {
  install: function(Vue) {
    Vue.use(VueI18nPlugin)
    Vue.use(AuthorityPlugin)
    Vue.use(TabsPagePlugin)
    Vue.use(PromisePlugs)
    Vue.use(Echart)
    Vue.use(SlideVerify)
    Vue.use(IconFont)
    Vue.use(Mixins)
    Vue.use(Viewer)
    Vue.use(Directive)
    Vue.use(MyPlugin)
  }
}
export default Plugins
