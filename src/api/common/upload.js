// 合同管理接口
import { request, METHOD } from '@/utils/request.js'


/**
 * 单文件上传
 */
export const uploadFileUrl = process.env.VUE_APP_BASE_API + '/file/upload'

/**
 * 多文件上传
 */
export const uploadFilesUrl = process.env.VUE_APP_BASE_API + '/file/uploads'


// 删除已上传的文件
export const delFile = params => request('/file/del', METHOD.POST, params)

// 查看、下载文件地址
export const downloadUrl = process.env.VUE_APP_BASE_IP

/**
 * word、excel 转 pdf
 */
export const toPdfFile = id => request('/file/toPdfFile', null, { fileId: id })
