<template>
  <div class="header">
    <a-row type="flex" justify="space-between">
      <a-col>
        <!-- <div class="logo" @click="$route.path !== '/dashboard' && $router.push('/dashboard')"> -->
        <div class="logo ellipsis">
          宿迁市中心城市西南片区项目工程管理平台
        </div>
      </a-col>
      <a-col>
        <div class="weather">
          <span class="city">
            宿迁市
          </span>
          <div v-for="(item,index) in threeDaysWeather" :key="index" class="item" style="margin-right:28px">
            <div class="img" :style="{backgroundImage: `url('${require(`@/assets/three-weather/${item.iconDay}.png`)}')`}" />
            <div class="day">
              <span>{{ item.day }}</span><br>
              <span>{{ item.tempMin }}~{{ item.tempMax }}℃</span>
            </div>
          </div>
        </div>
      </a-col>
      <a-col>
        <user-info />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import UserInfo from './UserInfo'
import { getThreeDaysWeather } from '@/api/modules/bigScreen'
import Cookie from 'js-cookie'

export default {
  components: {
    UserInfo
  },
  data() {
    return {
      threeDaysWeather: Cookie.get(process.env.VUE_APP_WEATHER) && JSON.parse(Cookie.get(process.env.VUE_APP_WEATHER)) || []
    }
  },
  created() {
    this.getThreeDaysWeather()
  },
  methods: {
    /**
     * 获取三天天气
     */
    async getThreeDaysWeather() {
      if (this.threeDaysWeather.length) return
      const { data } = await getThreeDaysWeather()
      const threeDaysWeather = data.daily.map(item => ({ tempMin: item.tempMin, tempMax: item.tempMax, iconDay: item.iconDay }))
      threeDaysWeather.forEach((item, index) => (item.day = ['今天', '明天', '后天'][index]))
      this.threeDaysWeather = threeDaysWeather
      Cookie.set(process.env.VUE_APP_WEATHER, threeDaysWeather, {
        expires: 0.5,
        path: '/'
      })
    }
  }
}
</script>
<style scoped lang="less">
.header {
  padding: 0 20px;
  height: 64px;
  color: rgba(255,255,255, .99);
  background-color: @primary-color;
  .logo {
    // padding-left: 190px;
    font-size: 24px;
    line-height: 64px;
    letter-spacing: 2px;
    // background: url('~@/assets/logo.png') no-repeat left center;
    background-size: auto 40px;
    // cursor: pointer;
    p {
      margin: 0;
    }
  }
  .weather {
    display: flex;
    align-items: center;
    height: 100%;
    .city {
      margin-right: 28px;
      font-size: 17px;
    }
    .item {
      display: flex;
      align-items: center;
      font-size: 12px;
      .img {
        width: 50px;
        height: 50px;
        background-size: 100% auto;
        background-repeat: no-repeat;
        background-position: center;
      }
    }
  }
}
</style>
