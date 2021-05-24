<template>
  <div ref="myChart" class="public-chart" />
</template>

<script>
export default {
  name: '',

  data() {
    return {
      myChart: null
    }
  },

  props: {
    data: {
      type: Object,
      default: null
    },
    // resizeFlag: {
    //   type: Number,
    //   default: 0
    // },
    group: {
      type: String,
      default: ''
    }
  },

  watch: {
    data: {
      handler(val) {
        if (val) {
          if (!this.myChart) {
            this.$nextTick(() => {
              this.myChart = this.$echarts.init(this.$refs.myChart)
              if (this.group) {
                this.myChart.group = this.group
              }
              this.setChartOption()
            })
          } else {
            this.setChartOption()
          }
        }
      },
      deep: true,
      immediate: true
    },
    resizeFlag() {
      if (this.myChart) {
        this.myChart.resize()
      }
    }
  },

  methods: {
    setChartOption() {
      this.myChart.setOption(this.data, true)
    }
  }
}
</script>

<style lang="less" scoped>
.public-chart {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
