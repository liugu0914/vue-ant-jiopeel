<template>
  <page-layout avatar="https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png">
    <div slot="headerContent">
      <div class="title">
        {{ welcome.timeFix }}，{{ currUser.userName }}，{{ welcome.message }}
      </div>
      <div>{{ '前端工程师 | 蚂蚁金服-计算服务事业群-VUE平台' }}</div>
    </div>
    <template slot="extra">
      <head-info class="split-right" :title="$t('project')" content="56" />
      <head-info class="split-right" :title="$t('ranking')" content="8/24" />
      <head-info class="split-right" :title="$t('visit')" content="2,223" />
    </template>
    <template>
      <a-row style="margin: 0 -12px">
        <a-col style="padding: 0 12px" :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card class="project-list" :loading="loading" style="margin-bottom: 24px;" :bordered="false" :title="$t('progress')" :body-style="{padding: 0}">
            <a slot="extra">{{ $t('all') }}</a>
            <div>
              <a-card-grid v-for="(item, i) in projects" :key="i">
                <a-card :bordered="false" :body-style="{padding: 0}">
                  <a-card-meta :description="item.desc">
                    <div slot="title" class="card-title">
                      <a-avatar size="small" :src="item.logo" />
                      <span>Alipay</span>
                    </div>
                  </a-card-meta>
                  <div class="project-item">
                    <a class="group" href="/#/">科学搬砖组</a>
                    <span class="datetime">9小时前</span>
                  </div>
                </a-card>
              </a-card-grid>
            </div>
          </a-card>
          <a-card :loading="loading" :title="$t('dynamic')" :bordered="false">
            <a-list>
              <a-list-item v-for="(item, index) in activities" :key="index">
                <a-list-item-meta>
                  <a-avatar slot="avatar" :src="item.avatar" />
                  <div slot="title" v-html="item.template" />
                  <div slot="description">
                    9小时前
                  </div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>
        <a-col style="padding: 0 12px" :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card :title="$t('access')" style="margin-bottom: 24px" :bordered="false" :body-style="{padding: 0}">
            <div class="item-group">
              <a>操作一</a>
              <a>操作二</a>
              <a>操作三</a>
              <a>操作四</a>
              <a>操作五</a>
              <a>操作六</a>
              <a-button size="small" type="primary" ghost icon="plus">
                {{ $t('add') }}
              </a-button>
            </div>
          </a-card>
          <a-card :loading="loading" :title="`XX ${$t('degree')}`" style="margin-bottom: 24px" :bordered="false" :body-style="{padding: 0}">
            <div style="min-height: 400px;">
              <!-- <radar /> -->
            </div>
          </a-card>
          <a-card :loading="loading" :title="$t('team')" :bordered="false">
            <div class="members">
              <a-row>
                <a-col v-for="(item, index) in teams" :key="index" :span="12">
                  <a>
                    <a-avatar size="small" :src="item.avatar" />
                    <span class="member">{{ item.name }}</span>
                  </a>
                </a-col>
              </a-row>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </template>
  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'
import HeadInfo from '@/components/tool/HeadInfo'
// import Radar from '@/components/chart/Radar'
import { mapState } from 'vuex'

export default {
  name: 'WorkPlace',
  components: { HeadInfo, PageLayout },
  i18n: require('./i18n'),
  data() {
    return {
      projects: [],
      loading: false,
      activities: [],
      teams: [],
      welcome: {
        timeFix: '你好',
        message: '要不要打一把 DOTA'
      }
    }
  },
  computed: {
    ...mapState('account', { currUser: 'user' }),
    ...mapState('setting', ['lang'])
  },
  created() {
    for (let index = 0; index < 8; index++) {
      this.activities[index] = {
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
        template: '曲丽丽 在 高逼格设计天团 新建项目 八月迭代'
      }
      this.teams[index] = {
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png',
        name: '科学搬砖组'
      }
      this.projects[index] = {
        desc: '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
        logo: 'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png'
      }
    }
  }
}
</script>

<style lang="less">
@import "index";
</style>
