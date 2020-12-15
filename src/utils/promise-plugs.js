/* eslint-disable no-extend-native */
// 添加事件结束
Promise.prototype.finally = function(callback) {
  const Promise = this.constructor
  return this.then(
    function(value) {
      Promise.resolve(callback()).then(
        function() {
          return value
        }
      )
    },
    function(reason) {
      Promise.resolve(callback()).then(
        function() {
          console.error(`error: ${reason}`)
        }
      )
    }
  )
}
// 错误处理
Promise.prototype.done = function(onFullfilled, onRejected) {
  return this.then(onFullfilled, onRejected)
    .catch(function(reason) {
      setTimeout(() => { console.error(`error: ${reason}`) }, 0)
    })
}
