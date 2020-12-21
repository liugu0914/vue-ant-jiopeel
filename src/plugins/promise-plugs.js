/* eslint-disable no-extend-native */

const PromisePlugs = {
  install: function(Vue) {
    const message = Vue.prototype.$message
    // 错误处理
    Promise.prototype.done = Promise.prototype.done ? Promise.prototype.done : function(onFullfilled, onRejected) {
      return this.then(onFullfilled, onRejected)
        .catch(function(reason) {
          setTimeout(() => {
            message.error(reason)
            console.error(`error: ${reason}`)
          }, 0)
        })
    }
  }
}

export default PromisePlugs
