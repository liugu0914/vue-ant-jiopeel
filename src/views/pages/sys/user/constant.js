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
    disable: true,
    dataType: 'month'
  },
  {
    title: '账号',
    dataIndex: 'account',
    customRender: (text) => text,
    searchAble: true,
    dataType: 'date'
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    searchAble: true,
    dataType: 'range',
    search: {
      name: 'date'
    }
  },
  {
    title: '类型',
    dataIndex: 'type',
    searchAble: true,
    dataType: 'select',
    search: {
      options: [
        { label: '已下单', value: 1 },
        { label: '已付款', value: 2 },
        { label: '已审核', value: 3 },
        { label: '已发货', value: 4 }
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
  id: '',
  description: '',
  callNo: '',
  updatedAt: ''
}
