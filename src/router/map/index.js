import common from './router.common'
import sys from './modules/sys'
import bigScreen from './modules/bigScreen'
import contract from './modules/contract'
import investment from './modules/investment'
import monitoring from './modules/monitoring'
import pm from './modules/pm'
import projectProcess from './modules/projectProcess'
import quality from './modules/quality'

const routeMap = {
  ...sys,
  ...bigScreen,
  ...contract,
  ...investment,
  ...monitoring,
  ...pm,
  ...projectProcess,
  ...quality
}

export { common, routeMap }

export default { ...routeMap, ...common }
