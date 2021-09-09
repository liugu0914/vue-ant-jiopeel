import { Icon } from 'ant-design-vue'
const MyIcon = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2541210_7g85om6s5om.js' // 在 iconfont.cn 上生成
})

const iconFont = {
  install(Vue) {
    Vue.component('my-icon', MyIcon)
  }
}

export default iconFont
