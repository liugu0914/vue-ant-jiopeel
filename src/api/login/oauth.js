import { request, METHOD } from '@/utils/request.js'

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
    return await request('/login', METHOD.POST, data)
  }
  /**
   * 注册
   */
  static async register(data) {
    return await request('/register', METHOD.POST, data)
  }
  /**
   * 重置密码
   */
  static async resetPassword(data) {
    return await request('/resetPassword', METHOD.POST, data)
  }
  /**
   * 退出
   */
  static async logout() {
    return await request('/logout', METHOD.GET)
  }
}

export default Oauth
