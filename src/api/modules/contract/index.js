// 合同管理接口
import { request, METHOD, exportExcel } from '@/utils/request.js'

const prefix = '/project/contract'

// 获取分页数据
export const getContractList = params => request(`${prefix}/getListPage`, METHOD.POST, params)

// 添加、修改合同信息
export const saveContractData = params => request(`${prefix}/save`, METHOD.POST, params)

// 删除合同信息
export const delContractData = id => request(`${prefix}/deleteById/${id}`)

// 导出合同信息
export const importContractData = params => exportExcel(`${prefix}/export`, params)

// 删除已上传的文件
export const delFile = params => request('/file/del', METHOD.POST, params)

// 获取合同数量
export const getContractCount = () => request(`${prefix}/getBaseInfo`)

// 查看、下载文件地址
export const downloadurl = 'http://27.17.43.146:18002/'

// excle 导入地址
export const excleImportUrl = process.env.VUE_APP_BASE_API + `${prefix}/import`

// 下载 excle 模板
export const excleDownload = params => exportExcel(`${prefix}/template`, params)
