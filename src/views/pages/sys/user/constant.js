import { getAsyncDepts } from './async'

/**
 * 表头
 * @date 2021-2-26 10:23:26
 * @author lyc
 */
export const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    customRender: (text, record, index) => index + 1,
    disable: true
  },
  {
    title: '头像',
    dataIndex: 'imgUrl',
    scopedSlots: { customRender: 'imgUrl' },
    disable: true
  },
  {
    title: '用户名称',
    dataIndex: 'userName',
    searchAble: true,
    disable: true
  },
  {
    title: '账号',
    dataIndex: 'account',
    searchAble: true,
    customRender: (text) => text
  },
  {
    title: '部门',
    dataIndex: 'deptName',
    dataType: 'tree',
    searchAble: true,
    search: {
      name: 'deptId',
      async: getAsyncDepts // 异步加载数据
    }
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    searchAble: true
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
  imgUrl: undefined,
  phone: undefined,
  idCard: undefined,
  account: undefined,
  email: undefined,
  deptId: undefined,
  type: undefined,
  userName: undefined,
  enable: '1'
}
