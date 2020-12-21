import account from './account'
import setting from './setting'

export default {
  account,
  setting,
  // 在严格模式下，无论何时发生了状态变更且不是由 mutation 函数引起的，将会抛出错误
  strict: process.env.NODE_ENV !== 'production'
}
