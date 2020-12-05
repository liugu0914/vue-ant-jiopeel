/**
 * ------------------------------------------------------------------------
 *  工具类
 *  @author lyc
 *  @date 2020年06月04日17:48:50
 * ------------------------------------------------------------------------
 */
class Utils {
  /**
     * 数组中是否包含item
     * @param {*} arr
     * @param {String} item
     */
  static contains(arr, item) {
    return !!item && (
      (arr instanceof Array && arr.some(value => item.startsWith(value))) ||
      (typeof arr === 'string' && item.startsWith(arr))
    )
  }
}

export default Utils
