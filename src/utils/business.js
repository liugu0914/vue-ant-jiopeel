
/**
 * 封装后台分页数据
 * @param {Object} data
 */
export function BoxPage(data) {
  return { current: data.current, pageSize: data.pageSize, total: data.total }
}
