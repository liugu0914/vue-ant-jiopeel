// 引入echarts
import * as echarts from 'echarts'

const Echart = {
  install(Vue) {
    Vue.prototype.$echarts = echarts
    Vue.mixin({
      data() {
        return {
          resizeFlag: 0
        }
      },
      methods: {
        // 监听窗口尺寸变化
        resizeChangeHandler() {
          this.resizeFlag++
        }
      },
      created() {
        window.addEventListener('resize', this.resizeChangeHandler)
      },
      activated() {
        window.addEventListener('resize', this.resizeChangeHandler)
      },
      deactivated() {
        window.removeEventListener('resize', this.resizeChangeHandler)
      }
    })
  }
}

export default Echart
