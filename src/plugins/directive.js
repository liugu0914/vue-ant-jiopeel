export default {
  install(Vue) {
    Vue.directive('move', {
      // 当被绑定的元素插入到 DOM 中时……
      inserted(el, binding) {
        const parent = el.parentNode
        const elHeight = el.clientHeight
        const parentHeight = parent.clientHeight
        const elWidth = el.clientWidth
        const parentWidth = parent.clientWidth
        // 如果当前元素自身宽度或高度超出父元素
        if (elHeight > parentHeight || elWidth > parentWidth) {
          el.classList.add('move')
          el.style['animation-duration'] = `${Math.ceil(elHeight / binding.value)}s`
          el.childNodes.forEach((item, index) => {
            if (index == el.childNodes.length - 1) item.classList.add('last-child')
            const child = item.cloneNode(true)
            el.appendChild(child)
          })
        }
      }
    })
  }
}
