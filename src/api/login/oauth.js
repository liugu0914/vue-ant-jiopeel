import request from '@/api/request.js'

/**
 *  用户授权接口
 * @author lyc
 * @date 2020-11-6
 */
class Oauth {
  /**
   * 获取授权地址
   */
  static async getAuthUrl(grantType) {
    return await request({
      url: '/oauth',
      method: 'get',
      params: { grantType }
    })
  }
  /**
   * 后端认证
   */
  static async authRedirect(grantType, code) {
    return await request({
      url: `/oauth/redirect/${grantType}`,
      method: 'get',
      params: { code }
    })
  }
  /**
   * 登录
   */
  static async login(data) {
    return await request({
      url: '/login',
      method: 'post',
      data
    })
  }
  /**
   * 注册
   */
  static async register(data) {
    return await request({
      url: '/register',
      method: 'POST',
      data
    })
  }
  /**
   * 重置密码
   */
  static async resetPassword(data) {
    return await request({
      url: '/resetPassword',
      method: 'POST',
      data
    })
  }
  /**
   * 退出
   */
  static async logout() {
    return await request({
      url: '/logout',
      method: 'get'
    })
  }
}

export default Oauth
