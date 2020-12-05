import request from '@/api/request.js'

/**
 *  主页面查询
 * @author lyc
 * @date 2020-11-6
 */
class Main {
  /**
   * 获取菜单数据
   */
  static async getMenus() {
    return await request({
      url: '/admin/menu/getList',
      method: 'post'
    })
  }
}

export default Main
