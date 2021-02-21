import { request, METHOD, CONTENT_TYPE } from '@/utils/request.js'

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
    return await request('/oauth', METHOD.GET, { grantType })
  }
  /**
   * 后端认证
   */
  static async authRedirect(grantType, code) {
    return await request(`/oauth/redirect/${grantType}`, METHOD.GET, { code })
  }
  /**
   * 登录
   */
  static async login(data) {
    return await request({
      url: '/login',
      method: METHOD.POST,
      data,
      headers: { 'Content-Type': CONTENT_TYPE.FORM }
    })
  }
  /**
   * 注册
   */
  static async register(data) {
    return await request({
      url: '/register',
      method: METHOD.POST,
      data,
      headers: { 'Content-Type': CONTENT_TYPE.FORM }
    })
  }
  /**
   * 重置密码
   */
  static async resetPassword(data) {
    return await request({
      url: '/resetPassword',
      method: METHOD.POST,
      data,
      headers: { 'Content-Type': CONTENT_TYPE.FORM }
    })
  }
  /**
   * 退出
   */
  static async logout() {
    return await request('/logout', METHOD.GET)
  }
}

export default Oauth
