import common from './router.common'
import sys from './modules/sys'

const routeMap = {
  ...sys
}

export { common, routeMap }

export default { ...routeMap, ...common }
