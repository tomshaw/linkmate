import Vue from 'vue'
import App from './App'
import store from '../store'
import { STORAGE_DBNAME_DOCUMENTS } from '../library/static/constants'
import PouchDB from 'pouchdb-browser'
import PouchVue from 'pouch-vue'

import lf from 'pouchdb-find';
import plf from 'pouchdb-live-find';
import auth from 'pouchdb-authentication';
//import debug from 'pouchdb-debug';

import 'materialize-css/dist/js/materialize.min'
import 'materialize-css/dist/css/materialize.css'

global.browser = require('webextension-polyfill')

Vue.prototype.$browser = global.browser
Vue.prototype.$eventHub = new Vue()

PouchDB.plugin(lf);
PouchDB.plugin(plf);
PouchDB.plugin(auth);
//PouchDB.plugin(debug);

Vue.use(PouchVue, {
  pouch: PouchDB,    // optional if `PouchDB` is available on the global object
  defaultDB: STORAGE_DBNAME_DOCUMENTS,  // this is used as a default connect/disconnect database
  optionDB: {}, // this is used to include a custom fetch() method (see TypeScript example)
  //debug: '*' // optional - See `https://pouchdb.com/api.html#debug_mode` for valid settings (will be a separate Plugin in PouchDB 7.0)
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
