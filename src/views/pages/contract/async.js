import { getSysConfigByAlias } from '@/api/modules/sys/dictionary'
import { formatObj } from '@/utils/tool'

export const getContractType = async() => {
  const { data = [] } = await getSysConfigByAlias('contractType')
  formatObj(data)
  return data
}
