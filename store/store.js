import Vue from 'vue'
import Vuex from 'vuex'
import user from './user.js'
import favor from './favor.js'
import address from './address.js'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    favor,
    address
  }
})

export default store