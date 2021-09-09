// 单独页面
export default [
  // 大屏展示
  {
    fullPath: '/bigScreen',
    path: '/bigScreen',
    name: 'bigScreen',
    component: () => import('@/views/bigScreen'),
    meta: {
      breadcrumb: [{ id: 'bigScreen', name: '大屏展示' }],
      name: '大屏展示'
    }
  }
]
