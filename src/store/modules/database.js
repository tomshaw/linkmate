import PouchDB from 'pouchdb'

import { defaultDatabases, databaseFields } from '@/library/static/schemas'
import { STORAGE_DBNAME_DATABASES } from '@/library/static/constants'
import { buildConnectionString, sortByDocumentTitle } from '@/library/utils'

const state = () => ({
  catname: "", // new db name
  database: {},
  databases: [],
  category: [],
  categories: []
});

const getters = {
  getCatName: state => state.catname,
  getDatabase: state => state.database,
  getDatabases: state => state.databases,
  getCategory: state => state.category,
  getCategories: state => state.categories,
  getDatabaseById: state => {
    return databaseId => state.databases.filter(item => {
      return item.doc.id === databaseId;
    });
  }
};

const mutations = {
  SET_CATNAME(state, payload) {
    state.catname = payload;
  },
  SET_DATABASE(state, payload) {
    state.database = payload;
  },
  SET_DATABASES(state, payload) {
    state.databases = payload;
  },
  SET_CATEGORY(state, payload) {
    state.category = payload;
  },
  SET_CATEGORIES(state, payload) {
    state.categories = payload;
  }
};

const actions = {
  CREATE_INDEXES({}, { $pouch, fields, database }) {
    return new Promise((resolve, reject) => {
      $pouch.createIndex({
        index: {
          fields: fields
        }
      }, database).then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  CREATE_REMOTE_DATABASE(context, { $pouch, data }) {
    return new Promise((resolve, reject) => {
      const db = new PouchDB(data.remote, { // data.remote = `http://${data.username}:${data.password}@localhost:5984/${category}`;
        skipSetup: true // skipSetup 
      });
      db.info((resp) => {
        resolve(resp);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  PUSH_DATABASE({}, { $pouch, local, remote, options }) {
    return new Promise((resolve, reject) => {
      $pouch.push(local, remote).then((resp) => {
        resolve(resp);
      }).catch(err => {
        reject(err);
      });
    });
  },
  PULL_DATABASE({}, { $pouch, local, remote, options }) {
    return new Promise((resolve, reject) => {
      $pouch.pull(local, remote).then((resp) => {
        resolve(resp);
      }).catch(err => {
        reject(err);
      });
    });
  },
  SYNC_DATABASE({}, { $pouch, local, remote, options }) {
    return new Promise((resolve, reject) => { // options { live: true, retry: true }
      $pouch.sync(local, remote, options).then((resp) => {
        resolve(resp);
      }).catch(err => {
        reject(err);
      });
    });
  },
  SYNC_DATABASES({ dispatch }, { $pouch }) {
    return new Promise((resolve, reject) => {
      dispatch('LOAD_DATABASES', { $pouch }).then((docs) => {
        for (let i = 0, total = docs.length; i < total; i++) {
          if (docs[i].doc.verified) {
            try {
              const remoteConnection = buildConnectionString(docs[i].doc.remote, docs[i].doc.username, docs[i].doc.password);
              $pouch.sync(docs[i].doc.local, remoteConnection, { live: true, retry: true }).then((resp) => {
                resolve(resp);
              }).catch(err => {
                reject(err);
              });
            } catch(err) {
              reject(err);
            }
          }
        }
      }).catch((err) => {
        reject(err);
      });
    });
  },
  PUSH_DATABASES({ dispatch }, { $pouch }) {
    return new Promise((resolve, reject) => {
      dispatch('LOAD_DATABASES', { $pouch }).then((docs) => {
        for (let i = 0, total = docs.length; i < total; i++) {
          if (docs[i].doc.verified) {
            try {
              $pouch.push(docs[i].doc.local, docs[i].doc.remote).then((resp) => {
                resolve(resp);
              }).catch(err => {
                reject(err);
              });
            } catch(err) {
              reject(err);
            }
          }
        }
      }).catch((err) => {
        reject(err);
      });
    });
  },
  BULK_DOCUMENTS({}, { $pouch, documents }) {
    return new Promise((resolve, reject) => {
      $pouch.bulkDocs(documents, {}, STORAGE_DBNAME_DATABASES).then((result) => {
        resolve(result)
      }).catch((err) => {
        reject(err)
      });
    });
  },
  CONNECT_REMOTE_DATABASE({}, { $pouch, username, password, database }) {
    return new Promise((resolve, reject) => {
      $pouch.connect(username, password, database).then((result) => {
        resolve(result);
      }).catch((err)=> {
        reject(err);
      });
    });
  },
  // Requires admin access.
  DATABASE_INFORMATION({}, { $pouch, database }) {
    return new Promise((resolve, reject) => {
      $pouch.info(database).then((result) => {
        resolve(result);
      }).catch((err)=> {
        reject(err);
      });
    });
  },
  LOAD_DATABASE({ commit }, { $pouch, docId }) {
    return new Promise((resolve, reject) => {
      $pouch.get(docId, {}, STORAGE_DBNAME_DATABASES).then((doc) => {
        commit('SET_CATEGORIES', doc.categories);
        commit('SET_DATABASE', doc);
        resolve(doc);
      }).catch(err => {
        reject(err);
      });
    });
  },
  LOAD_DATABASES({ commit }, { $pouch }) {
    return new Promise((resolve, reject) => {  // filter indexes { startkey: '_design0' }
      $pouch.allDocs({ include_docs: true, attachments: true, descending: true }, STORAGE_DBNAME_DATABASES).then((resp) => {
        let rows = (resp.rows && resp.rows.length) ? resp.rows : [];
        let docs = [];
        rows.forEach(item => {
          if (!item.doc.views) { // filter out design views
            docs.push(item);
          }
        });
        commit('SET_DATABASES', sortByDocumentTitle(docs))
        resolve(rows)
      }).catch(err => {
        reject(err)
      });
    });
  },
  SAVE_DATABASE({ dispatch }, { $pouch, doc }) {
    return new Promise((resolve, reject) => {
      $pouch.post(doc, {}, STORAGE_DBNAME_DATABASES).then((doc) => {
        dispatch('LOAD_DATABASE', { $pouch, docId: doc.id }).then((resp) => {
          resolve(resp);
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
        reject(err)
      });
    });
  },
  DELETE_DATABASE({ dispatch }, { $pouch, doc }) {
    return new Promise((resolve, reject) => {
      $pouch.remove(doc, {}, STORAGE_DBNAME_DATABASES).then((resp) => {
        dispatch('LOAD_DATABASES', { $pouch }).then((resp) => {
          resolve(resp)
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
        reject(err);
      });
    });
  },
  DELETE_CATEGORY({ dispatch }, { $pouch, docId, category }) {
    return new Promise((resolve, reject) => {
      $pouch.get(docId, {}, STORAGE_DBNAME_DATABASES).then((doc) => {
        if (doc.categories.includes(category)) {
          doc.categories = doc.categories.filter((value, index, arr) => {
            return value !== category;
          });
          dispatch('SAVE_DATABASE', { $pouch, doc }).then((resp) => {
            resolve(resp)
          }).catch((err) => {
            reject(err);
          });
        } 
      }).catch((err) => {
        reject(err);
      });
    });
  },
  UPDATE_SELECTED({}, { $pouch, docId }) {
    return new Promise((resolve, reject) => {
      $pouch.allDocs({ include_docs: true }, STORAGE_DBNAME_DATABASES).then((result) => {
        let data = (result.rows) ? result.rows : [];
        let documents = [];
        for (let i = 0, total = data.length; i < total; i++) {
          data[i].doc.selected = (data[i].doc._id == docId) ? true : false;
          documents.push(data[i].doc);
        }
        if (documents.length) { // bulk update
          $pouch.bulkDocs(documents, {}, STORAGE_DBNAME_DATABASES).then((result) => {
            resolve(result);
          }).catch((err) => {
            reject(err);
          });
        } else {
          resolve(result);
        }
      }).catch(err => {
        reject(err);
      });
    });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
