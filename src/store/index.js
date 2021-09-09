import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
import getters from './getters'

Vue.use(Vuex)
const store = new Vuex.Store({ modules, getters })

export default store

const mapState = Vuex.mapState
const mapGetters = Vuex.mapGetters
const mapMutations = Vuex.mapMutations

export {
  mapState,
  mapGetters,
  mapMutations
}
