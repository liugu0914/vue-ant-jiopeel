/* eslint-disable no-extend-native */

const PromisePlugs = {
  install: function(Vue) {
    const message = Vue.prototype.$message
    const prototype = Promise.prototype
    // 错误处理 -消息提示
    prototype.done = prototype.done ? prototype.done : function(onFullfilled, onRejected) {
      return this.then(onFullfilled, onRejected)
        .catch(function(reason) {
          setTimeout(() => {
            message.error(reason)
            console.error(`error: ${reason}`)
          }, 0)
        })
    }
    // 错误处理
    prototype.over = prototype.over ? prototype.over : function(onFullfilled, onRejected) {
      return this.then(onFullfilled, onRejected)
        .catch(function(reason) {
          setTimeout(() => {
            console.error(`error: ${reason}`)
          }, 0)
        })
    }
  }
}

export default PromisePlugs
