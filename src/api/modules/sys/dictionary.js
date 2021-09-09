/**
 * 数据字典 - 接口
 * @author lyc
 * @date 2021年3月1日16:54:36
 */
import { request, METHOD } from '@/utils/request.js'

const prefix = '/sys/admin/sysConfig'

/**
 * 获取分页数据
 * @param { param: {需要查询的数据} , page: { pageNum: 第几页, pageSize: 每页大小} } params
 */
export async function getList(params) {
  return await request(`${prefix}/getList`, METHOD.POST, params)
}


/**
 * 通过Id查询数据

 */
export async function getSysConfigById(id) {
  return await request(`${prefix}/getSysConfigById`, METHOD.GET, { id })
}

/**
 * 保存数据

 */
export async function saveSysConfig(params) {
  return await request(`${prefix}/saveSysConfig`, METHOD.POST, params)
}


/**
 * 删除数据
 */
export async function delSysConfig(ids) {
  return await request(`${prefix}/delSysConfig`, METHOD.GET, { ids })
}



/**
 * 根据主表Id获取子表信息
 */
export async function getDetailsById(id) {
  return await request(`${prefix}/getDetailsById`, METHOD.GET, { id })
}


/**
 * 根据子表Id获取信息
 */
export async function getDetailInfoById(id) {
  return await request(`${prefix}/getDetailInfoById`, METHOD.GET, { id })
}


/**
 * 保存数据

 */
export async function saveSysConfigDetail(params) {
  return await request(`${prefix}/saveSysConfigDetail`, METHOD.POST, params)
}


/**
 * 删除数据
 */
export async function delSysConfigDetail(ids) {
  return await request(`${prefix}/delSysConfigDetail`, METHOD.GET, { ids })
}


/**
 * 通过别称获取数据
 */
export async function getSysConfigByAlias(alias) {
  return await request(`${prefix}/getSysConfigByAlias`, METHOD.GET, { alias })
}
