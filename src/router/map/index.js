import common from './router.common'
import sys from './modules/sys'
import bigScreen from './modules/bigScreen'
import contract from './modules/contract'
import investment from './modules/investment'
import monitoring from './modules/monitoring'
import pm from './modules/pm'
import quality from './modules/quality'
import work from './modules/work'
import approval from './modules/approval'
import overview from './modules/overview'

const routeMap = {
  ...sys,
  ...bigScreen,
  ...contract,
  ...investment,
  ...monitoring,
  ...pm,
  ...quality,
  ...work,
  ...approval,
  ...overview
}

export { common, routeMap }

export default { ...routeMap, ...common }
