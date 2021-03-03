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
    title: '邮箱',
    dataIndex: 'email',
    searchAble: true
  },
  {
    title: '类型',
    dataIndex: 'type',
    searchAble: true,
    dataType: 'select',
    search: {
      name: 'typeSearch',
      options: [
        { label: 'gitee', value: 'gitee' },
        { label: 'github', value: 'github' },
        { label: 'weixin', value: 'weixin' },
        { label: 'local', value: 'local' }
      ],
      multiple: true
    }
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
  account: undefined,
  email: undefined,
  type: undefined,
  userName: undefined,
  enable: '1'
}
