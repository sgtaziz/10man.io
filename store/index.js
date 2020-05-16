import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
  state: () => ({
    user: { },
    queueUp: false,
    darkMode: true,
  }),
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setQueue(state, queueUp) {
      state.queueUp = queueUp
    },
    setDarkmode(state, darkMode) {
      state.darkMode = darkMode
    },
  },
  actions: {
    nuxtServerInit ({ commit }, { req }) {
      if (req.session && req.session.steamUser) {
        commit('setUser', req.session.steamUser._json)
      }
    },
    logout({ commit }) {
      commit('setUser', null)
    },
    login({ commit }, val) {
      commit('setUser', val)
    },
    queueUp({ commit }, val) {
      commit('setQueue', val)
    },
    darkmode({ commit }, val) {
      commit('setDarkmode', val)
    },
  },
  strict: process.env.NODE_ENV !== 'production',
}
