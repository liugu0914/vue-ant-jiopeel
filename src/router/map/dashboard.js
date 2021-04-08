// 默认子页面 - 工作台
export default {
  fullPath: '/dashboard',
  path: '/dashboard',
  name: 'dashboard',
  component: () => import('@/views/dashboard/main.vue'),
  meta: {
    breadcrumb: [{ id: 'dashboard', name: '工作台' }],
    name: '工作台',
    page: {
      closable: false
    }
  }
}
