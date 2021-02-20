import { request, METHOD } from '@/utils/request.js'


/**
 * 获取菜单数据
 */
export async function getMenus() {
  return await request('/admin/menu/getList', METHOD.GET)
}



/**
 * test
 */
export async function test() {
  return await request('/admin/menu/test', METHOD.GET)
}
