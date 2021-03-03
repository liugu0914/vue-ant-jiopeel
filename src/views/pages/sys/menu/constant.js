import { getAsyncApps, getAsyncMenus } from './async'
/**
 * 表头
 * @date 2021-2-26 10:23:26
 * @author lyc
 */
export const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    customRender: (text, record, index) => index + 1
  },
  {
    title: '菜单名称',
    dataIndex: 'name',
    dataType: 'tree',
    searchAble: true,
    search: {
      name: 'id',
      async: getAsyncMenus // 异步加载数据
    },
    disable: true
  },
  {
    title: '菜单图标',
    dataIndex: 'icon',
    scopedSlots: { customRender: 'icon' }
  },
  {
    title: '路由别称',
    dataIndex: 'router',
    searchAble: true
  },
  {
    title: '菜单顺序',
    dataIndex: 'orderNum'
  },
  {
    title: '所属应用',
    dataIndex: 'appName',
    searchAble: true,
    dataType: 'select',
    search: {
      name: 'appId',
      async: getAsyncApps, // 异步加载数据
      multiple: true
    }
  },
  {
    title: '是否可用',
    dataIndex: 'enable',
    scopedSlots: { customRender: 'enable' },
    disable: true
  },
  {
    title: '操作',
    dataIndex: 'ops',
    scopedSlots: { customRender: 'action' },
    disable: true
  }
]


/**
 * 表头
 * @date 2021-2-26 10:23:26
 * @author lyc
 */
export const defaultForm = {
  id: undefined,
  name: undefined,
  icon: undefined,
  parent: '1',
  router: undefined,
  superId: undefined,
  orderNum: undefined,
  appId: undefined,
  enable: '1'
}
