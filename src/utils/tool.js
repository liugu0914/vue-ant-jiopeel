import _cloneDeep from 'lodash.clonedeep'


/**
 * ------------------------------------------------------------------------
 *  工具类
 *  @author lyc
 *  @date 2020年06月04日17:48:50
 * ------------------------------------------------------------------------
 */
// ----------------------------------------------------------------------
// Object序列化
// ----------------------------------------------------------------------
export function toSerialize(obj) {
  let serialize = ''
  if (!obj || !(obj instanceof Object)) {
    return serialize
  }
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) {
      continue
    }
    let data = obj[key]

    if (data instanceof Array) {
      for (const index in data) {
        if (!Object.prototype.hasOwnProperty.call(data, index)) {
          continue
        }
        let value = data[index]
        value = encodeURIComponent(value)
        serialize = serialize ? serialize.concat(`&${key}=${value}`) : `${key}=${value}`
      }
    } else if (typeof data === 'object') {
      continue
    } else {
      data = encodeURIComponent(data)
      serialize = serialize ? serialize.concat(`&${key}=${data}`) : `${key}=${data}`
    }
  }
  return serialize
}

// ----------------------------------------------------------------------
// 数组数据转为Object
// ----------------------------------------------------------------------
export function toObject(target, ...needs) {
  if (!target) {
    return {}
  }
  if (!(target instanceof Array)) {
    return target
  }
  const data = {}
  let flag = false
  for (const index in target) {
    if (!Object.prototype.hasOwnProperty.call(target, index)) {
      continue
    }
    const targetData = target[index]
    if (typeof targetData !== 'object') {
      flag = true
      break
    }
    for (const key in targetData) {
      if (!Object.prototype.hasOwnProperty.call(targetData, key)) {
        continue
      }
      if (needs && needs.length > 0 && !needs.includes(key)) {
        continue
      }
      const value = targetData[key]
      data[key] = data[key] ? [...data[key] instanceof Array ? data[key] : [data[key]], value] : value
    }
  }
  return flag ? target : data
}
// ----------------------------------------------------------------------
// 字符串转function
// ----------------------------------------------------------------------
export function evalString(value) {
  let args
  let fuc
  if (!value) {
    return fuc
  }
  const regval = value.match(/\(.*\)/gi)

  if (regval && regval instanceof Array && regval.length > 0) {
    const JSON = window.JSON
    const argstr = regval.pop()
    value = value.replace(argstr, '')
    args = argstr.replace(/\(|\)/g, '').split(';')
    args = args.filter((arg) => arg || arg === 0).map((arg) => JSON.parse(arg.replace(/'/g, '"')))
  }
  try {
    // eslint-disable-next-line no-new-func
    fuc = new Function(`return ${value}`)()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`the value [${value}] is not function`)
  }
  return args ? {
    args,
    fuc
  } : fuc
}

// ----------------------------------------------------------------------
// 判断是否为JSON
// ----------------------------------------------------------------------
export function isJSON(value) {
  value = typeof value === 'string' ? value : JSON.stringify(value)
  try {
    value = Object.prototype.toString.call(JSON.parse(value))
    if (value === '[object Object]' || value === '[object Array]') {
      return true
    }
    return false
  } catch (e) {
    return false
  }
}

// ----------------------------------------------------------------------
//  ztree 简单数据 转 子孙节点数据
// ----------------------------------------------------------------------
export function simple2Tree(sNodes, key, parentKey, childKey) {
  if (!key) {
    key = 'id'
  }
  if (!parentKey) {
    parentKey = 'pid'
  }
  if (!childKey) {
    childKey = 'children'
  }
  const result = []
  const tmpMap = {}

  // 先把数组整理成map的形式
  for (let i = 0, l = sNodes.length; i < l; i++) {
    // key为 对象的"id"的值， value就是就该对象
    tmpMap[sNodes[i][key]] = sNodes[i]
  }

  // 遍历，组织成子孙节点
  for (let i = 0, l = sNodes.length; i < l; i++) {
    // 查找当前节点的父节点是否存在，如果存在就把当前节点放入到父节点的子孙列表中
    if (tmpMap[sNodes[i][parentKey]] && sNodes[i][key] !== sNodes[i][parentKey]) {
      if (!tmpMap[sNodes[i][parentKey]][childKey]) {
        tmpMap[sNodes[i][parentKey]][childKey] = []
      }
      tmpMap[sNodes[i][parentKey]][childKey].push(sNodes[i])
    } else {
      // 如果不存在就直接放入到一个新的列表中
      result.push(sNodes[i])
    }
  }
  return result
}

// ----------------------------------------------------------------------
// 检查QQ格式
// ----------------------------------------------------------------------
export function chkQQ(value) {
  const reg = /^[1-9][0-9]{4,10}$/
  return reg.test(value)
}


// ----------------------------------------------------------------------
// 检查手机号格式
// ----------------------------------------------------------------------
export function chkPhone(value) {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(value)
}

// ----------------------------------------------------------------------
// 检查座机电话格式
// ----------------------------------------------------------------------
export function chkTel(value) {
  const reg = /\(?\d{3,4}[) -]?\d{8}/
  return reg.test(value)
}

// ----------------------------------------------------------------------
// 检查邮箱格式
// ----------------------------------------------------------------------
export function chkEmail(value) {
  const reg = /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+(\.[a-zA-Z]{2,4})+$/
  return reg.test(value)
}

// ----------------------------------------------------------------------
// 检查http格式
// ----------------------------------------------------------------------
export function chkHttp(value) {
  const reg = /^(?=^.{3,255}$)(http(s)?:\/\/)+(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*$/
  return reg.test(value)
}

// ----------------------------------------------------------------------
// 检查url格式
// ----------------------------------------------------------------------
export function chkUrl(value) {
  const reg = /^(?=^.{3,255}$)(http(s)?:\/\/)+(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*([?&]\w+=\w*)*$/
  return reg.test(value)
}


// ----------------------------------------------------------------------
// 检查身份证格式
// ----------------------------------------------------------------------
export function chkIdCard(idcode) {
  let code
  if (typeof idcode === 'number') {
    code = `${idcode}`
  } else if (typeof idcode === 'string') {
    code = idcode
  } else {
    return false
  }

  // 加权因子
  // eslint-disable-next-line no-magic-numbers
  const weightFactor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  // 校验码
  const checkCode = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
  const lastNum = 17
  const last = idcode[lastNum] // 最后一位
  const seventeen = code.substring(0, lastNum)
  // ISO 7064:1983.MOD 11-2
  // 判断最后一位校验码是否正确
  const arr = seventeen.split('')
  const len = arr.length
  let num = 0
  for (let i = 0; i < len; i++) {
    num += arr[i] * weightFactor[i]
  }
  // 获取余数
  const resisueNum = 11
  const resisue = num % resisueNum
  const lastNo = checkCode[resisue]
  // 格式的正则
  // 正则思路
  /*
    第一位不可能是0
    第二位到第六位可以是0-9
    第七位到第十位是年份，所以七八位为19或者20
    十一位和十二位是月份，这两位是01-12之间的数值
    十三位和十四位是日期，是从01-31之间的数值
    十五，十六，十七都是数字0-9
    十八位可能是数字0-9，也可能是X
    */
  const idcardPatter = /^[1-9][0-9]{5}([1][0-9]{3}|[2][0-9]{3})([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/
  // 判断格式是否正确
  const format = idcardPatter.test(idcode)
  // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
  return last === lastNo && format
}

// ----------------------------------------------------------------------
// 检测开头是否相等
// ----------------------------------------------------------------------
export function startsWiths(arr, item) {
  return !!item && (
    (arr instanceof Array && arr.some(value => item.startsWith(value))) ||
      (typeof arr === 'string' && item.startsWith(arr))
  )
}

// ----------------------------------------------------------------------
// 深复制
// ----------------------------------------------------------------------
export const cloneDeep = _cloneDeep



/**
 * 封装后台分页数据
 * @param {Object} data
 */
export function BoxPage(data) {
  const { current, pageSize, total } = data
  return { current, pageSize, total }
}



/**
 * 递归数据为Tree
 * @param {Array} datas 递归数据
 * @param {Object} replaceFields 替换datas 中的字段
 */
export function toTree(datas, replaceFields = {}) {
  const DefaultKeys = { children: 'children', title: 'title', key: 'key', value: 'value', ...replaceFields }
  return datas.map(data => {
    const item = {
      ...data,
      title: data[DefaultKeys.title],
      value: data[DefaultKeys.value],
      key: data[DefaultKeys.key]
    }
    if (data[DefaultKeys.children] && data[DefaultKeys.children].length > 0) {
      item.children = toTree(data.children, replaceFields)
    }
    return item
  })
}

// ----------------------------------------------------------------------
// url转blob
// ----------------------------------------------------------------------
export function urlTransition(url, type, callback) {
  // 创建XMLHttpRequest对象
  const xhr = new XMLHttpRequest()
  // 前两个参数固定，第三个参数true时是异步，false时是同步
  xhr.open('get', url, true)
  // 选定输出格式
  xhr.responseType = type
  // onload后回调this本身  onload本身不携带参数
  xhr.onload = function() {
    callback(xhr.response)
  }
  // 关闭xhr  一定要加
  xhr.send()
}

// ----------------------------------------------------------------------
// 日期格式化
// ----------------------------------------------------------------------
export function dateFormat(date, fmt = 'YYYY-mm-dd') {
  if (!date) { return '' }
  let ret
  const weekArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString(), // 秒
    'W+': weekArr[date.getDay()] // 星期
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  }
  for (const k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
    }
  }
  return fmt
}

// ----------------------------------------------------------------------
// 给所有对象设置 label 和 value
// ----------------------------------------------------------------------
export function formatObj(data, { name = 'name', value = 'value' } = {}) {
  data.forEach(item => {
    item.label = item[name]
    item.value = item[value]
    if (item.children && item.children.length) formatObj(item.children, { name, value })
  })
}

