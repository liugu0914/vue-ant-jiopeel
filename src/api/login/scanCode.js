import { request, METHOD } from '@/utils/request.js'

const prefix = '/sys/scanCode'


/**
 * 更新二维码状态
 */
export async function updCode(data) {
  return await request(`${prefix}/updCode`, METHOD.GET, data)
}
