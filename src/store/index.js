import Vue from 'vue'
import Vuex from 'vuex'

// modules
import page from './modules/page'
import document from './modules/document'
import database from './modules/database'
import expires from './modules/expiration'
import session from './modules/session'

import languages from '../library/static/languages'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state: {
    languages
  },
  modules: {
    page,
    document,
    database,
    expires,
    session
  },
  strict: debug,
  plugins: debug ? [] : []
})